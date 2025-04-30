// Enhance the admin.js file with additional functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check admin access
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        // Redirect non-admin users
        alert('You do not have permission to access this page');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize sample data
    initSampleData();
    
    // Tab switching functionality
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminPanels = document.querySelectorAll('.admin-panel');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panels
            adminTabs.forEach(t => t.classList.remove('active'));
            adminPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to current tab
            this.classList.add('active');
            
            // Show the corresponding panel
            const panelId = this.dataset.tab + '-panel';
            document.getElementById(panelId).classList.add('active');
        });
    });
    
    // Initialize all modules
    initNewsManagement();
    initPlayerManagement();
    initPlayerStats();
    initUserManagement();
    initMatchesManagement(); // New module
    initSiteSettings();      // New module
    
    // Add dashboard overview stats
    updateDashboardStats();
});

// Initialize sample data in localStorage if not exists
function initSampleData() {
    // Sample news
    if (!localStorage.getItem('newsArticles')) {
        const newsArticles = [
            {
                id: 1,
                title: 'First Team Victory in Season Opener',
                date: '2025-04-25',
                excerpt: 'Awsworth Villa FC kicked off the new season with an impressive 3-1 victory against local rivals.',
                content: 'Detailed match report goes here...',
                featured: true,
                category: 'match-report'
            },
            {
                id: 2,
                title: 'New Signing Announcement',
                date: '2025-04-20',
                excerpt: 'We\'re excited to welcome our newest striker to the squad, who joins us from Nottingham South FC.',
                content: 'Player profile and details go here...',
                featured: false,
                category: 'transfer-news'
            },
            {
                id: 3,
                title: 'Reserve Team Update',
                date: '2025-04-15',
                excerpt: 'Our reserve team continues their strong performance with another win in the Notts Amateur League.',
                content: 'Match details and performance highlights go here...',
                featured: false,
                category: 'match-report'
            }
        ];
        localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    }
    
    // Sample first team players
    if (!localStorage.getItem('firstTeamPlayers')) {
        const firstTeamPlayers = [
            { id: 1, name: 'Jimmy Knowles', position: 'goalkeeper', team: 'first-team', number: 1, age: 28, photo: null },
            { id: 2, name: 'James Fogg', position: 'goalkeeper', team: 'first-team', number: 13, age: 24, photo: null },
            { id: 3, name: 'Kyle Croft', position: 'defender', team: 'first-team', number: 2, age: 26, photo: null },
            { id: 4, name: 'Njoh Mtanase', position: 'defender', team: 'first-team', number: 5, age: 25, photo: null },
            { id: 5, name: 'Charlton Rooke', position: 'midfielder', team: 'first-team', number: 8, age: 23, photo: null },
            { id: 6, name: 'Gabriel Ebede', position: 'midfielder', team: 'first-team', number: 10, age: 27, photo: null },
            { id: 7, name: 'Ethan Shipstone', position: 'attacker', team: 'first-team', number: 9, age: 24, photo: null },
            { id: 8, name: 'Harry O\'Neill', position: 'attacker', team: 'first-team', number: 11, age: 22, photo: null }
        ];
        localStorage.setItem('firstTeamPlayers', JSON.stringify(firstTeamPlayers));
    }
    
    // Sample reserve team players
    if (!localStorage.getItem('reservePlayers')) {
        const reservePlayers = [
            { id: 1, name: 'Sam Williams', position: 'goalkeeper', team: 'reserves', number: 1, age: 20, photo: null },
            { id: 2, name: 'Ryan Taylor', position: 'defender', team: 'reserves', number: 2, age: 19, photo: null },
            { id: 3, name: 'Jack Harris', position: 'midfielder', team: 'reserves', number: 8, age: 21, photo: null },
            { id: 4, name: 'Tom Green', position: 'attacker', team: 'reserves', number: 9, age: 18, photo: null }
        ];
        localStorage.setItem('reservePlayers', JSON.stringify(reservePlayers));
    }
    
    // Sample player stats
    if (!localStorage.getItem('playerStats')) {
        const playerStats = [
            { 
                playerId: 1, 
                matches: 15, 
                goals: 0, 
                assists: 0, 
                cleanSheets: 7, 
                yellowCards: 1, 
                redCards: 0 
            },
            { 
                playerId: 3, 
                matches: 14, 
                goals: 2, 
                assists: 1, 
                cleanSheets: 7, 
                yellowCards: 3, 
                redCards: 0 
            },
            { 
                playerId: 4, 
                matches: 16, 
                goals: 1, 
                assists: 3, 
                cleanSheets: 7, 
                yellowCards: 2, 
                redCards: 0 
            },
            { 
                playerId: 5, 
                matches: 15, 
                goals: 6, 
                assists: 8, 
                cleanSheets: 0, 
                yellowCards: 4, 
                redCards: 1 
            },
            { 
                playerId: 6, 
                matches: 13, 
                goals: 4, 
                assists: 6, 
                cleanSheets: 0, 
                yellowCards: 1, 
                redCards: 0 
            },
            { 
                playerId: 7, 
                matches: 16, 
                goals: 12, 
                assists: 5, 
                cleanSheets: 0, 
                yellowCards: 2, 
                redCards: 0 
            },
            { 
                playerId: 8, 
                matches: 14, 
                goals: 9, 
                assists: 7, 
                cleanSheets: 0, 
                yellowCards: 1, 
                redCards: 0 
            }
        ];
        localStorage.setItem('playerStats', JSON.stringify(playerStats));
    }
    
    // Sample users
    if (!localStorage.getItem('users')) {
        const users = [
            {
                id: 1,
                name: 'Admin User',
                email: 'admin@awsworthvilla.com',
                role: 'admin',
                registeredOn: '2025-01-01',
                lastLogin: '2025-04-30'
            },
            {
                id: 2,
                name: 'Regular User',
                email: 'user@example.com',
                role: 'user',
                registeredOn: '2025-02-15',
                lastLogin: '2025-04-28'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Sample matches
    if (!localStorage.getItem('matches')) {
        const matches = [
            {
                id: 1,
                team: 'first-team',
                opponent: 'Nottingham South FC',
                date: '2025-04-25',
                time: '15:00',
                location: 'Home',
                competition: 'League',
                result: {
                    homeScore: 3,
                    awayScore: 1,
                    status: 'completed'
                },
                scorers: [7, 7, 8],
                report: 'Match report content goes here...'
            },
            {
                id: 2,
                team: 'first-team',
                opponent: 'Ilkeston Town',
                date: '2025-05-02',
                time: '19:45',
                location: 'Away',
                competition: 'League',
                result: {
                    status: 'upcoming'
                }
            },
            {
                id: 3,
                team: 'reserves',
                opponent: 'Hucknall Town Reserves',
                date: '2025-04-26',
                time: '14:00',
                location: 'Home',
                competition: 'League',
                result: {
                    homeScore: 2,
                    awayScore: 2,
                    status: 'completed'
                },
                scorers: [3, 4],
                report: 'Reserve team match report...'
            }
        ];
        localStorage.setItem('matches', JSON.stringify(matches));
    }
    
    // Sample site settings
    if (!localStorage.getItem('siteSettings')) {
        const siteSettings = {
            clubName: 'Awsworth Villa FC',
            clubMotto: 'Passion, Pride, Performance',
            clubPhone: '+44 115 XXX XXXX',
            clubEmail: 'info@awsworthvilla.com',
            socialLinks: {
                twitter: 'https://x.com/awsworthvilla',
                instagram: 'https://instagram.com',
                tiktok: 'https://tiktok.com'
            },
            sponsorLogos: [
                'Images/awsworth-villa badge'
            ],
            maintenanceMode: false
        };
        localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    }
}

// News Management Functions
function initNewsManagement() {
    // Load news articles
    loadNewsArticles();
    
    // Add new article button
    const addNewsBtn = document.getElementById('add-news-btn');
    const newsForm = document.getElementById('news-form');
    
    addNewsBtn.addEventListener('click', function() {
        // Clear form
        document.getElementById('news-editor').reset();
        document.getElementById('news-id').value = '';
        
        // Set today's date
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('news-date').value = today;
        
        // Show form
        newsForm.style.display = 'block';
    });
    
    // Cancel button
    const cancelButtons = newsForm.querySelectorAll('.cancel-button');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            newsForm.style.display = 'none';
        });
    });
    
    // Form submission
    const newsEditor = document.getElementById('news-editor');
    newsEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newsId = document.getElementById('news-id').value;
        const title = document.getElementById('news-title').value;
        const date = document.getElementById('news-date').value;
        const excerpt = document.getElementById('news-excerpt').value;
        const content = document.getElementById('news-content').value;
        const featured = document.getElementById('news-featured').checked;
        const category = document.getElementById('news-category').value;
        
        // Get existing news
        const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
        
        if (newsId) {
            // Edit existing article
            const index = newsArticles.findIndex(article => article.id == newsId);
            if (index !== -1) {
                newsArticles[index] = {
                    id: parseInt(newsId),
                    title,
                    date,
                    excerpt,
                    content,
                    featured,
                    category
                };
            }
        } else {
            // Add new article
            const newId = newsArticles.length > 0 ? Math.max(...newsArticles.map(a => a.id)) + 1 : 1;
            newsArticles.push({
                id: newId,
                title,
                date,
                excerpt,
                content,
                featured,
                category
            });
        }
        
        // Save to localStorage
        localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
        
        // Hide form
        newsForm.style.display = 'none';
        
        // Reload news table
        loadNewsArticles();
        
        // Update dashboard stats
        updateDashboardStats();
    });
    
    // Filter functionality
    const newsFilter = document.getElementById('news-filter');
    if (newsFilter) {
        newsFilter.addEventListener('change', function() {
            loadNewsArticles(this.value);
        });
    }
}

