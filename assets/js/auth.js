/**
 * assets/js/auth.js
 * Robust Firebase Auth Handler
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Get UI Elements safely
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const userEmailSpan = document.getElementById('user-email');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const closeBtn = document.querySelector('.close');

    // 2. Auth State Listener: Updates UI based on Login Status
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("User Logged In:", user.email);
            if (loginBtn) loginBtn.classList.add('hidden');
            if (logoutBtn) logoutBtn.classList.remove('hidden');
            if (userEmailSpan) {
                userEmailSpan.textContent = user.email;
                userEmailSpan.classList.remove('hidden');
            }
            if (loginModal) loginModal.classList.add('hidden');
        } else {
            console.log("No User Logged In");
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (logoutBtn) logoutBtn.classList.add('hidden');
            if (userEmailSpan) userEmailSpan.classList.add('hidden');
        }
    });

    // 3. Modal Controls (Opening/Closing)
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            console.log("Login button clicked");
            loginModal.classList.remove('hidden');
        });
    }

    if (closeBtn && loginModal) {
        closeBtn.addEventListener('click', () => {
            loginModal.classList.add('hidden');
        });
    }

    // 4. Handle Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('email-input');
            const email = emailInput ? emailInput.value : '';
            
            if (!email) return;

            // Use the baseurl from your _config.yml
            const actionCodeSettings = {
                url: window.location.origin + '/cv-assignments/auth-complete.html',
                handleCodeInApp: true
            };

            firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    window.localStorage.setItem('emailForSignIn', email);
                    alert('A login link has been sent to ' + email);
                    loginModal.classList.add('hidden');
                })
                .catch((error) => {
                    console.error("Link sending failed:", error);
                    alert("Error: " + error.message);
                });
        });
    }

    // 5. Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut().then(() => {
                window.location.reload(); // Refresh to clear UI state
            });
        });
    }

    // 6. Check for Email Link Sign-in Completion
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }
        
        if (email) {
            firebase.auth().signInWithEmailLink(email, window.location.href)
                .then(() => {
                    window.localStorage.removeItem('emailForSignIn');
                    window.location.href = '/cv-assignments/';
                })
                .catch((error) => {
                    console.error("Sign-in completion failed:", error);
                    alert("Link invalid or expired.");
                });
        }
    }
});