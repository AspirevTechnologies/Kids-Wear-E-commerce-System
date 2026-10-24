const fs = require('fs');
const https = require('https');

const banners = [
  // 1. Cute girl smiling for Spring Sale
  { url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&auto=format&fit=crop&q=85', dest: 'public/images/banners/spring-sale.jpg' },
  // 2. Beautiful folded pastel clothes stack for New Collection
  { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=85', dest: 'public/images/banners/new-collection.jpg' },
  // 3. Cute stylish boy for Welcome Offer
  { url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&auto=format&fit=crop&q=85', dest: 'public/images/banners/welcome-offer.jpg' },
];

function fetchFile(item) {
  return new Promise((resolve, reject) => {
    https.get(item.url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redRes) => {
          const file = fs.createWriteStream(item.dest);
          redRes.pipe(file);
          file.on('finish', () => { file.close(); resolve(item.dest); });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(item.dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(item.dest); });
      } else {
        reject(new Error(`Status ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

Promise.all(banners.map(fetchFile)).then(res => {
  console.log('Saved 3 banners successfully: ' + res.join(', '));
}).catch(err => {
  console.error('Failed to download banner: ', err);
});