function loadNewsArticles(filter = 'all') {
    const tableBody = document.getElementById('news-table-body');
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    
    // Apply filter
    let filteredArticles = newsArticles;
    if (filter !== 'all') {
        filteredArticles = newsArticles.filter(article => article.category === filter);
    }
    
    // Sort by date (newest first)
    filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    filteredArticles.forEach(article => {
        const row = document.createElement('tr');
        row.dataset.id = article.id;
        
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Show first 40 characters of title with ellipsis if longer
        const shortTitle = article.title.length > 40 ? 
            article.title.substring(0, 40) + '...' : 
            article.title;
        
        // Format category for display
        const categoryDisplay = article.category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        row.innerHTML = `
            <td>${shortTitle}</td>
            <td>${formattedDate}</td>
            <td>${categoryDisplay}</td>
            <td>${article.featured ? '<span class="featured-badge">Featured</span>' : ''}</td>
            <td class="action-cell">
                <button class="edit-btn">Edit</button>
                <button class="view-btn">View</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        
        // Add event listeners to buttons
        const editBtn = row.querySelector('.edit-btn');
        const viewBtn = row.querySelector('.view-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            editNewsArticle(article.id);
        });
        
        viewBtn.addEventListener('click', function() {
            viewNewsArticle(article.id);
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this article?')) {
                deleteNewsArticle(article.id);
            }
        });
        
        tableBody.appendChild(row);
    });
    
    // Show "no articles" message if no articles match filter
    if (filteredArticles.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="5" class="empty-message">No articles found${filter !== 'all' ? ' for this category' : ''}.</td>
        `;
        tableBody.appendChild(emptyRow);
    }
}

function editNewsArticle(id) {
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    const article = newsArticles.find(a => a.id == id);
    
    if (article) {
        document.getElementById('news-id').value = article.id;
        document.getElementById('news-title').value = article.title;
        document.getElementById('news-date').value = article.date;
        document.getElementById('news-excerpt').value = article.excerpt;
        document.getElementById('news-content').value = article.content;
        document.getElementById('news-featured').checked = article.featured || false;
        document.getElementById('news-category').value = article.category || 'general';
        
        // Show form
        document.getElementById('news-form').style.display = 'block';
    }
}

function viewNewsArticle(id) {
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    const article = newsArticles.find(a => a.id == id);
    
    if (article) {
        // Get modal elements
        const modal = document.getElementById('view-news-modal');
        const titleEl = modal.querySelector('.modal-title');
        const dateEl = modal.querySelector('.modal-date');
        const contentEl = modal.querySelector('.modal-content-text');
        
        // Populate modal
        titleEl.textContent = article.title;
        dateEl.textContent = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        contentEl.innerHTML = `
            <p><strong>Excerpt:</strong> ${article.excerpt}</p>
            <p><strong>Category:</strong> ${article.category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
            <p><strong>Featured:</strong> ${article.featured ? 'Yes' : 'No'}</p>
            <div class="content-body">
                ${article.content}
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
    }
}

function deleteNewsArticle(id) {
    let newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    newsArticles = newsArticles.filter(a => a.id != id);
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    
    // Reload news table
    loadNewsArticles(document.getElementById('news-filter').value);
    
    // Update dashboard stats
    updateDashboardStats();
}

// Player Management Functions
function initPlayerManagement() {
    // Load players
    loadPlayers('first-team');
    
    // Team filter
    const teamFilter = document.getElementById('team-filter');
    teamFilter.addEventListener('change', function() {
        loadPlayers(this.value);
    });
    
    // Add new player button
    const addPlayerBtn = document.getElementById('add-player-btn');
    const playerForm = document.getElementById('player-form');
    
    addPlayerBtn.addEventListener('click', function() {
        // Clear form
        document.getElementById('player-editor').reset();
        document.getElementById('player-id').value = '';
        
        // Set default team based on filter
        document.getElementById('player-team').value = document.getElementById('team-filter').value;
        
        // Show form
        playerForm.style.display = 'block';
    });
    
    // Cancel button
    const cancelButtons = playerForm.querySelectorAll('.cancel-button');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            playerForm.style.display = 'none';
        });
    });
    
    // Form submission
    const playerEditor = document.getElementById('player-editor');
    playerEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const playerId = document.getElementById('player-id').value;
        const name = document.getElementById('player-name').value;
        const team = document.getElementById('player-team').value;
        const position = document.getElementById('player-position').value;
        const number = parseInt(document.getElementById('player-number').value) || '';
        const age = parseInt(document.getElementById('player-age').value) || '';
        
        // Get existing players
        const storageKey = team === 'first-team' ? 'firstTeamPlayers' : 'reservePlayers';
        const players = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        if (playerId) {
            // Edit existing player
            const index = players.findIndex(p => p.id == playerId);
            if (index !== -1) {
                players[index] = {
                    ...players[index],
                    name,
                    position,
                    team,
                    number,
                    age
                };
            }
        } else {
            // Add new player
            const newId = players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
            players.push({
                id: newId,
                name,
                position,
                team,
                number,
                age,
                photo: null
            });
        }
        
        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(players));
        
        // Hide form
        playerForm.style.display = 'none';
        
        // Reload players table
        loadPlayers(team);
        
        // Update dashboard stats
        updateDashboardStats();
    });
    
    // Position filter
    const positionFilter = document.getElementById('position-filter');
    if (positionFilter) {
        positionFilter.addEventListener('change', function() {
            const team = document.getElementById('team-filter').value;
            loadPlayers(team, this.value);
        });
    }
}

function loadPlayers(team, positionFilter = 'all') {
    const tableBody = document.getElementById('players-table-body');
    const storageKey = team === 'first-team' ? 'firstTeamPlayers' : 'reservePlayers';
    const players = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Apply position filter
    let filteredPlayers = players;
    if (positionFilter !== 'all') {
        filteredPlayers = players.filter(player => player.position === positionFilter);
    }
    
    // Sort players by position and then by shirt number
    const positionOrder = { goalkeeper: 1, defender: 2, midfielder: 3, attacker: 4 };
    filteredPlayers.sort((a, b) => {
        // First by position
        const positionDiff = positionOrder[a.position] - positionOrder[b.position];
        if (positionDiff !== 0) return positionDiff;
        
        // Then by shirt number
        if (a.number && b.number) return a.number - b.number;
        if (a.number) return -1;
        if (b.number) return 1;
        
        // Finally by name
        return a.name.localeCompare(b.name);
    });
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    filteredPlayers.forEach(player => {
        const row = document.createElement('tr');
        row.dataset.id = player.id;
        
        const positionDisplay = {
            goalkeeper: 'Goalkeeper',
            defender: 'Defender',
            midfielder: 'Midfielder',
            attacker: 'Attacker'
        };
        
        const teamDisplay = {
            'first-team': 'First Team',
            'reserves': 'Reserve Team'
        };
        
        row.innerHTML = `
            <td>${player.number ? '#' + player.number : ''}</td>
            <td>${player.name}</td>
            <td>${positionDisplay[player.position]}</td>
            <td>${player.age || ''}</td>
            <td>${teamDisplay[player.team]}</td>
            <td class="action-cell">
                <button class="stats-btn">Stats</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        
        // Add event listeners to buttons
        const statsBtn = row.querySelector('.stats-btn');
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        statsBtn.addEventListener('click', function() {
            viewPlayerStats(player.id);
        });
        
        editBtn.addEventListener('click', function() {
            editPlayer(player.id, team);
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this player?')) {
                deletePlayer(player.id, team);
            }
        });
        
        tableBody.appendChild(row);
    });
    
    // Show "no players" message if no players match filter
    if (filteredPlayers.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="empty-message">No players found${positionFilter !== 'all' ? ' for this position' : ''}.</td>
        `;
        tableBody.appendChild(emptyRow);
    }
}

function editPlayer(id, team) {
    const storageKey = team === 'first-team' ? 'firstTeamPlayers' : 'reservePlayers';
    const players = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const player = players.find(p => p.id == id);
    
    if (player) {
        document.getElementById('player-id').value = player.id;
        document.getElementById('player-name').value = player.name;
        document.getElementById('player-team').value = player.team;
        document.getElementById('player-position').value = player.position;
        document.getElementById('player-number').value = player.number || '';
        document.getElementById('player-age').value = player.age || '';
        
        // Show form
        document.getElementById('player-form').style.display = 'block';
    }
}

function viewPlayerStats(playerId) {
    const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    const stats = playerStats.find(s => s.playerId == playerId);
    
    // Find player details
    let player = null;
    let firstTeamPlayers = JSON.parse(localStorage.getItem('firstTeamPlayers') || '[]');
    let reservePlayers = JSON.parse(localStorage.getItem('reservePlayers') || '[]');
    
    player = firstTeamPlayers.find(p => p.id == playerId) || reservePlayers.find(p => p.id == playerId);
    
    if (player) {
        // Get modal elements
        const modal = document.getElementById('view-stats-modal');
        const titleEl = modal.querySelector('.modal-title');
        const contentEl = modal.querySelector('.modal-content-text');
        
        // Populate modal
        titleEl.textContent = `Player Statistics: ${player.name}`;
        
        if (stats) {
            contentEl.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-label">Matches</div>
                        <div class="stat-value">${stats.matches}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Goals</div>
                        <div class="stat-value">${stats.goals}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Assists</div>
                        <div class="stat-value">${stats.assists}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Clean Sheets</div>
                        <div class="stat-value">${stats.cleanSheets}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Yellow Cards</div>
                        <div class="stat-value">${stats.yellowCards}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Red Cards</div>
                        <div class="stat-value">${stats.redCards}</div>
                    </div>
                </div>
                <div class="stats-summary">
                    <p><strong>Goals per Match:</strong> ${(stats.goals / stats.matches).toFixed(2)}</p>
                    <p><strong>Assists per Match:</strong> ${(stats.assists / stats.matches).toFixed(2)}</p>
                </div>
            `;
        } else {
            contentEl.innerHTML = `
                <p class="no-stats-message">No statistics available for this player.</p>
            `;
        }
        
        // Show modal
        modal.style.display = 'block';
    }
}

