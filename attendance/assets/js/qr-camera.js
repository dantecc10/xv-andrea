let qrCodeScanner;
let initialized = false;

function startScanner() {
    document.querySelector("#qr-link").innerHTML = "";
    if (!initialized) {
        qrCodeScanner = new Html5Qrcode("reader");
        initialized = true;
    }

    qrCodeScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            // Si el texto decodificado es un enlace y empieza con "https://xv-andrea.castelancarpinteyro.com" 
            if (decodedText.startsWith("https://xv-andrea.castelancarpinteyro.com")) {
                document.getElementById("qr-link").innerHTML =
                    `<a class="bg-success text-white btn" onclick="javascript:fetchAndFillGuestFromUrl('${decodedText}')">VER PASE</a>`;
                    //`<a class="bg-success text-white btn" href="${decodedText}">VER PASE</a>`;
            } else {
                document.getElementById("qr-link").innerHTML =
                    `<span class="btn bg-danger text-white">QR no válido</span>`;
            }

            qrCodeScanner.stop();
        }
    );
}
