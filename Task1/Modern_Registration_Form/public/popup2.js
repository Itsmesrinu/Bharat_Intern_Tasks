// JavaScript code to handle the pop-up functionality

function openPopup(message) {
    document.getElementById('popup-content').innerHTML = message;
    document.querySelector('.popup-container').style.display = 'flex';
}

function closePopup() {
    document.querySelector('.popup-container').style.display = 'none';
}
