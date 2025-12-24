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

        // Mapear datos a los elementos del modal
        // FAMILIA
        const familyElement = modal.querySelector('.row:nth-child(1) .col');
        if (familyElement) {
            familyElement.innerHTML = `
                <h4 class="fs-2 mb-0">${guestData.family_guest || 'N/A'}</h4>
                <hr class="my-0 col-4" style="border-width: thin;color: red;">
                <h5>${guestData.name_guest} ${guestData.last_names_guest}</h5>
            `;
        }

        // MESA
        const tableElement = modal.querySelector('.row:nth-child(2) .col');
        if (tableElement) {
            tableElement.innerHTML = `
                <h4 class="fs-1 mb-0">MESA</h4>
                <hr class="my-0 col-4" style="border-width: thin;color: red;">
                <h5 class="fs-1">${guestData.assigned_to_table || 'N/A'}</h5>
            `;
        }

        // ADULTOS Y NIÑOS
        const passesRow = modal.querySelector('.row:nth-child(3)');
        if (passesRow) {
            const cols = passesRow.querySelectorAll('.col');
            if (cols[0]) {
                cols[0].innerHTML = `
                    <h4 class="fs-4 mb-0">ADULTOS</h4>
                    <hr class="my-0 col-8" style="border-width: thin;color: red;">
                    <h5 class="fs-2">${guestData.adults_qr_code || 0}</h5>
                `;
            }
            if (cols[1]) {
                cols[1].innerHTML = `
                    <h4 class="fs-4 mb-0">NIÑOS</h4>
                    <hr class="my-0 col-8" style="border-width: thin;color: red;">
                    <h5 class="fs-2">${guestData.kids_qr_code || 0}</h5>
                `;
            }
        }

        // PASES TOTALES
        const totalPassesElement = modal.querySelector('.row:nth-child(4) .col');
        if (totalPassesElement) {
            totalPassesElement.innerHTML = `
                <h4 class="fs-4 mb-0">PASES</h4>
                <hr class="my-0 col-6" style="border-width: thin;color: red;">
                <h5 class="fs-1">${guestData.total_passes || 0}</h5>
            `;
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
