const fs = require('fs');
const https = require('https');
const path = require('path');

const downloads = [
  { url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/floral-dress.jpg' },
  { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/bomber-jacket.jpg' },
  { url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/heart-sweatshirt.jpg' },
  { url: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/striped-tee.jpg' },
  { url: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/ruffle-romper.jpg' },
  { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/dino-set.jpg' },

  { url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&auto=format&fit=crop&q=85', dest: 'public/images/categories/girls.jpg' },
  { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=85', dest: 'public/images/categories/boys.jpg' },
  { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=85', dest: 'public/images/categories/baby.jpg' },
  { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&auto=format&fit=crop&q=85', dest: 'public/images/categories/outfits.jpg' },
  { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=85', dest: 'public/images/categories/footwear.jpg' },
  { url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=500&auto=format&fit=crop&q=85', dest: 'public/images/categories/accessories.jpg' },

  { url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&auto=format&fit=crop&q=85', dest: 'public/images/banners/spring-sale.jpg' },
  { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500&auto=format&fit=crop&q=85', dest: 'public/images/banners/new-collection.jpg' },
  { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=85', dest: 'public/images/banners/welcome-offer.jpg' },
  { url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1200&auto=format&fit=crop&q=90', dest: 'public/images/hero-kids.jpg' }
];

function fetchUrl(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const dir = path.dirname(dest);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const file = fs.createWriteStream(dest);
          redirectRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(dest); });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const dir = path.dirname(dest);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(dest); });
      } else {
        reject(new Error(`Failed with status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function run() {
  for (const item of downloads) {
    try {
      await fetchUrl(item.url, item.dest);
      console.log(`Saved: ${item.dest}`);
    } catch (e) {
      console.error(`Error for ${item.dest}:`, e.message);
    }
  }
  console.log('All downloads processed!');
}

run();
