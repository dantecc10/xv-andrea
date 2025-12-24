let qrCodeScanner;
let initialized = false;

function startScanner() {

    if (!initialized) {
        qrCodeScanner = new Html5Qrcode("reader");
        initialized = true;
    }

    qrCodeScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {

            document.getElementById("qr-link").innerHTML =
                `<a class="bg-success text-white btn" href="${decodedText}">VER PASE</a>`;

            qrCodeScanner.stop();
        }
    );
}
