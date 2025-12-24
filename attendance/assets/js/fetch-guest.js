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

        // Obtener el modal-body
        const modalBody = modal.querySelector('.modal-body');
        if (!modalBody) {
            console.error('Modal body no encontrado');
            return;
        }

        // Construir el HTML completo del contenido del modal
        const modalContent = `
            <div class="container text-center">
                <div class="row">
                    <div class="col-lg-8 mx-auto">
                        <h2 class="text-uppercase text-success mb-0">¡PASE ENCONTRADO!</h2>
                        <hr class="mt-4 mb-1 star-dark">
                        
                        <div class="row">
                            <div class="col">
                                <h4 class="fs-2 mb-0">FAMILIA</h4>
                                <hr class="my-0 col-4" style="border-width: thin;color: red;">
                                <h5>${guestData.family_guest || 'N/A'}</h5>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <h4 class="fs-2 mb-0">${guestData.name_guest || 'N/A'}</h4>
                                <hr class="my-0 col-4" style="border-width: thin;color: red;">
                                <h5>${guestData.last_names_guest || 'N/A'}</h5>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <h4 class="fs-1 mb-0">MESA</h4>
                                <hr class="my-0 col-4" style="border-width: thin;color: red;">
                                <h5 class="fs-1">${guestData.assigned_to_table || 'N/A'}</h5>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <h4 class="fs-4 mb-0">ADULTOS</h4>
                                <hr class="my-0 col-8" style="border-width: thin;color: red;">
                                <h5 class="fs-2">${guestData.adults_qr_code || 0}</h5>
                            </div>
                            <div class="col">
                                <h4 class="fs-4 mb-0">NIÑOS</h4>
                                <hr class="my-0 col-8" style="border-width: thin;color: red;">
                                <h5 class="fs-2">${guestData.kids_qr_code || 0}</h5>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <h4 class="fs-4 mb-0">PASES</h4>
                                <hr class="my-0 col-6" style="border-width: thin;color: red;">
                                <h5 class="fs-1">${guestData.total_passes || 0}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Reemplazar el contenido del modal-body
        modalBody.innerHTML = modalContent;

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
