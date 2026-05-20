/**
 * This script fetches the environment variables from the dev app and stores
 * them in public/env.js, and creates an empty features.json file
 */
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localFeaturesFilePath = path.join(__dirname, '../public/features.json');
const localEnvConfigPath = path.join(__dirname, '../public/env.js');
const devEnvConfigUrl = 'https://toolkit-boilerplate-dev.hyble.app/env.js';

async function setup() {
  try {
    const envFileResponse = await fetch(devEnvConfigUrl);
    if (!envFileResponse.ok) {
      throw new Error(`HTTP ${envFileResponse.status}`);
    }

    const fileStream = createWriteStream(localEnvConfigPath);

    let bodyStream = envFileResponse.body;
    if (bodyStream && typeof bodyStream.getReader === 'function') {
      bodyStream = Readable.fromWeb(bodyStream);
    }

    await pipeline(bodyStream, fileStream);

    console.log(`✅ env config fetched successfully`);
  } catch (error) {
    console.error(`❌ Failed to fetch env config`, error);
  }

  await fs.writeFile(localFeaturesFilePath, '[]');
  console.log('✅ features file created');
}

setup();
