const video = document.getElementById('video');
const output = document.getElementById('ascii-output');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const ASCII_WIDTH = 100;
let isPlaying = false;

function convertToAscii(imageData, width) {
    const height = Math.floor(imageData.height * width / imageData.width);
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(video, 0, 0, imageData.width, imageData.height, 0, 0, width, height);
    
    const resizedData = ctx.getImageData(0, 0, width, height);
    
    let ascii = '';
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const gray = (resizedData.data[idx] + resizedData.data[idx + 1] + resizedData.data[idx + 2]) / 3;
            ascii += gray < 128 ? '@' : '#';
        }
        ascii += '\n';
    }
    return ascii;
}

function processFrame() {
    if (!isPlaying) return;
    
    canvas.width = video.videoWidth / 1;
    canvas.height = video.videoHeight / 1;
    
    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const ascii = convertToAscii(imageData, ASCII_WIDTH);
    output.textContent = ascii;
    
    requestAnimationFrame(processFrame);
}

video.addEventListener('loadeddata', async () => {
    try {
        await video.play();
        isPlaying = true;
        requestAnimationFrame(processFrame);
    } catch (error) {
        console.error("Erreur: Impossible de lire la vidéo", error);
    }
});

video.addEventListener('ended', () => {
    isPlaying = true;
});