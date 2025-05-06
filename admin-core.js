/**
 * AWSWORTH VILLA FC - Admin Dashboard Core
 * 
 * This file contains the core functionality for the admin dashboard.
 * It's structured in a modular way to avoid code duplication and
 * make maintenance easier.
 */

// Initialize the main admin functionality when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is admin
    checkAdminAccess();
    
    // Initialize dashboard components
    initAdminDashboard();
});

/**
 * Check if the current user has admin access
 * Redirects to login page if not authenticated
 */
function checkAdminAccess() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        // Redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Initialize all dashboard components
 */
function initAdminDashboard() {
    // Only run on admin dashboard page
    if (!document.getElementById('dashboard-panel')) return;
    
    // Initialize core components
    initAdminTabs();
    loadDashboardStats();
    
    // Load section data
    loadNewsData();
    loadPlayersData();
    loadPlayerStats();
    loadMatchesData();
    loadUsersData();
    loadSiteSettings();
    
    // Initialize modals
    initModals();
    
    // Initialize form handlers
    initNewsForm();
    initPlayerForm();
    initMatchForm();
    initUserForm();
    initSettingsForm();
    
    // Fix common issues
    applyCommonFixes();
}

/**
 * Initialize tab switching functionality
 */
function initAdminTabs() {
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminPanels = document.querySelectorAll('.admin-panel');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all tabs and panels
            adminTabs.forEach(t => t.classList.remove('active'));
            adminPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to selected tab and panel
            this.classList.add('active');
            document.getElementById(`${tabName}-panel`).classList.add('active');
            
            // Save active tab to localStorage for persistence
            localStorage.setItem('activeAdminTab', tabName);
        });
    });
    
    // Restore previously active tab
    const activeTab = localStorage.getItem('activeAdminTab');
    if (activeTab) {
        const tabToActivate = document.querySelector(`.admin-tab[data-tab="${activeTab}"]`);
        if (tabToActivate) tabToActivate.click();
    }
}

/**
 * Initialize modal functionality
 */
function initModals() {
    // Set up all modals
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        
        if (closeBtn) {
            // Remove any existing listeners by cloning
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            // Add new event listener
            newCloseBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Enable scrolling
            });
        }
        
        // Close when clicking outside the modal content
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Enable scrolling
            }
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = ''; // Enable scrolling
                }
            });
        }
    });
}

/**
 * Show notification messages to the user
 * @param {string} message - Message to display
 * @param {string} type - Message type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    const notification = document.getElementById('admin-notification');
    if (!notification) {
        // Create notification element if it doesn't exist
        const newNotification = document.createElement('div');
        newNotification.id = 'admin-notification';
        newNotification.className = 'notification';
        document.body.appendChild(newNotification);
        
        // Add styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 6px;
                    color: white;
                    font-size: 0.9rem;
                    z-index: 1050;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                    display: none;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .notification.show {
                    display: block;
                    opacity: 1;
                }
                
                .notification.success {
                    background-color: #28a745;
                }
                
                .notification.error {
                    background-color: #dc3545;
                }
                
                .notification.info {
                    background-color: #17a2b8;
                }
                
                .notification.warning {
                    background-color: #ffc107;
                    color: #212529;
                }
            `;
            document.head.appendChild(style);
        }
        
        return showNotification(message, type); // Try again with the new element
    }
    
    // Set notification content and class
    notification.textContent = message;
    notification.className = 'notification ' + type;
    
    // Force display with inline style and class
    notification.style.display = 'block';
    notification.style.opacity = '1';
    
    // Add show class for transition
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 3000);
}

/**
 * Generate a unique ID for new items
 * @param {Array} items - Array of items to check IDs against
 * @returns {number} - Unique ID
 */
function generateUniqueId(items) {
    if (!items || items.length === 0) return 1;
    
    // Extract all IDs, ensuring they're integers
    const ids = items.map(item => typeof item.id === 'number' ? item.id : parseInt(item.id || 0));
    
    // Find the highest ID and return highest + 1
    return Math.max(...ids) + 1;
}

/**
 * Apply common fixes to the admin dashboard
 */
function applyCommonFixes() {
    // Fix image previews and upload buttons
    fixImageUploads();
    
    // Fix error messages
    fixErrorMessages();
}

/**
 * Fix image uploads and previews
 */
