// admin-sync.js - Syncs admin dashboard changes with the website
(function() {
    console.log('Admin sync module initialized');
    
    // Register the sync functions after DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            // Set up automatic syncing for each admin function
            setupSyncTriggers();
            
            // Manually allow syncing from dashboard
            addSyncButton();
            
            console.log('Admin sync triggers setup complete');
        }, 1500);
    });
    
    /**
     * Setup automatic sync triggers for when content is changed
     */
    function setupSyncTriggers() {
        // Monitor localStorage changes for auto-sync
        window.addEventListener('storage', function(e) {
            console.log('Storage change detected:', e.key);
            
            // Determine which content changed and sync accordingly
            switch(e.key) {
                case 'newsArticles':
                    syncNewsToWebsite();
                    break;
                case 'players':
                    syncPlayersToWebsite();
                    break;
                case 'playerStats':
                    syncPlayerStatsToWebsite();
                    break;
                case 'matches':
                    syncMatchesToWebsite();
                    break;
                case 'siteSettings':
                    syncSettingsToWebsite();
                    break;
            }
        });
        
        // Intercept form submissions to trigger syncs
        interceptFormSubmissions();
    }
    
    /**
     * Intercept form submissions to trigger sync actions
     */
    function interceptFormSubmissions() {
        // News form
        const newsEditor = document.getElementById('news-editor');
        if (newsEditor) {
            const originalSubmit = newsEditor.onsubmit;
            newsEditor.onsubmit = function(e) {
                // Call original handler first
                if (originalSubmit) {
                    const result = originalSubmit.call(this, e);
                    if (result === false) return false;
                }
                
                // Then trigger sync
                setTimeout(function() {
                    syncNewsToWebsite();
                }, 500);
            };
        }
        
        // Player form
        const playerEditor = document.getElementById('player-editor');
        if (playerEditor) {
            const originalSubmit = playerEditor.onsubmit;
            playerEditor.onsubmit = function(e) {
                // Call original handler first
                if (originalSubmit) {
                    const result = originalSubmit.call(this, e);
                    if (result === false) return false;
                }
                
                // Then trigger sync
                setTimeout(function() {
                    syncPlayersToWebsite();
                    syncPlayerStatsToWebsite();
                }, 500);
            };
        }
        
        // Match form
        const matchEditor = document.getElementById('match-editor');
        if (matchEditor) {
            const originalSubmit = matchEditor.onsubmit;
            matchEditor.onsubmit = function(e) {
                // Call original handler first
                if (originalSubmit) {
                    const result = originalSubmit.call(this, e);
                    if (result === false) return false;
                }
                
                // Then trigger sync
                setTimeout(function() {
                    syncMatchesToWebsite();
                }, 500);
            };
        }
        
        // Settings form
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            const originalSubmit = settingsForm.onsubmit;
            settingsForm.onsubmit = function(e) {
                // Call original handler first
                if (originalSubmit) {
                    const result = originalSubmit.call(this, e);
                    if (result === false) return false;
                }
                
                // Then trigger sync
                setTimeout(function() {
                    syncSettingsToWebsite();
                }, 500);
            };
        }
    }
    
    /**
     * Add a manual sync button to the dashboard
     */
    function addSyncButton() {
        const dashboardPanel = document.getElementById('dashboard-panel');
        if (!dashboardPanel) return;
        
        // Find the quick actions section
        const quickActions = dashboardPanel.querySelector('.quick-actions');
        if (!quickActions) return;
        
        // Create sync button
        const syncButton = document.createElement('button');
        syncButton.id = 'sync-website-btn';
        syncButton.className = 'action-button';
        syncButton.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Website';
        
        // Add click handler
        syncButton.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Syncing...';
            this.disabled = true;
            
            // Perform all syncs
            Promise.all([
                syncNewsToWebsite(),
                syncPlayersToWebsite(),
                syncPlayerStatsToWebsite(),
                syncMatchesToWebsite(),
                syncSettingsToWebsite()
            ]).then(() => {
                // Show success state
                this.innerHTML = '<i class="fas fa-check"></i> Sync Complete';
                
                // Reset button after delay
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Website';
                    this.disabled = false;
                }, 2000);
                
                // Show notification
                showNotification('Website sync completed successfully', 'success');
            }).catch(error => {
                // Show error state
                this.innerHTML = '<i class="fas fa-times"></i> Sync Failed';
                
                // Reset button after delay
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-sync-alt"></i> Sync Website';
                    this.disabled = false;
                }, 2000);
                
                // Show notification
                showNotification('Website sync failed: ' + error.message, 'error');
                console.error('Sync error:', error);
            });
        });
        
        // Add to quick actions
        quickActions.appendChild(syncButton);
    }
    
    /**
     * Sync news articles to the website
     */
    window.syncNewsToWebsite = function() {
        return new Promise((resolve) => {
            console.log('Syncing news to website...');
            
            // Get news articles from localStorage
            const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
            
            // Update home page news section
            updateHomePageNews(newsArticles);
            
            // Set flag for news pages to know data is updated
            localStorage.setItem('newsLastUpdated', new Date().toISOString());
            
            console.log('News sync complete');
            resolve();
        });
    };
    
    /**
     * Update the home page news section
     */
    function updateHomePageNews(newsArticles) {
        // Sort news by date, newest first
        const sortedNews = [...newsArticles].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        // Filter for featured news
        const featuredNews = sortedNews.filter(article => article.featured);
        
        // Store processed news for front-end pages
        localStorage.setItem('processedNews', JSON.stringify({
            all: sortedNews,
            featured: featuredNews,
            recent: sortedNews.slice(0, 3), // 3 most recent articles for home page
            categories: {
                matchReport: sortedNews.filter(a => a.category === 'match-report'),
                transferNews: sortedNews.filter(a => a.category === 'transfer-news'),
                clubNews: sortedNews.filter(a => a.category === 'club-news'),
                event: sortedNews.filter(a => a.category === 'event'),
                general: sortedNews.filter(a => a.category === 'general')
            }
        }));
    }
    
    /**
     * Sync players to the website
     */
    window.syncPlayersToWebsite = function() {
        return new Promise((resolve) => {
            console.log('Syncing players to website...');
            
            // Get players from localStorage
            const players = JSON.parse(localStorage.getItem('players') || '[]');
            
            // Process players by team
            const processedPlayers = {
                all: players,
                firstTeam: players.filter(p => p.team === 'first-team'),
                reserves: players.filter(p => p.team === 'reserves'),
                byPosition: {
                    goalkeeper: players.filter(p => p.position === 'goalkeeper'),
                    defender: players.filter(p => p.position === 'defender'),
                    midfielder: players.filter(p => p.position === 'midfielder'),
                    attacker: players.filter(p => p.position === 'attacker')
                }
            };
            
            // Store processed players for team pages
            localStorage.setItem('processedPlayers', JSON.stringify(processedPlayers));
            
            // Set flag for team pages to know data is updated
            localStorage.setItem('playersLastUpdated', new Date().toISOString());
            
            console.log('Players sync complete');
            resolve();
        });
    };
    
    /**
     * Sync player statistics to the website
     */
    window.syncPlayerStatsToWebsite = function() {
        return new Promise((resolve) => {
            console.log('Syncing player stats to website...');
            
            // Get player stats from localStorage
            const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
            const players = JSON.parse(localStorage.getItem('players') || '[]');
            
            // Make sure player stats are up-to-date with player list
            updatePlayerStatsWithPlayerInfo(playerStats, players);
            
            // Process stats for different views
            const processedStats = {
                all: playerStats,
                goalScorers: [...playerStats].sort((a, b) => b.goals - a.goals),
                assists: [...playerStats].sort((a, b) => b.assists - a.assists),
                cleanSheets: [...playerStats].filter(p => p.position === 'goalkeeper')
                    .sort((a, b) => b.cleanSheets - a.cleanSheets),
                disciplinary: [...playerStats].sort((a, b) => 
                    (b.yellowCards * 1 + b.redCards * 3) - (a.yellowCards * 1 + a.redCards * 3)
                ),
                firstTeam: playerStats.filter(p => p.team === 'first-team'),
                reserves: playerStats.filter(p => p.team === 'reserves')
            };
            
            // Store processed stats for website pages
            localStorage.setItem('processedPlayerStats', JSON.stringify(processedStats));
            
            // Set flag for stats pages to know data is updated
            localStorage.setItem('statsLastUpdated', new Date().toISOString());
            
            console.log('Player stats sync complete');
            resolve();
        });
    };
    
    /**
     * Update player stats with current player information
     */
    function updatePlayerStatsWithPlayerInfo(playerStats, players) {
        // Make sure all players have stats
        players.forEach(player => {
            // Check if player already has stats
            const existingStat = playerStats.find(stat => stat.playerId === player.id);
            
            if (!existingStat) {
                // Create new stat entry for player
                playerStats.push({
                    playerId: player.id,
                    name: player.name,
                    position: player.position,
                    team: player.team,
                    matches: 0,
                    goals: 0,
                    assists: 0,
                    cleanSheets: 0,
                    yellowCards: 0,
                    redCards: 0
                });
            } else {
                // Update name, position and team if changed
                existingStat.name = player.name;
                existingStat.position = player.position;
                existingStat.team = player.team;
            }
        });
        
        // Remove stats for players that no longer exist
        const activePlayerIds = players.map(p => p.id);
        const updatedStats = playerStats.filter(stat => activePlayerIds.includes(stat.playerId));
        
        // Save updated stats back to localStorage
        localStorage.setItem('playerStats', JSON.stringify(updatedStats));
        
        return updatedStats;
    }
    
    /**
     * Sync matches to the website
     */
    window.syncMatchesToWebsite = function() {
        return new Promise((resolve) => {
            console.log('Syncing matches to website...');
            
            // Get matches from localStorage
            const matches = JSON.parse(localStorage.getItem('matches') || '[]');
            
            // Sort matches by date
            const sortedMatches = [...matches].sort((a, b) => 
                new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)
            );
            
            // Process matches for different views
            const processedMatches = {
                all: sortedMatches,
                upcoming: sortedMatches.filter(m => m.status === 'upcoming'),
                completed: sortedMatches.filter(m => m.status === 'completed'),
                postponed: sortedMatches.filter(m => m.status === 'postponed' || m.status === 'cancelled'),
                firstTeam: sortedMatches.filter(m => m.team === 'first-team'),
                reserves: sortedMatches.filter(m => m.team === 'reserves'),
                firstTeamUpcoming: sortedMatches.filter(m => m.team === 'first-team' && m.status === 'upcoming'),
                firstTeamCompleted: sortedMatches.filter(m => m.team === 'first-team' && m.status === 'completed'),
                reservesUpcoming: sortedMatches.filter(m => m.team === 'reserves' && m.status === 'upcoming'),
                reservesCompleted: sortedMatches.filter(m => m.team === 'reserves' && m.status === 'completed')
            };
            
            // Store processed matches for website pages
            localStorage.setItem('processedMatches', JSON.stringify(processedMatches));
            
            // Set flag for match pages to know data is updated
            localStorage.setItem('matchesLastUpdated', new Date().toISOString());
            
            console.log('Matches sync complete');
            resolve();
        });
    };
    
    /**
     * Sync site settings to the website
     */
    window.syncSettingsToWebsite = function() {
        return new Promise((resolve) => {
            console.log('Syncing site settings to website...');
            
            // Get settings from localStorage
            const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
            
            // Set flag for website pages to know settings are updated
            localStorage.setItem('settingsLastUpdated', new Date().toISOString());
            
            console.log('Settings sync complete');
            resolve();
        });
    };
    
    /**
     * Helper function to update player stats by name
     * This is a utility for the admin panel to use
     */
    window.updatePlayerStatsName = function(playerId, newName, newTeam, newPosition) {
        const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
        
        const statIndex = playerStats.findIndex(stat => stat.playerId === playerId);
        if (statIndex !== -1) {
            playerStats[statIndex].name = newName;
            playerStats[statIndex].team = newTeam;
            playerStats[statIndex].position = newPosition;
            
            localStorage.setItem('playerStats', JSON.stringify(playerStats));
            
            // Sync to website
            syncPlayerStatsToWebsite();
        }
        
        return statIndex !== -1;
    };
    
    /**
     * Helper function to show notification
     */
    function showNotification(message, type) {
        // Check if notification container exists
        let notificationContainer = document.querySelector('.notification-container');
        
        // Create notification container if it doesn't exist
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Style the container
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '9999';
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification ' + (type || 'info');
        notification.innerHTML = message + '<span class="notification-close">&times;</span>';
        
        // Style the notification
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                            type === 'error' ? '#F44336' : '#2196F3';
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.position = 'relative';
        
        // Style the close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '10px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Add close event
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        // Auto-remove after 5 seconds
        setTimeout(function() {
            notification.remove();
        }, 5000);
    }
})();