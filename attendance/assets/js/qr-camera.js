//Inicializo la cámara y el lector de QR
const result = document.getElementById("result");
const qrCodeScanner = new Html5Qrcode("reader");
const linkElement = document.getElementById("qr-link");

function startScanner() {
    qrCodeScanner.start({
        facingMode: "environment"
    }, // cámara trasera en móviles
        {
            fps : 10,
            qrbox: 250
        },
        (decodedText) => {
            result.innerHTML = "<a href=\"" + decodedText + "\">" + decodedText + "</a>";
            linkElement.textContent = decodedText;

            // Si es un enlace, puedes redirigir
            if (decodedText.startsWith("http") && decodedText.startsWith("https://xv-andrea.castelancarpinteyro.com/guest.php")) {
                //window.location.href = decodedText;
                linkElement.href = decodedText;
                //document.getElementById("qr-link").click();
            }

            qrCodeScanner.stop();
        },
        (errorMessage) => {
            // errores silenciosos de lectura
        }
    );
}