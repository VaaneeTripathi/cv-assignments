
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

// Check if email is in allowed list
function isEmailAllowed(email) {
    const normalizedEmail = email.toLowerCase().trim();
    return ALLOWED_EMAILS.some(allowed => allowed.toLowerCase() === normalizedEmail);
}

// UI Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close');
const googleSignInBtn = document.getElementById('google-signin-btn');
const loginMessage = document.getElementById('login-message');
const userEmailDisplay = document.getElementById('user-email');

// Show/hide login modal
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        loginModal.classList.add('active');
        loginModal.classList.remove('hidden');
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('active');
        loginModal.classList.add('hidden');
        if (loginMessage) loginMessage.classList.add('hidden');
    });
}

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        loginModal.classList.add('hidden');
    }
});

// Handle redirect result on page load (completes sign-in after Google redirect)
firebaseAuth.getRedirectResult().then((result) => {
    if (result && result.user) {
        if (!isEmailAllowed(result.user.email)) {
            firebaseAuth.signOut();
            showMessage('This email is not authorized. Please use your university email.', 'error');
            if (loginModal) {
                loginModal.classList.add('active');
                loginModal.classList.remove('hidden');
            }
        }
    }
}).catch((error) => {
    console.error('Error completing sign-in redirect:', error);
});

// Handle Google Sign-In button — redirect instead of popup
if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', () => {
        firebaseAuth.signInWithRedirect(googleProvider);
    });
}

// Show message in modal
function showMessage(text, type) {
    if (loginMessage) {
        loginMessage.textContent = text;
        loginMessage.className = `message ${type}`;
        loginMessage.classList.remove('hidden');
    }
}

// Handle logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await firebaseAuth.signOut();
            updateUIForUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });
}

// Update UI based on authentication state
function updateUIForUser(user) {
    if (user) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
        if (userEmailDisplay) {
            userEmailDisplay.textContent = user.email;
            userEmailDisplay.classList.remove('hidden');
        }
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.disabled = false;
        });
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
        if (userEmailDisplay) userEmailDisplay.classList.add('hidden');
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
}

// Listen for authentication state changes
firebaseAuth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user ? user.email : 'no user');
    updateUIForUser(user);

    // If on voting page, initialize user voting
    if (user && typeof initializeVoting === 'function') {
        initializeVoting(user);
    }
});
