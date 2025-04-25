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
});