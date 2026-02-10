
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
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email-input');
const loginMessage = document.getElementById('login-message');
const userEmailDisplay = document.getElementById('user-email');

// Show/hide login modal
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    loginModal.classList.remove('hidden');
});

closeModal.addEventListener('click', () => {
    loginModal.classList.remove('active');
    loginModal.classList.add('hidden');
    loginMessage.classList.add('hidden');
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('active');
        loginModal.classList.add('hidden');
    }
});

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    const actionCodeSettings = {
        url: window.location.origin + '/cv-assignments/auth-complete.html',
        handleCodeInApp: true
};

    // Check if email is allowed
    if (!isEmailAllowed(email)) {
        showMessage('This email is not authorized. Please use your university email.', 'error');
        return;
    }

    try {
        // Send sign-in link to email
        await firebaseAuth.sendSignInLinkToEmail(email, actionCodeSettings);
        
        // Save email for completion of sign-in
        window.localStorage.setItem('emailForSignIn', email);
        
        showMessage('Login link sent! Check your email to complete sign-in.', 'success');
        emailInput.value = '';
        
        // Close modal after 3 seconds
        setTimeout(() => {
            loginModal.classList.remove('active');
            loginModal.classList.add('hidden');
        }, 3000);
    } catch (error) {
        console.error('Error sending login email:', error);
        showMessage('Error sending login email. Please try again.', 'error');
    }
});

// Show message in modal
function showMessage(text, type) {
    loginMessage.textContent = text;
    loginMessage.className = `message ${type}`;
    loginMessage.classList.remove('hidden');
}

// Handle logout
logoutBtn.addEventListener('click', async () => {
    try {
        await firebaseAuth.signOut();
        updateUIForUser(null);
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Update UI based on authentication state
function updateUIForUser(user) {
    if (user) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userEmailDisplay.textContent = user.email;
        userEmailDisplay.classList.remove('hidden');
        
        // Enable voting buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.disabled = false;
        });
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userEmailDisplay.classList.add('hidden');
        
        // Disable voting buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.disabled = true;
        });
    }
}

// Listen for authentication state changes
firebaseAuth.onAuthStateChanged((user) => {
    updateUIForUser(user);
    
    // If on voting page, initialize votes
    if (user && typeof initializeVoting === 'function') {
        initializeVoting(user);
    }
});

// Check if returning from email link
if (firebaseAuth.isSignInWithEmailLink(window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    
    if (!email) {
        email = window.prompt('Please provide your email for confirmation');
    }
    
    if (email && isEmailAllowed(email)) {
        firebaseAuth.signInWithEmailLink(email, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                // Redirect to home or previous page
                window.location.href = '/cv-assignments/';
            })
            .catch((error) => {
                console.error('Error signing in with email link:', error);
                alert('Error completing sign-in. Please try again.');
            });
    } else {
        alert('Email not authorized or invalid.');
    }
}