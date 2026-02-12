#!/usr/bin/env node

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import pino from 'pino';
import sharp from 'sharp';
import { Client } from '@notionhq/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      ignore: 'pid,hostname',
      translateTime: 'SYS:standard'
    }
  }
});

// Image compression settings
const COMPRESSION_THRESHOLD = 50 * 1024; // 50KB in bytes
const COMPRESSION_QUALITY = 50; // JPEG quality (1-100)
const MAX_WIDTH = 600; // Maximum width for compressed images

// Command line arguments
const args = process.argv.slice(2);
const forceRebuild = args.includes('--force') || args.includes('-f');

// Notion configuration
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_OFFICERS_DB_ID;

// Helper function to get current semester based on date
function getCurrentSemester() {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const year = now.getFullYear();
  
  // Spring: Jan-July (months 0-6), Fall: Aug-Dec (months 7-11)
  const semester = month <= 6 ? 'sp' : 'fa';
  const semesterYear = String(year).slice(-2);
  
  return `${semester}${semesterYear}`;
}

// This will be set after we determine the semester
let SEMESTER = null;
let OUTPUT_DIR = null;
let OUTPUT_FILE = null;
let IMAGES_DIR = null;
let HASH_TRACKING_FILE = null;

async function fetchOfficersData() {
  const startTime = Date.now();
  
  try {
    logger.info({ forceRebuild }, 'Starting officers data fetch from Notion');
    
    // Check for required environment variables
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY environment variable is required');
    }
    
    if (!NOTION_DATABASE_ID) {
      throw new Error('NOTION_OFFICERS_DB_ID environment variable is required');
    }
    
    // Initialize Notion client
    const notion = new Client({ auth: NOTION_API_KEY });
    
    // Fetch database
    logger.info({ databaseId: NOTION_DATABASE_ID }, 'Fetching Notion database');
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
    });
    
    logger.info({ count: response.results.length }, 'Notion pages fetched');
    
    // Determine semester from the first officer's Semester field or use current semester
    let detectedSemester = getCurrentSemester();
    if (response.results.length > 0) {
      const firstPage = response.results[0];
      const semesterProp = firstPage.properties['Semester'];
      if (semesterProp?.rich_text && semesterProp.rich_text.length > 0) {
        const semesterText = semesterProp.rich_text[0].plain_text.toLowerCase().trim();
        // Normalize to format like "sp26" or "fa25"
        detectedSemester = semesterText;
        logger.info({ semester: detectedSemester }, 'Semester detected from Notion');
      } else {
        logger.info({ semester: detectedSemester }, 'No semester in Notion, using current semester');
      }
    }
    
    // Set semester and initialize output paths
    SEMESTER = detectedSemester;
    OUTPUT_DIR = path.join(__dirname, '..', 'public', 'fetched', 'officers', SEMESTER);
    OUTPUT_FILE = path.join(OUTPUT_DIR, `officers-${SEMESTER}.json`);
    IMAGES_DIR = OUTPUT_DIR;
    HASH_TRACKING_FILE = path.join(OUTPUT_DIR, '.notion-hash');
    
    logger.info({ semester: SEMESTER, outputDir: OUTPUT_DIR }, 'Output paths configured');
    
    // Create hash of the response data
    const currentHash = crypto.createHash('sha256')
      .update(JSON.stringify(response.results))
      .digest('hex');
    logger.info({ hash: currentHash.slice(0, 8) }, 'Current Notion data hash calculated');
    
    // Check if we have a previous hash
    const previousHash = getPreviousHash();
    
    if (previousHash === currentHash && !forceRebuild) {
      logger.info('Notion data unchanged - skipping rebuild');
      logger.info('Use --force or -f flag to force a rebuild');
      return;
    }
    
    if (forceRebuild) {
      logger.info('Force rebuild requested - proceeding regardless of hash');
    } else {
      logger.info('Notion data has changed - proceeding with rebuild');
    }
    
    // Delete only the semester-specific subdirectory if it exists
    if (fs.existsSync(OUTPUT_DIR)) {
      logger.info({ dir: OUTPUT_DIR }, 'Deleting existing semester officers directory for clean rebuild');
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    
    // Recreate the output directory
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    logger.info('Semester officers directory recreated');
    
    // Parse Notion pages to JSON
    const jsonData = await parseNotionPages(response.results, notion);
    
    // Download images and update image URLs
    logger.info('Processing officer images...');
    const processedData = await processOfficerImages(jsonData);
    
    // Write JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedData, null, 2));
    logger.info({ file: OUTPUT_FILE }, 'Officers data saved');
    logger.info({ count: processedData.length }, 'Officers processed');
    
    // Save the new hash
    saveCurrentHash(currentHash);
    logger.info('Hash tracking file updated');
    
    const duration = Date.now() - startTime;
    logger.info({ duration, officers: processedData.length }, 'Officers data fetch completed successfully');
    
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error({ error: error.message, duration }, 'Error fetching officers data');
    process.exit(1);
  }
}

