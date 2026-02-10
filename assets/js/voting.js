// Voting System with Firebase Realtime Database

let currentUser = null;

// Load vote counts for all widgets (no auth required)
function initializeVoteCounts() {
    const votingWidgets = document.querySelectorAll('.voting-widget');

    votingWidgets.forEach(widget => {
        const problemId = widget.dataset.problemId;
        if (!widget.dataset.countListener) {
            loadVoteCount(problemId, widget);
            widget.dataset.countListener = 'true';
        }
    });
}

// Initialize user-specific voting (requires auth)
function initializeVoting(user) {
    currentUser = user;
    const votingWidgets = document.querySelectorAll('.voting-widget');

    votingWidgets.forEach(widget => {
        const problemId = widget.dataset.problemId;

        // Load user's vote state
        loadUserVote(problemId, widget);

        // Setup vote button listeners (only once)
        if (!widget.dataset.buttonsReady) {
            setupVoteButtons(problemId, widget);
            widget.dataset.buttonsReady = 'true';
        }
    });
}

// Load total vote count for a problem
function loadVoteCount(problemId, widget) {
    const voteCountRef = firebaseDatabase.ref('votes/' + problemId + '/count');

    voteCountRef.on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const countElement = widget.querySelector('.vote-count');
        countElement.textContent = count;

        // Add color class based on count
        countElement.classList.remove('positive', 'negative');
        if (count > 0) {
            countElement.classList.add('positive');
        } else if (count < 0) {
            countElement.classList.add('negative');
        }
    }, (error) => {
        console.error('Error loading vote count for ' + problemId + ':', error);
    });
}

// Load user's current vote for a problem
function loadUserVote(problemId, widget) {
    if (!currentUser) return;

    const userId = currentUser.uid;
    const userVoteRef = firebaseDatabase.ref('votes/' + problemId + '/users/' + userId);

    userVoteRef.on('value', (snapshot) => {
        const userVote = snapshot.val();
        const upvoteBtn = widget.querySelector('.vote-btn.upvote');
        const downvoteBtn = widget.querySelector('.vote-btn.downvote');

        // Remove active class from both buttons
        upvoteBtn.classList.remove('active');
        downvoteBtn.classList.remove('active');

        // Add active class to the voted button
        if (userVote === 1) {
            upvoteBtn.classList.add('active');
        } else if (userVote === -1) {
            downvoteBtn.classList.add('active');
        }
    }, (error) => {
        console.error('Error loading user vote for ' + problemId + ':', error);
    });
}

// Setup vote button click handlers
function setupVoteButtons(problemId, widget) {
    const upvoteBtn = widget.querySelector('.vote-btn.upvote');
    const downvoteBtn = widget.querySelector('.vote-btn.downvote');

    upvoteBtn.addEventListener('click', () => handleVote(problemId, 1, widget));
    downvoteBtn.addEventListener('click', () => handleVote(problemId, -1, widget));
}

// Handle vote submission
async function handleVote(problemId, voteValue, widget) {
    if (!currentUser) {
        alert('Please login to vote');
        return;
    }

    const userId = currentUser.uid;
    const userEmail = currentUser.email;
    const userVoteRef = firebaseDatabase.ref('votes/' + problemId + '/users/' + userId);
    const voteCountRef = firebaseDatabase.ref('votes/' + problemId + '/count');
    const voteDetailsRef = firebaseDatabase.ref('votes/' + problemId + '/details/' + userId);

    try {
        // Get current user vote
        const currentVoteSnapshot = await userVoteRef.once('value');
        const currentVote = currentVoteSnapshot.val() || 0;

        let newVote;
        let countChange;

        // Toggle logic: if clicking same button, remove vote
        if (currentVote === voteValue) {
            newVote = 0;
            countChange = -voteValue;
        } else {
            newVote = voteValue;
            countChange = voteValue - currentVote;
        }

        // Use transaction to update count atomically
        await voteCountRef.transaction((currentCount) => {
            return (currentCount || 0) + countChange;
        });

        // Update user's vote
        if (newVote === 0) {
            await userVoteRef.remove();
            await voteDetailsRef.remove();
        } else {
            await userVoteRef.set(newVote);
            await voteDetailsRef.set({
                email: userEmail,
                vote: newVote,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }

    } catch (error) {
        console.error('Error voting:', error);
        alert('Error submitting vote. Please try again.');
    }
}

// Auto-initialize vote counts when script loads
initializeVoteCounts();

// Export functions for use in auth.js
window.initializeVoting = initializeVoting;
