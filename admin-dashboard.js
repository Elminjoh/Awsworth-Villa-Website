/**
 * AWSWORTH VILLA FC - Admin Dashboard Module
 * 
 * This file contains all functionality related to the dashboard overview
 * in the admin dashboard.
 */

/**
 * Load dashboard overview statistics
 */
function loadDashboardStats() {
    // Load counts from localStorage
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Update dashboard stats
    document.getElementById('stats-news-count').textContent = newsArticles.length;
    document.getElementById('stats-players-count').textContent = players.length;
    document.getElementById('stats-users-count').textContent = users.length;
    
    // Count upcoming matches
    const upcomingMatches = matches.filter(match => match.status === 'upcoming');
    document.getElementById('stats-matches-upcoming').textContent = upcomingMatches.length;
    
    // Load recent activity
    loadRecentActivity();
    
    // Load upcoming matches
    loadUpcomingMatches();
    
    // Load recent members
    loadRecentMembers();
    
    // Initialize charts
    initDashboardCharts();
}

/**
 * Load recent activity for dashboard
 */
function loadRecentActivity() {
    const activityContainer = document.getElementById('recent-activity');
    if (!activityContainer) return;
    
    // Get data from localStorage
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    
    // Create activity items
    const activities = [];
    
    // Add recent news articles
    newsArticles.forEach(article => {
        activities.push({
            type: 'news',
            text: `News article published: ${article.title}`,
            time: new Date(article.date),
            sort: new Date(article.date).getTime()
        });
    });
    
    // Add recent matches
    matches.forEach(match => {
        if (match.status === 'completed') {
            activities.push({
                type: 'match',
                text: `Match result: ${match.location === 'Home' ? 'Awsworth Villa' : match.opponent} ${match.homeScore}-${match.awayScore} ${match.location === 'Home' ? match.opponent : 'Awsworth Villa'}`,
                time: new Date(match.date),
                sort: new Date(match.date).getTime()
            });
        } else if (match.status === 'upcoming') {
            activities.push({
                type: 'match',
                text: `Upcoming match: ${match.location === 'Home' ? 'Awsworth Villa vs ' + match.opponent : match.opponent + ' vs Awsworth Villa'}`,
                time: new Date(match.date),
                sort: new Date(match.date).getTime()
            });
        }
    });
    
    // Add recent user registrations
    users.forEach(user => {
        activities.push({
            type: 'user',
            text: `New user registered: ${user.name}`,
            time: new Date(user.registeredOn),
            sort: new Date(user.registeredOn).getTime()
        });
    });
    
    // Sort by time (most recent first) and take top 5
    activities.sort((a, b) => b.sort - a.sort);
    const recentActivities = activities.slice(0, 5);
    
    // Clear container
    activityContainer.innerHTML = '';
    
    // If no activities, show message
    if (recentActivities.length === 0) {
        activityContainer.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }
    
    // Add activity items
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        // Format time
        const now = new Date();
        const activityTime = activity.time;
        let timeDisplay = '';
        
        const timeDiff = now.getTime() - activityTime.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 0) {
            // Today
            const hourDiff = Math.floor(timeDiff / (1000 * 60 * 60));
            if (hourDiff === 0) {
                const minuteDiff = Math.floor(timeDiff / (1000 * 60));
                timeDisplay = minuteDiff === 0 ? 'Just now' : `${minuteDiff} minutes ago`;
            } else {
                timeDisplay = `${hourDiff} hours ago`;
            }
        } else if (dayDiff === 1) {
            timeDisplay = 'Yesterday';
        } else if (dayDiff < 7) {
            timeDisplay = `${dayDiff} days ago`;
        } else {
            timeDisplay = activityTime.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
        
        // Set icon based on activity type
        let icon = '';
        switch (activity.type) {
            case 'user': icon = '<i class="fas fa-user-plus"></i>'; break;
            case 'news': icon = '<i class="fas fa-newspaper"></i>'; break;
            case 'match': icon = '<i class="fas fa-futbol"></i>'; break;
            case 'player': icon = '<i class="fas fa-running"></i>'; break;
            default: icon = '<i class="fas fa-bell"></i>';
        }
        
        activityItem.innerHTML = `
            <div class="activity-icon">${icon}</div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${timeDisplay}</div>
            </div>
        `;
        
        activityContainer.appendChild(activityItem);
    });
}