async function parseNotionPages(pages, notion) {
  const officers = [];
  
  for (const page of pages) {
    try {
      const props = page.properties;
      
      // Extract text from rich text fields
      const getPlainText = (richText) => {
        if (!richText || richText.length === 0) return '';
        return richText.map(text => text.plain_text).join('');
      };
      
      // Extract URL from URL field
      const getUrl = (urlField) => {
        return urlField || '';
      };
      
      // Extract files from files field (for headshot)
      const getFileUrl = (filesField) => {
        if (!filesField || filesField.length === 0) return '';
        const file = filesField[0];
        return file.type === 'file' ? file.file.url : file.external?.url || '';
      };
      
      // Get the title (Full Name - the default Name column)
      const fullName = props['Name']?.title ? getPlainText(props['Name'].title) : '';
      const preferredName = props['Preferred Name']?.rich_text ? getPlainText(props['Preferred Name'].rich_text) : '';
      
      // Use preferred name if available, otherwise fall back to full name
      const displayName = preferredName || fullName;
      
      const officer = {
        name: displayName,
        role: props['Role']?.rich_text ? getPlainText(props['Role'].rich_text) : '',
        image: props['headshot']?.files ? getFileUrl(props['headshot'].files) : '',
        bio: props['Bio']?.rich_text ? getPlainText(props['Bio'].rich_text) : '',
        "personal website": props['Personal Website']?.url ? getUrl(props['Personal Website'].url) : '',
        linkedin: props['Linkedin']?.url ? getUrl(props['Linkedin'].url) : '',
        github: props['GitHub']?.url ? getUrl(props['GitHub'].url) : '',
        orcid: props['ORCID']?.url ? getUrl(props['ORCID'].url) : '',
      };
      
      officers.push(officer);
      logger.debug({ name: displayName }, 'Parsed officer from Notion');
      
    } catch (error) {
      logger.warn({ error: error.message, pageId: page.id }, 'Failed to parse Notion page');
    }
  }
  
  logger.info({ count: officers.length }, 'Notion pages parsed to JSON');
  return officers;
}

async function processOfficerImages(officers) {
  const processedOfficers = [];
  const imageStartTime = Date.now();
  let successCount = 0;
  let failureCount = 0;
  
  logger.info({ total: officers.length }, 'Starting image processing');
  
  for (const officer of officers) {
    const processedOfficer = { ...officer };
    
    if (officer.image && officer.image.trim() !== '') {
      try {
        logger.debug({ officer: officer.name }, 'Downloading image');
        const localImagePath = await downloadImage(officer.image, officer.name);
        processedOfficer.image = localImagePath;
        logger.info({ officer: officer.name, path: localImagePath }, 'Image downloaded successfully');
        successCount++;
      } catch (error) {
        logger.warn({ officer: officer.name, error: error.message }, 'Failed to download image');
        // Keep the original URL if download fails
        processedOfficer.image = officer.image;
        failureCount++;
      }
    }
    
    processedOfficers.push(processedOfficer);
  }
  
  const imageDuration = Date.now() - imageStartTime;
  logger.info({ 
    duration: imageDuration,
    successCount,
    failureCount,
    total: officers.length
  }, 'Image processing completed');
  
  return processedOfficers;
}

