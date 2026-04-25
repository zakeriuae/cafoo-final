import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.join(__dirname, '..', 'public', 'images', 'developers')

const logos = [
  {
    name: 'danube',
    url: 'https://www.danubeproperties.ae/themes/danube/img/logo.png',
    file: 'danube.png'
  },
  {
    name: 'dar-al-arkan',
    url: 'https://dararkan.com/wp-content/themes/dar-al-arkan/images/logo.png',
    file: 'dar-al-arkan.png'
  },
  {
    name: 'omniyat',
    url: 'https://omniyat.com/images/common/logo.svg',
    file: 'omniyat.svg'
  }
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        return download(response.headers.location, dest).then(resolve).catch(reject)
      }
      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`))
      }
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlinkSync(dest)
      reject(err)
    })
  })
}

async function downloadAll() {
  for (const logo of logos) {
    const dest = path.join(outputDir, logo.file)
    try {
      await download(logo.url, dest)
      console.log(`✅ Downloaded ${logo.name} -> ${logo.file}`)
    } catch (err) {
      console.error(`❌ Failed ${logo.name}: ${err.message}`)
    }
  }
}

downloadAll()
