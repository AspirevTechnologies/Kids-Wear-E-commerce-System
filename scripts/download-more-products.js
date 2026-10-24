const fs = require('fs');
const https = require('https');

const moreProducts = [
  { url: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/linen-shirt.jpg' },
  { url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/party-frock.jpg' },
  { url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/organic-onesie-set.jpg' },
  { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/denim-dungaree.jpg' },
  { url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/festive-kurta.jpg' },
  { url: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&auto=format&fit=crop&q=85', dest: 'public/images/products/modal-pyjamas.jpg' }
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

Promise.all(moreProducts.map(fetchFile)).then(res => {
  console.log('Saved 6 additional products: ' + res.join(', '));
}).catch(err => {
  console.error('Failed to download: ', err);
});
