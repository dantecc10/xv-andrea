/**
 * Función para obtener datos del invitado mediante AJAX
 * @param {string} qrCode - Código QR del invitado
 * @param {string} url - URL del endpoint (por defecto: guest-copy.php)
 * @returns {Promise<Object>} - Datos del invitado en formato JSON
 */
async function fetchGuestData(qrCode, url = 'https://xv-andrea.castelancarpinteyro.com/attendance/guest.php') {
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
 * Función para llenar el modal con los datos del invitado
 * @param {Object} data - Datos del invitado obtenidos del fetch
 * @param {string} modalId - ID del modal a llenar (por defecto: 'guestModal')
 */
function fillGuestModal(data, modalId = 'guestModal') {
    try {
        if (!data.success) {
            console.error('Error: ', data.message);
            alert('Error: ' + data.message);
            return;
        }

        const guestData = data.data;

        // Obtener el modal
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal con ID "${modalId}" no encontrado`);
            return;
        }

        // Obtener el contenedor principal (col-lg-8)
        const container = modal.querySelector('.col-lg-8.mx-auto');
        if (!container) {
            console.error('Contenedor .col-lg-8.mx-auto no encontrado en el modal');
            return;
        }

        // Obtener todos los rows que son hijos directos del contenedor
        const rows = container.querySelectorAll(':scope > .row');

        console.log('Rows encontrados:', rows.length);

        if (rows.length < 5) {
            console.warn('Se esperaban al menos 5 rows, se encontraron: ' + rows.length);
        }

        // Row 0: FAMILIA (h5 con la familia)
        if (rows[0]) {
            const h5 = rows[0].querySelector('h5');
            if (h5) h5.textContent = guestData.family_guest || 'N/A';
        }

        // Row 1: NOMBRE Y APELLIDOS (h4 con nombre, h5 con apellidos)
        if (rows[1]) {
            const h4 = rows[1].querySelector('h4');
            const h5 = rows[1].querySelector('h5');
            if (h4) h4.textContent = guestData.name_guest || 'N/A';
            if (h5) h5.textContent = guestData.last_names_guest || 'N/A';
        }

        // Row 2: MESA (h5 con número de mesa)
        if (rows[2]) {
            const h5 = rows[2].querySelector('h5');
            if (h5) h5.textContent = guestData.assigned_to_table || 'N/A';
        }

        // Row 3: ADULTOS Y NIÑOS (dos columnas con h5)
        if (rows[3]) {
            const cols = rows[3].querySelectorAll('.col');
            if (cols[0]) {
                const h5 = cols[0].querySelector('h5');
                if (h5) h5.textContent = guestData.adults_qr_code || 0;
            }
            if (cols[1]) {
                const h5 = cols[1].querySelector('h5');
                if (h5) h5.textContent = guestData.kids_qr_code || 0;
            }
        }

        // Row 4: PASES TOTALES (h5 con total)
        if (rows[4]) {
            const h5 = rows[4].querySelector('h5');
            if (h5) h5.textContent = guestData.total_passes || 0;
        }

        // Mostrar el modal
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        console.log('Modal llenado exitosamente con datos:', guestData);

    } catch (error) {
        console.error('Error al llenar el modal:', error);
    }
}

/**
 * Función combinada que obtiene los datos y llena el modal
 * @param {string} qrCode - Código QR del invitado
 * @param {string} url - URL del endpoint
 * @param {string} modalId - ID del modal a llenar
 */
async function fetchAndFillGuest(qrCode, url = 'https://xv-andrea.castelancarpinteyro.com/attendance/guest.php', modalId = 'guestModal') {
    try {
        const data = await fetchGuestData(qrCode, url);
        fillGuestModal(data, modalId);
    } catch (error) {
        console.error('Error en fetchAndFillGuest:', error);
        alert('Error al obtener datos del invitado');
    }
}

/**
 * Ejemplo de uso de las funciones
 * Descomentar para probar:
 */
// fetchAndFillGuest('codigo-qr-ejemplo');
