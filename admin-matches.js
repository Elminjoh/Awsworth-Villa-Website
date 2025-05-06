/**
 * AWSWORTH VILLA FC - Admin Matches Module
 * 
 * This file contains all functionality related to matches management
 * in the admin dashboard.
 */

/**
 * Initialize matches form and functionality
 */
function initMatchForm() {
    const addMatchBtn = document.getElementById('add-match-btn');
    const matchForm = document.getElementById('match-form');
    const matchEditor = document.getElementById('match-editor');
    const resultFields = document.getElementById('result-fields');
    const cancelBtn = matchForm ? matchForm.querySelector('.cancel-button') : null;
    const statusSelect = document.getElementById('match-status');
    
    // Add new match button
    if (addMatchBtn && matchForm) {
        addMatchBtn.addEventListener('click', function() {
            // Clear form
            matchEditor.reset();
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('match-date').value = today;
            
            // Clear ID field (indicates this is a new match)
            document.getElementById('match-id').value = '';
            
            // Hide result fields
            resultFields.style.display = 'none';
            
            // Show form
            matchForm.style.display = 'block';
            
            // Set form heading
            matchForm.querySelector('h3').textContent = 'Add New Match';
            
            // Scroll to form
            matchForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Cancel button
    if (cancelBtn && matchForm) {
        cancelBtn.addEventListener('click', function() {
            matchForm.style.display = 'none';
        });
    }
    
    // Status change event (show/hide result fields)
    if (statusSelect && resultFields) {
        statusSelect.addEventListener('change', function() {
            if (this.value === 'completed') {
                resultFields.style.display = 'block';
            } else {
                resultFields.style.display = 'none';
            }
        });
    }
    
    // Form submission
    if (matchEditor) {
        matchEditor.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const matchId = document.getElementById('match-id').value;
            const team = document.getElementById('match-team').value;
            const opponent = document.getElementById('match-opponent').value;
            const date = document.getElementById('match-date').value;
            const time = document.getElementById('match-time').value;
            const location = document.getElementById('match-location').value;
            const competition = document.getElementById('match-competition').value;
            const status = document.getElementById('match-status').value;
            
            // Get result data if status is completed
            let homeScore = null;
            let awayScore = null;
            let report = null;
            
            if (status === 'completed') {
                homeScore = parseInt(document.getElementById('match-home-score').value) || 0;
                awayScore = parseInt(document.getElementById('match-away-score').value) || 0;
                report = document.getElementById('match-report').value;
            }
            
            // Get current matches
            let matches = JSON.parse(localStorage.getItem('matches') || '[]');
            
            // Create or update match
            if (matchId) {
                // Update existing match
                const index = matches.findIndex(m => m.id === parseInt(matchId));
                
                if (index !== -1) {
                    matches[index] = {
                        id: parseInt(matchId),
                        team,
                        opponent,
                        date,
                        time,
                        location,
                        competition,
                        status,
                        homeScore,
                        awayScore,
                        report
                    };
                    
                    // Show notification
                    showNotification('Match updated successfully', 'success');
                }
            } else {
                // Generate new ID
                const newId = generateUniqueId(matches);
                
                // Add new match
                const newMatch = {
                    id: newId,
                    team,
                    opponent,
                    date,
                    time,
                    location,
                    competition,
                    status,
                    homeScore,
                    awayScore,
                    report
                };
                
                matches.push(newMatch);
                
                // Show notification
                showNotification('Match added successfully', 'success');
            }
            
            // Save updated matches
            localStorage.setItem('matches', JSON.stringify(matches));
            
            // Hide form
            matchForm.style.display = 'none';
            
            // Update the table
            loadMatchesData();
            
            // Update dashboard stats if function exists
            if (typeof loadDashboardStats === 'function') {
                loadDashboardStats();
            }
            
            // Reload dashboard charts if function exists
            if (typeof initDashboardCharts === 'function') {
                initDashboardCharts();
            }
        });
    }
    
    // Export button
    const exportMatchesBtn = document.getElementById('export-matches-btn');
    if (exportMatchesBtn) {
        exportMatchesBtn.addEventListener('click', function() {
            exportData('matches', 'matches-data');
        });
    }
}

/**
 * Load matches data into the admin table
 */
function loadMatchesData() {
    const matchesTableBody = document.getElementById('matches-table-body');
    if (!matchesTableBody) return;
    
    // Get matches from localStorage
    let matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Apply filter if any
    const teamFilter = document.getElementById('matches-team-filter');
    if (teamFilter && teamFilter.value !== 'all') {
        const teamValue = teamFilter.value;
        matches = matches.filter(match => match.team === teamValue);
    }
    
    // Sort matches by date (newest first)
    matches.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear table
    matchesTableBody.innerHTML = '';
    
    // If no matches, show message
    if (matches.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="8" class="empty-message">No matches found</td>';
        matchesTableBody.appendChild(emptyRow);
        return;
    }
    
    // Add each match to table
    matches.forEach(match => {
        const row = document.createElement('tr');
        
        // Format date for display
        const matchDate = new Date(match.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        // Format team for display
        const teamDisplay = match.team === 'first-team' ? 'First Team' : 'Reserves';
        
        // Format result for display
        let resultDisplay = match.status === 'upcoming' ? '-' : 
                          match.status === 'postponed' ? 'Postponed' :
                          match.status === 'cancelled' ? 'Cancelled' :
                          `${match.homeScore}-${match.awayScore}`;
        
        row.innerHTML = `
            <td>${teamDisplay}</td>
            <td>${match.opponent}</td>
            <td>${matchDate}</td>
            <td>${match.time}</td>
            <td>${match.location}</td>
            <td>${match.competition}</td>
            <td>${resultDisplay}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${match.id}">Edit</button>
                <button class="delete-btn" data-id="${match.id}">Delete</button>
            </td>
        `;
        
        matchesTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addMatchActionListeners();
    
    // Add filter change listener
    if (teamFilter) {
        teamFilter.addEventListener('change', loadMatchesData);
    }
}

/**
 * Add action listeners to matches table buttons
 */
function addMatchActionListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('#matches-table-body .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matchId = this.dataset.id;
            editMatch(matchId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#matches-table-body .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const matchId = this.dataset.id;
            if (confirm('Are you sure you want to delete this match?')) {
                deleteMatch(matchId);
            }
        });
    });
}

/**
 * Edit a match
 * @param {string} matchId - ID of the match to edit
 */
function editMatch(matchId) {
    const matchForm = document.getElementById('match-form');
    const matchEditor = document.getElementById('match-editor');
    const resultFields = document.getElementById('result-fields');
    
    if (!matchForm || !matchEditor || !resultFields) return;
    
    // Show the form
    matchForm.style.display = 'block';
    
    // Find the match to edit
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const match = matches.find(m => m.id === parseInt(matchId));
    
    if (!match) {
        showNotification('Match not found', 'error');
        return;
    }
    
    // Fill the form with match data
    document.getElementById('match-id').value = match.id;
    document.getElementById('match-team').value = match.team;
    document.getElementById('match-opponent').value = match.opponent;
    document.getElementById('match-date').value = match.date;
    document.getElementById('match-time').value = match.time;
    document.getElementById('match-location').value = match.location;
    document.getElementById('match-competition').value = match.competition;
    document.getElementById('match-status').value = match.status;
    
    // Show/hide result fields based on status
    if (match.status === 'completed') {
        resultFields.style.display = 'block';
        document.getElementById('match-home-score').value = match.homeScore || 0;
        document.getElementById('match-away-score').value = match.awayScore || 0;
        document.getElementById('match-report').value = match.report || '';
    } else {
        resultFields.style.display = 'none';
    }
    
    // Set form heading
    matchForm.querySelector('h3').textContent = 'Edit Match';
    
    // Scroll to form
    matchForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Delete a match
 * @param {string} matchId - ID of the match to delete
 */
function deleteMatch(matchId) {
    // Get current matches
    let matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Remove the match
    matches = matches.filter(match => match.id !== parseInt(matchId));
    
    // Save updated matches
    localStorage.setItem('matches', JSON.stringify(matches));
    
    // Update the table
    loadMatchesData();
    
    // Update dashboard stats if function exists
    if (typeof loadDashboardStats === 'function') {
        loadDashboardStats();
    }
    
    // Show notification
    showNotification('Match deleted successfully', 'success');
}

function syncMatchesToWebsite() {
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Format for website
    const websiteMatches = matches.map(match => ({
        ...match,
        formattedDate: new Date(match.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }),
        teamDisplay: match.team === 'first-team' ? 'First Team' : 'Reserves',
        isHome: match.location === 'Home',
        awsworthScore: match.location === 'Home' ? match.homeScore : match.awayScore,
        opponentScore: match.location === 'Home' ? match.awayScore : match.homeScore
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    localStorage.setItem('websiteMatches', JSON.stringify(websiteMatches));
}