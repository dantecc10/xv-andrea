//Inicializo la cámara y el lector de QR
const result = document.getElementById("result");
const qrCodeScanner = new Html5Qrcode("reader");
const linkElement = document.getElementById("qr-link");

function startScanner() {
    qrCodeScanner.start({
        facingMode: "environment"
    }, // cámara trasera en móviles
        {
            fps: 10,
            qrbox: 250
        },
        (decodedText) => {
            result.innerHTML = "<a class='bg-success text-white btn' href='" + decodedText + "'>VER PASE</a>";
            linkElement.textContent = decodedText;

            // Detiener el escáner después de una lectura exitosa
            qrCodeScanner.stop();
        },
        (errorMessage) => {
            // errores silenciosos de lectura
        }
    );
}