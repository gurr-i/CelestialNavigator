
import https from 'https';
import fs from 'fs';
import path from 'path';

const TEXTURE_URLS = {
  'sun.jpg': 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
  'planets/mercury.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
  'planets/venus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
  'planets/earth.jpg': 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
  'planets/moon.jpg': 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg',
  'planets/mars.jpg': 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
  'planets/jupiter.jpg': 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
  'planets/saturn.jpg': 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
  'planets/uranus.jpg': 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
  'planets/neptune.jpg': 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
  'planets/pluto.jpg': 'https://www.solarsystemscope.com/textures/download/2k_pluto.jpg',
};

async function downloadTexture(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function downloadAllTextures() {
  const baseDir = path.join('client', 'public', 'textures');
  
  for (const [localPath, url] of Object.entries(TEXTURE_URLS)) {
    const fullPath = path.join(baseDir, localPath);
    try {
      await downloadTexture(url, fullPath);
    } catch (error) {
      console.error(`Error downloading ${localPath}:`, error);
    }
  }
}

downloadAllTextures().then(() => {
  console.log('All textures downloaded successfully!');
}).catch(console.error);
