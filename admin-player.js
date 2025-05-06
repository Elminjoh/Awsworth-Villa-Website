/**
 * AWSWORTH VILLA FC - Admin Players Module
 * 
 * This file contains all functionality related to player management
 * in the admin dashboard.
 */

/**
 * Initialize player form and functionality
 */
function initPlayerForm() {
    const addPlayerBtn = document.getElementById('add-player-btn');
    const playerForm = document.getElementById('player-form');
    const playerEditor = document.getElementById('player-editor');
    const cancelBtn = playerForm ? playerForm.querySelector('.cancel-button') : null;
    
    // Add new player button
    if (addPlayerBtn && playerForm) {
        addPlayerBtn.addEventListener('click', function() {
            // Clear form
            playerEditor.reset();
            
            // Clear ID field (indicates this is a new player)
            document.getElementById('player-id').value = '';
            
            // Show form
            playerForm.style.display = 'block';
            
            // Set form heading
            playerForm.querySelector('h3').textContent = 'Add New Player';
            
            // Scroll to form
            playerForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Cancel button
    if (cancelBtn && playerForm) {
        cancelBtn.addEventListener('click', function() {
            playerForm.style.display = 'none';
        });
    }
    
    // Form submission
    if (playerEditor) {
        playerEditor.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const playerId = document.getElementById('player-id').value;
            const name = document.getElementById('player-name').value;
            const number = document.getElementById('player-number').value;
            const team = document.getElementById('player-team').value;
            const position = document.getElementById('player-position').value;
            const age = document.getElementById('player-age').value;
            
            // Get current players
            let players = JSON.parse(localStorage.getItem('players') || '[]');
            
            // Create or update player
            if (playerId) {
                // Update existing player
                const index = players.findIndex(p => p.id === parseInt(playerId));
                
                if (index !== -1) {
                    players[index] = {
                        id: parseInt(playerId),
                        name,
                        number: number ? parseInt(number) : null,
                        team,
                        position,
                        age: age ? parseInt(age) : null
                    };
                    
                    // Update player stats name if it changed
                    updatePlayerStatsName(parseInt(playerId), name, team, position);
                    
                    // Show notification
                    showNotification('Player updated successfully', 'success');
                }
            } else {
                // Check if player with same name already exists
                const existingPlayer = players.find(p => 
                    p.name.toLowerCase() === name.toLowerCase() && 
                    p.team === team
                );
                
                if (existingPlayer) {
                    showNotification('A player with this name already exists in the selected team', 'error');
                    return;
                }
                
                // Generate new ID
                const newId = generateUniqueId(players);
                
                // Add new player
                const newPlayer = {
                    id: newId,
                    name,
                    number: number ? parseInt(number) : null,
                    team,
                    position,
                    age: age ? parseInt(age) : null
                };
                
                players.push(newPlayer);
                
                // Initialize player stats
                let playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
                playerStats.push({
                    playerId: newId,
                    name: name,
                    position: position,
                    team: team,
                    matches: 0,
                    goals: 0,
                    assists: 0,
                    cleanSheets: 0,
                    yellowCards: 0,
                    redCards: 0
                });
                localStorage.setItem('playerStats', JSON.stringify(playerStats));
                
                // Show notification
                showNotification('Player added successfully', 'success');
            }
            
            // Save updated players
            localStorage.setItem('players', JSON.stringify(players));
            
            // Hide form
            playerForm.style.display = 'none';
            
            // Update the table
            loadPlayersData();
            
            // Update player stats display
            loadPlayerStats();
            
            // Update dashboard stats if function exists
            if (typeof loadDashboardStats === 'function') {
                loadDashboardStats();
            }
            
            // Sync player stats with website
            syncPlayerStats();
            
            // Sync players to team pages
            syncPlayersToTeamPages();
        });
    }
    
    // Export button
    const exportPlayersBtn = document.getElementById('export-players-btn');
    if (exportPlayersBtn) {
        exportPlayersBtn.addEventListener('click', function() {
            exportData('players', 'players-data');
        });
    }
}

/**
 * Load players data into the admin table
 */
function loadPlayersData() {
    const playersTableBody = document.getElementById('players-table-body');
    if (!playersTableBody) return;
    
    // Get players from localStorage
    let players = JSON.parse(localStorage.getItem('players') || '[]');
    
    // Apply filters if any
    const teamFilter = document.getElementById('team-filter');
    const positionFilter = document.getElementById('position-filter');
    
    if (teamFilter && teamFilter.value) {
        const teamValue = teamFilter.value;
        if (teamValue !== 'all') {
            players = players.filter(player => player.team === teamValue);
        }
    }
    
    if (positionFilter && positionFilter.value !== 'all') {
        const positionValue = positionFilter.value;
        players = players.filter(player => player.position === positionValue);
    }
    
    // Clear table
    playersTableBody.innerHTML = '';
    
    // If no players, show message
    if (players.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6" class="empty-message">No players found</td>';
        playersTableBody.appendChild(emptyRow);
        return;
    }
    
    // Add each player to table
    players.forEach(player => {
        const row = document.createElement('tr');
        
        // Format position for display
        let positionDisplay = player.position.charAt(0).toUpperCase() + player.position.slice(1);
        
        // Format team for display
        let teamDisplay = player.team === 'first-team' ? 'First Team' : 'Reserves';
        
        row.innerHTML = `
            <td>${player.number || ''}</td>
            <td>${player.name}</td>
            <td>${positionDisplay}</td>
            <td>${player.age || ''}</td>
            <td>${teamDisplay}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${player.id}">Edit</button>
                <button class="stats-btn" data-id="${player.id}">Stats</button>
                <button class="delete-btn" data-id="${player.id}">Delete</button>
            </td>
        `;
        
        playersTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addPlayerActionListeners();
    
    // Add filter change listeners
    if (teamFilter) {
        teamFilter.addEventListener('change', loadPlayersData);
    }
    
    if (positionFilter) {
        positionFilter.addEventListener('change', loadPlayersData);
    }
}

/**
 * Add action listeners to player table buttons
 */
function addPlayerActionListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('#players-table-body .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerId = this.dataset.id;
            editPlayer(playerId);
        });
    });
    
    // Stats buttons
    const statsButtons = document.querySelectorAll('#players-table-body .stats-btn');
    statsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerId = this.dataset.id;
            viewPlayerStats(playerId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#players-table-body .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerId = this.dataset.id;
            if (confirm('Are you sure you want to delete this player?')) {
                deletePlayer(playerId);
            }
        });
    });
}

