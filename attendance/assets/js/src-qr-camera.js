const result = document.getElementById("result");

const qrCodeScanner = new Html5Qrcode("reader");

qrCodeScanner.start({
    facingMode: "environment"
}, // cámara trasera en móviles
    {
        fps: 10,
        qrbox: 250
    },
    (decodedText) => {
        result.textContent = decodedText;

        // Si es un enlace, puedes redirigir
        if (decodedText.startsWith("http")) {
            window.location.href = decodedText;
        }

        qrCodeScanner.stop();
    },
    (errorMessage) => {
        // errores silenciosos de lectura
    }
);