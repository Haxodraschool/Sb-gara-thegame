const { Jimp } = require('jimp');
async function test() {
    const img = await Jimp.read('sb-garage/public/shadowsitright.png');
    for (let i = 0; i < 6; i++) {
        let minX = 1280;
        let maxX = 0;
        let startX = Math.floor(i * 1280 / 6);
        let endX = Math.floor((i+1) * 1280 / 6);
        for (let x = startX - 20; x < endX + 20; x++) {
            if (x < 0 || x >= 1280) continue;
            for (let y = 0; y < 242; y++) {
                const color = img.getPixelColor(x, y);
                if ((color & 0xff) > 0) { // check alpha
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                }
            }
        }
        console.log(`Character ${i} is between ${minX} and ${maxX} (width: ${maxX - minX + 1}). Expected slot is ${startX} to ${endX}`);
    }
}
test();