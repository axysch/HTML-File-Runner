// popup.js

function initPopup() {
    const overlay = document.getElementById("afxPopupOverlay");
    if (!overlay) return;

    const close = document.getElementById("afxClose");
    const btn = document.getElementById("afxBtn");

    // show only once per session (optional but recommended)
    if (sessionStorage.getItem("popupSeen")) return;
    sessionStorage.setItem("popupSeen", "true");

    setTimeout(() => {
        overlay.classList.add("show");
    }, 400);

    function closePopup() {
        overlay.classList.remove("show");
    }

    close?.addEventListener("click", closePopup);
    btn?.addEventListener("click", closePopup);
}

window.addEventListener("DOMContentLoaded", initPopup);
