document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const closeBtn = document.querySelector('.close-btn');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close menu
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        nav.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Handle dropdowns on mobile
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
    
    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && e.target !== menuToggle) {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
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
});