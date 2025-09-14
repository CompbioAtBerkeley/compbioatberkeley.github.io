#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import pino from 'pino';

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

// Command line arguments
const args = process.argv.slice(2);
const forceRebuild = args.includes('--force') || args.includes('-f');

// Google Sheets URL - converts to CSV export
const GOOGLE_SHEET_ID = '1N8vuOaxZoHAhiLSN-WTOkeHmXe9BMQok64w1z4GwC-g'; // TODO In future replace with env var. This is not a security issue, rather just a convenience for switching environments.
const CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;

// Output paths
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'fetched', 'officers');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'officers.json');
const IMAGES_DIR = OUTPUT_DIR;
const HASH_TRACKING_FILE = path.join(OUTPUT_DIR, '.sheet-hash');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

async function fetchOfficersData() {
  const startTime = Date.now();
  
  try {
    logger.info({ forceRebuild }, 'Starting officers data fetch');
    
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvData = await response.text();
    logger.info({ dataSize: csvData.length }, 'CSV data fetched successfully');
    
    // Create hash of the CSV data
    const currentHash = crypto.createHash('sha256').update(csvData).digest('hex');
    logger.info({ hash: currentHash.slice(0, 8) }, 'Current sheet hash calculated');
    
    // Check if we have a previous hash
    const previousHash = getPreviousHash();
    
    if (previousHash === currentHash && !forceRebuild) {
      logger.info('Sheet data unchanged - skipping rebuild');
      logger.info('Use --force or -f flag to force a rebuild');
      return;
    }
    
    if (forceRebuild) {
      logger.info('Force rebuild requested - proceeding regardless of hash');
    } else {
      logger.info('Sheet data has changed - proceeding with rebuild');
    }
    
    // Parse CSV to JSON
    const jsonData = csvToJson(csvData);
    
    // Download images and update image URLs
    logger.info('Processing officer images...');
    const processedData = await processOfficerImages(jsonData);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
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
        const extension = officer['image extension'] || '.jpg'; // Default to .jpg if no extension provided
        const localImagePath = await downloadImage(officer.image, officer.name, extension);
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

async function downloadImage(imageUrl, officerName, extension) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    const nodeBuffer = Buffer.from(uint8Array);
    
    // Use the extension from the Google Sheet
    const fileExtension = extension.startsWith('.') ? extension : `.${extension}`;
  
    // Create a safe filename using officer name and a hash for uniqueness
    const safeOfficerName = officerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    // Use a hash of the officer name and image URL to ensure uniqueness
    const hash = crypto.createHash('sha256').update(officerName + imageUrl).digest('hex').slice(0, 8);
    const filename = `${safeOfficerName}_${hash}${fileExtension}`;
    
    const imagePath = path.join(IMAGES_DIR, filename);
    
    // Write the image file using the node buffer
    fs.writeFileSync(imagePath, nodeBuffer);
    
    // Return the public path (relative to public directory)
    return `/fetched/officers/${filename}`;
    
  } catch (error) {
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

function getExtensionFromContentType(contentType) {
  const typeMap = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
    'image/bmp': '.bmp'
  };
  
  return typeMap[contentType.toLowerCase()] || '.jpg';
}

function csvToJson(csvData) {
  const lines = csvData.trim().split('\n');
  if (lines.length < 2) {
    logger.warn('CSV appears to be empty or has no data rows');
    return [];
  }
  
  // Parse header row
  const headers = parseCSVRow(lines[0]);
  logger.debug({ headers }, 'CSV headers parsed');
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i]);
    if (values.length > 0 && values.some(val => val.trim() !== '')) {
      const obj = {};
      headers.forEach((header, index) => {
        const headerName = header.trim();
        const value = values[index]?.trim() || '';
        
        // Transform Google Drive image URLs
        if (headerName.toLowerCase() === 'image' && value) {
          obj[headerName] = transformGoogleDriveUrl(value);
        } else {
          obj[headerName] = value;
        }
      });
      data.push(obj);
    }
  }
  
  logger.info({ rows: data.length }, 'CSV data parsed to JSON');
  return data;
}

function transformGoogleDriveUrl(url) {
  // Check if it's a Google Drive URL
  if (!url.includes('drive.google.com')) {
    return url; // Return as-is if not a Google Drive URL
  }
  
  // Extract file ID from various Google Drive URL formats
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  
  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    return `https://drive.usercontent.google.com/download?id=${fileId}`;
  }
  
  // If we can't extract the file ID, return the original URL
  logger.warn({ url }, 'Could not extract file ID from URL');
  return url;
}

function parseCSVRow(row) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    const nextChar = row[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add the last field
  return result;
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