function deletePlayer(id, team) {
    const storageKey = team === 'first-team' ? 'firstTeamPlayers' : 'reservePlayers';
    let players = JSON.parse(localStorage.getItem(storageKey) || '[]');
    players = players.filter(p => p.id != id);
    localStorage.setItem(storageKey, JSON.stringify(players));
    
    // Also delete player stats
    let playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    playerStats = playerStats.filter(s => s.playerId != id);
    localStorage.setItem('playerStats', JSON.stringify(playerStats));
    
    // Reload players table
    loadPlayers(team, document.getElementById('position-filter').value);
    
    // Update dashboard stats
    updateDashboardStats();
}

// Player Stats Functions
function initPlayerStats() {
    // Load player stats
    loadPlayerStats('first-team');
    
    // Team filter
    const teamFilter = document.getElementById('stats-team-filter');
    teamFilter.addEventListener('change', function() {
        loadPlayerStats(this.value);
    });
    
    // Export stats button
    const exportBtn = document.getElementById('export-stats-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportPlayerStats();
        });
    }
}

// Continuing from where we left off...

function loadPlayerStats(team) {
    const tableBody = document.getElementById('stats-table-body');
    const storageKey = team === 'first-team' ? 'firstTeamPlayers' : 'reservePlayers';
    const players = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const stats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Sort players by position
    const positionOrder = { goalkeeper: 1, defender: 2, midfielder: 3, attacker: 4 };
    players.sort((a, b) => positionOrder[a.position] - positionOrder[b.position] || a.name.localeCompare(b.name));
    
    // Add rows
    players.forEach(player => {
        const row = document.createElement('tr');
        row.dataset.id = player.id;
        row.dataset.position = player.position;
        
        // Find stats for this player
        const playerStats = stats.find(s => s.playerId == player.id) || {
            playerId: player.id,
            matches: 0,
            goals: 0,
            assists: 0,
            cleanSheets: 0,
            yellowCards: 0,
            redCards: 0
        };
        
        row.innerHTML = `
            <td>${player.name}</td>
            <td><input type="number" class="stat-input" data-stat="matches" value="${playerStats.matches}" min="0"></td>
            <td><input type="number" class="stat-input" data-stat="goals" value="${playerStats.goals}" min="0"></td>
            <td><input type="number" class="stat-input" data-stat="assists" value="${playerStats.assists}" min="0"></td>
            <td><input type="number" class="stat-input" data-stat="cleanSheets" value="${playerStats.cleanSheets}" min="0"></td>
            <td><input type="number" class="stat-input" data-stat="yellowCards" value="${playerStats.yellowCards}" min="0"></td>
            <td><input type="number" class="stat-input" data-stat="redCards" value="${playerStats.redCards}" min="0"></td>
            <td class="action-cell">
                <button class="submit-button save-stats-btn">Save</button>
            </td>
        `;
        
        // Add event listener to save button
        const saveBtn = row.querySelector('.save-stats-btn');
        saveBtn.addEventListener('click', function() {
            savePlayerStats(player.id, row);
        });
        
        tableBody.appendChild(row);
    });
    
    // Add position filtering
    initPositionFiltering();
}

function initPositionFiltering() {
    const positionFilterButtons = document.querySelectorAll('.position-filter-btn');
    const statsRows = document.querySelectorAll('#stats-table-body tr');
    
    positionFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            positionFilterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get position to filter
            const position = this.dataset.position;
            
            // Show/hide rows based on position
            statsRows.forEach(row => {
                if (position === 'all' || row.dataset.position === position) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    });
}

function savePlayerStats(playerId, row) {
    const inputs = row.querySelectorAll('.stat-input');
    const updatedStats = {
        playerId: parseInt(playerId)
    };
    
    inputs.forEach(input => {
        const stat = input.dataset.stat;
        updatedStats[stat] = parseInt(input.value) || 0;
    });
    
    // Get existing stats
    let stats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    
    // Find and update or add new stats
    const index = stats.findIndex(s => s.playerId == playerId);
    if (index !== -1) {
        stats[index] = updatedStats;
    } else {
        stats.push(updatedStats);
    }
    
    // Save to localStorage
    localStorage.setItem('playerStats', JSON.stringify(stats));
    
    // Show success message
    showNotification('Player statistics saved successfully', 'success');
    
    // Update dashboard stats
    updateDashboardStats();
}

