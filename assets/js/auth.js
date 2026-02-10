const ALLOWED_EMAILS = [
    'raghavendra.singh@ashoka.edu.in',
    'saransh.gupta@ashoka.edu.in',
    'amarnath_yif26@ashoka.edu.in',
    'anand.agarwal_ug2023@ashoka.edu.in',
    'shubham.agarwal_phd24@ashoka.edu.in',
    'kartikeya.agrawal_ug25@ashoka.edu.in',
    'pankhi.mehta_ug25@ashoka.edu.in',
    'shreenand.bhattad_ug2023@ashoka.edu.in',
    'parshwa.doshi_ug2024@ashoka.edu.in',
    'neha.palak_ug2023@ashoka.edu.in',
    'sampurna.pandey_ug2023@ashoka.edu.in',
    'armaan.shah_ug25@ashoka.edu.in',
    'veer.singh_ug25@ashoka.edu.in',
    'karthik.sunil_ug25@ashoka.edu.in',
    'vaanee.tripathi_ug25@ashoka.edu.in'
];

function isEmailAllowed(email) {
    return ALLOWED_EMAILS.some(function(allowed) {
        return allowed.toLowerCase() === email.toLowerCase().trim();
    });
}

// UI Elements
var loginBtn = document.getElementById('login-btn');
var logoutBtn = document.getElementById('logout-btn');
var loginModal = document.getElementById('login-modal');
var closeModal = document.querySelector('.close');
var googleSignInBtn = document.getElementById('google-signin-btn');
var loginMessage = document.getElementById('login-message');
var userEmailDisplay = document.getElementById('user-email');

// Modal handlers
if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        loginModal.classList.add('active');
        loginModal.classList.remove('hidden');
    });
}

if (closeModal) {
    closeModal.addEventListener('click', function() {
        loginModal.classList.remove('active');
        loginModal.classList.add('hidden');
        if (loginMessage) loginMessage.classList.add('hidden');
    });
}

window.addEventListener('click', function(e) {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        loginModal.classList.add('hidden');
    }
});

// Google Identity Services token client (lazy init)
var tokenClient = null;

function getTokenClient() {
    if (tokenClient) return tokenClient;
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) return null;

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: handleGoogleToken
    });
    return tokenClient;
}

// Handle Google OAuth token -> Firebase sign-in
function handleGoogleToken(tokenResponse) {
    if (tokenResponse.error) {
        showMessage('Sign-in was cancelled.', 'error');
        return;
    }

    var credential = firebase.auth.GoogleAuthProvider.credential(null, tokenResponse.access_token);

    firebaseAuth.signInWithCredential(credential)
        .then(function(result) {
            if (!isEmailAllowed(result.user.email)) {
                return firebaseAuth.signOut().then(function() {
                    showMessage('This email is not authorized. Please use your university email.', 'error');
                });
            }
            // ADDED: store token for fast restore on other pages
            localStorage.setItem('gToken', tokenResponse.access_token);
            // Success — close modal
            if (loginModal) {
                loginModal.classList.remove('active');
                loginModal.classList.add('hidden');
            }
        })
        .catch(function(error) {
            console.error('Firebase sign-in error:', error);
            showMessage('Error signing in: ' + error.message, 'error');
        });
}

// Sign-in button click
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', function() {
        var client = getTokenClient();
        if (client) {
            client.requestAccessToken();
        } else {
            showMessage('Google Sign-In is still loading. Please try again in a moment.', 'error');
        }
    });
}

function showMessage(text, type) {
    if (loginMessage) {
        loginMessage.textContent = text;
        loginMessage.className = 'message ' + type;
        loginMessage.classList.remove('hidden');
    }
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('gToken');
        firebaseAuth.signOut()
            .then(function() {
                updateUIForUser(null);
            })
            .catch(function(error) {
                console.error('Error signing out:', error);
            });
    });
}

// Update UI based on auth state
function updateUIForUser(user) {
    if (user) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (userEmailDisplay) {
            userEmailDisplay.textContent = user.email;
            userEmailDisplay.classList.remove('hidden');
        }
        document.querySelectorAll('.vote-btn').forEach(function(btn) {
            btn.disabled = false;
        });
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (userEmailDisplay) userEmailDisplay.classList.add('hidden');
        document.querySelectorAll('.vote-btn').forEach(function(btn) {
            btn.disabled = true;
        });
    }
}

// ADDED: On page load, proactively restore session from stored Google token.
// This bypasses the slow Firebase auth iframe (~5min) with a direct API call (~100ms).
var storedGToken = localStorage.getItem('gToken');
if (storedGToken) {
    var cred = firebase.auth.GoogleAuthProvider.credential(null, storedGToken);
    firebaseAuth.signInWithCredential(cred).catch(function() {
        localStorage.removeItem('gToken');
    });
}

// Auth state listener
firebaseAuth.onAuthStateChanged(function(user) {
    updateUIForUser(user);
    if (user && typeof initializeVoting === 'function') {
        initializeVoting(user);
    }
});