async function compressImageIfNeeded(buffer, filename, originalSize) {
  if (originalSize <= COMPRESSION_THRESHOLD) {
    logger.debug({ filename, size: originalSize }, 'Image under threshold, skipping compression');
    return buffer;
  }

  try {
    logger.info({ filename, originalSize, threshold: COMPRESSION_THRESHOLD }, 'Compressing image');
    
    // Get file extension to determine format
    const ext = path.extname(filename).toLowerCase();
    
    let compressedBuffer;
    
    if (ext === '.png') {
      // For PNG files, convert to WebP for better compression
      compressedBuffer = await sharp(buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: COMPRESSION_QUALITY })
        .toBuffer();
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // For JPEG files, compress as JPEG
      compressedBuffer = await sharp(buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: COMPRESSION_QUALITY })
        .toBuffer();
    } else {
      // For other formats, try to convert to JPEG
      compressedBuffer = await sharp(buffer)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: COMPRESSION_QUALITY })
        .toBuffer();
    }
    
    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    logger.info({ 
      filename, 
      originalSize, 
      compressedSize, 
      compressionRatio: `${compressionRatio}%`,
      saved: originalSize - compressedSize
    }, 'Image compressed successfully');
    
    return compressedBuffer;
    
  } catch (error) {
    logger.warn({ filename, error: error.message }, 'Failed to compress image, using original');
    return buffer;
  }
}

async function downloadImage(imageUrl, officerName) {
  try {
    // Notion signed URLs have query parameters - extract the base filename
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    const originalFilename = pathParts[pathParts.length - 1];
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const nodeBuffer = Buffer.from(uint8Array);
    const originalSize = nodeBuffer.length;
    
    // Determine extension from original filename or default to jpg
    let fileExtension = path.extname(originalFilename).toLowerCase() || '.jpg';
    if (!fileExtension.startsWith('.')) {
      fileExtension = '.' + fileExtension;
    }
    
    // Create a safe filename using officer name and a hash for uniqueness
    const safeOfficerName = officerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    // Use a hash of the officer name and image URL to ensure uniqueness
    const hash = crypto.createHash('sha256').update(officerName + imageUrl).digest('hex').slice(0, 8);
    let filename = `${safeOfficerName}_${hash}${fileExtension}`;
    
    // Compress the image if it's over the threshold
    const processedBuffer = await compressImageIfNeeded(nodeBuffer, filename, originalSize);
    
    // If we compressed a PNG to WebP, update the filename extension
    if (fileExtension === '.png' && originalSize > COMPRESSION_THRESHOLD) {
      fileExtension = '.webp';
      filename = `${safeOfficerName}_${hash}${fileExtension}`;
    }
    
    // If we compressed a non-JPEG to JPEG, update the filename extension
    if (!fileExtension.match(/\.(jpg|jpeg)$/i) && fileExtension !== '.webp' && originalSize > COMPRESSION_THRESHOLD) {
      fileExtension = '.jpg';
      filename = `${safeOfficerName}_${hash}${fileExtension}`;
    }
    
    const imagePath = path.join(IMAGES_DIR, filename);
    
    // Write the processed image file
    fs.writeFileSync(imagePath, processedBuffer);
    
    logger.info({ 
      officer: officerName, 
      filename, 
      originalSize, 
      finalSize: processedBuffer.length,
      compressed: originalSize > COMPRESSION_THRESHOLD
    }, 'Image saved');
    
    // Return the public path (relative to public directory)
    return `/fetched/officers/${SEMESTER}/${filename}`;
    
  } catch (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

function getPreviousHash() {
  try {
    if (fs.existsSync(HASH_TRACKING_FILE)) {
      const hash = fs.readFileSync(HASH_TRACKING_FILE, 'utf8').trim();
      logger.debug({ hash: hash.slice(0, 8) }, 'Previous hash loaded');
      return hash;
    }
  } catch (error) {
    logger.warn({ error: error.message }, 'Could not read hash tracking file');
  }
  return null;
}

function saveCurrentHash(hash) {
  try {
    fs.writeFileSync(HASH_TRACKING_FILE, hash);
    logger.debug({ hash: hash.slice(0, 8) }, 'Hash saved to tracking file');
  } catch (error) {
    logger.warn({ error: error.message }, 'Could not save hash to tracking file');
  }
}

// Run the script
fetchOfficersData();
