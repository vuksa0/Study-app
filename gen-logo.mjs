import sharp from "sharp";

const svg = `<svg width="512" height="512" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#F5F5F5"/>
  <path d="M16 4 C16.5 13 19 15.5 28 16 C19 16.5 16.5 19 16 28 C15.5 19 13 16.5 4 16 C13 15.5 15.5 13 16 4Z" fill="#111111"/>
</svg>`;

await sharp(Buffer.from(svg))
  .resize(512, 512)
  .png()
  .toFile("C:/Users/vukzi/thinkio-logo.png");

console.log("Done: C:/Users/vukzi/thinkio-logo.png");
