#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Sheets URL - converts to CSV export
const GOOGLE_SHEET_ID = '1N8vuOaxZoHAhiLSN-WTOkeHmXe9BMQok64w1z4GwC-g';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;

// Output paths
const OUTPUT_DIR = path.join(__dirname, '../public/fetched');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'officers.json');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'officers');

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
        const localImagePath = await downloadImage(officer.image, officer.name);
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

async function downloadImage(imageUrl, officerName) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Get content type to determine file extension
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = getExtensionFromContentType(contentType);
    
    // Create a safe filename using officer name and a hash for uniqueness
    const safeOfficerName = officerName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    // Use a hash of the officer name and image URL to ensure uniqueness
    const hash = crypto.createHash('sha256').update(officerName + imageUrl).digest('hex').slice(0, 8);
    const filename = `${safeOfficerName}_${hash}${extension}`;
    
    const imagePath = path.join(IMAGES_DIR, filename);
    
    // Write the image file
    fs.writeFileSync(imagePath, uint8Array);
    
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
        const value = values[index]?.trim() || '';
        
        // Transform Google Drive image URLs
        if (header.trim().toLowerCase() === 'image' && value) {
          obj[header.trim()] = transformGoogleDriveUrl(value);
        } else {
          obj[header.trim()] = value;
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

// Run the script
fetchOfficersData();
