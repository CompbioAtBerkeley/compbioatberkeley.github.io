#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  try {
    console.log('Fetching officers data from Google Sheets...');
    
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csvData = await response.text();
    console.log('CSV data fetched successfully');
    
    // Create hash of the CSV data
    const currentHash = crypto.createHash('sha256').update(csvData).digest('hex');
    console.log(`Current sheet hash: ${currentHash.slice(0, 8)}...`);
    
    // Check if we have a previous hash
    const previousHash = getPreviousHash();
    
    if (previousHash === currentHash && !forceRebuild) {
      console.log('Sheet data unchanged - skipping rebuild');
      console.log('Use --force or -f flag to force a rebuild');
      return;
    }
    
    if (forceRebuild) {
      console.log('Force rebuild requested - proceeding regardless of hash');
    } else {
      console.log('Sheet data has changed - proceeding with rebuild');
    }
    
    // Parse CSV to JSON
    const jsonData = csvToJson(csvData);
    
    // Download images and update image URLs
    console.log('Processing officer images...');
    const processedData = await processOfficerImages(jsonData);
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Write JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedData, null, 2));
    console.log(`Officers data saved to ${OUTPUT_FILE}`);
    console.log(`Found ${processedData.length} officers`);
    
    // Save the new hash
    saveCurrentHash(currentHash);
    console.log('Hash tracking file updated');
    
  } catch (error) {
    console.error('Error fetching officers data:', error);
    process.exit(1);
  }
}

async function processOfficerImages(officers) {
  const processedOfficers = [];
  
  for (const officer of officers) {
    const processedOfficer = { ...officer };
    
    if (officer.image && officer.image.trim() !== '') {
      try {
        console.log(`Downloading image for ${officer.name}...`);
        const extension = officer['image extension'] || '.jpg'; // Default to .jpg if no extension provided
        const localImagePath = await downloadImage(officer.image, officer.name, extension);
        processedOfficer.image = localImagePath;
        console.log(`✓ Image downloaded for ${officer.name}: ${localImagePath}`);
      } catch (error) {
        console.warn(`⚠ Failed to download image for ${officer.name}:`, error.message);
        // Keep the original URL if download fails
        processedOfficer.image = officer.image;
      }
    }
    
    processedOfficers.push(processedOfficer);
  }
  
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
    console.warn('CSV appears to be empty or has no data rows');
    return [];
  }
  
  // Parse header row
  const headers = parseCSVRow(lines[0]);
  console.log('CSV Headers:', headers);
  
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
  console.warn(`Could not extract file ID from URL: ${url}`);
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
      return fs.readFileSync(HASH_TRACKING_FILE, 'utf8').trim();
    }
  } catch (error) {
    console.warn('Could not read hash tracking file:', error.message);
  }
  return null;
}

function saveCurrentHash(hash) {
  try {
    fs.writeFileSync(HASH_TRACKING_FILE, hash);
  } catch (error) {
    console.warn('Could not save hash to tracking file:', error.message);
  }
}

// Run the script
fetchOfficersData();
