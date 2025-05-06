/**
 * AWSWORTH VILLA FC - Admin Main Script
 * 
 * This is the main entry point for the admin dashboard.
 * It initializes all modules and applies required fixes.
 */

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'index.html';
        return;
    }

    // Initialize all admin modules
    initAdminModules();
    
    // Apply enhanced fixes
    applyEnhancedFixes();
});

/**
 * Initialize all admin modules
 */
function initAdminModules() {
    // Initialize tabs
    initAdminTabs();
    
    // Initialize dashboard
    loadDashboardStats();
    initBackupRestoreFunctions();
    
    // Initialize section data
    loadNewsData();
    loadPlayersData();
    loadPlayerStats();
    loadMatchesData();
    loadUsersData();
    loadSiteSettings();
    
    // Initialize forms
    initNewsForm();
    initPlayerForm();
    initMatchForm();
    initUserForm();
    initSettingsForm();
    
    // Initialize modals
    initModals();
    
    // Apply common fixes
    applyCommonFixes();
}

/**
 * Enhanced fixes for form submissions and data sync
 */
function applyEnhancedFixes() {
    // Ensure forms submit properly
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 2000);
            }
        });
    });
    
    // Sync data to website immediately after changes
    window.syncAllData = function() {
        if (typeof syncNewsToWebsite === 'function') syncNewsToWebsite();
        if (typeof syncPlayerStats === 'function') syncPlayerStats();
        if (typeof syncPlayersToTeamPages === 'function') syncPlayersToTeamPages();
        if (typeof updateWebsiteImages === 'function') updateWebsiteImages();
    };
}

// Ensure global functions are available
window.showNotification = showNotification;
window.generateUniqueId = generateUniqueId;
window.exportData = exportData;
window.syncAllData = syncAllData;