/**
 * Edit a player
 * @param {string} playerId - ID of the player to edit
 */
function editPlayer(playerId) {
    const playerForm = document.getElementById('player-form');
    const playerEditor = document.getElementById('player-editor');
    
    if (!playerForm || !playerEditor) return;
    
    // Show the form
    playerForm.style.display = 'block';
    
    // Find the player to edit
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const player = players.find(p => p.id === parseInt(playerId));
    
    if (!player) {
        showNotification('Player not found', 'error');
        return;
    }
    
    // Fill the form with player data
    document.getElementById('player-id').value = player.id;
    document.getElementById('player-name').value = player.name;
    document.getElementById('player-number').value = player.number || '';
    document.getElementById('player-team').value = player.team;
    document.getElementById('player-position').value = player.position;
    document.getElementById('player-age').value = player.age || '';
    
    // Set form heading
    playerForm.querySelector('h3').textContent = 'Edit Player';
    
    // Scroll to form
    playerForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * View player statistics
 * @param {string} playerId - ID of the player to view statistics for
 */
function viewPlayerStats(playerId) {
    const viewModal = document.getElementById('view-stats-modal');
    
    if (!viewModal) return;
    
    // Find the player
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const player = players.find(p => p.id === parseInt(playerId));
    
    if (!player) {
        showNotification('Player not found', 'error');
        return;
    }
    
    // Find player stats
    const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    const stats = playerStats.find(s => s.playerId === parseInt(playerId)) || {
        matches: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0
    };
    
    // Fill the modal with player data and stats
    viewModal.querySelector('.modal-title').textContent = `${player.name} - Statistics`;
    
    const positionDisplay = player.position.charAt(0).toUpperCase() + player.position.slice(1);
    const teamDisplay = player.team === 'first-team' ? 'First Team' : 'Reserves';
    
    const statsHtml = `
        <div class="player-stats-header">
            <div class="player-details">
                <p><strong>Position:</strong> ${positionDisplay}</p>
                <p><strong>Team:</strong> ${teamDisplay}</p>
                <p><strong>Number:</strong> ${player.number || 'N/A'}</p>
                <p><strong>Age:</strong> ${player.age || 'N/A'}</p>
            </div>
        </div>
        <div class="player-stats-grid">
            <div class="stat-box">
                <div class="stat-value">${stats.matches}</div>
                <div class="stat-label">Matches</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${stats.goals}</div>
                <div class="stat-label">Goals</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${stats.assists}</div>
                <div class="stat-label">Assists</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${stats.cleanSheets}</div>
                <div class="stat-label">Clean Sheets</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${stats.yellowCards}</div>
                <div class="stat-label">Yellow Cards</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${stats.redCards}</div>
                <div class="stat-label">Red Cards</div>
            </div>
        </div>
        <div class="player-stats-actions">
            <button id="edit-stats-btn" class="action-button">Edit Statistics</button>
        </div>
    `;
    
    viewModal.querySelector('.modal-content-text').innerHTML = statsHtml;
    
    // Add edit stats button listener
    document.getElementById('edit-stats-btn').addEventListener('click', function() {
        editPlayerStats(playerId);
        viewModal.style.display = 'none';
    });
    
    // Display the modal
    viewModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Delete a player
 * @param {string} playerId - ID of the player to delete
 */
function deletePlayer(playerId) {
    // Get current players
    let players = JSON.parse(localStorage.getItem('players') || '[]');
    
    // Remove the player
    players = players.filter(player => player.id !== parseInt(playerId));
    
    // Save updated players
    localStorage.setItem('players', JSON.stringify(players));
    
    // Also remove player stats if any
    let playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    playerStats = playerStats.filter(stats => stats.playerId !== parseInt(playerId));
    localStorage.setItem('playerStats', JSON.stringify(playerStats));
    
    // Update the table
    loadPlayersData();
    
    // Update dashboard stats if function exists
    if (typeof loadDashboardStats === 'function') {
        loadDashboardStats();
    }
    
    // Sync player stats with website
    syncPlayerStats();
    
    // Sync players to team pages
    syncPlayersToTeamPages();
    
    // Show notification
    showNotification('Player deleted successfully', 'success');
}

/**
 * Edit player statistics
 * @param {string} playerId - ID of the player to edit statistics for
 */
function editPlayerStats(playerId) {
    // Create a modal for editing stats if it doesn't exist
    if (!document.getElementById('edit-stats-modal')) {
        const modal = document.createElement('div');
        modal.id = 'edit-stats-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2 class="modal-title">Edit Player Statistics</h2>
                <div class="modal-content-text">
                    <form id="edit-stats-form">
                        <input type="hidden" id="stats-player-id">
                        <div class="form-group">
                            <label for="stats-matches">Matches Played</label>
                            <input type="number" id="stats-matches" min="0">
                        </div>
                        <div class="form-group">
                            <label for="stats-goals">Goals</label>
                            <input type="number" id="stats-goals" min="0">
                        </div>
                        <div class="form-group">
                            <label for="stats-assists">Assists</label>
                            <input type="number" id="stats-assists" min="0">
                        </div>
                        <div class="form-group">
                            <label for="stats-clean-sheets">Clean Sheets</label>
                            <input type="number" id="stats-clean-sheets" min="0">
                        </div>
                        <div class="form-group">
                            <label for="stats-yellow-cards">Yellow Cards</label>
                            <input type="number" id="stats-yellow-cards" min="0">
                        </div>
                        <div class="form-group">
                            <label for="stats-red-cards">Red Cards</label>
                            <input type="number" id="stats-red-cards" min="0">
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="submit-button">Save Stats</button>
                            <button type="button" class="cancel-button">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners to the new modal
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
        
        const cancelBtn = modal.querySelector('.cancel-button');
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        const statsForm = document.getElementById('edit-stats-form');
        statsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const playerId = document.getElementById('stats-player-id').value;
            const matches = parseInt(document.getElementById('stats-matches').value) || 0;
            const goals = parseInt(document.getElementById('stats-goals').value) || 0;
            const assists = parseInt(document.getElementById('stats-assists').value) || 0;
            const cleanSheets = parseInt(document.getElementById('stats-clean-sheets').value) || 0;
            const yellowCards = parseInt(document.getElementById('stats-yellow-cards').value) || 0;
            const redCards = parseInt(document.getElementById('stats-red-cards').value) || 0;
            
            // Update player stats
            let playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
            const statsIndex = playerStats.findIndex(s => s.playerId === parseInt(playerId));
            
            if (statsIndex !== -1) {
                playerStats[statsIndex].matches = matches;
                playerStats[statsIndex].goals = goals;
                playerStats[statsIndex].assists = assists;
                playerStats[statsIndex].cleanSheets = cleanSheets;
                playerStats[statsIndex].yellowCards = yellowCards;
                playerStats[statsIndex].redCards = redCards;
            } else {
                // Find player to get name and position
                const players = JSON.parse(localStorage.getItem('players') || '[]');
                const player = players.find(p => p.id === parseInt(playerId));
                
                if (player) {
                    playerStats.push({
                        playerId: parseInt(playerId),
                        name: player.name,
                        position: player.position,
                        team: player.team,
                        matches,
                        goals,
                        assists,
                        cleanSheets,
                        yellowCards,
                        redCards
                    });
                }
            }
            
            localStorage.setItem('playerStats', JSON.stringify(playerStats));
            
            // Hide modal
            modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Update stats panel if open
            loadPlayerStats();
            
            // Sync player stats with website
            syncPlayerStats();
            
            // Reload dashboard charts if function exists
            if (typeof initDashboardCharts === 'function') {
                initDashboardCharts();
            }
            
            // Show notification
            showNotification('Player statistics updated successfully', 'success');
        });
    }
    
    // Get player stats
    const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    const stats = playerStats.find(s => s.playerId === parseInt(playerId)) || {
        matches: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        yellowCards: 0,
        redCards: 0
    };
    
    // Find player
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const player = players.find(p => p.id === parseInt(playerId));
    
    if (!player) {
        showNotification('Player not found', 'error');
        return;
    }
    
    // Set modal title
    document.querySelector('#edit-stats-modal .modal-title').textContent = `Edit Statistics: ${player.name}`;
    
    // Fill form with current stats
    document.getElementById('stats-player-id').value = playerId;
    document.getElementById('stats-matches').value = stats.matches;
    document.getElementById('stats-goals').value = stats.goals;
    document.getElementById('stats-assists').value = stats.assists;
    document.getElementById('stats-clean-sheets').value = stats.cleanSheets;
    document.getElementById('stats-yellow-cards').value = stats.yellowCards;
    document.getElementById('stats-red-cards').value = stats.redCards;
    
    // Show modal
    document.getElementById('edit-stats-modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Load player statistics into the admin table
 */
function loadPlayerStats() {
    const statsTableBody = document.getElementById('stats-table-body');
    if (!statsTableBody) return;
    
    // Get player stats from localStorage
    let playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    
    // Apply filters if any
    const teamFilter = document.getElementById('stats-team-filter');
    const positionButtons = document.querySelectorAll('.position-filter-btn');
    
    if (teamFilter && teamFilter.value) {
        const teamValue = teamFilter.value;
        playerStats = playerStats.filter(stats => stats.team === teamValue);
    }
    
    const activePositionBtn = document.querySelector('.position-filter-btn.active');
    if (activePositionBtn && activePositionBtn.dataset.position !== 'all') {
        const positionValue = activePositionBtn.dataset.position;
        playerStats = playerStats.filter(stats => stats.position === positionValue);
    }
    
    // Clear table
    statsTableBody.innerHTML = '';
    
    // If no stats, show message
    if (playerStats.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="8" class="empty-message">No player statistics found</td>';
        statsTableBody.appendChild(emptyRow);
        return;
    }
    
    // Add each player's stats to table
    playerStats.forEach(stats => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${stats.name}</td>
            <td>${stats.matches}</td>
            <td>${stats.goals}</td>
            <td>${stats.assists}</td>
            <td>${stats.cleanSheets}</td>
            <td>${stats.yellowCards}</td>
            <td>${stats.redCards}</td>
            <td class="actions">
                <button class="edit-stats-btn" data-id="${stats.playerId}">Edit</button>
            </td>
        `;
        
        statsTableBody.appendChild(row);
    });
    
    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll('#stats-table-body .edit-stats-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerId = this.dataset.id;
            editPlayerStats(playerId);
        });
    });
    
    // Add filter change listener
    if (teamFilter) {
        teamFilter.addEventListener('change', loadPlayerStats);
    }
    
    // Add position filter button listeners
    positionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            positionButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update table
            loadPlayerStats();
        });
    });
    
    // Export button
    const exportStatsBtn = document.getElementById('export-stats-btn');
    if (exportStatsBtn) {
        exportStatsBtn.addEventListener('click', function() {
            exportData('playerStats', 'player-statistics');
        });
    }
}

/**
 * Helper function to update player name in stats when name changes
 * @param {number} playerId - Player ID
 * @param {string} newName - New player name
 * @param {string} newTeam - New team value
 * @param {string} newPosition - New position value
 */
function updatePlayerStatsName(playerId, newName, newTeam, newPosition) {
    let playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    const statsIndex = playerStats.findIndex(s => s.playerId === playerId);
    
    if (statsIndex !== -1) {
        playerStats[statsIndex].name = newName;
        playerStats[statsIndex].team = newTeam;
        playerStats[statsIndex].position = newPosition;
        localStorage.setItem('playerStats', JSON.stringify(playerStats));
    }
}

/**
 * Sync player stats with the website
 */
function syncPlayerStats() {
    // Get player stats from localStorage
    const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    
    // Format for website use (organize by team)
    const websitePlayerStats = {
        'first-team': playerStats.filter(player => player.team === 'first-team'),
        'reserves': playerStats.filter(player => player.team === 'reserves')
    };
    
    // Store for website use
    localStorage.setItem('websitePlayerStats', JSON.stringify(websitePlayerStats));
    
    console.log('Player stats synced to website:', websitePlayerStats);
}

/**
 * Sync players to team pages
 */
function syncPlayersToTeamPages() {
    // Create a special localStorage item for team pages to read
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    
    // Group players by team and position
    const teamData = {
        'first-team': {
            goalkeepers: players.filter(p => p.team === 'first-team' && p.position === 'goalkeeper'),
            defenders: players.filter(p => p.team === 'first-team' && p.position === 'defender'),
            midfielders: players.filter(p => p.team === 'first-team' && p.position === 'midfielder'),
            attackers: players.filter(p => p.team === 'first-team' && p.position === 'attacker')
        },
        'reserves': {
            goalkeepers: players.filter(p => p.team === 'reserves' && p.position === 'goalkeeper'),
            defenders: players.filter(p => p.team === 'reserves' && p.position === 'defender'),
            midfielders: players.filter(p => p.team === 'reserves' && p.position === 'midfielder'),
            attackers: players.filter(p => p.team === 'reserves' && p.position === 'attacker')
        }
    };
    
    // Save this data to localStorage for team pages to use
    localStorage.setItem('teamPlayersData', JSON.stringify(teamData));
    
    console.log('Players synced to team pages:', teamData);
}
function syncPlayersToTeamPages() {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    
    const teamData = {
        'first-team': {
            goalkeepers: players.filter(p => p.team === 'first-team' && p.position === 'goalkeeper'),
            defenders: players.filter(p => p.team === 'first-team' && p.position === 'defender'),
            midfielders: players.filter(p => p.team === 'first-team' && p.position === 'midfielder'),
            attackers: players.filter(p => p.team === 'first-team' && p.position === 'attacker')
        },
        'reserves': {
            goalkeepers: players.filter(p => p.team === 'reserves' && p.position === 'goalkeeper'),
            defenders: players.filter(p => p.team === 'reserves' && p.position === 'defender'),
            midfielders: players.filter(p => p.team === 'reserves' && p.position === 'midfielder'),
            attackers: players.filter(p => p.team === 'reserves' && p.position === 'attacker')
        }
    };
    
    localStorage.setItem('teamPlayersData', JSON.stringify(teamData));
}