/**
 * Load upcoming matches for dashboard
 */
function loadUpcomingMatches() {
    const matchesContainer = document.getElementById('upcoming-matches');
    if (!matchesContainer) return;
    
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const upcomingMatches = matches.filter(match => match.status === 'upcoming')
                                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                                  .slice(0, 3); // Get next 3 matches
    
    // Clear container
    matchesContainer.innerHTML = '';
    
    if (upcomingMatches.length === 0) {
        matchesContainer.innerHTML = '<p class="no-data">No upcoming matches</p>';
        return;
    }
    
    // Add match items
    upcomingMatches.forEach(match => {
        const matchDate = new Date(match.date).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        
        matchItem.innerHTML = `
            <div class="match-date">${matchDate} - ${match.time}</div>
            <div class="match-teams">
                ${match.location === 'Home' ? 'Awsworth Villa' : match.opponent} vs 
                ${match.location === 'Home' ? match.opponent : 'Awsworth Villa'}
            </div>
            <div class="match-info">
                ${match.competition} - ${match.team === 'first-team' ? 'First Team' : 'Reserves'}
            </div>
        `;
        
        matchesContainer.appendChild(matchItem);
    });
}

/**
 * Load recent members for dashboard
 */
function loadRecentMembers() {
    const membersContainer = document.getElementById('recent-members');
    if (!membersContainer) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const recentUsers = [...users].sort((a, b) => new Date(b.registeredOn) - new Date(a.registeredOn))
                                .slice(0, 3); // Get 3 most recent users
    
    // Clear container
    membersContainer.innerHTML = '';
    
    if (recentUsers.length === 0) {
        membersContainer.innerHTML = '<p class="no-data">No users registered</p>';
        return;
    }
    
    // Add user items
    recentUsers.forEach(user => {
        const registeredDate = new Date(user.registeredOn).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        
        const userItem = document.createElement('div');
        userItem.className = 'member-item';
        
        userItem.innerHTML = `
            <div class="member-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="member-info">
                <div class="member-name">${user.name}</div>
                <div class="member-role">${user.role === 'admin' ? 'Administrator' : 'Regular User'}</div>
                <div class="member-date">Joined: ${registeredDate}</div>
            </div>
        `;
        
        membersContainer.appendChild(userItem);
    });
}

/**
 * Initialize dashboard charts
 */
