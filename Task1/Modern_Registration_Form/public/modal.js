// Function to open the modal with a message
function openModal(message) {
    document.getElementById('messageText').innerText = message;
    document.getElementById('myModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}
