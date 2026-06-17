import fs from 'node:fs/promises';
import QRCode from 'qrcode';

const catalogUrl = process.env.CATALOG_URL ?? 'https://desa-sedayu.pages.dev/produk/';

const svg = await QRCode.toString(catalogUrl, {
  type: 'svg',
  errorCorrectionLevel: 'M',
  margin: 2,
  color: {
    dark: '#174631',
    light: '#ffffff',
  },
});

await fs.mkdir('public/assets', { recursive: true });
await fs.writeFile('public/assets/qr-katalog.svg', svg);

console.log(`QR katalog dibuat untuk ${catalogUrl}`);