function initDashboardCharts() {
    // Player position distribution chart
    const positionCtx = document.getElementById('position-chart');
    if (positionCtx) {
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        
        // Count players by position
        const positions = { 
            goalkeeper: 0, 
            defender: 0, 
            midfielder: 0, 
            attacker: 0 
        };
        
        players.forEach(player => {
            if (positions.hasOwnProperty(player.position)) {
                positions[player.position]++;
            }
        });
        
        new Chart(positionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Goalkeepers', 'Defenders', 'Midfielders', 'Attackers'],
                datasets: [{
                    data: [
                        positions.goalkeeper,
                        positions.defender,
                        positions.midfielder,
                        positions.attacker
                    ],
                    backgroundColor: [
                        '#28a745',
                        '#007bff',
                        '#fd7e14',
                        '#dc3545'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
    
    // Top goal scorers chart
    const scorersCtx = document.getElementById('scorers-chart');
    if (scorersCtx) {
        const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
        
        // Sort by goals scored and get top 5
        const topScorers = [...playerStats]
            .sort((a, b) => b.goals - a.goals)
            .slice(0, 5);
        
        new Chart(scorersCtx, {
            type: 'horizontalBar',
            data: {
                labels: topScorers.map(player => player.name),
                datasets: [{
                    label: 'Goals',
                    data: topScorers.map(player => player.goals),
                    backgroundColor: '#dc3545',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero: true,
                            stepSize: 1
                        }
                    }]
                },
                legend: {
                    display: false
                }
            }
        });
    }
    
    // First team results chart
    const resultsCtx = document.getElementById('results-chart');
    if (resultsCtx) {
        const matches = JSON.parse(localStorage.getItem('matches') || '[]');
        
        // Filter completed first team matches
        const completedMatches = matches.filter(match => 
            match.status === 'completed' && match.team === 'first-team'
        );
        
        // Count results
        const results = { win: 0, draw: 0, loss: 0 };
        
        completedMatches.forEach(match => {
            const awsworthScore = match.location === 'Home' ? match.homeScore : match.awayScore;
            const opponentScore = match.location === 'Home' ? match.awayScore : match.homeScore;
            
            if (awsworthScore > opponentScore) results.win++;
            else if (awsworthScore === opponentScore) results.draw++;
            else results.loss++;
        });
        
        new Chart(resultsCtx, {
            type: 'pie',
            data: {
                labels: ['Wins', 'Draws', 'Losses'],
                datasets: [{
                    data: [results.win, results.draw, results.loss],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107',
                        '#dc3545'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
}

/**
 * Backup and restore functionality
 */
function initBackupRestoreFunctions() {
    // Backup data button
    const backupBtn = document.getElementById('backup-data-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            // Create a backup object containing all data
            const backup = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                newsArticles: JSON.parse(localStorage.getItem('newsArticles') || '[]'),
                players: JSON.parse(localStorage.getItem('players') || '[]'),
                playerStats: JSON.parse(localStorage.getItem('playerStats') || '[]'),
                matches: JSON.parse(localStorage.getItem('matches') || '[]'),
                users: JSON.parse(localStorage.getItem('users') || '[]'),
                siteSettings: JSON.parse(localStorage.getItem('siteSettings') || '{}')
            };
            
            // Create a JSON blob
            const jsonContent = JSON.stringify(backup, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Use date in filename
            const date = new Date().toISOString().split('T')[0];
            link.download = `awsworth-villa-backup-${date}.json`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Show notification
            showNotification('Backup created successfully', 'success');
        });
    }
    
    // Restore form
    const restoreForm = document.getElementById('restore-form');
    if (restoreForm) {
        restoreForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fileInput = document.getElementById('backup-file');
            
            if (!fileInput.files || fileInput.files.length === 0) {
                showNotification('Please select a backup file', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            
            if (file.type !== 'application/json') {
                showNotification('Please select a valid JSON backup file', 'error');
                return;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    // Validate backup structure
                    if (!backup.version || !backup.timestamp) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    // Confirm restore
                    if (confirm('This will overwrite all current data. Are you sure you want to continue?')) {
                        // Restore data
                        if (backup.newsArticles) localStorage.setItem('newsArticles', JSON.stringify(backup.newsArticles));
                        if (backup.players) localStorage.setItem('players', JSON.stringify(backup.players));
                        if (backup.playerStats) localStorage.setItem('playerStats', JSON.stringify(backup.playerStats));
                        if (backup.matches) localStorage.setItem('matches', JSON.stringify(backup.matches));
                        if (backup.users) localStorage.setItem('users', JSON.stringify(backup.users));
                        if (backup.siteSettings) localStorage.setItem('siteSettings', JSON.stringify(backup.siteSettings));
                        
                        // Show success notification
                        showNotification('Data restored successfully. Refreshing page...', 'success');
                        
                        // Reload page after short delay
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Error restoring backup:', error);
                    showNotification('Error restoring backup: ' + error.message, 'error');
                }
            };
            
            reader.readAsText(file);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Fix for all modal close buttons, including admin panels
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a modal close button
        if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
            // Find the closest modal to this button
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        }
    });

    // Additionally, handle the specific player stats modal in admin
    const playerStatsModals = document.querySelectorAll('.player-stats-modal, #stats-modal');
    playerStatsModals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
    });

    // Also close modals when clicking outside content
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block' || modal.style.display === 'flex') {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        }
    });
});

