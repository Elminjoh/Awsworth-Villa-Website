// Immediately-invoked function to avoid global scope pollution
(function() {
    console.log('Applying comprehensive button fix...');
    
    // Wait for everything to load
    document.addEventListener('DOMContentLoaded', function() {
        // Add a slight delay to ensure everything else has loaded
        setTimeout(function() {
            // Fix all Add buttons
            fixAllAddButtons();
            
            // Fix all form submissions
            fixAllFormSubmissions();
            
            console.log('Comprehensive fix applied!');
        }, 300);
    });
    
    /**
     * Fix all Add buttons throughout the admin dashboard
     */
    function fixAllAddButtons() {
        console.log('Fixing all Add buttons');
        
        // Find all "Add" buttons
        const addButtons = document.querySelectorAll('[id^="add-"]');
        
        addButtons.forEach(button => {
            console.log('Found button:', button.id);
            
            // Get the section this button belongs to
            const section = button.id.split('-')[1]; // e.g., 'news', 'player', 'match'
            
            // Override click handler
            button.onclick = function(e) {
                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                
                console.log(`${button.id} clicked`);
                
                // Find the corresponding form
                const formId = section ? `${section}-form` : null;
                const form = formId ? document.getElementById(formId) : null;
                
                // Find editor inside form
                const editorId = section ? `${section}-editor` : null;
                const editor = editorId ? document.getElementById(editorId) : null;
                
                // Find ID field
                const idField = section ? document.getElementById(`${section}-id`) : null;
                
                if (form && editor) {
                    // Reset form
                    editor.reset();
                    
                    // Clear ID field if it exists
                    if (idField) idField.value = '';
                    
                    // Set today's date for date fields
                    const today = new Date().toISOString().split('T')[0];
                    const dateField = form.querySelector('input[type="date"]');
                    if (dateField) dateField.value = today;
                    
                    // Special case for news image
                    if (section === 'news') {
                        // Reset image preview
                        const previewImg = document.querySelector('#news-image-preview img');
                        if (previewImg) {
                            previewImg.src = '/api/placeholder/400/200';
                        }
                    }
                    
                    // Show form
                    form.style.display = 'block';
                    
                    // Set form heading
                    const heading = form.querySelector('h3');
                    if (heading) {
                        heading.textContent = `Add New ${section.charAt(0).toUpperCase() + section.slice(1)}`;
                    }
                    
                    // Scroll to form
                    form.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.error(`Form not found for ${button.id}`);
                }
                
                return false;
            };
            
            console.log(`Fixed button: ${button.id}`);
        });
    }
    
    /**
     * Fix all form submissions in the admin dashboard
     */
    function fixAllFormSubmissions() {
        console.log('Fixing all form submissions');
        
        // Find all form editors
        const forms = document.querySelectorAll('form[id$="-editor"]');
        
        forms.forEach(form => {
            const formId = form.id;
            const section = formId.split('-')[0]; // e.g., 'news', 'player', 'match'
            
            console.log(`Fixing form submission for: ${formId}`);
            
            // Override submit handler
            form.onsubmit = function(e) {
                e.preventDefault();
                
                console.log(`Form submitted: ${formId}`);
                
                // Get the form container
                const formContainer = document.getElementById(`${section}-form`);
                
                // Generic form processing
                try {
                    // Call specific handlers based on section
                    if (section === 'news') {
                        processNewsForm(form);
                    } else if (section === 'player') {
                        processPlayerForm(form);
                    } else if (section === 'match') {
                        processMatchForm(form);
                    } else if (section === 'user') {
                        processUserForm(form);
                    } else {
                        // Generic processing
                        console.log(`No specific handler for ${section}, using generic`);
                        processGenericForm(form, section);
                    }
                    
                    // Hide form after successful submission
                    if (formContainer) {
                        formContainer.style.display = 'none';
                    }
                    
                    // Try to update tables
                    const loadFunction = window[`load${section.charAt(0).toUpperCase() + section.slice(1)}Data`];
                    if (typeof loadFunction === 'function') {
                        loadFunction();
                    }
                    
                    // Update dashboard stats if function exists
                    if (typeof loadDashboardStats === 'function') {
                        loadDashboardStats();
                    }
                } catch (error) {
                    console.error(`Error processing ${section} form:`, error);
                    showNotification(`Error saving ${section}: ${error.message}`, 'error');
                }
                
                return false;
            };
            
            console.log(`Fixed form submission: ${formId}`);
        });
        
        // Fix all cancel buttons
        const cancelButtons = document.querySelectorAll('.cancel-button');
        cancelButtons.forEach(button => {
            button.onclick = function() {
                const form = this.closest('.admin-form');
                if (form) {
                    form.style.display = 'none';
                }
                return false;
            };
        });
    }
    
    // Specific form processors
    function processNewsForm(form) {
        const articleId = document.getElementById('news-id').value;
        const title = document.getElementById('news-title').value;
        const date = document.getElementById('news-date').value;
        const category = document.getElementById('news-category').value;
        const excerpt = document.getElementById('news-excerpt').value;
        const content = document.getElementById('news-content').value;
        const featured = document.getElementById('news-featured').checked;
        const imageUrl = document.getElementById('news-image').value || '/api/placeholder/400/200';
        
        // Validate required fields
        if (!title || !date || !excerpt || !content) {
            showNotification('Please fill in all required fields', 'error');
            throw new Error('Missing required fields');
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
            // Generate new ID
            const newId = generateUniqueId(newsArticles);
            
            // Add new article
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
        
        // Save updated articles
        localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
        
        // Sync to website if function exists
        if (typeof syncNewsToWebsite === 'function') {
            syncNewsToWebsite();
        }
    }
    
    function processPlayerForm(form) {
        const playerId = document.getElementById('player-id').value;
        const name = document.getElementById('player-name').value;
        const number = document.getElementById('player-number').value;
        const team = document.getElementById('player-team').value;
        const position = document.getElementById('player-position').value;
        const age = document.getElementById('player-age').value;
        
        // Validate name
        if (!name) {
            showNotification('Player name is required', 'error');
            throw new Error('Missing player name');
        }
        
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
                
                // Update player stats name if function exists
                if (typeof updatePlayerStatsName === 'function') {
                    updatePlayerStatsName(parseInt(playerId), name, team, position);
                }
                
                showNotification('Player updated successfully', 'success');
            }
        } else {
            // Generate new ID
            const newId = generateUniqueId(players);
            
            // Add new player
            players.push({
                id: newId,
                name,
                number: number ? parseInt(number) : null,
                team,
                position,
                age: age ? parseInt(age) : null
            });
            
            // Initialize player stats
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
        
        // Save updated players
        localStorage.setItem('players', JSON.stringify(players));
        
        // Update related data
        if (typeof loadPlayerStats === 'function') {
            loadPlayerStats();
        }
        
        // Sync player data if functions exist
        if (typeof syncPlayerStats === 'function') {
            syncPlayerStats();
        }
        
        if (typeof syncPlayersToTeamPages === 'function') {
            syncPlayersToTeamPages();
        }
    }
    
    function processMatchForm(form) {
        const matchId = document.getElementById('match-id').value;
        const team = document.getElementById('match-team').value;
        const opponent = document.getElementById('match-opponent').value;
        const date = document.getElementById('match-date').value;
        const time = document.getElementById('match-time').value;
        const location = document.getElementById('match-location').value;
        const competition = document.getElementById('match-competition').value;
        const status = document.getElementById('match-status').value;
        
        // Validate required fields
        if (!opponent || !date) {
            showNotification('Please fill in all required fields', 'error');
            throw new Error('Missing required fields');
        }
        
        // Get result data if completed
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
            // Generate new ID
            const newId = generateUniqueId(matches);
            
            // Add new match
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
        
        // Save updated matches
        localStorage.setItem('matches', JSON.stringify(matches));
        
        // Sync matches if function exists
        if (typeof syncMatchesToWebsite === 'function') {
            syncMatchesToWebsite();
        }
    }
    
    function processUserForm(form) {
        const userId = document.getElementById('user-id').value;
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const role = document.getElementById('user-role').value;
        const password = document.getElementById('user-password').value;
        
        // Validate required fields
        if (!name || !email) {
            showNotification('Please fill in all required fields', 'error');
            throw new Error('Missing required fields');
        }
        
        // Get current users
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (userId) {
            // Update existing user
            const index = users.findIndex(u => u.id === parseInt(userId));
            
            if (index !== -1) {
                // Check for email duplication
                const isDuplicateEmail = users.some(u => 
                    u.email.toLowerCase() === email.toLowerCase() && u.id !== parseInt(userId)
                );
                
                if (isDuplicateEmail) {
                    showNotification('Email address is already in use', 'error');
                    throw new Error('Duplicate email');
                }
                
                users[index].name = name;
                users[index].email = email;
                users[index].role = role;
                
                // Update password only if provided
                if (password) {
                    users[index].password = password;
                }
                
                showNotification('User updated successfully', 'success');
            }
        } else {
            // Validate password for new users
            if (!password) {
                showNotification('Password is required for new users', 'error');
                throw new Error('Missing password');
            }
            
            // Check for duplicate email
            const isDuplicateEmail = users.some(u => u.email.toLowerCase() === email.toLowerCase());
            if (isDuplicateEmail) {
                showNotification('Email address is already registered', 'error');
                throw new Error('Duplicate email');
            }
            
            // Generate new ID
            const newId = generateUniqueId(users);
            
            // Add new user
            users.push({
                id: newId,
                name,
                email,
                password,
                role,
                registeredOn: new Date().toISOString(),
                lastLogin: null
            });
            
            showNotification('User added successfully', 'success');
        }
        
        // Save updated users
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Auto-refresh functionality
// Background auto-refresh functionality
(function() {
    // Set refresh interval (in milliseconds)
    const refreshInterval = 5000; // 3 seconds
    
    // Variables to track state
    let refreshTimer = null;
    let activeTab = null;
    
    // Start the refresh timer
    function startRefreshTimer() {
        // Clear any existing timer
        if (refreshTimer) {
            clearInterval(refreshTimer);
        }
        
        // Get the currently active tab
        activeTab = document.querySelector('.admin-tab.active')?.dataset.tab;
        
        // Start new timer
        refreshTimer = setInterval(function() {
            // Get currently active panel
            const currentTab = document.querySelector('.admin-tab.active')?.dataset.tab;
            
            // Check if a form is open
            const anyFormOpen = document.querySelector('.admin-form[style*="display: block"]');
            const modalOpen = document.querySelector('.modal[style*="display: block"]');
            
            // Only refresh if tab hasn't changed and no form or modal is open
            if (currentTab === activeTab && !anyFormOpen && !modalOpen) {
                refreshCurrentView();
            } else {
                // Update active tab
                activeTab = currentTab;
            }
        }, refreshInterval);
        
        console.log('Background auto-refresh started');
    }
    
    // Refresh the current view
    function refreshCurrentView() {
        // Determine which function to call based on active tab
        switch (activeTab) {
            case 'dashboard':
                if (typeof loadDashboardStats === 'function') {
                    loadDashboardStats();
                }
                break;
            case 'news':
                if (typeof loadNewsData === 'function') {
                    loadNewsData();
                }
                break;
            case 'players':
                if (typeof loadPlayersData === 'function') {
                    loadPlayersData();
                }
                break;
            case 'stats':
                if (typeof loadPlayerStats === 'function') {
                    loadPlayerStats();
                }
                break;
            case 'matches':
                if (typeof loadMatchesData === 'function') {
                    loadMatchesData();
                }
                break;
            case 'users':
                if (typeof loadUsersData === 'function') {
                    loadUsersData();
                }
                break;
            default:
                // No refresh for other panels
                break;
        }
    }
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Give time for other scripts to initialize
        setTimeout(function() {
            startRefreshTimer();
        }, 1000);
    });
})();
    
    function processGenericForm(form, section) {
        // Get all input fields
        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Create data object
        const formData = {};
        
        // Get ID field separately
        const idField = document.getElementById(`${section}-id`);
        const id = idField ? idField.value : null;
        
        // Process each field
        inputs.forEach(input => {
            if (input.id && input.id !== `${section}-id`) {
                const fieldName = input.id.replace(`${section}-`, '');
                
                if (input.type === 'checkbox') {
                    formData[fieldName] = input.checked;
                } else if (input.type === 'number') {
                    formData[fieldName] = input.value ? parseInt(input.value) : null;
                } else {
                    formData[fieldName] = input.value;
                }
            }
        });
        
        // Get current items
        const storageKey = `${section}s`;
        let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        if (id) {
            // Update existing item
            const index = items.findIndex(item => item.id === parseInt(id));
            
            if (index !== -1) {
                items[index] = {
                    id: parseInt(id),
                    ...formData
                };
                
                showNotification(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully`, 'success');
            }
        } else {
            // Generate new ID
            const newId = generateUniqueId(items);
            
            // Add new item
            items.push({
                id: newId,
                ...formData
            });
            
            showNotification(`${section.charAt(0).toUpperCase() + section.slice(1)} added successfully`, 'success');
        }
        
        // Save updated items
        localStorage.setItem(storageKey, JSON.stringify(items));
    }
    
    /**
     * Generate a unique ID utility function
     */
    function generateUniqueId(items) {
        if (typeof window.generateUniqueId === 'function') {
            return window.generateUniqueId(items);
        } else {
            if (!items || items.length === 0) return 1;
            const ids = items.map(item => typeof item.id === 'number' ? item.id : parseInt(item.id || 0));
            return Math.max(...ids) + 1;
        }
    }
})();

// Fix for Add Sponsor Logo button
// Fix for Add Sponsor Logo button with Save confirmation
(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            // Find the Add Sponsor Logo button
            const addSponsorBtn = document.getElementById('add-sponsor-btn');
            
            if (addSponsorBtn) {
                console.log('Found Add Sponsor Logo button, setting up handler');
                
                // Remove inline onclick attribute if it exists
                addSponsorBtn.removeAttribute('onclick');
                
                // Add new click handler
                addSponsorBtn.onclick = function() {
                    console.log('Add Sponsor Logo button clicked');
                    
                    // Get sponsor logos container
                    const sponsorContainer = document.getElementById('sponsor-logos-container');
                    if (!sponsorContainer) {
                        console.error('Sponsor logos container not found');
                        return;
                    }
                    
                    // Create a unique ID for the new sponsor
                    const sponsorId = 'sponsor-' + new Date().getTime();
                    
                    // Create new sponsor logo element
                    const sponsorDiv = document.createElement('div');
                    sponsorDiv.className = 'sponsor-logo-item';
                    sponsorDiv.id = sponsorId;
                    sponsorDiv.innerHTML = `
                        <div class="form-row">
                            <div class="form-group">
                                <label for="${sponsorId}-name">Sponsor Name</label>
                                <input type="text" id="${sponsorId}-name" placeholder="Sponsor Name">
                            </div>
                            <div class="form-group">
                                <label for="${sponsorId}-url">Website URL</label>
                                <input type="url" id="${sponsorId}-url" placeholder="https://...">
                            </div>
                            <div class="form-group">
                                <label for="${sponsorId}-logo">Logo URL</label>
                                <input type="url" id="${sponsorId}-logo" placeholder="https://...">
                            </div>
                            <div class="form-group logo-controls">
                                <button type="button" class="save-sponsor-btn" data-id="${sponsorId}">
                                    <i class="fas fa-save"></i> Save
                                </button>
                                <button type="button" class="delete-sponsor-btn" data-id="${sponsorId}">
                                    <i class="fas fa-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                        <div class="logo-preview">
                            <img src="/api/placeholder/150/50" alt="Sponsor Logo Preview">
                        </div>
                        <div class="sponsor-status" id="${sponsorId}-status"></div>
                    `;
                    
                    // Add to container
                    sponsorContainer.appendChild(sponsorDiv);
                    
                    // Add event listener to the logo URL input for preview
                    const logoInput = document.getElementById(`${sponsorId}-logo`);
                    const previewImg = sponsorDiv.querySelector('.logo-preview img');
                    
                    if (logoInput && previewImg) {
                        logoInput.addEventListener('input', function() {
                            if (this.value) {
                                previewImg.src = this.value;
                            } else {
                                previewImg.src = '/api/placeholder/150/50';
                            }
                        });
                    }
                    
                    // Add event listener to the save button
                    const saveBtn = sponsorDiv.querySelector('.save-sponsor-btn');
                    if (saveBtn) {
                        saveBtn.addEventListener('click', function() {
                            const sponsorId = this.dataset.id;
                            const nameInput = document.getElementById(`${sponsorId}-name`);
                            const urlInput = document.getElementById(`${sponsorId}-url`);
                            const logoInput = document.getElementById(`${sponsorId}-logo`);
                            const statusDiv = document.getElementById(`${sponsorId}-status`);
                            
                            if (nameInput && urlInput && logoInput && statusDiv) {
                                // Validate inputs
                                if (!nameInput.value.trim()) {
                                    showSponsorStatus(statusDiv, 'Please enter a sponsor name', 'error');
                                    return;
                                }
                                
                                // Save this sponsor
                                const sponsor = {
                                    id: sponsorId,
                                    name: nameInput.value.trim(),
                                    url: urlInput.value.trim(),
                                    logo: logoInput.value.trim()
                                };
                                
                                // Get existing settings
                                const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                                if (!settings.sponsors) settings.sponsors = [];
                                
                                // Check if sponsor with this ID already exists
                                const existingIndex = settings.sponsors.findIndex(s => s.id === sponsorId);
                                if (existingIndex !== -1) {
                                    settings.sponsors[existingIndex] = sponsor;
                                } else {
                                    settings.sponsors.push(sponsor);
                                }
                                
                                // Save updated settings
                                localStorage.setItem('siteSettings', JSON.stringify(settings));
                                
                                // Show success message
                                showSponsorStatus(statusDiv, 'Sponsor saved successfully!', 'success');
                                
                                console.log('Sponsor saved:', sponsor);
                            }
                        });
                    }
                    
                    // Add event listener to the delete button
                    const deleteBtn = sponsorDiv.querySelector('.delete-sponsor-btn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function() {
                            const sponsorId = this.dataset.id;
                            const sponsorElement = document.getElementById(sponsorId);
                            
                            if (sponsorElement) {
                                // Remove from DOM
                                sponsorElement.remove();
                                
                                // Remove from localStorage
                                const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                                if (settings.sponsors) {
                                    settings.sponsors = settings.sponsors.filter(s => s.id !== sponsorId);
                                    localStorage.setItem('siteSettings', JSON.stringify(settings));
                                }
                                
                                // Show notification
                                showNotification('Sponsor removed successfully', 'success');
                                
                                console.log('Sponsor removed:', sponsorId);
                            }
                        });
                    }
                };
                
                console.log('Add Sponsor Logo button handler set up successfully');
                
                // Also fix the Settings form submission
                const settingsForm = document.getElementById('settings-form');
                if (settingsForm) {
                    settingsForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        // Gather all settings
                        const settings = {
                            clubName: document.getElementById('club-name').value,
                            clubMotto: document.getElementById('club-motto').value,
                            clubPhone: document.getElementById('club-phone').value,
                            clubEmail: document.getElementById('club-email').value,
                            socialLinks: {
                                twitter: document.getElementById('twitter-url').value,
                                instagram: document.getElementById('instagram-url').value,
                                tiktok: document.getElementById('tiktok-url').value
                            },
                            maintenanceMode: document.getElementById('maintenance-mode').checked,
                            // Add sponsors (they're already in localStorage)
                            sponsors: JSON.parse(localStorage.getItem('siteSettings') || '{}').sponsors || []
                        };
                        
                        // Save settings
                        localStorage.setItem('siteSettings', JSON.stringify(settings));
                        
                        // Show notification
                        showNotification('Settings saved successfully', 'success');
                        
                        console.log('Settings saved:', settings);
                    });
                }
            } else {
                console.error('Add Sponsor Logo button not found');
            }
            
            // Function to show sponsor status
            function showSponsorStatus(element, message, type) {
                if (!element) return;
                
                element.textContent = message;
                element.style.padding = '5px';
                element.style.marginTop = '5px';
                element.style.borderRadius = '4px';
                
                if (type === 'success') {
                    element.style.backgroundColor = '#28a745';
                    element.style.color = 'white';
                } else if (type === 'error') {
                    element.style.backgroundColor = '#dc3545';
                    element.style.color = 'white';
                }
                
                // Clear status after a few seconds
                setTimeout(function() {
                    element.textContent = '';
                    element.style.padding = '0';
                    element.style.backgroundColor = 'transparent';
                }, 3000);
            }
            
            // Load existing sponsors
            loadExistingSponsors();
            
            function loadExistingSponsors() {
                const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                if (!settings.sponsors || !Array.isArray(settings.sponsors)) return;
                
                const sponsorContainer = document.getElementById('sponsor-logos-container');
                if (!sponsorContainer) return;
                
                // Clear container first
                sponsorContainer.innerHTML = '';
                
                // Add each sponsor
                settings.sponsors.forEach(sponsor => {
                    const sponsorDiv = document.createElement('div');
                    sponsorDiv.className = 'sponsor-logo-item';
                    sponsorDiv.id = sponsor.id || 'sponsor-' + new Date().getTime();
                    sponsorDiv.innerHTML = `
                        <div class="form-row">
                            <div class="form-group">
                                <label for="${sponsorDiv.id}-name">Sponsor Name</label>
                                <input type="text" id="${sponsorDiv.id}-name" placeholder="Sponsor Name" value="${sponsor.name || ''}">
                            </div>
                            <div class="form-group">
                                <label for="${sponsorDiv.id}-url">Website URL</label>
                                <input type="url" id="${sponsorDiv.id}-url" placeholder="https://..." value="${sponsor.url || ''}">
                            </div>
                            <div class="form-group">
                                <label for="${sponsorDiv.id}-logo">Logo URL</label>
                                <input type="url" id="${sponsorDiv.id}-logo" placeholder="https://..." value="${sponsor.logo || ''}">
                            </div>
                            <div class="form-group logo-controls">
                                <button type="button" class="save-sponsor-btn" data-id="${sponsorDiv.id}">
                                    <i class="fas fa-save"></i> Save
                                </button>
                                <button type="button" class="delete-sponsor-btn" data-id="${sponsorDiv.id}">
                                    <i class="fas fa-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                        <div class="logo-preview">
                            <img src="${sponsor.logo || '/api/placeholder/150/50'}" alt="Sponsor Logo Preview">
                        </div>
                        <div class="sponsor-status" id="${sponsorDiv.id}-status"></div>
                    `;
                    
                    // Add to container
                    sponsorContainer.appendChild(sponsorDiv);
                    
                    // Add event listeners
                    // Logo preview
                    const logoInput = document.getElementById(`${sponsorDiv.id}-logo`);
                    const previewImg = sponsorDiv.querySelector('.logo-preview img');
                    
                    if (logoInput && previewImg) {
                        logoInput.addEventListener('input', function() {
                            if (this.value) {
                                previewImg.src = this.value;
                            } else {
                                previewImg.src = '/api/placeholder/150/50';
                            }
                        });
                    }
                    
                    // Save button
                    const saveBtn = sponsorDiv.querySelector('.save-sponsor-btn');
                    if (saveBtn) {
                        saveBtn.addEventListener('click', function() {
                            const sponsorId = this.dataset.id;
                            const nameInput = document.getElementById(`${sponsorId}-name`);
                            const urlInput = document.getElementById(`${sponsorId}-url`);
                            const logoInput = document.getElementById(`${sponsorId}-logo`);
                            const statusDiv = document.getElementById(`${sponsorId}-status`);
                            
                            if (nameInput && urlInput && logoInput && statusDiv) {
                                // Validate inputs
                                if (!nameInput.value.trim()) {
                                    showSponsorStatus(statusDiv, 'Please enter a sponsor name', 'error');
                                    return;
                                }
                                
                                // Save this sponsor
                                const sponsor = {
                                    id: sponsorId,
                                    name: nameInput.value.trim(),
                                    url: urlInput.value.trim(),
                                    logo: logoInput.value.trim()
                                };
                                
                                // Get existing settings
                                const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                                if (!settings.sponsors) settings.sponsors = [];
                                
                                // Check if sponsor with this ID already exists
                                const existingIndex = settings.sponsors.findIndex(s => s.id === sponsorId);
                                if (existingIndex !== -1) {
                                    settings.sponsors[existingIndex] = sponsor;
                                } else {
                                    settings.sponsors.push(sponsor);
                                }
                                
                                // Save updated settings
                                localStorage.setItem('siteSettings', JSON.stringify(settings));
                                
                                // Show success message
                                showSponsorStatus(statusDiv, 'Sponsor saved successfully!', 'success');
                                
                                console.log('Sponsor saved:', sponsor);
                            }
                        });
                    }
                    
                    // Delete button
                    const deleteBtn = sponsorDiv.querySelector('.delete-sponsor-btn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function() {
                            const sponsorId = this.dataset.id;
                            const sponsorElement = document.getElementById(sponsorId);
                            
                            if (sponsorElement) {
                                // Confirm deletion
                                if (confirm('Are you sure you want to remove this sponsor?')) {
                                    // Remove from DOM
                                    sponsorElement.remove();
                                    
                                    // Remove from localStorage
                                    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                                    if (settings.sponsors) {
                                        settings.sponsors = settings.sponsors.filter(s => s.id !== sponsorId);
                                        localStorage.setItem('siteSettings', JSON.stringify(settings));
                                    }
                                    
                                    // Show notification
                                    showNotification('Sponsor removed successfully', 'success');
                                    
                                    console.log('Sponsor removed:', sponsorId);
                                }
                            }
                        });
                    }
                });
            }
        }, 1500); // Wait a bit longer to ensure everything is loaded
    });
})();