function exportPlayerStats() {
    const team = document.getElementById('stats-team-filter').value;
    const storageKey = team === 'first-team' ? 'firstTeamPlayers' : 'reservePlayers';
    const players = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const stats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    
    // Prepare CSV content
    let csvContent = 'Player Name,Position,Matches,Goals,Assists,Clean Sheets,Yellow Cards,Red Cards\n';
    
    players.forEach(player => {
        const playerStats = stats.find(s => s.playerId == player.id) || {
            matches: 0,
            goals: 0,
            assists: 0,
            cleanSheets: 0,
            yellowCards: 0,
            redCards: 0
        };
        
        const positionDisplay = {
            goalkeeper: 'Goalkeeper',
            defender: 'Defender',
            midfielder: 'Midfielder',
            attacker: 'Attacker'
        };
        
        csvContent += `"${player.name}","${positionDisplay[player.position]}",${playerStats.matches},${playerStats.goals},${playerStats.assists},${playerStats.cleanSheets},${playerStats.yellowCards},${playerStats.redCards}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${team}-player-stats.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('Player statistics exported successfully', 'success');
}

// User Management Functions
function initUserManagement() {
    // Load users
    loadUsers();
    
    // Add new user button
    const addUserBtn = document.getElementById('add-user-btn');
    const userForm = document.getElementById('user-form');
    
    addUserBtn.addEventListener('click', function() {
        // Clear form
        document.getElementById('user-editor').reset();
        document.getElementById('user-id').value = '';
        
        // Show form
        userForm.style.display = 'block';
    });
    
    // Cancel button
    const cancelButtons = userForm.querySelectorAll('.cancel-button');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            userForm.style.display = 'none';
        });
    });
    
    // Form submission
    const userEditor = document.getElementById('user-editor');
    userEditor.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('user-id').value;
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const role = document.getElementById('user-role').value;
        const password = document.getElementById('user-password').value;
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check for duplicate email
        const isDuplicate = users.some(u => u.email === email && u.id != userId);
        if (isDuplicate) {
            showNotification('A user with this email already exists', 'error');
            return;
        }
        
        if (userId) {
            // Edit existing user
            const index = users.findIndex(u => u.id == userId);
            if (index !== -1) {
                users[index] = {
                    ...users[index],
                    name,
                    email,
                    role
                };
                
                // Update password if provided
                if (password) {
                    users[index].password = password;
                }
            }
        } else {
            // Add new user
            const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            users.push({
                id: newId,
                name,
                email,
                role,
                password: password || 'password123', // Default password
                registeredOn: new Date().toISOString().split('T')[0],
                lastLogin: null
            });
        }
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Hide form
        userForm.style.display = 'none';
        
        // Reload users table
        loadUsers();
        
        // Update dashboard stats
        updateDashboardStats();
        
        // Show success message
        showNotification('User saved successfully', 'success');
    });
    
    // Role filter
    const roleFilter = document.getElementById('role-filter');
    if (roleFilter) {
        roleFilter.addEventListener('change', function() {
            loadUsers(this.value);
        });
    }
}

function loadUsers(roleFilter = 'all') {
    const tableBody = document.getElementById('users-table-body');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Apply role filter
    let filteredUsers = users;
    if (roleFilter !== 'all') {
        filteredUsers = users.filter(user => user.role === roleFilter);
    }
    
    // Sort by registration date (newest first)
    filteredUsers.sort((a, b) => new Date(b.registeredOn) - new Date(a.registeredOn));
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.dataset.id = user.id;
        
        const formattedRegDate = new Date(user.registeredOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const formattedLastLogin = user.lastLogin ? 
            new Date(user.lastLogin).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Never';
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'Admin' : 'Regular User'}</td>
            <td>${formattedRegDate}</td>
            <td>${formattedLastLogin}</td>
            <td class="action-cell">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
                ${user.role !== 'admin' ? '<button class="promote-btn">Make Admin</button>' : '<button class="demote-btn">Make Regular</button>'}
            </td>
        `;
        
        // Add event listeners to buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        const promoteBtn = row.querySelector('.promote-btn');
        const demoteBtn = row.querySelector('.demote-btn');
        
        editBtn.addEventListener('click', function() {
            editUser(user.id);
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(user.id);
            }
        });
        
        if (promoteBtn) {
            promoteBtn.addEventListener('click', function() {
                if (confirm(`Are you sure you want to make ${user.name} an admin?`)) {
                    changeUserRole(user.id, 'admin');
                }
            });
        }
        
        if (demoteBtn) {
            demoteBtn.addEventListener('click', function() {
                if (confirm(`Are you sure you want to make ${user.name} a regular user?`)) {
                    changeUserRole(user.id, 'user');
                }
            });
        }
        
        tableBody.appendChild(row);
    });
    
    // Show "no users" message if no users match filter
    if (filteredUsers.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="6" class="empty-message">No users found${roleFilter !== 'all' ? ' with this role' : ''}.</td>
        `;
        tableBody.appendChild(emptyRow);
    }
}

function editUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id == id);
    
    if (user) {
        document.getElementById('user-id').value = user.id;
        document.getElementById('user-name').value = user.name;
        document.getElementById('user-email').value = user.email;
        document.getElementById('user-role').value = user.role;
        document.getElementById('user-password').value = '';
        
        // Show form
        document.getElementById('user-form').style.display = 'block';
    }
}

function changeUserRole(id, newRole) {
    // Don't allow changing your own role
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id == id) {
        showNotification('You cannot change your own role', 'error');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id == id);
    
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Reload users table
        loadUsers(document.getElementById('role-filter').value);
        
        // Show success message
        showNotification(`User role updated to ${newRole === 'admin' ? 'Admin' : 'Regular User'}`, 'success');
    }
}

function deleteUser(id) {
    // Don't allow deleting yourself
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id == id) {
        showNotification('You cannot delete your own account', 'error');
        return;
    }
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => u.id != id);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Reload users table
    loadUsers(document.getElementById('role-filter').value);
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Show success message
    showNotification('User deleted successfully', 'success');
}

// Matches Management Functions
function initMatchesManagement() {
    // Load matches
    loadMatches('all');
    
    // Team filter
    const teamFilter = document.getElementById('matches-team-filter');
    if (teamFilter) {
        teamFilter.addEventListener('change', function() {
            loadMatches(this.value);
        });
    }
    
    // Add new match button
    const addMatchBtn = document.getElementById('add-match-btn');
    const matchForm = document.getElementById('match-form');
    
    if (addMatchBtn && matchForm) {
        addMatchBtn.addEventListener('click', function() {
            // Clear form
            document.getElementById('match-editor').reset();
            document.getElementById('match-id').value = '';
            
            // Show result fields based on status
            toggleResultFields('upcoming');
            
            // Show form
            matchForm.style.display = 'block';
        });
        
        // Cancel button
        const cancelButtons = matchForm.querySelectorAll('.cancel-button');
        cancelButtons.forEach(button => {
            button.addEventListener('click', function() {
                matchForm.style.display = 'none';
            });
        });
        
        // Match status change
        const matchStatus = document.getElementById('match-status');
        if (matchStatus) {
            matchStatus.addEventListener('change', function() {
                toggleResultFields(this.value);
            });
        }
        
        // Form submission
        const matchEditor = document.getElementById('match-editor');
        matchEditor.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const matchId = document.getElementById('match-id').value;
            const team = document.getElementById('match-team').value;
            const opponent = document.getElementById('match-opponent').value;
            const date = document.getElementById('match-date').value;
            const time = document.getElementById('match-time').value;
            const location = document.getElementById('match-location').value;
            const competition = document.getElementById('match-competition').value;
            const status = document.getElementById('match-status').value;
            
            // Build match object
            const matchData = {
                team,
                opponent,
                date,
                time,
                location,
                competition,
                result: {
                    status
                }
            };
            
            // Add result data if match is completed
            if (status === 'completed') {
                const homeScore = parseInt(document.getElementById('match-home-score').value);
                const awayScore = parseInt(document.getElementById('match-away-score').value);
                const report = document.getElementById('match-report').value;
                
                matchData.result.homeScore = homeScore;
                matchData.result.awayScore = awayScore;
                matchData.report = report;
            }
            
            // Get existing matches
            const matches = JSON.parse(localStorage.getItem('matches') || '[]');
            
            if (matchId) {
                // Edit existing match
                const index = matches.findIndex(m => m.id == matchId);
                if (index !== -1) {
                    matchData.id = parseInt(matchId);
                    matches[index] = matchData;
                }
            } else {
                // Add new match
                const newId = matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1;
                matchData.id = newId;
                matches.push(matchData);
            }
            
            // Save to localStorage
            localStorage.setItem('matches', JSON.stringify(matches));
            
            // Hide form
            matchForm.style.display = 'none';
            
            // Reload matches table
            loadMatches(document.getElementById('matches-team-filter').value);
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Show success message
            showNotification('Match saved successfully', 'success');
        });
    }
}

function toggleResultFields(status) {
    const resultFields = document.getElementById('result-fields');
    if (resultFields) {
        if (status === 'completed') {
            resultFields.style.display = 'block';
        } else {
            resultFields.style.display = 'none';
        }
    }
}

function loadMatches(teamFilter = 'all') {
    const tableBody = document.getElementById('matches-table-body');
    if (!tableBody) return;
    
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Apply team filter
    let filteredMatches = matches;
    if (teamFilter !== 'all') {
        filteredMatches = matches.filter(match => match.team === teamFilter);
    }
    
    // Sort by date (newest first)
    filteredMatches.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear table
    tableBody.innerHTML = '';
    
    // Add rows
    filteredMatches.forEach(match => {
        const row = document.createElement('tr');
        row.dataset.id = match.id;
        
        const formattedDate = new Date(match.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const teamDisplay = match.team === 'first-team' ? 'First Team' : 'Reserve Team';
        
        let resultDisplay = 'Upcoming';
        if (match.result.status === 'completed') {
            resultDisplay = `${match.result.homeScore} - ${match.result.awayScore}`;
        } else if (match.result.status === 'postponed') {
            resultDisplay = 'Postponed';
        } else if (match.result.status === 'cancelled') {
            resultDisplay = 'Cancelled';
        }
        
        row.innerHTML = `
            <td>${teamDisplay}</td>
            <td>${match.opponent}</td>
            <td>${formattedDate}</td>
            <td>${match.time}</td>
            <td>${match.location}</td>
            <td>${match.competition}</td>
            <td>${resultDisplay}</td>
            <td class="action-cell">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;
        
        // Add event listeners to buttons
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', function() {
            editMatch(match.id);
        });
        
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this match?')) {
                deleteMatch(match.id);
            }
        });
        
        tableBody.appendChild(row);
    });
    
    // Show "no matches" message if no matches match filter
    if (filteredMatches.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="8" class="empty-message">No matches found${teamFilter !== 'all' ? ' for this team' : ''}.</td>
        `;
        tableBody.appendChild(emptyRow);
    }
}

function editMatch(id) {
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    const match = matches.find(m => m.id == id);
    
    if (match) {
        document.getElementById('match-id').value = match.id;
        document.getElementById('match-team').value = match.team;
        document.getElementById('match-opponent').value = match.opponent;
        document.getElementById('match-date').value = match.date;
        document.getElementById('match-time').value = match.time;
        document.getElementById('match-location').value = match.location;
        document.getElementById('match-competition').value = match.competition;
        document.getElementById('match-status').value = match.result.status;
        
        // Show/hide result fields based on status
        toggleResultFields(match.result.status);
        
        // Set result fields if match is completed
        if (match.result.status === 'completed') {
            document.getElementById('match-home-score').value = match.result.homeScore;
            document.getElementById('match-away-score').value = match.result.awayScore;
            document.getElementById('match-report').value = match.report || '';
        }
        
        // Show form
        document.getElementById('match-form').style.display = 'block';
    }
}

function deleteMatch(id) {
    let matches = JSON.parse(localStorage.getItem('matches') || '[]');
    matches = matches.filter(m => m.id != id);
    localStorage.setItem('matches', JSON.stringify(matches));
    
    // Reload matches table
    loadMatches(document.getElementById('matches-team-filter').value);
    
    // Update dashboard stats
    updateDashboardStats();
    
    // Show success message
    showNotification('Match deleted successfully', 'success');
}

// Site Settings Functions
function initSiteSettings() {
    // Load settings
    loadSiteSettings();
    
    // Form submission
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const clubName = document.getElementById('club-name').value;
            const clubMotto = document.getElementById('club-motto').value;
            const clubPhone = document.getElementById('club-phone').value;
            const clubEmail = document.getElementById('club-email').value;
            const twitterUrl = document.getElementById('twitter-url').value;
            const instagramUrl = document.getElementById('instagram-url').value;
            const tiktokUrl = document.getElementById('tiktok-url').value;
            const maintenanceMode = document.getElementById('maintenance-mode').checked;
            
            // Build settings object
            const settings = {
                clubName,
                clubMotto,
                clubPhone,
                clubEmail,
                socialLinks: {
                    twitter: twitterUrl,
                    instagram: instagramUrl,
                    tiktok: tiktokUrl
                },
                sponsorLogos: JSON.parse(localStorage.getItem('siteSettings') || '{}').sponsorLogos || [],
                maintenanceMode
            };
            
            // Save to localStorage
            localStorage.setItem('siteSettings', JSON.stringify(settings));
            
            // Show success message
            showNotification('Site settings saved successfully', 'success');
        });
    }
}

function loadSiteSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    
    // Populate form fields
    if (document.getElementById('club-name')) {
        document.getElementById('club-name').value = settings.clubName || 'Awsworth Villa FC';
    }
    
    if (document.getElementById('club-motto')) {
        document.getElementById('club-motto').value = settings.clubMotto || '';
    }
    
    if (document.getElementById('club-phone')) {
        document.getElementById('club-phone').value = settings.clubPhone || '';
    }
    
    if (document.getElementById('club-email')) {
        document.getElementById('club-email').value = settings.clubEmail || '';
    }
    
    if (document.getElementById('twitter-url')) {
        document.getElementById('twitter-url').value = settings.socialLinks?.twitter || 'https://x.com/awsworthvilla';
    }
    
    if (document.getElementById('instagram-url')) {
        document.getElementById('instagram-url').value = settings.socialLinks?.instagram || 'https://instagram.com';
    }
    
    if (document.getElementById('tiktok-url')) {
        document.getElementById('tiktok-url').value = settings.socialLinks?.tiktok || 'https://tiktok.com';
    }
    
    if (document.getElementById('maintenance-mode')) {
        document.getElementById('maintenance-mode').checked = settings.maintenanceMode || false;
    }
    
    // Add sponsor logos preview
    if (document.getElementById('sponsor-logos-container') && settings.sponsorLogos) {
        const container = document.getElementById('sponsor-logos-container');
        container.innerHTML = '';
        
        settings.sponsorLogos.forEach((logo, index) => {
            const logoCard = document.createElement('div');
            logoCard.className = 'sponsor-logo-card';
            logoCard.innerHTML = `
                <img src="${logo}" alt="Sponsor Logo ${index + 1}">
                <button class="delete-logo-btn" data-index="${index}">Delete</button>
            `;
            
            const deleteBtn = logoCard.querySelector('.delete-logo-btn');
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this sponsor logo?')) {
                    deleteSponsorLogo(index);
                }
            });
            
            container.appendChild(logoCard);
        });
    }
}

function addSponsorLogo() {
    // In a real implementation, this would handle file uploads
    // For this demo, we'll just add a placeholder
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    const sponsorLogos = settings.sponsorLogos || [];
    
    // Add placeholder logo
    sponsorLogos.push('Images/awsworth-villa badge');
    
    // Update settings
    settings.sponsorLogos = sponsorLogos;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Reload settings
    loadSiteSettings();
    
    // Show success message
    showNotification('Sponsor logo added successfully', 'success');
}

function deleteSponsorLogo(index) {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    const sponsorLogos = settings.sponsorLogos || [];
    
    // Remove logo at index
    sponsorLogos.splice(index, 1);
    
    // Update settings
    settings.sponsorLogos = sponsorLogos;
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Reload settings
    loadSiteSettings();
    
    // Show success message
    showNotification('Sponsor logo deleted successfully', 'success');
}

// Dashboard Overview Functions
function updateDashboardStats() {
    // Get data from localStorage
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    const firstTeamPlayers = JSON.parse(localStorage.getItem('firstTeamPlayers') || '[]');
    const reservePlayers = JSON.parse(localStorage.getItem('reservePlayers') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Update dashboard stats
    if (document.getElementById('stats-news-count')) {
        document.getElementById('stats-news-count').textContent = newsArticles.length;
    }
    
    if (document.getElementById('stats-players-count')) {
        document.getElementById('stats-players-count').textContent = firstTeamPlayers.length + reservePlayers.length;
    }
    
    if (document.getElementById('stats-users-count')) {
        document.getElementById('stats-users-count').textContent = users.length;
    }
    
    if (document.getElementById('stats-matches-upcoming')) {
        const upcomingMatches = matches.filter(match => match.result.status === 'upcoming');
        document.getElementById('stats-matches-upcoming').textContent = upcomingMatches.length;
    }
}

// Utility Functions
// Continuing with utility functions and completing the admin.js file

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('admin-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'admin-notification';
        document.body.appendChild(notification);
    }
    
    // Set notification content and class
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    notification.style.display = 'block';
    notification.style.opacity = '1';
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    }, 3000);
}

// Generate random color for charts
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Update dashboard charts and statistics
function updateDashboardCharts() {
    // Get data
    const firstTeamPlayers = JSON.parse(localStorage.getItem('firstTeamPlayers') || '[]');
    const reservePlayers = JSON.parse(localStorage.getItem('reservePlayers') || '[]');
    const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Position distribution chart
    updatePositionDistributionChart(firstTeamPlayers, reservePlayers);
    
    // Top scorers chart
    updateTopScorersChart(firstTeamPlayers, reservePlayers, playerStats);
    
    // Match results chart
    updateMatchResultsChart(matches);
    
    // Recent activity timeline
    updateRecentActivityTimeline();
}

function updatePositionDistributionChart(firstTeamPlayers, reservePlayers) {
    const ctx = document.getElementById('position-chart');
    if (!ctx) return;
    
    // Combine players
    const allPlayers = [...firstTeamPlayers, ...reservePlayers];
    
    // Count players by position
    const positionCounts = {
        goalkeeper: 0,
        defender: 0,
        midfielder: 0,
        attacker: 0
    };
    
    allPlayers.forEach(player => {
        positionCounts[player.position]++;
    });
    
    // Create chart
    if (window.positionChart) {
        window.positionChart.destroy();
    }
    
    window.positionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Goalkeepers', 'Defenders', 'Midfielders', 'Attackers'],
            datasets: [{
                data: [
                    positionCounts.goalkeeper,
                    positionCounts.defender,
                    positionCounts.midfielder,
                    positionCounts.attacker
                ],
                backgroundColor: [
                    '#FFC107',
                    '#4CAF50',
                    '#2196F3',
                    '#F44336'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: 'Player Position Distribution'
            }
        }
    });
}

function updateTopScorersChart(firstTeamPlayers, reservePlayers, playerStats) {
    const ctx = document.getElementById('scorers-chart');
    if (!ctx) return;
    
    // Combine players
    const allPlayers = [...firstTeamPlayers, ...reservePlayers];
    
    // Get players with goals
    const playersWithGoals = playerStats
        .filter(stats => stats.goals > 0)
        .map(stats => {
            const player = allPlayers.find(p => p.id === stats.playerId);
            return {
                name: player ? player.name : `Player #${stats.playerId}`,
                goals: stats.goals
            };
        })
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 5); // Top 5 scorers
    
    // Create chart data
    const labels = playersWithGoals.map(p => p.name);
    const data = playersWithGoals.map(p => p.goals);
    const colors = Array(playersWithGoals.length).fill().map(() => getRandomColor());
    
    // Create chart
    if (window.scorersChart) {
        window.scorersChart.destroy();
    }
    
    window.scorersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Goals',
                data: data,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Top Goal Scorers'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }]
            }
        }
    });
}

