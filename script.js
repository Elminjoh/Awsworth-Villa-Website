document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const closeBtn = document.querySelector('.close-btn');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Toggle menu - show X, hide hamburger on mobile only
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Only hide hamburger on mobile
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'none';
        }
    });
    
    // Close menu - show hamburger, hide X
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            nav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Only show hamburger on mobile
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
            }
        });
    }
    
    // Handle all dropdowns on mobile (Teams and Admin)
    dropdowns.forEach(dropdown => {
        const p = dropdown.querySelector('p');
        
        if (p) {
            p.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Close menu and any open dropdowns when clicking a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
                menuToggle.style.display = 'block';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && !nav.contains(e.target) && e.target !== menuToggle) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
            
            // Only show hamburger on mobile
            if (window.innerWidth <= 768) {
                menuToggle.style.display = 'block';
            }
        }
    });
    
    // Improved window resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (nav) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (menuToggle) {
                menuToggle.style.display = 'block';
            }
        }
    });

    // Rest of your script.js code...

    
    // Make FA tables responsive
    function makeFATablesResponsive() {
        const tables = document.querySelectorAll('#Fixtures table, #Results table, #league-table table');
        tables.forEach(table => {
            table.style.width = '100%';
            table.style.maxWidth = '100%';
        });
    }
    
    // Run initially and then every second for 5 seconds to catch dynamically loaded tables
    makeFATablesResponsive();
    let attempts = 0;
    const interval = setInterval(() => {
        makeFATablesResponsive();
        attempts++;
        if (attempts >= 5) clearInterval(interval);
    }, 1000);

    // Player Stats Modal functionality
    const statsBtn = document.getElementById('show-stats-btn');
    const statsModal = document.getElementById('stats-modal');
    
    if (statsBtn && statsModal) {
        const modalClose = document.querySelector('.modal-close');
        const tabButtons = document.querySelectorAll('.tab-button');
        
        // Show modal when clicking the stats button
        statsBtn.addEventListener('click', function() {
            statsModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
        
        // Close modal when clicking the X
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                statsModal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            });
        }
        
        // Close modal when clicking outside the content
        window.addEventListener('click', function(e) {
            if (e.target === statsModal) {
                statsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Tab filtering functionality
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get position to filter
                const position = this.dataset.position;
                
                // Get all rows
                const rows = document.querySelectorAll('#stats-body tr');
                
                // Show/hide rows based on position
                rows.forEach(row => {
                    if (position === 'all' || row.dataset.position === position) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }

// Website News Display Script
// Add this to script.js or include as a separate file

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the homepage
    if (document.getElementById('news-section')) {
        loadHomePageNews();
    }
    
    // Handle modal close button fix across all pages
    fixModalCloseButtons();
});

function loadHomePageNews() {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) return;
    
    // Get news articles from localStorage
    const news = JSON.parse(localStorage.getItem('websiteNews') || '[]');
    
    // Take the 3 most recent articles
    const recentNews = news.slice(0, 3);
    
    // Clear container
    newsContainer.innerHTML = '';
    
    // If no news, show placeholder
    if (recentNews.length === 0) {
        for (let i = 0; i < 3; i++) {
            createNewsPlaceholder(newsContainer);
        }
        return;
    }
    
    // Add news cards
    recentNews.forEach(article => {
        createNewsCard(newsContainer, article);
    });
    
    // Fill remaining slots with placeholders
    for (let i = recentNews.length; i < 3; i++) {
        createNewsPlaceholder(newsContainer);
    }
    
    // Add event listeners to "Read More" links
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.dataset.id;
            openNewsArticle(articleId);
        });
    });
}

function createNewsCard(container, article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    card.innerHTML = `
        <div class="news-image">
            <img src="${article.image || '/api/placeholder/400/200'}" alt="${article.title}">
        </div>
        <div class="news-content">
            <h3>${article.title}</h3>
            <p class="news-date">${article.formattedDate}</p>
            <p class="news-excerpt">${article.excerpt}</p>
            <a href="#" class="read-more" data-id="${article.id}">Read More</a>
        </div>
    `;
    
    container.appendChild(card);
}

