const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Helper to draw a pixel with RGBA
function setPixel(png, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * Math.floor(y) + Math.floor(x)) << 2;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

// Draw filled rectangle
function drawRect(png, x1, y1, x2, y2, r, g, b, a = 255) {
  for (let y = Math.max(0, Math.floor(y1)); y <= Math.min(png.height - 1, Math.floor(y2)); y++) {
    for (let x = Math.max(0, Math.floor(x1)); x <= Math.min(png.width - 1, Math.floor(x2)); x++) {
      setPixel(png, x, y, r, g, b, a);
    }
  }
}

// Draw filled circle / rounded rect
function drawCircle(png, cx, cy, radius, r, g, b, a = 255) {
  const r2 = radius * radius;
  for (let y = Math.max(0, Math.floor(cy - radius)); y <= Math.min(png.height - 1, Math.floor(cy + radius)); y++) {
    for (let x = Math.max(0, Math.floor(cx - radius)); x <= Math.min(png.width - 1, Math.floor(cx + radius)); x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) {
        setPixel(png, x, y, r, g, b, a);
      }
    }
  }
}

// Draw thick line
function drawLine(png, x0, y0, x1, y1, thickness, r, g, b, a = 255) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy)) * 2 || 1;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + (dx * i) / steps;
    const y = y0 + (dy * i) / steps;
    drawCircle(png, x, y, thickness / 2, r, g, b, a);
  }
}

// Draw a House & Bed icon
function drawGiteIcon(png, isMaskable = false) {
  const w = png.width;
  const h = png.height;
  
  // Background: Warm Amber / Terracotta (#78350F -> RGB 120, 53, 15 or #B45309 -> 180, 83, 9)
  const bgR = 180, bgG = 83, bgB = 9;
  
  if (isMaskable) {
    drawRect(png, 0, 0, w, h, bgR, bgG, bgB, 255);
  } else {
    // Rounded container
    const radius = w * 0.22;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        // Check rounded box
        let inBox = true;
        if (x < radius && y < radius && Math.hypot(x - radius, y - radius) > radius) inBox = false;
        if (x > w - radius && y < radius && Math.hypot(x - (w - radius), y - radius) > radius) inBox = false;
        if (x < radius && y > h - radius && Math.hypot(x - radius, y - (h - radius)) > radius) inBox = false;
        if (x > w - radius && y > h - radius && Math.hypot(x - (w - radius), y - (h - radius)) > radius) inBox = false;
        
        if (inBox) {
          setPixel(png, x, y, bgR, bgG, bgB, 255);
        } else {
          setPixel(png, x, y, 0, 0, 0, 0); // Transparent
        }
      }
    }
  }

  // Draw house roof (triangle) & body in Cream / Off-White (#FEF3C7 -> 254, 243, 199)
  const fgR = 254, fgG = 243, fgB = 199;
  const stroke = Math.max(2, w * 0.04);

  // Safe zone offset for maskable
  const scale = isMaskable ? 0.75 : 0.85;
  const cx = w / 2;
  const cy = h / 2;

  // House roof peak
  const roofPeakY = cy - h * 0.25 * scale;
  const roofLeftX = cx - w * 0.3 * scale;
  const roofRightX = cx + w * 0.3 * scale;
  const roofBaseY = cy - h * 0.05 * scale;

  drawLine(png, roofPeakY, cx, roofPeakY, cx, stroke, fgR, fgG, fgB);
  drawLine(png, cx, roofPeakY, roofLeftX, roofBaseY, stroke, fgR, fgG, fgB);
  drawLine(png, cx, roofPeakY, roofRightX, roofBaseY, stroke, fgR, fgG, fgB);

  // House body
  const bodyLeft = cx - w * 0.22 * scale;
  const bodyRight = cx + w * 0.22 * scale;
  const bodyTop = roofBaseY;
  const bodyBottom = cy + h * 0.25 * scale;

  drawLine(png, bodyLeft, bodyTop, bodyLeft, bodyBottom, stroke, fgR, fgG, fgB);
  drawLine(png, bodyRight, bodyTop, bodyRight, bodyBottom, stroke, fgR, fgG, fgB);
  drawLine(png, bodyLeft, bodyBottom, bodyRight, bodyBottom, stroke, fgR, fgG, fgB);

  // Bed inside house
  const bedLeft = cx - w * 0.15 * scale;
  const bedRight = cx + w * 0.15 * scale;
  const bedTop = cy + h * 0.08 * scale;
  const bedBottom = bodyBottom - stroke;

  // Bed headboard
  drawLine(png, bedLeft, bedTop - h * 0.05 * scale, bedLeft, bedBottom, stroke * 0.8, fgR, fgG, fgB);
  // Bed mattress
  drawRect(png, bedLeft, bedTop, bedRight, bedTop + h * 0.04 * scale, fgR, fgG, fgB, 255);
  // Bed pillow
  drawRect(png, bedLeft + stroke, bedTop - h * 0.03 * scale, bedLeft + w * 0.08 * scale, bedTop, fgR, fgG, fgB, 255);
}

// Generate an image file using PNG
function generateAndSave(filePath, width, height, isMaskable = false) {
  const png = new PNG({ width, height });
  drawGiteIcon(png, isMaskable);
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated valid PNG: ${filePath} (${width}x${height}, ${buffer.length} bytes)`);
}

// Generate App Screenshots
function generateScreenshot(filePath, width, height, isMobile = false) {
  const png = new PNG({ width, height });
  // Background gradient-like UI representation
  drawRect(png, 0, 0, width, height, 250, 245, 235, 255); // Light cream
  
  // Header bar (amber)
  drawRect(png, 0, 0, width, Math.floor(height * 0.08), 180, 83, 9, 255);

  // Cards representation
  const margin = Math.floor(width * 0.05);
  const cardW = isMobile ? width - margin * 2 : (width - margin * 4) / 3;
  const cardH = Math.floor(height * 0.22);
  const startY = Math.floor(height * 0.12);

  if (isMobile) {
    for (let i = 0; i < 3; i++) {
      const y = startY + i * (cardH + margin);
      if (y + cardH < height) {
        drawRect(png, margin, y, margin + cardW, y + cardH, 255, 255, 255, 255);
        // Card header
        drawRect(png, margin, y, margin + cardW, y + Math.floor(cardH * 0.25), 254, 243, 199, 255);
      }
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const x = margin + i * (cardW + margin);
      drawRect(png, x, startY, x + cardW, startY + cardH, 255, 255, 255, 255);
      drawRect(png, x, startY, x + cardW, startY + Math.floor(cardH * 0.2), 254, 243, 199, 255);
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated screenshot: ${filePath} (${width}x${height}, ${buffer.length} bytes)`);
}

const publicDir = path.join(__dirname, '..', 'public');

generateAndSave(path.join(publicDir, 'favicon-32x32.png'), 32, 32, false);
generateAndSave(path.join(publicDir, 'icon-192.png'), 192, 192, false);
generateAndSave(path.join(publicDir, 'icon-192-maskable.png'), 192, 192, true);
generateAndSave(path.join(publicDir, 'icon-512.png'), 512, 512, false);
generateAndSave(path.join(publicDir, 'icon-512-maskable.png'), 512, 512, true);

generateScreenshot(path.join(publicDir, 'screenshot-desktop.png'), 1280, 720, false);
generateScreenshot(path.join(publicDir, 'screenshot-mobile.png'), 750, 1334, true);

console.log('All PWA icons and screenshots generated successfully!');
