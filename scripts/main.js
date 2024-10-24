// scripts/main.js
const config = {
    width: 256,
    height: 256,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
};

let qr = null;

function generateQR() {
    const content = document.getElementById('content').value;
    if (!content) {
        alert('Prosím zadejte obsah QR kódu');
        return;
    }

    const size = document.getElementById('size').value;
    document.getElementById('qrcode').innerHTML = '';
    
    config.width = parseInt(size);
    config.height = parseInt(size);
    
    qr = new QRCode(document.getElementById("qrcode"), {
        ...config,
        text: content
    });
}

function downloadQR(format) {
    if (!qr) {
        alert('Nejdříve vygenerujte QR kód');
        return;
    }
    
    const canvas = document.querySelector('#qrcode canvas');
    const link = document.createElement('a');
    
    if (format === 'png') {
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
    } else if (format === 'svg') {
        const svg = createSVGFromCanvas(canvas);
        const blob = new Blob([svg], {type: 'image/svg+xml'});
        link.download = 'qrcode.svg';
        link.href = URL.createObjectURL(blob);
    }
    
    link.click();
}

function createSVGFromCanvas(canvas) {
    const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">`;
    
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const idx = (y * canvas.width + x) * 4;
            if (data.data[idx] === 0) {
                svg += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
            }
        }
    }
    
    svg += '</svg>';
    return svg;
}

// Přidání event listeneru pro Enter klávesu
document.getElementById('content').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateQR();
    }
});