function createNewsPlaceholder(container) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    card.innerHTML = `
        <div class="news-image">
            <img src="/api/placeholder/400/200" alt="No News">
        </div>
        <div class="news-content">
            <h3>No News Available</h3>
            <p class="news-date">-</p>
            <p class="news-excerpt">Check back later for news updates.</p>
        </div>
    `;
    
    container.appendChild(card);
}

function openNewsArticle(articleId) {
    // Get the article
    const news = JSON.parse(localStorage.getItem('websiteNews') || '[]');
    const article = news.find(a => a.id === parseInt(articleId));
    
    if (!article) {
        console.error('Article not found:', articleId);
        return;
    }
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('news-article-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'news-article-modal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="article-image">
                    <img src="" alt="Article Image">
                </div>
                <h2 class="modal-title"></h2>
                <div class="article-meta">
                    <span class="article-date"></span>
                    <span class="article-category"></span>
                </div>
                <div class="modal-content-text"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to close button
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Fill modal with article data
    modal.querySelector('.modal-title').textContent = article.title;
    modal.querySelector('.article-date').textContent = article.formattedDate;
    modal.querySelector('.article-category').textContent = article.categoryDisplay;
    modal.querySelector('.modal-content-text').innerHTML = article.content;
    
    // Set image
    const imageElement = modal.querySelector('.article-image img');
    imageElement.src = article.image || '/api/placeholder/400/200';
    imageElement.alt = article.title;
    
    // Show modal
    modal.style.display = 'block';
}

// Fix modal close buttons universally
function fixModalCloseButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });
}

// Load player stats for first-team.html and reserves.html
function loadPlayerStats() {
    const statsBtn = document.getElementById('show-stats-btn');
    if (!statsBtn) return;
    
    // Get team type from page URL
    const isFirstTeam = window.location.pathname.includes('first-team');
    const teamType = isFirstTeam ? 'first-team' : 'reserves';
    
    // Get player stats from localStorage
    const playerStats = JSON.parse(localStorage.getItem('playerStats') || '[]');
    const filteredStats = playerStats.filter(player => player.team === teamType);
    
    statsBtn.addEventListener('click', function() {
        const statsModal = document.getElementById('stats-modal');
        if (!statsModal) return;
        
        const statsBody = document.getElementById('stats-body');
        if (!statsBody) return;
        
        // Clear existing rows
        statsBody.innerHTML = '';
        
        // Add stats for each player
        filteredStats.forEach(player => {
            const row = document.createElement('tr');
            row.dataset.position = getPositionCategory(player.position);
            
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.matches}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td>${player.cleanSheets}</td>
                <td>${player.yellowCards}</td>
                <td>${player.redCards}</td>
            `;
            
            statsBody.appendChild(row);
        });
        
        // Show modal
        statsModal.style.display = 'block';
    });
}

// Helper function to map individual positions to categories
function getPositionCategory(position) {
    switch (position) {
        case 'goalkeeper': return 'goalkeepers';
        case 'defender': return 'defenders';
        case 'midfielder': return 'midfielders';
        case 'attacker': return 'attackers';
        default: return 'other';
    }
}

// Modal Close Button Fix - Add to script.js

document.addEventListener('DOMContentLoaded', function() {
    // Fix for modal close buttons
    fixModalCloseButtons();
    
    // Also initialize player stats functionality if on team pages
    if (document.getElementById('show-stats-btn')) {
        loadPlayerStats();
    }
});

function fixModalCloseButtons() {
    // Fix for cross close button in modals
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-close')) {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        }
    });
    
    // Fix for clicking outside modal to close
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    });
    
    // Fix for escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
        }
    });
}

// Load player stats for team pages
function loadPlayerStats() {
    const statsBtn = document.getElementById('show-stats-btn');
    if (!statsBtn) return;
    
    // Set up click handler for stats button
    statsBtn.addEventListener('click', function() {
        const statsModal = document.getElementById('stats-modal');
        if (!statsModal) return;
        
        // Show modal
        statsModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Set up tab functionality
        const tabButtons = statsModal.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get position to filter
                const position = this.dataset.position;
                
                // Get all rows
                const rows = document.querySelectorAll('#stats-body tr');
                
                // Show/hide rows based on position
                rows.forEach(row => {
                    if (position === 'all' || row.dataset.position === position) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    });
}

});