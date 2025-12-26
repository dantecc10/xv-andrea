if (redirectUrl !== "") {
document.getElementById("qr-link").innerHTML =
                    `<a class="bg-success text-white btn" onclick="javascript:fetchAndFillGuestFromUrl('${redirectUrl}', 'portfolio-modal-1');">VER PASE</a>`;
}