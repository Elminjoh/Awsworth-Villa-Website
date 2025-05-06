// website-data.js - Loads synced data on website pages
(function() {
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Website data loader initialized');
        
        // Determine current page
        const currentPage = getCurrentPage();
        
        // Load appropriate data based on page
        switch(currentPage) {
            case 'home':
            case 'index':
                loadHomePageData();
                break;
            case 'first-team':
                loadTeamData('first-team');
                break;
            case 'reserves':
                loadTeamData('reserves');
                break;
            case 'first-team-matches':
                loadMatchesData('first-team');
                break;
            case 'reserves-matches':
                loadMatchesData('reserves');
                break;
            case 'contact':
                loadContactPageData();
                break;
            default:
                // Load general site settings
                loadGeneralSettings();
                break;
        }
    });
    
    /**
     * Determine the current page based on URL
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().toLowerCase(); // Add toLowerCase() for case insensitivity
        
        if (filename === '' || filename === 'index.html') {
            return 'home';
        }
        
        // Remove file extension for comparison
        return filename.replace('.html', '');
    }
    
    /**
     * Load home page data
     */
    function loadHomePageData() {
        console.log('Loading home page data');
        
        // Load general settings
        loadGeneralSettings();
        
        // Load featured news
        loadFeaturedNews();
        
        // League table is already loaded via Full-Time API
    }
    
    /**
     * Load featured news for home page
     */
    function loadFeaturedNews() {
        const newsContainer = document.querySelector('.news-container');
        if (!newsContainer) return;
        
        const processedNews = JSON.parse(localStorage.getItem('processedNews') || '{}');
        const featuredNews = processedNews.featured || [];
        
        if (featuredNews.length === 0) {
            // No featured news, try to use recent news
            if (processedNews.recent && processedNews.recent.length > 0) {
                renderNewsArticles(newsContainer, processedNews.recent.slice(0, 3));
            } else {
                // Keep existing sample news if no data available
                console.log('No news articles available in localStorage, keeping sample content');
            }
        } else {
            // Render featured news
            renderNewsArticles(newsContainer, featuredNews.slice(0, 3));
        }
    }
    
    /**
     * Render news articles to container
     */
    function renderNewsArticles(container, articles) {
        // First, save existing news articles if we don't have any real ones yet
        if (articles.length === 0) return;
        
        container.innerHTML = '';
        
        articles.forEach(article => {
            const date = new Date(article.date);
            const formattedDate = date.toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            
            const articleElement = document.createElement('div');
            articleElement.className = 'news-card';
            articleElement.innerHTML = `
                <div class="news-image">
                    <img src="${article.image || '/api/placeholder/400/200'}" alt="${article.title}">
                </div>
                <div class="news-content">
                    <h3>${article.title}</h3>
                    <p class="news-date">${formattedDate}</p>
                    <p class="news-excerpt">${article.excerpt}</p>
                    <a href="#" class="read-more">Read More</a>
                </div>
            `;
            
            container.appendChild(articleElement);
        });
    }
    
    /**
     * Load team data (first team or reserves page)
     */
    function loadTeamData(team) {
        console.log(`Loading ${team} data`);
        
        // Load general settings
        loadGeneralSettings();
        
        // Load team players
        loadTeamPlayers(team);
        
        // Load player stats if modal exists
        loadPlayerStatsModal(team);
    }
    
    /**
     * Load team players for team page
     */
    function loadTeamPlayers(team) {
        const playersContainer = document.getElementById('Players');
        if (!playersContainer) return;
        
        const processedPlayers = JSON.parse(localStorage.getItem('processedPlayers') || '{}');
        const players = team === 'first-team' ? processedPlayers.firstTeam : processedPlayers.reserves;
        
        if (!players || players.length === 0) {
            console.log('No player data found in localStorage, keeping existing content');
            return;
        }
        
        // Get existing sections in the Players div
        const existingSections = playersContainer.querySelectorAll('.contacts-section');
        if (existingSections.length < 4) return; // Need sections for all positions
        
        // Map position categories to section indices
        // Assuming order is: Goalkeepers, Defenders, Midfielders, Attackers
        const positionToSection = {
            'goalkeeper': 0,
            'defender': 1,
            'midfielder': 2,
            'attacker': 3
        };
        
        // Clear each section's contact cards but keep the headings
        existingSections.forEach((section, index) => {
            const contactCards = section.querySelector('.contact-cards');
            if (contactCards) {
                contactCards.innerHTML = ''; // Clear existing cards
            }
        });
        
        // Add players to appropriate sections
        players.forEach(player => {
            const sectionIndex = positionToSection[player.position];
            if (sectionIndex === undefined) return;
            
            const section = existingSections[sectionIndex];
            if (!section) return;
            
            const contactCards = section.querySelector('.contact-cards');
            if (!contactCards) return;
            
            const playerCard = document.createElement('div');
            playerCard.className = 'contact-card';
            playerCard.innerHTML = `
                <div class="contact-title">${player.name}</div>
                ${player.number ? `<div class="contact-number">#${player.number}</div>` : ''}
            `;
            
            contactCards.appendChild(playerCard);
        });
    }
    
    /**
     * Load player stats modal for team page
     */
    function loadPlayerStatsModal(team) {
        const statsBody = document.getElementById('stats-body');
        if (!statsBody) return;
        
        // Get player stats
        const processedStats = JSON.parse(localStorage.getItem('processedPlayerStats') || '{}');
        const playerStats = team === 'first-team' ? processedStats.firstTeam : processedStats.reserves;
        
        if (!playerStats || playerStats.length === 0) {
            console.log('No player stats found in localStorage, keeping existing content');
            return;
        }
        
        // Clear existing stats
        statsBody.innerHTML = '';
        
        // Add stats rows
        playerStats.forEach(stat => {
            const positionClass = stat.position === 'goalkeeper' ? 'goalkeepers' : 
                                 stat.position === 'defender' ? 'defenders' : 
                                 stat.position === 'midfielder' ? 'midfielders' : 'attackers';
            
            const row = document.createElement('tr');
            row.setAttribute('data-position', positionClass);
            row.innerHTML = `
                <td>${stat.name}</td>
                <td>${stat.matches}</td>
                <td>${stat.goals}</td>
                <td>${stat.assists}</td>
                <td>${stat.position === 'goalkeeper' ? stat.cleanSheets : '-'}</td>
                <td>${stat.yellowCards}</td>
                <td>${stat.redCards}</td>
            `;
            
            statsBody.appendChild(row);
        });
    }
    
    /**
     * Load matches data (first team or reserves matches page)
     */
    function loadMatchesData(team) {
        console.log(`Loading ${team} matches data`);
        
        // Load general settings
        loadGeneralSettings();
        
        // Your site uses the ThFA Full-Time API for matches
        // We'll leave this intact and not attempt to replace it
        console.log('Matches are being loaded via ThFA Full-Time API');
    }
    
    /**
     * Load contact page data
     */
    function loadContactPageData() {
        console.log('Loading contact page data');
        
        // Load general settings
        loadGeneralSettings();
        
        // Your contact page uses a different structure than expected
        // We'll just update social media links
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        // Update social media links in the contact page
        if (settings.socialLinks) {
            const socialLinks = document.querySelectorAll('footer .social-media a');
            
            socialLinks.forEach(link => {
                const platform = link.getAttribute('aria-label').toLowerCase();
                if (platform && settings.socialLinks[platform]) {
                    link.href = settings.socialLinks[platform];
                }
            });
        }
    }
    
    /**
     * Load general settings for all pages
     */
    function loadGeneralSettings() {
        console.log('Loading general settings');
        
        // Get settings
        const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        
        // Update club name in header
        if (settings.clubName) {
            const clubNameElement = document.querySelector('.logo h1');
            if (clubNameElement) {
                clubNameElement.textContent = settings.clubName;
            }
            
            // Update page title if not already set
            if (!document.title.includes('-')) {
                document.title = settings.clubName;
            }
        }
        
        // Update footer copyright
        if (settings.clubName) {
            const footerCopyright = document.querySelector('footer p:first-child');
            if (footerCopyright) {
                const currentYear = new Date().getFullYear();
                footerCopyright.textContent = `© ${currentYear} ${settings.clubName}. All rights reserved.`;
            }
        }
        
        // Update social media links in footer
        if (settings.socialLinks) {
            const socialLinks = document.querySelectorAll('footer .social-media a');
            
            socialLinks.forEach(link => {
                const platform = link.getAttribute('aria-label').toLowerCase();
                if (platform && settings.socialLinks[platform]) {
                    link.href = settings.socialLinks[platform];
                }
            });
        }
        
        // Add sponsor logos
        if (settings.sponsors && settings.sponsors.length > 0) {
            // Your site uses "sponser" with an "e" instead of "o"
            const sponsorsSection = document.getElementById('sponsers');
            if (sponsorsSection) {
                const sponsorsContainer = sponsorsSection.querySelector('.sponser-logos');
                if (sponsorsContainer) {
                    // Clear existing sponsor logos
                    sponsorsContainer.innerHTML = '';
                    
                    // Add logos from settings
                    settings.sponsors.forEach(sponsor => {
                        if (sponsor.logo && sponsor.name) {
                            const sponsorImg = document.createElement('img');
                            sponsorImg.src = sponsor.logo;
                            sponsorImg.alt = sponsor.name + ' logo';
                            
                            // If URL is provided, wrap in a link
                            if (sponsor.url) {
                                const sponsorLink = document.createElement('a');
                                sponsorLink.href = sponsor.url;
                                sponsorLink.target = '_blank';
                                sponsorLink.rel = 'noopener noreferrer';
                                sponsorLink.appendChild(sponsorImg);
                                sponsorsContainer.appendChild(sponsorLink);
                            } else {
                                sponsorsContainer.appendChild(sponsorImg);
                            }
                        }
                    });
                }
            }
        }
        
        // Check for maintenance mode
        if (settings.maintenanceMode) {
            // Check if user is an admin
            const isAdmin = checkIfAdmin();
            
            if (!isAdmin) {
                // Redirect to maintenance page or show overlay
                showMaintenanceOverlay();
            }
        }
    }
    
    /**
     * Check if current user is an admin
     */
    function checkIfAdmin() {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        return currentUser && currentUser.role === 'admin';
    }
    
   /**
     * Show maintenance mode overlay
     */
   function showMaintenanceOverlay() {
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'maintenance-overlay';
    overlay.innerHTML = `
        <div class="maintenance-content">
            <h2>Site Under Maintenance</h2>
            <p>We're currently performing scheduled maintenance on our website. Please check back soon.</p>
            <img src="Images/awsworth-villa badge" alt="Awsworth Villa FC">
        </div>
    `;
    
    // Style the overlay
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}
})();