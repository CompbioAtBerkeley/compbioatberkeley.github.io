#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Sheets URL - converts to CSV export
const GOOGLE_SHEET_ID = '1N8vuOaxZoHAhiLSN-WTOkeHmXe9BMQok64w1z4GwC-g';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;

// Output path
const OUTPUT_DIR = path.join(__dirname, '../public/fetched');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'officers.json');

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
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Write JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(jsonData, null, 2));
    console.log(`Officers data saved to ${OUTPUT_FILE}`);
    console.log(`Found ${jsonData.length} officers`);
    
  } catch (error) {
    console.error('Error fetching officers data:', error);
    process.exit(1);
  }
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
