import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = './public';

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// You'll need to manually copy the source image to the project directory first
const sourceImage = './source-icon.png'; // You'll place the image here

if (!fs.existsSync(sourceImage)) {
  console.log('Please place the source image as "source-icon.png" in the project root');
  process.exit(1);
}

async function createFavicons() {
  try {
    // Create favicon.ico (32x32)
    await sharp(sourceImage)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    // Create 16x16 favicon
    await sharp(sourceImage)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    // Create 192x192 icon
    await sharp(sourceImage)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));

    // Create 512x512 icon
    await sharp(sourceImage)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    // Create Apple touch icon
    await sharp(sourceImage)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    console.log('✅ All favicon files created successfully!');
    console.log('Created:');
    console.log('- favicon-16x16.png');
    console.log('- favicon-32x32.png');
    console.log('- icon-192.png');
    console.log('- icon-512.png');
    console.log('- apple-touch-icon.png');

  } catch (error) {
    console.error('Error creating favicons:', error);
  }
}

createFavicons();