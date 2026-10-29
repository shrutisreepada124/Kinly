import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// SVG source icon for Kinly: Warm Emerald shield/heart hybrid with a family leaf
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0f766e" />
    </linearGradient>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#ecfdf5" stop-opacity="0.9" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#022c22" flood-opacity="0.3" />
    </filter>
  </defs>
  <!-- Background with rounded squircle -->
  <rect width="512" height="512" rx="110" fill="url(#bg)" />
  
  <!-- Shield and Heart motif -->
  <g filter="url(#shadow)" transform="translate(0, 8)">
    <!-- Protective Shield Outer -->
    <path d="M256 90 C340 90, 400 130, 400 220 C400 325, 305 385, 256 422 C207 385, 112 325, 112 220 C112 130, 172 90, 256 90 Z" fill="url(#shieldGrad)" />
    
    <!-- Inner Cross / Sprout Care Motif in Emerald -->
    <!-- Heart & Care Emblem -->
    <path d="M256 160 C270 138 300 132 320 152 C342 174 340 205 315 235 L256 295 L197 235 C172 205 170 174 192 152 C212 132 242 138 256 160 Z" fill="#059669" />
    
    <!-- Health Plus Sparkle Accent -->
    <circle cx="256" cy="340" r="16" fill="#0d9488" />
    <path d="M256 312 L256 368 M228 340 L284 340" stroke="#059669" stroke-width="8" stroke-linecap="round" />
  </g>
</svg>`;

// Maskable icon with 15% safe padding
const maskableSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#0d9488" />
      <stop offset="100%" stop-color="#0f766e" />
    </linearGradient>
    <linearGradient id="shieldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#ecfdf5" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <!-- Full bleed background for maskable -->
  <rect width="512" height="512" fill="url(#bgm)" />
  
  <!-- Scaled content to stay within safe circle (radius 200, center 256) -->
  <g transform="translate(64, 64) scale(0.75)">
    <path d="M256 90 C340 90, 400 130, 400 220 C400 325, 305 385, 256 422 C207 385, 112 325, 112 220 C112 130, 172 90, 256 90 Z" fill="url(#shieldGradM)" />
    <path d="M256 160 C270 138 300 132 320 152 C342 174 340 205 315 235 L256 295 L197 235 C172 205 170 174 192 152 C212 132 242 138 256 160 Z" fill="#059669" />
    <circle cx="256" cy="340" r="16" fill="#0d9488" />
    <path d="M256 312 L256 368 M228 340 L284 340" stroke="#059669" stroke-width="8" stroke-linecap="round" />
  </g>
</svg>`;

async function run() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

  const svgBuffer = Buffer.from(svgContent);
  const maskableSvgBuffer = Buffer.from(maskableSvgContent);

  // Generate 512x512
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Generate 192x192
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));

  // Generate Apple Touch Icon 180x180
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate Maskable 512x512
  await sharp(maskableSvgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Generate favicon 32x32 ico/png
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon.ico'));

  console.log('All PWA icons generated successfully.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
