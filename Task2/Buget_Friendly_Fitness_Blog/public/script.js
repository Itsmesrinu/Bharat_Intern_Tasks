document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registrationForm');
    const successPopup = document.getElementById('successPopup');
    const existingUserPopup = document.getElementById('existingUserPopup');

    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Perform logic to check if the user's email already exists
        // Example: You might want to replace this with actual backend integration
        const userEmail = document.getElementById('email').value;
        const userExists = checkUserExists(userEmail);

        if (!userExists) {
            // User does not exist, display success popup
            showPopup(successPopup);
        } else {
            // User already exists, display existing user popup
            showPopup(existingUserPopup);
        }
    });
});

function checkUserExists(email) {
    // Example function to simulate checking if the user already exists
    // Replace this with actual backend integration
    const existingUsers = ['existing@example.com', 'anotheruser@example.com'];
    return existingUsers.includes(email);
}

function showPopup(popup) {
    popup.style.display = 'block';
}

function closePopup() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
}

function showLoginInstructions() {
