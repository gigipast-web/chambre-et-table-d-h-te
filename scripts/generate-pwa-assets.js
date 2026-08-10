import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Color palette
const C_GREEN = [74, 103, 65, 255]; // #4A6741
const C_DARK_GREEN = [45, 66, 39, 255]; // #2D4227
const C_LIGHT_GREEN = [232, 240, 230, 255]; // #E8F0E6
const C_GOLD = [217, 119, 6, 255]; // #D97706 (Amber/Gold)
const C_WHITE = [255, 255, 255, 255];
const C_BG_LIGHT = [250, 250, 249, 255]; // #FAFAF9
const C_STONE_DARK = [41, 37, 36, 255]; // #292524

function setPixel(png, x, y, color) {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * y + x) << 2;
  png.data[idx] = color[0];
  png.data[idx + 1] = color[1];
  png.data[idx + 2] = color[2];
  png.data[idx + 3] = color[3];
}

function fillRect(png, x1, y1, x2, y2, color) {
  for (let y = Math.max(0, y1); y <= Math.min(png.height - 1, y2); y++) {
    for (let x = Math.max(0, x1); x <= Math.min(png.width - 1, x2); x++) {
      setPixel(png, x, y, color);
    }
  }
}

function fillCircle(png, cx, cy, radius, color) {
  const r2 = radius * radius;
  for (let y = Math.max(0, Math.floor(cy - radius)); y <= Math.min(png.height - 1, Math.ceil(cy + radius)); y++) {
    for (let x = Math.max(0, Math.floor(cx - radius)); x <= Math.min(png.width - 1, Math.ceil(cx + radius)); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(png, x, y, color);
      }
    }
  }
}

function drawHouseLogo(png, cx, cy, scale = 1, isMaskable = false) {
  // House roof (triangle)
  const roofHeight = Math.round(35 * scale);
  const houseWidth = Math.round(60 * scale);
  const houseHeight = Math.round(45 * scale);

  // Roof
  for (let dy = 0; dy <= roofHeight; dy++) {
    const w = Math.round((dy / roofHeight) * (houseWidth / 2 + 10 * scale));
    const y = cy - roofHeight + dy;
    for (let dx = -w; dx <= w; dx++) {
      setPixel(png, Math.round(cx + dx), Math.round(y), C_GOLD);
    }
  }

  // House Body
  fillRect(png, Math.round(cx - houseWidth / 2), Math.round(cy), Math.round(cx + houseWidth / 2), Math.round(cy + houseHeight), C_WHITE);

  // Door
  const doorW = Math.round(16 * scale);
  const doorH = Math.round(26 * scale);
  fillRect(png, Math.round(cx - doorW / 2), Math.round(cy + houseHeight - doorH), Math.round(cx + doorW / 2), Math.round(cy + houseHeight), C_DARK_GREEN);

  // Windows
  const winSize = Math.round(12 * scale);
  fillRect(png, Math.round(cx - houseWidth / 3 - winSize / 2), Math.round(cy + 8 * scale), Math.round(cx - houseWidth / 3 + winSize / 2), Math.round(cy + 8 * scale + winSize), C_GOLD);
  fillRect(png, Math.round(cx + houseWidth / 3 - winSize / 2), Math.round(cy + 8 * scale), Math.round(cx + houseWidth / 3 + winSize / 2), Math.round(cy + 8 * scale + winSize), C_GOLD);
}

// 1. Generate Icon 192x192
function createIcon192() {
  const png = new PNG({ width: 192, height: 192 });
  fillRect(png, 0, 0, 191, 191, C_DARK_GREEN);
  fillCircle(png, 96, 96, 80, C_GREEN);
  drawHouseLogo(png, 96, 90, 1.2);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192.png'), PNG.sync.write(png));
}

// 2. Generate Maskable Icon 192x192
function createIcon192Maskable() {
  const png = new PNG({ width: 192, height: 192 });
  // Maskable icon must have solid full bleed background with safe margin (20% padding)
  fillRect(png, 0, 0, 191, 191, C_GREEN);
  drawHouseLogo(png, 96, 96, 1.0, true);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192-maskable.png'), PNG.sync.write(png));
}

