// Script pour générer tous les favicons à partir de favicon3.0.png
// Nécessite: npm install sharp

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.join(__dirname, '../public/favicon3.0.png');
const publicPath = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    console.log('📦 Generating favicons from favicon3.0.png...');

    // 1. favicon.ico (32x32)
    await sharp(sourcePath)
      .resize(32, 32)
      .toFile(path.join(publicPath, 'favicon.ico'));
    console.log('✅ favicon.ico (32x32)');

    // 2. favicon.png (32x32)
    await sharp(sourcePath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicPath, 'favicon.png'));
    console.log('✅ favicon.png (32x32)');

    // 3. favicon-16x16.png
    await sharp(sourcePath)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicPath, 'favicon-16x16.png'));
    console.log('✅ favicon-16x16.png');

    // 4. favicon-32x32.png
    await sharp(sourcePath)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicPath, 'favicon-32x32.png'));
    console.log('✅ favicon-32x32.png');

    // 5. apple-touch-icon.png (180x180)
    await sharp(sourcePath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicPath, 'apple-touch-icon.png'));
    console.log('✅ apple-touch-icon.png (180x180)');

    // 6. android-chrome-192x192.png
    await sharp(sourcePath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicPath, 'android-chrome-192x192.png'));
    console.log('✅ android-chrome-192x192.png');

    // 7. android-chrome-512x512.png
    await sharp(sourcePath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicPath, 'android-chrome-512x512.png'));
    console.log('✅ android-chrome-512x512.png');

    console.log('🎉 All favicons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
  }
}

generateFavicons();