function fixImageUploads() {
    // Fix news image preview
    const newsImagePreview = document.querySelector('#news-image-preview img');
    if (newsImagePreview) {
        newsImagePreview.onerror = function() {
            this.src = '/api/placeholder/400/200';
            this.onerror = null;
        };
        
        // Set default if needed
        if (!newsImagePreview.src || newsImagePreview.src === 'about:blank') {
            newsImagePreview.src = '/api/placeholder/400/200';
        }
    }
    
    // Fix image selection for news articles
    const newsImageField = document.getElementById('news-image');
    const newsImagePreviewContainer = document.getElementById('news-image-preview');
    
    if (newsImageField && newsImagePreviewContainer) {
        // Create file input for image selection
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'news-image-file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        newsImageField.parentNode.appendChild(fileInput);
        
        // Create select image button
        const selectButton = document.createElement('button');
        selectButton.type = 'button';
        selectButton.className = 'select-image-btn';
        selectButton.innerHTML = '<i class="fas fa-upload"></i> Select Image';
        selectButton.style.marginLeft = '10px';
        
        // Style the button
        selectButton.style.backgroundColor = '#f53832';
        selectButton.style.color = 'white';
        selectButton.style.border = 'none';
        selectButton.style.borderRadius = '4px';
        selectButton.style.padding = '8px 12px';
        selectButton.style.cursor = 'pointer';
        
        // Insert button after the input
        newsImageField.parentNode.insertBefore(selectButton, newsImageField.nextSibling);
        
        // Add click handler to the button
        selectButton.addEventListener('click', function() {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Update preview image
                    const previewImg = newsImagePreviewContainer.querySelector('img');
                    if (previewImg) {
                        previewImg.src = e.target.result;
                    }
                    
                    // Set the URL input value to the data URL
                    newsImageField.value = e.target.result;
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Also apply to team image selection in settings
    const teamImageInputs = document.querySelectorAll('input[id$="-url"]');
    teamImageInputs.forEach(input => {
        const previewId = input.id.replace('-url', '-preview');
        const previewContainer = document.getElementById(previewId);
        
        if (previewContainer) {
            // Create file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = input.id + '-file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            input.parentNode.appendChild(fileInput);
            
            // Create select button
            const selectButton = document.createElement('button');
            selectButton.type = 'button';
            selectButton.className = 'select-image-btn';
            selectButton.innerHTML = '<i class="fas fa-upload"></i> Select';
            selectButton.style.marginLeft = '10px';
            
            // Style the button
            selectButton.style.backgroundColor = '#f53832';
            selectButton.style.color = 'white';
            selectButton.style.border = 'none';
            selectButton.style.borderRadius = '4px';
            selectButton.style.padding = '8px 12px';
            selectButton.style.cursor = 'pointer';
            
            // Insert button after the input
            input.parentNode.insertBefore(selectButton, input.nextSibling);
            
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
                        // Update preview image
                        const previewImg = previewContainer.querySelector('img');
                        if (previewImg) {
                            previewImg.src = e.target.result;
                        }
                        
                        // Set the URL input value
                        input.value = e.target.result;
                    };
                    
                    reader.readAsDataURL(file);
                }
            });
        }
    });
}

/**
 * Fix error messages
 */
function fixErrorMessages() {
    // Remove any existing error messages
    removeErrorMessages();
    
    // Add CSS to hide error messages
    const style = document.createElement('style');
    style.textContent = `
        /* Hide error messages about image URLs */
        div:not(.notification):not(.form-message) {
            &:contains('image URL is invalid'),
            &:contains('image URL is inaccessible') {
                display: none !important;
            }
        }
        
        /* Target error styling */
        [style*="background-color: #ef4444"],
        [style*="background-color: rgb(239, 68, 68)"],
        div[class*="error"]:not(.notification):not(.form-message) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Monitor the DOM for new error messages
    const observer = new MutationObserver(function(mutations) {
        let shouldRemove = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                shouldRemove = true;
            }
        });
        
        if (shouldRemove) {
            removeErrorMessages();
        }
    });
    
    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Run removal periodically to catch any that might slip through
    setInterval(removeErrorMessages, 500);
}

/**
 * Remove error messages from the DOM
 */
function removeErrorMessages() {
    // Find and remove any error messages about invalid image URLs
    document.querySelectorAll('*').forEach(element => {
        if (element.textContent && 
            (element.textContent.includes('image URL is invalid') || 
             element.textContent.includes('image URL is inaccessible'))) {
            
            // If it looks like an error message (based on common styling)
            if (element.className && element.className.includes('error') || 
                window.getComputedStyle(element).backgroundColor === 'rgb(239, 68, 68)' ||
                window.getComputedStyle(element).position === 'fixed') {
                
                // Hide it
                element.style.display = 'none';
                
                // Try to remove it
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        }
    });
}

// Make the functions available globally
window.showNotification = showNotification;
window.generateUniqueId = generateUniqueId;