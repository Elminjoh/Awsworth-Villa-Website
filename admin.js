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
    
    // Apply fixes
    applyCommonFixes();
}

// Ensure global functions are available
window.showNotification = showNotification;
window.generateUniqueId = generateUniqueId;
window.exportData = exportData;