// Voting System with Firebase Realtime Database

let currentUser = null;

// Initialize voting system when user is authenticated
function initializeVoting(user) {
    currentUser = user;
    const votingWidgets = document.querySelectorAll('.voting-widget');
    
    votingWidgets.forEach(widget => {
        const problemId = widget.dataset.problemId;
        
        // Load vote counts
        loadVoteCount(problemId, widget);
        
        // Load user's vote
        loadUserVote(problemId, widget);
        
        // Setup vote button listeners
        setupVoteButtons(problemId, widget);
    });
}

// Load total vote count for a problem
function loadVoteCount(problemId, widget) {
    const voteCountRef = database.ref(`votes/${problemId}/count`);
    
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
    });
}

// Load user's current vote for a problem
function loadUserVote(problemId, widget) {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    const userVoteRef = database.ref(`votes/${problemId}/users/${userId}`);
    
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
    const userVoteRef = database.ref(`votes/${problemId}/users/${userId}`);
    const voteCountRef = database.ref(`votes/${problemId}/count`);
    const voteDetailsRef = database.ref(`votes/${problemId}/details/${userId}`);
    
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

// Get vote statistics for a problem (for admin/instructor use)
async function getVoteStats(problemId) {
    const voteRef = database.ref(`votes/${problemId}`);
    const snapshot = await voteRef.once('value');
    const data = snapshot.val();
    
    if (!data) {
        return {
            totalCount: 0,
            upvotes: 0,
            downvotes: 0,
            voters: []
        };
    }
    
    const voters = data.details || {};
    const upvotes = Object.values(voters).filter(v => v.vote === 1).length;
    const downvotes = Object.values(voters).filter(v => v.vote === -1).length;
    
    return {
        totalCount: data.count || 0,
        upvotes,
        downvotes,
        voters: Object.values(voters).map(v => ({
            email: v.email,
            vote: v.vote,
            timestamp: v.timestamp
        }))
    };
}

// Export functions for use in other scripts
window.initializeVoting = initializeVoting;
window.getVoteStats = getVoteStats;