// Initialize UI Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userEmailSpan = document.getElementById('user-email');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');

/**
 * PHASE 1: UI State Management
 */
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (userEmailSpan) {
            userEmailSpan.textContent = user.email;
            userEmailSpan.classList.remove('hidden');
        }
        if (loginModal) loginModal.classList.add('hidden');
    } else {
        // User is signed out
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (userEmailSpan) userEmailSpan.classList.add('hidden');
    }
});

/**
 * PHASE 2: Sending the Magic Link
 */
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        
        const actionCodeSettings = {
            // URL must be whitelisted in Firebase Console
            url: window.location.origin + '/cv-assignments/auth-complete.html',
            handleCodeInApp: true
        };

        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
            .then(() => {
                // Save email locally so we don't have to ask for it again on the same device
                window.localStorage.setItem('emailForSignIn', email);
                alert('Check your email for the login link!');
            })
            .catch((error) => {
                console.error("Error sending link:", error);
                alert("Error: " + error.message);
            });
    });
}

/**
 * PHASE 3: Completing the Sign-In (The Handshake)
 */
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    
    // Fallback if the user opened the link on a different browser/device
    if (!email) {
        email = window.prompt('Please provide your email for confirmation');
    }

    firebase.auth().signInWithEmailLink(email, window.location.href)
        .then((result) => {
            window.localStorage.removeItem('emailForSignIn');
            // Successful login! Redirect to homepage
            window.location.href = '/cv-assignments/';
        })
        .catch((error) => {
            console.error("Sign-in error:", error);
            const statusMsg = document.getElementById('status-msg');
            if (statusMsg) statusMsg.textContent = "Error: Link expired or invalid.";
        });
}

/**
 * Logout Logic
 */
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        firebase.auth().signOut();
    });
}