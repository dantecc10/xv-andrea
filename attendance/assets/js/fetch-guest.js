/**
 * Función para obtener datos del invitado mediante AJAX
 * @param {string} qrCode - Código QR del invitado
 * @param {string} url - URL del endpoint (por defecto: guest-copy.php)
 * @returns {Promise<Object>} - Datos del invitado en formato JSON
 */
async function fetchGuestData(qrCode, url = 'guest.php') {
    try {
        // Construir la URL con los parámetros
        const fetchUrl = `${url}?qr_code=${encodeURIComponent(qrCode)}&ajax=1`;
        
        // Hacer la petición fetch
        const response = await fetch(fetchUrl);
        
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Decodificar la respuesta JSON
        const data = await response.json();
        
        // Imprimir en consola
        console.log('Datos del invitado:', data);
        
        // Retornar los datos para uso posterior
        return data;
        
    } catch (error) {
        console.error('Error al obtener datos del invitado:', error);
        throw error;
    }
}

/**
 * Ejemplo de uso de la función
 * Descomentar para probar:
 */
// fetchGuestData('codigo-qr-ejemplo');