function updateMatchResultsChart(matches) {
    const ctx = document.getElementById('results-chart');
    if (!ctx) return;
    
    // Count results for first team matches
    const firstTeamMatches = matches.filter(match => match.team === 'first-team' && match.result.status === 'completed');
    
    let wins = 0;
    let draws = 0;
    let losses = 0;
    
    firstTeamMatches.forEach(match => {
        if (match.location === 'Home') {
            if (match.result.homeScore > match.result.awayScore) wins++;
            else if (match.result.homeScore === match.result.awayScore) draws++;
            else losses++;
        } else {
            if (match.result.homeScore < match.result.awayScore) wins++;
            else if (match.result.homeScore === match.result.awayScore) draws++;
            else losses++;
        }
    });
    
    // Create chart
    if (window.resultsChart) {
        window.resultsChart.destroy();
    }
    
    window.resultsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Wins', 'Draws', 'Losses'],
            datasets: [{
                data: [wins, draws, losses],
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                position: 'bottom'
            },
            title: {
                display: true,
                text: 'First Team Results'
            }
        }
    });
}

function updateRecentActivityTimeline() {
    const container = document.getElementById('recent-activity');
    if (!container) return;
    
    // Get recent activities (would be stored in a real system)
    // For this demo, we'll generate some sample activities
    const activities = [
        {
            type: 'news',
            action: 'added',
            title: 'First Team Victory in Season Opener',
            date: '2025-04-25T14:30:00'
        },
        {
            type: 'player',
            action: 'updated',
            title: 'Ethan Shipstone',
            date: '2025-04-24T11:15:00'
        },
        {
            type: 'match',
            action: 'added',
            title: 'Upcoming match against Ilkeston Town',
            date: '2025-04-23T09:45:00'
        },
        {
            type: 'user',
            action: 'added',
            title: 'New user registered',
            date: '2025-04-22T16:20:00'
        },
        {
            type: 'settings',
            action: 'updated',
            title: 'Site settings changed',
            date: '2025-04-21T13:10:00'
        }
    ];
    
    // Clear container
    container.innerHTML = '';
    
    // Add activity items
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const formattedDate = new Date(activity.date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const iconClass = {
            news: 'fa-newspaper',
            player: 'fa-user',
            match: 'fa-futbol',
            user: 'fa-users',
            settings: 'fa-cog'
        }[activity.type];
        
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-title">
                    <span class="activity-action">${activity.action.toUpperCase()}</span>
                    ${activity.title}
                </p>
                <p class="activity-time">${formattedDate}</p>
            </div>
        `;
        
        container.appendChild(activityItem);
    });
}

// Export functionality to CSV
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    // Get headers
    const headers = [];
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach(cell => {
        // Skip the actions column
        if (!cell.classList.contains('action-cell')) {
            headers.push(cell.textContent.trim());
        }
    });
    
    // Get rows
    const rows = [];
    const rowElements = table.querySelectorAll('tbody tr');
    rowElements.forEach(row => {
        const rowData = [];
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            // Skip the actions column
            if (!cell.classList.contains('action-cell')) {
                rowData.push(cell.textContent.trim());
            }
        });
        rows.push(rowData);
    });
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification(`${filename} exported successfully`, 'success');
}

// Initialize export buttons
function initExportButtons() {
    // News export
    const exportNewsBtn = document.getElementById('export-news-btn');
    if (exportNewsBtn) {
        exportNewsBtn.addEventListener('click', function() {
            exportTableToCSV('news-table', 'news-articles.csv');
        });
    }
    
    // Players export
    const exportPlayersBtn = document.getElementById('export-players-btn');
    if (exportPlayersBtn) {
        exportPlayersBtn.addEventListener('click', function() {
            exportTableToCSV('players-table', 'players.csv');
        });
    }
    
    // Users export
    const exportUsersBtn = document.getElementById('export-users-btn');
    if (exportUsersBtn) {
        exportUsersBtn.addEventListener('click', function() {
            exportTableToCSV('users-table', 'users.csv');
        });
    }
    
    // Matches export
    const exportMatchesBtn = document.getElementById('export-matches-btn');
    if (exportMatchesBtn) {
        exportMatchesBtn.addEventListener('click', function() {
            exportTableToCSV('matches-table', 'matches.csv');
        });
    }
}

// Backup & Restore Functionality
function initBackupRestore() {
    // Backup button
    const backupBtn = document.getElementById('backup-data-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            createBackup();
        });
    }
    
    // Restore form
    const restoreForm = document.getElementById('restore-form');
    if (restoreForm) {
        restoreForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('backup-file');
            if (fileInput.files.length > 0) {
                restoreBackup(fileInput.files[0]);
            } else {
                showNotification('Please select a backup file', 'error');
            }
        });
    }
}

function createBackup() {
    // Get all data from localStorage
    const data = {
        newsArticles: JSON.parse(localStorage.getItem('newsArticles') || '[]'),
        firstTeamPlayers: JSON.parse(localStorage.getItem('firstTeamPlayers') || '[]'),
        reservePlayers: JSON.parse(localStorage.getItem('reservePlayers') || '[]'),
        playerStats: JSON.parse(localStorage.getItem('playerStats') || '[]'),
        users: JSON.parse(localStorage.getItem('users') || '[]'),
        matches: JSON.parse(localStorage.getItem('matches') || '[]'),
        siteSettings: JSON.parse(localStorage.getItem('siteSettings') || '{}')
    };
    
    // Create JSON file
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Generate filename with date
    const now = new Date();
    const dateString = now.toISOString().split('T')[0];
    const filename = `awsworth-villa-backup-${dateString}.json`;
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    showNotification('Backup created successfully', 'success');
}

function restoreBackup(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate backup data (basic check)
            if (!data.newsArticles || !data.firstTeamPlayers || !data.users) {
                throw new Error('Invalid backup file format');
            }
            
            // Confirm restore
            if (confirm('This will replace all current data. Are you sure you want to continue?')) {
                // Restore data to localStorage
                localStorage.setItem('newsArticles', JSON.stringify(data.newsArticles));
                localStorage.setItem('firstTeamPlayers', JSON.stringify(data.firstTeamPlayers));
                localStorage.setItem('reservePlayers', JSON.stringify(data.reservePlayers));
                localStorage.setItem('playerStats', JSON.stringify(data.playerStats));
                localStorage.setItem('users', JSON.stringify(data.users));
                localStorage.setItem('matches', JSON.stringify(data.matches));
                localStorage.setItem('siteSettings', JSON.stringify(data.siteSettings));
                
                // Show success message
                showNotification('Backup restored successfully. Page will reload.', 'success');
                
                // Reload page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            showNotification(`Error restoring backup: ${error.message}`, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Enhanced Dashboard Overview
function initDashboardOverview() {
    updateDashboardStats();
    
    // Initial chart rendering
    if (document.getElementById('dashboard-panel')) {
        updateDashboardCharts();
    }
    
    // Schedule regular updates
    setInterval(updateDashboardStats, 60000); // Update stats every minute
    
    // Upcoming matches
    loadUpcomingMatches();
    
    // Recent members
    loadRecentMembers();
}

function loadUpcomingMatches() {
    const container = document.getElementById('upcoming-matches');
    if (!container) return;
    
    const matches = JSON.parse(localStorage.getItem('matches') || '[]');
    
    // Get upcoming matches sorted by date
    const upcomingMatches = matches
        .filter(match => match.result.status === 'upcoming')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5); // Show next 5 matches
    
    // Clear container
    container.innerHTML = '';
    
    if (upcomingMatches.length === 0) {
        container.innerHTML = '<p class="no-data-message">No upcoming matches</p>';
        return;
    }
    
    // Add match items
    upcomingMatches.forEach(match => {
        const matchItem = document.createElement('div');
        matchItem.className = 'match-item';
        
        const matchDate = new Date(`${match.date}T${match.time}`);
        const formattedDate = matchDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        const formattedTime = matchDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        matchItem.innerHTML = `
            <div class="match-date">
                <div class="match-day">${formattedDate}</div>
                <div class="match-time">${formattedTime}</div>
            </div>
            <div class="match-details">
                <div class="match-teams">
                    ${match.location === 'Home' ? 'Awsworth Villa' : match.opponent} vs
                    ${match.location === 'Home' ? match.opponent : 'Awsworth Villa'}
                </div>
                <div class="match-venue">${match.location === 'Home' ? 'Home' : 'Away'}, ${match.competition}</div>
            </div>
        `;
        
        container.appendChild(matchItem);
    });
}

function loadRecentMembers() {
    const container = document.getElementById('recent-members');
    if (!container) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Get recent users sorted by registration date
    const recentUsers = users
        .sort((a, b) => new Date(b.registeredOn) - new Date(a.registeredOn))
        .slice(0, 5); // Show 5 most recent
    
    // Clear container
    container.innerHTML = '';
    
    if (recentUsers.length === 0) {
        container.innerHTML = '<p class="no-data-message">No users found</p>';
        return;
    }
    
    // Add user items
    recentUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        
        const formattedDate = new Date(user.registeredOn).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        userItem.innerHTML = `
            <div class="user-avatar">
                ${user.name.charAt(0).toUpperCase()}
            </div>
            <div class="user-details">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
                <div class="user-joined">Joined: ${formattedDate}</div>
            </div>
            <div class="user-role ${user.role}">
                ${user.role === 'admin' ? 'Admin' : 'User'}
            </div>
        `;
        
        container.appendChild(userItem);
    });
}

// Initialize All Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the admin dashboard page
    if (!document.querySelector('.admin-container')) return;
    
    // Check admin access
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        // Redirect non-admin users
        alert('You do not have permission to access this page');
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize data and components
    initSampleData();
    initDashboardOverview();
    initNewsManagement();
    initPlayerManagement();
    initPlayerStats();
    initUserManagement();
    initMatchesManagement();
    initSiteSettings();
    initExportButtons();
    initBackupRestore();
    
    // Tab switching functionality
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminPanels = document.querySelectorAll('.admin-panel');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and panels
            adminTabs.forEach(t => t.classList.remove('active'));
            adminPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to current tab
            this.classList.add('active');
            
            // Show the corresponding panel
            const panelId = this.dataset.tab + '-panel';
            document.getElementById(panelId).classList.add('active');
            
            // Update charts if on dashboard
            if (this.dataset.tab === 'dashboard') {
                updateDashboardCharts();
            }

            // Add this code to fix the close button in modals and other issues

// Fix modal close buttons
document.addEventListener('DOMContentLoaded', function() {
    // Fix for modal close buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the parent modal and hide it
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                // Re-enable scrolling on body
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal when clicking outside content
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
    
    // Fix duplication issues in tables by checking for existing entries
    function checkForDuplicates(storageKey, id) {
        const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const count = items.filter(item => item.id === id).length;
        
        // If more than one item with the same ID exists, remove duplicates
        if (count > 1) {
            // Keep only the first occurrence
            const uniqueItems = [];
            const seenIds = new Set();
            
            items.forEach(item => {
                if (!seenIds.has(item.id)) {
                    uniqueItems.push(item);
                    seenIds.add(item.id);
                }
            });
            
            // Save back to localStorage
            localStorage.setItem(storageKey, JSON.stringify(uniqueItems));
            console.log(`Fixed duplicates in ${storageKey}`);
            return true;
        }
        
        return false;
    }
    
    // Check and fix duplicates in all data storage
    const dataKeys = [
        'newsArticles', 
        'firstTeamPlayers', 
        'reservePlayers', 
        'playerStats', 
        'users', 
        'matches', 
        'siteSettings'
    ];
    
    dataKeys.forEach(key => {
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        
        // For array data
        if (Array.isArray(items)) {
            // Get all unique IDs
            const ids = items.map(item => item.id);
            const uniqueIds = [...new Set(ids)];
            
            // Check each ID for duplicates
            uniqueIds.forEach(id => {
                if (id) checkForDuplicates(key, id);
            });
        }
    });
    
    // Add sync functionality to update the website content when admin changes are made
    function syncWebsiteContent() {
        // Update news on index page
        updateNewsOnIndexPage();
        
        // Update player lists on team pages
        updateTeamPages();
        
        // Update match data
        updateMatchPages();
        
        // Update site settings
        applySiteSettings();
    }
    
    // This function will synchronize news articles to the index page
    function updateNewsOnIndexPage() {
        const newsContainer = document.querySelector('.news-container');
        if (!newsContainer) return; // Not on index page
        
        const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
        
        // Sort by date (newest first) and take the first 3
        const recentNews = newsArticles
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        // Clear existing news
        newsContainer.innerHTML = '';
        
        // Add news cards
        recentNews.forEach(article => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            
            const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            newsCard.innerHTML = `
                <div class="news-image">
                    <img src="/api/placeholder/400/200" alt="${article.title}">
                </div>
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p class="news-date">${formattedDate}</p>
                    <p class="news-excerpt">${article.excerpt}</p>
                    <a href="#" class="read-more" data-id="${article.id}">Read More</a>
                </div>
            `;
            
            newsContainer.appendChild(newsCard);
        });
        
        // Add event listeners to "Read More" links
        document.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const articleId = this.dataset.id;
                // Create a modal or redirect to a news detail page
                showNewsModal(articleId);
            });
        });
    }
    
    // Show news article in a modal
    function showNewsModal(articleId) {
        const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
        const article = newsArticles.find(a => a.id == articleId);
        
        if (!article) return;
        
        // Create modal if it doesn't exist
        let modal = document.getElementById('news-detail-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'news-detail-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h2 class="modal-title"></h2>
                    <p class="modal-date"></p>
                    <div class="modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add close button functionality
            modal.querySelector('.modal-close').addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
            
            // Close when clicking outside
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Populate modal
        modal.querySelector('.modal-title').textContent = article.title;
        
        const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        modal.querySelector('.modal-date').textContent = formattedDate;
        modal.querySelector('.modal-body').innerHTML = `
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-content">${article.content}</div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    
    // Update team pages with player data
    function updateTeamPages() {
        // First team page
        const firstTeamCards = document.querySelectorAll('#Players .contacts-section');
        if (firstTeamCards.length > 0) {
            updatePlayerCards('first-team');
        }
        
        // Reserve team page
        const reserveTeamCards = document.querySelectorAll('#Players .contacts-section');
        if (reserveTeamCards.length > 0 && window.location.pathname.includes('reserves')) {
            updatePlayerCards('reserves');
        }
    }
    
    // Update player cards on team pages
    function updatePlayerCards(team) {
        const storageKey = team === 'first-team' ? 'firstTeamPlayers' : 'reservePlayers';
        const players = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Group players by position
        const playersByPosition = {
            goalkeeper: [],
            defender: [],
            midfielder: [],
            attacker: []
        };
        
        players.forEach(player => {
            if (playersByPosition[player.position]) {
                playersByPosition[player.position].push(player);
            }
        });
        
        // Get position sections
        const sections = document.querySelectorAll('#Players .contacts-section');
        sections.forEach(section => {
            const heading = section.querySelector('h2');
            if (!heading) return;
            
            let positionKey = '';
            if (heading.textContent.includes('Goalkeeper')) positionKey = 'goalkeeper';
            else if (heading.textContent.includes('Defender')) positionKey = 'defender';
            else if (heading.textContent.includes('Midfielder')) positionKey = 'midfielder';
            else if (heading.textContent.includes('Attacker')) positionKey = 'attacker';
            
            if (positionKey && playersByPosition[positionKey]) {
                const cardContainer = section.querySelector('.contact-cards');
                if (!cardContainer) return;
                
                // Clear existing cards
                cardContainer.innerHTML = '';
                
                // Add player cards
                playersByPosition[positionKey].forEach(player => {
                    const card = document.createElement('div');
                    card.className = 'contact-card';
                    card.innerHTML = `
                        <div class="contact-title">${player.name}</div>
                        ${player.number ? `<div class="player-number">#${player.number}</div>` : ''}
                    `;
                    cardContainer.appendChild(card);
                });
            }
        });
    }
    
    // Update match pages
    function updateMatchPages() {
        // This would need custom implementation based on your match page structure
        // For now, we'll leave it as a placeholder
    }
    
    // Apply site settings
    function applySiteSettings() {
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        // Update club name
        if (settings.clubName) {
            document.querySelectorAll('.logo h1').forEach(el => {
                el.textContent = settings.clubName;
            });
        }
        
        // Update social media links
        if (settings.socialLinks) {
            if (settings.socialLinks.twitter) {
                document.querySelectorAll('a[aria-label="Twitter"]').forEach(el => {
                    el.href = settings.socialLinks.twitter;
                });
            }
            
            if (settings.socialLinks.instagram) {
                document.querySelectorAll('a[aria-label="Instagram"]').forEach(el => {
                    el.href = settings.socialLinks.instagram;
                });
            }
            
            if (settings.socialLinks.tiktok) {
                document.querySelectorAll('a[aria-label="TikTok"]').forEach(el => {
                    el.href = settings.socialLinks.tiktok;
                });
            }
        }
        
        // Update sponsor logos
        if (settings.sponsorLogos && settings.sponsorLogos.length > 0) {
            const sponsorContainer = document.querySelector('.sponser-logos');
            if (sponsorContainer) {
                sponsorContainer.innerHTML = '';
                settings.sponsorLogos.forEach(logo => {
                    const img = document.createElement('img');
                    img.src = logo;
                    img.alt = 'Sponsor';
                    sponsorContainer.appendChild(img);
                });
            }
        }
    }
    
    // Call sync function when page loads
    syncWebsiteContent();
    
    // Also run checkLogin to ensure username is displayed correctly
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
});

// Enhanced version of the checkLoginStatus function to show username properly
function enhancedCheckLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginLinks = document.querySelectorAll('.login-link');
    const userMenus = document.querySelectorAll('.user-menu');
    
    if (user) {
        // User is logged in
        loginLinks.forEach(link => {
            // Replace login link with username
            const parentLi = link.parentElement;
            
            // Create user menu HTML with clearer username display
            const userMenuHTML = `
                <div class="user-menu">
                    <span class="username">${user.name.split(' ')[0]}</span>
                    <div class="user-dropdown">
                        ${user.role === 'admin' ? '<a href="admin-dashboard.html">Admin Dashboard</a>' : '<a href="admin-verify.html">Request Admin Access</a>'}
                        <a href="profile.html">Profile</a>
                        <a href="#" id="logout-btn">Logout</a>
                    </div>
                </div>
            `;
            
            // Replace login link with user menu
            parentLi.innerHTML = userMenuHTML;
            
            // Add event listener to logout button
            const newLogoutBtn = parentLi.querySelector('#logout-btn');
            if (newLogoutBtn) {
                newLogoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }
        });
    } else {
        // User is not logged in
        userMenus.forEach(menu => {
            // Replace user menu with login link
            const parentLi = menu.parentElement;
            parentLi.innerHTML = '<a href="login.html" class="login-link">Login</a>';
        });
    }
}

        });
    });
});