// 3. Generate Icon 512x512
function createIcon512() {
  const png = new PNG({ width: 512, height: 512 });
  fillRect(png, 0, 0, 511, 511, C_DARK_GREEN);
  fillCircle(png, 256, 256, 220, C_GREEN);
  drawHouseLogo(png, 256, 240, 3.2);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512.png'), PNG.sync.write(png));
}

// 4. Generate Maskable Icon 512x512
function createIcon512Maskable() {
  const png = new PNG({ width: 512, height: 512 });
  fillRect(png, 0, 0, 511, 511, C_GREEN);
  drawHouseLogo(png, 256, 256, 2.8, true);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512-maskable.png'), PNG.sync.write(png));
}

// 5. Generate Favicon 32x32
function createFavicon32() {
  const png = new PNG({ width: 32, height: 32 });
  fillRect(png, 0, 0, 31, 31, C_GREEN);
  drawHouseLogo(png, 16, 15, 0.22);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon-32x32.png'), PNG.sync.write(png));
}

// 6. Generate Desktop Screenshot 1280x720 (Wide form factor for PWABuilder)
function createDesktopScreenshot() {
  const png = new PNG({ width: 1280, height: 720 });
  fillRect(png, 0, 0, 1279, 719, C_BG_LIGHT);

  // Top Navbar
  fillRect(png, 0, 0, 1279, 56, C_DARK_GREEN);
  fillRect(png, 20, 16, 180, 40, C_GOLD);

  // Sidebar
  fillRect(png, 0, 57, 240, 719, C_WHITE);
  fillRect(png, 20, 80, 200, 110, C_LIGHT_GREEN);
  fillRect(png, 20, 130, 200, 160, C_LIGHT_GREEN);

  // Main Dashboard Content Cards
  // Header
  fillRect(png, 280, 80, 600, 120, C_WHITE);
  // Stats grid
  fillRect(png, 280, 150, 560, 250, C_GREEN);
  fillRect(png, 580, 150, 860, 250, C_GOLD);
  fillRect(png, 880, 150, 1220, 250, C_WHITE);

  // Calendar / Planning Table Mock
  fillRect(png, 280, 280, 1220, 680, C_WHITE);
  for (let r = 0; r < 5; r++) {
    fillRect(png, 300, 340 + r * 60, 1200, 380 + r * 60, r % 2 === 0 ? C_LIGHT_GREEN : C_BG_LIGHT);
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'screenshot-desktop.png'), PNG.sync.write(png));
}

// 7. Generate Mobile Screenshot 720x1280 (Narrow form factor for PWABuilder)
function createMobileScreenshot() {
  const png = new PNG({ width: 720, height: 1280 });
  fillRect(png, 0, 0, 719, 1279, C_BG_LIGHT);

  // Status bar & Navbar
  fillRect(png, 0, 0, 719, 70, C_DARK_GREEN);
  fillRect(png, 20, 20, 220, 50, C_GOLD);

  // Mobile Cards
  fillRect(png, 20, 90, 699, 210, C_GREEN);
  fillRect(png, 20, 230, 699, 350, C_WHITE);
  fillRect(png, 20, 370, 699, 520, C_WHITE);
  fillRect(png, 20, 540, 699, 800, C_WHITE);
  fillRect(png, 20, 820, 699, 1100, C_WHITE);

  // Bottom Nav Bar
  fillRect(png, 0, 1190, 719, 1279, C_WHITE);
  fillRect(png, 40, 1210, 140, 1260, C_GREEN);
  fillRect(png, 200, 1210, 300, 1260, C_STONE_DARK);
  fillRect(png, 360, 1210, 460, 1260, C_STONE_DARK);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'screenshot-mobile.png'), PNG.sync.write(png));
}

console.log('Generating PWA Icons & Screenshots...');
createIcon192();
createIcon192Maskable();
createIcon512();
createIcon512Maskable();
createFavicon32();
createDesktopScreenshot();
createMobileScreenshot();
console.log('PWA Assets successfully generated in public/ !');
