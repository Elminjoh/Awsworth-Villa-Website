/**
 * Enhanced form submission fixes
 */

// Enhanced news form submission
function fixNewsModule() {
    const newsEditor = document.getElementById('news-editor');
    if (newsEditor) {
        newsEditor.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const articleId = document.getElementById('news-id').value;
            const title = document.getElementById('news-title').value;
            const date = document.getElementById('news-date').value;
            const category = document.getElementById('news-category').value;
            const excerpt = document.getElementById('news-excerpt').value;
            const content = document.getElementById('news-content').value;
            const featured = document.getElementById('news-featured').checked;
            const imageUrl = document.getElementById('news-image').value;
            
            // Validate required fields
            if (!title || !date || !category || !excerpt || !content) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Get current news articles
            let newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
            
            if (articleId) {
                // Update existing article
                const index = newsArticles.findIndex(a => a.id === parseInt(articleId));
                if (index !== -1) {
                    newsArticles[index] = {
                        id: parseInt(articleId),
                        title,
                        date,
                        category,
                        excerpt,
                        content,
                        featured,
                        image: imageUrl
                    };
                    showNotification('News article updated successfully', 'success');
                }
            } else {
                // Add new article
                const newId = generateUniqueId(newsArticles);
                newsArticles.push({
                    id: newId,
                    title,
                    date,
                    category,
                    excerpt,
                    content,
                    featured,
                    image: imageUrl
                });
                showNotification('News article added successfully', 'success');
            }
            
            // Save and sync
            localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
            loadNewsData();
            syncAllData();
            
            // Hide form
            document.getElementById('news-form').style.display = 'none';
        });
    }
}

// Enhanced player form submission
function fixPlayerModule() {
    const playerEditor = document.getElementById('player-editor');
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
                    showNotification('Player updated successfully', 'success');
                }
            } else {
                // Add new player
                const newId = generateUniqueId(players);
                players.push({
                    id: newId,
                    name,
                    number: number ? parseInt(number) : null,
                    team,
                    position,
                    age: age ? parseInt(age) : null
                });
                
                // Initialize stats
                let playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
                playerStats.push({
                    playerId: newId,
                    name,
                    position,
                    team,
                    matches: 0,
                    goals: 0,
                    assists: 0,
                    cleanSheets: 0,
                    yellowCards: 0,
                    redCards: 0
                });
                localStorage.setItem('playerStats', JSON.stringify(playerStats));
                
                showNotification('Player added successfully', 'success');
            }
            
            // Save and sync
            localStorage.setItem('players', JSON.stringify(players));
            loadPlayersData();
            loadPlayerStats();
            syncAllData();
            
            // Hide form
            document.getElementById('player-form').style.display = 'none';
        });
    }
}

// Enhanced match form submission
function fixMatchModule() {
    const matchEditor = document.getElementById('match-editor');
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
            
            // Get result data if completed
            let homeScore, awayScore, report;
            if (status === 'completed') {
                homeScore = parseInt(document.getElementById('match-home-score').value) || 0;
                awayScore = parseInt(document.getElementById('match-away-score').value) || 0;
                report = document.getElementById('match-report').value;
            }
            
            // Get current matches
            let matches = JSON.parse(localStorage.getItem('matches') || '[]');
            
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
                    showNotification('Match updated successfully', 'success');
                }
            } else {
                // Add new match
                const newId = generateUniqueId(matches);
                matches.push({
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
                });
                showNotification('Match added successfully', 'success');
            }
            
            // Save and sync
            localStorage.setItem('matches', JSON.stringify(matches));
            loadMatchesData();
            syncAllData();
            
            // Hide form
            document.getElementById('match-form').style.display = 'none';
        });
    }
}