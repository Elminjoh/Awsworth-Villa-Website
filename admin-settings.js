/**
 * AWSWORTH VILLA FC - Admin Settings Module
 * 
 * This file contains all functionality related to site settings
 * management in the admin dashboard.
 */

/**
 * Initialize settings form and functionality
 */
function initSettingsForm() {
    // Get settings form
    const settingsForm = document.getElementById('settings-form');
    if (!settingsForm) return;
    
    // Load existing settings
    loadSiteSettings();
    
    // Add image management sections
    enhanceSettingsWithImageManagement();
    
    // Form submission
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const clubName = document.getElementById('club-name').value;
        const clubMotto = document.getElementById('club-motto').value;
        const clubPhone = document.getElementById('club-phone').value;
        const clubEmail = document.getElementById('club-email').value;
        const twitterUrl = document.getElementById('twitter-url').value;
        const instagramUrl = document.getElementById('instagram-url').value;
        const tiktokUrl = document.getElementById('tiktok-url').value;
        const maintenanceMode = document.getElementById('maintenance-mode').checked;
        
        // Get current settings
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        // Update settings
        const updatedSettings = {
            ...settings,
            clubName,
            clubMotto,
            clubPhone,
            clubEmail,
            twitterUrl,
            instagramUrl,
            tiktokUrl,
            maintenanceMode
        };
        
        // Save updated settings
        localStorage.setItem('siteSettings', JSON.stringify(updatedSettings));
        
        // Show notification
        showNotification('Site settings saved successfully', 'success');
    });
}



/**
 * Load site settings into the form
 */
function loadSiteSettings() {
    // Get settings from localStorage
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    
    // Fill form with settings
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
        document.getElementById('twitter-url').value = settings.twitterUrl || '';
    }
    
    if (document.getElementById('instagram-url')) {
        document.getElementById('instagram-url').value = settings.instagramUrl || '';
    }
    
    if (document.getElementById('tiktok-url')) {
        document.getElementById('tiktok-url').value = settings.tiktokUrl || '';
    }
    
    if (document.getElementById('maintenance-mode')) {
        document.getElementById('maintenance-mode').checked = settings.maintenanceMode || false;
    }
    
    // Load sponsor logos
    loadSponsorLogos(settings);
}

/**
 * Load sponsor logos
 * @param {Object} settings - Site settings object
 */
function loadSponsorLogos(settings) {
    const sponsorLogosContainer = document.getElementById('sponsor-logos-container');
    if (!sponsorLogosContainer) return;
    
    sponsorLogosContainer.innerHTML = '';
    
    const sponsorLogos = settings.sponsorLogos || [];
    
    if (sponsorLogos.length === 0) {
        sponsorLogosContainer.innerHTML = '<p class="no-data">No sponsor logos added</p>';
    } else {
        sponsorLogos.forEach((logo, index) => {
            const logoItem = document.createElement('div');
            logoItem.className = 'sponsor-logo-item';
            
            logoItem.innerHTML = `
                <div class="sponsor-logo-preview">
                    <img src="${logo.url}" alt="Sponsor Logo">
                </div>
                <div class="sponsor-logo-info">
                    <p>${logo.name}</p>
                    <button type="button" class="remove-sponsor-btn" data-index="${index}">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            `;
            
            sponsorLogosContainer.appendChild(logoItem);
        });
        
        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-sponsor-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                removeSponsorLogo(index);
            });
        });
    }
    
    // Initialize add sponsor logo functionality
    initAddSponsorLogo();
}

/**
 * Initialize add sponsor logo functionality
 */
function initAddSponsorLogo() {
    // Add sponsor logo button
    window.addSponsorLogo = function() {
        // Create a modal for adding sponsor logo if it doesn't exist
        if (!document.getElementById('add-sponsor-modal')) {
            const modal = document.createElement('div');
            modal.id = 'add-sponsor-modal';
            modal.className = 'modal';
            
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <h2 class="modal-title">Add Sponsor Logo</h2>
                    <div class="modal-content-text">
                        <form id="add-sponsor-form">
                            <div class="form-group">
                                <label for="sponsor-name">Sponsor Name</label>
                                <input type="text" id="sponsor-name" required>
                            </div>
                            <div class="form-group">
                                <label for="sponsor-url">Logo URL</label>
                                <input type="url" id="sponsor-url" required placeholder="https://example.com/logo.png">
                                <p class="help-text">Enter the URL of the sponsor's logo image</p>
                            </div>
                            <div class="form-group">
                                <label for="sponsor-website">Website (optional)</label>
                                <input type="url" id="sponsor-website" placeholder="https://example.com">
                            </div>
                            <div class="form-buttons">
                                <button type="submit" class="submit-button">Add Sponsor</button>
                                <button type="button" class="cancel-button">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners to the new modal
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = '';
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
            
            const sponsorForm = document.getElementById('add-sponsor-form');
            sponsorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('sponsor-name').value;
                const url = document.getElementById('sponsor-url').value;
                const website = document.getElementById('sponsor-website').value;
                
                // Get current settings
                const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
                
                // Initialize sponsor logos array if it doesn't exist
                if (!settings.sponsorLogos) {
                    settings.sponsorLogos = [];
                }
                
                // Add new sponsor logo
                settings.sponsorLogos.push({
                    name,
                    url,
                    website
                });
                
                // Save updated settings
                localStorage.setItem('siteSettings', JSON.stringify(settings));
                
                // Hide modal
                modal.style.display = 'none';
                document.body.style.overflow = '';
                
                // Reload settings
                loadSiteSettings();
                
                // Show notification
                showNotification('Sponsor logo added successfully', 'success');
            });
            
            // Add file upload functionality to sponsor logo form
            addFileUploadToSponsorForm();
        }
        
        // Show the modal
        document.getElementById('add-sponsor-modal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };
}

/**
 * Add file upload functionality to sponsor logo form
 */
function addFileUploadToSponsorForm() {
    const sponsorUrlInput = document.getElementById('sponsor-url');
    if (!sponsorUrlInput) return;
    
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'sponsor-logo-file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    sponsorUrlInput.parentNode.appendChild(fileInput);
    
    // Create select button
    const selectButton = document.createElement('button');
    selectButton.type = 'button';
    selectButton.className = 'select-image-btn';
    selectButton.innerHTML = '<i class="fas fa-upload"></i> Select Logo';
    selectButton.style.marginLeft = '10px';
    
    // Style the button
    selectButton.style.backgroundColor = '#f53832';
    selectButton.style.color = 'white';
    selectButton.style.border = 'none';
    selectButton.style.borderRadius = '4px';
    selectButton.style.padding = '8px 12px';
    selectButton.style.cursor = 'pointer';
    
    // Insert button after the input
    sponsorUrlInput.parentNode.insertBefore(selectButton, sponsorUrlInput.nextSibling);
    
    // Add click handler
    selectButton.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Set the URL input value
                sponsorUrlInput.value = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Remove sponsor logo
 * @param {number} index - Index of the logo to remove
 */
window.removeSponsorLogo = function(index) {
    if (confirm('Are you sure you want to remove this sponsor logo?')) {
        // Get current settings
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        // Remove logo at specified index
        if (settings.sponsorLogos && settings.sponsorLogos.length > index) {
            settings.sponsorLogos.splice(index, 1);
            
            // Save updated settings
            localStorage.setItem('siteSettings', JSON.stringify(settings));
            
            // Reload settings
            loadSiteSettings();
            
            // Show notification
            showNotification('Sponsor logo removed successfully', 'success');
        }
    }
};

/**
 * Enhance settings with image management sections
 */
function enhanceSettingsWithImageManagement() {
    // Check if we're on the settings panel
    const settingsPanel = document.getElementById('settings-panel');
    if (!settingsPanel) return;
    
    // Create team images section if it doesn't exist
    if (!document.querySelector('.settings-section.team-images')) {
        createTeamImagesSection(settingsPanel);
    }
    
    // Create news images section if it doesn't exist
    if (!document.querySelector('.settings-section.news-images')) {
        createNewsImagesSection(settingsPanel);
    }
    
    // Load existing image settings
    loadExistingImageSettings();
}

/**
 * Create team images management section
 * @param {HTMLElement} settingsPanel - Settings panel element
 */
function createTeamImagesSection(settingsPanel) {
    // Create the section
    const teamImagesSection = document.createElement('div');
    teamImagesSection.className = 'settings-section team-images';
    teamImagesSection.innerHTML = `
        <h3>Team Images</h3>
        <p class="help-text">Manage team photos displayed throughout the website</p>
        
        <div class="team-images-grid">
            <div class="team-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="Team Picture" id="team-picture-preview">
                </div>
                <div class="image-details">
                    <h4>Home Page Team Picture</h4>
                    <div class="form-group">
                        <label for="team-picture-url">Image URL</label>
                        <input type="url" id="team-picture-url" placeholder="https://example.com/team-picture.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveTeamImage('team-picture')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
            
            <div class="team-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="First Team" id="first-team-picture-preview">
                </div>
                <div class="image-details">
                    <h4>First Team Picture</h4>
                    <div class="form-group">
                        <label for="first-team-picture-url">Image URL</label>
                        <input type="url" id="first-team-picture-url" placeholder="https://example.com/first-team.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveTeamImage('first-team-picture')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
            
            <div class="team-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="Reserve Team" id="reserve-team-picture-preview">
                </div>
                <div class="image-details">
                    <h4>Reserve Team Picture</h4>
                    <div class="form-group">
                        <label for="reserve-team-picture-url">Image URL</label>
                        <input type="url" id="reserve-team-picture-url" placeholder="https://example.com/reserve-team.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveTeamImage('reserve-team-picture')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to settings panel
    settingsPanel.appendChild(teamImagesSection);
    
    // Add styles for image management
    addImageManagementStyles();
}

/**
 * Create news images section for default category images
 * @param {HTMLElement} settingsPanel - Settings panel element
 */
function createNewsImagesSection(settingsPanel) {
    const newsImagesSection = document.createElement('div');
    newsImagesSection.className = 'settings-section news-images';
    newsImagesSection.innerHTML = `
        <h3>Default News Images</h3>
        <p class="help-text">Set default images for news categories</p>
        
        <div class="news-images-grid">
            <div class="news-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="Match Reports" id="match-report-image-preview">
                </div>
                <div class="image-details">
                    <h4>Match Reports</h4>
                    <div class="form-group">
                        <label for="match-report-image-url">Image URL</label>
                        <input type="url" id="match-report-image-url" placeholder="https://example.com/match-report.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveNewsImage('match-report')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
            
            <div class="news-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="Transfer News" id="transfer-news-image-preview">
                </div>
                <div class="image-details">
                    <h4>Transfer News</h4>
                    <div class="form-group">
                        <label for="transfer-news-image-url">Image URL</label>
                        <input type="url" id="transfer-news-image-url" placeholder="https://example.com/transfer-news.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveNewsImage('transfer-news')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
            
            <div class="news-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="Club News" id="club-news-image-preview">
                </div>
                <div class="image-details">
                    <h4>Club News</h4>
                    <div class="form-group">
                        <label for="club-news-image-url">Image URL</label>
                        <input type="url" id="club-news-image-url" placeholder="https://example.com/club-news.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveNewsImage('club-news')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
            
            <div class="news-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="Events" id="event-image-preview">
                </div>
                <div class="image-details">
                    <h4>Events</h4>
                    <div class="form-group">
                        <label for="event-image-url">Image URL</label>
                        <input type="url" id="event-image-url" placeholder="https://example.com/event.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveNewsImage('event')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
            
            <div class="news-image-item">
                <div class="image-preview">
                    <img src="/api/placeholder/400/200" alt="General" id="general-image-preview">
                </div>
                <div class="image-details">
                    <h4>General</h4>
                    <div class="form-group">
                        <label for="general-image-url">Image URL</label>
                        <input type="url" id="general-image-url" placeholder="https://example.com/general.jpg">
                    </div>
                    <button type="button" class="action-button" onclick="saveNewsImage('general')">
                        <i class="fas fa-save"></i> Save
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to settings panel
    settingsPanel.appendChild(newsImagesSection);
}

/**
 * Add CSS styles for image management
 */
function addImageManagementStyles() {
    // Check if styles already exist
    if (document.getElementById('image-management-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'image-management-styles';
    styleElement.textContent = `
        .team-images-grid,
        .news-images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .team-image-item,
        .news-image-item {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        
        .team-image-item:hover,
        .news-image-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .image-preview {
            width: 100%;
            height: 150px;
            overflow: hidden;
            background-color: #f1f1f1;
        }
        
        .image-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .image-details {
            padding: 15px;
        }
        
        .image-details h4 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1rem;
            color: #333;
        }
        
        @media (max-width: 768px) {
            .team-images-grid,
            .news-images-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

/**
 * Load existing image settings
 */
function loadExistingImageSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    
    // Load team images
    if (settings.teamImages) {
        Object.entries(settings.teamImages).forEach(([key, url]) => {
            const urlInput = document.getElementById(`${key}-url`);
            const preview = document.getElementById(`${key}-preview`);
            
            if (urlInput && preview && url) {
                urlInput.value = url;
                preview.src = url;
            }
        });
    }
    
    // Load news category images
    if (settings.newsImages) {
        Object.entries(settings.newsImages).forEach(([category, url]) => {
            const urlInput = document.getElementById(`${category}-image-url`);
            const preview = document.getElementById(`${category}-image-preview`);
            
            if (urlInput && preview && url) {
                urlInput.value = url;
                preview.src = url;
            }
        });
    }
}

/**
 * Save team image
 * @param {string} imageKey - Key for the team image
 */
window.saveTeamImage = function(imageKey) {
    const urlInput = document.getElementById(`${imageKey}-url`);
    if (!urlInput || !urlInput.value) {
        showNotification('Please enter a valid image URL', 'error');
        return;
    }
    
    // Get settings
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    
    // Initialize teamImages if it doesn't exist
    if (!settings.teamImages) {
        settings.teamImages = {};
    }
    
    // Save image URL
    settings.teamImages[imageKey] = urlInput.value;
    
    // Save settings
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Update preview
    const preview = document.getElementById(`${imageKey}-preview`);
    if (preview) preview.src = urlInput.value;
    
    // Update images throughout the website
    updateWebsiteImages();
    
    // Show notification
    showNotification(`${imageKey.replace(/-/g, ' ')} updated successfully`, 'success');
};

/**
 * Save news category image
 * @param {string} category - Category slug
 */
window.saveNewsImage = function(category) {
    const urlInput = document.getElementById(`${category}-image-url`);
    if (!urlInput || !urlInput.value) {
        showNotification('Please enter a valid image URL', 'error');
        return;
    }
    
    // Get settings
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    
    // Initialize newsImages if it doesn't exist
    if (!settings.newsImages) {
        settings.newsImages = {};
    }
    
    // Save image URL
    settings.newsImages[category] = urlInput.value;
    
    // Save settings
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Update preview
    const preview = document.getElementById(`${category}-image-preview`);
    if (preview) preview.src = urlInput.value;
    
    // Update news with default images
    if (typeof syncNewsToWebsite === 'function') {
        syncNewsToWebsite();
    }
    
    // Show notification
    showNotification(`${category.replace(/-/g, ' ')} image updated successfully`, 'success');
};

/**
 * Update images throughout the website
 */
function updateWebsiteImages() {
    // This will be called when the pages load
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    const teamImages = settings.teamImages || {};
    
    // Team picture on homepage
    const teamPicture = document.querySelector('#team\\ picture img');
    if (teamPicture && teamImages['team-picture']) {
        teamPicture.src = teamImages['team-picture'];
    }
    
    // First team picture
    const firstTeamPicture = document.querySelector('#\\ First-team\\ picture img');
    if (firstTeamPicture && teamImages['first-team-picture']) {
        firstTeamPicture.src = teamImages['first-team-picture'];
    }
    
    // Reserve team picture
    const reserveTeamPicture = document.querySelector('#Reserve-Team\\ picture img');
    if (reserveTeamPicture && teamImages['reserve-team-picture']) {
        reserveTeamPicture.src = teamImages['reserve-team-picture'];
    }
    
    // Sync news to website to update default images
    if (typeof syncNewsToWebsite === 'function') {
        syncNewsToWebsite();
    }
}