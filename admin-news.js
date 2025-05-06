/**
 * AWSWORTH VILLA FC - Admin News Module
 * 
 * This file contains all functionality related to news management
 * in the admin dashboard.
 */

/**
 * Initialize news form and functionality
 */
function initNewsForm() {
    console.log('Initializing news form with direct approach');
    
    // Find the Add New Article button
    const addNewsBtn = document.getElementById('add-news-btn');
    console.log('Add News button found:', addNewsBtn);
    
    const newsForm = document.getElementById('news-form');
    const newsEditor = document.getElementById('news-editor');
    
    // Add new article button - using direct onclick property
    if (addNewsBtn && newsForm) {
        console.log('Setting up Add News button click handler');
        
        // Remove any existing handlers by cloning the button
        const newBtn = addNewsBtn.cloneNode(true);
        if (addNewsBtn.parentNode) {
            addNewsBtn.parentNode.replaceChild(newBtn, addNewsBtn);
        }
        
        // Use direct onclick assignment
        newBtn.onclick = function() {
            console.log('Add News button clicked');
            
            // Clear form
            if (newsEditor) {
                newsEditor.reset();
            }
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            const dateField = document.getElementById('news-date');
            if (dateField) {
                dateField.value = today;
            }
            
            // Clear ID field (indicates this is a new article)
            const idField = document.getElementById('news-id');
            if (idField) {
                idField.value = '';
            }
            
            // Clear image
            const imageField = document.getElementById('news-image');
            if (imageField) {
                imageField.value = '';
            }
            
            // Reset image preview
            const previewImg = document.querySelector('#news-image-preview img');
            if (previewImg) {
                previewImg.src = '/api/placeholder/400/200';
            }
            
            // Show form
            newsForm.style.display = 'block';
            
            // Set form heading
            const formHeading = newsForm.querySelector('h3');
            if (formHeading) {
                formHeading.textContent = 'Add News Article';
            }
            
            // Scroll to form
            newsForm.scrollIntoView({ behavior: 'smooth' });
        };
    } else {
        console.error('Add News button or News form not found');
    }
    
    // Cancel button - using direct onclick property
    const cancelBtn = newsForm ? newsForm.querySelector('.cancel-button') : null;
    if (cancelBtn && newsForm) {
        // Remove any existing handlers by cloning
        const newCancelBtn = cancelBtn.cloneNode(true);
        if (cancelBtn.parentNode) {
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        }
        
        // Use direct onclick assignment
        newCancelBtn.onclick = function() {
            console.log('Cancel button clicked');
            newsForm.style.display = 'none';
        };
    }
    
    // Form submission - using direct onsubmit property
    if (newsEditor) {
        // Remove any existing handlers by cloning
        const newEditor = newsEditor.cloneNode(true);
        if (newsEditor.parentNode) {
            newsEditor.parentNode.replaceChild(newEditor, newsEditor);
        }
        
        // Use direct onsubmit assignment
        newEditor.onsubmit = function(e) {
            e.preventDefault();
            console.log('News form submitted');
            
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
                return false;
            }
            
            // Get current news articles
            let newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
            
            // Create or update article
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
                        image: imageUrl || '/api/placeholder/400/200'
                    };
                    
                    // Show notification
                    showNotification('News article updated successfully', 'success');
                }
            } else {
                // Generate new ID - ensuring no duplicates
                const newId = generateUniqueId(newsArticles);
                
                // Add new article
                const newArticle = {
                    id: newId,
                    title,
                    date,
                    category,
                    excerpt,
                    content,
                    featured,
                    image: imageUrl || '/api/placeholder/400/200'
                };
                
                newsArticles.push(newArticle);
                
                // Show notification
                showNotification('News article added successfully', 'success');
            }
            
            // Save updated articles
            localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
            
            // Hide form
            newsForm.style.display = 'none';
            
            // Update the table
            loadNewsData();
            
            // Update dashboard stats if function exists
            if (typeof loadDashboardStats === 'function') {
                loadDashboardStats();
            }
            
            // Sync news to website
            if (typeof syncNewsToWebsite === 'function') {
                syncNewsToWebsite();
            }
            
            return false;
        };
    }
    
    // Export button
    const exportNewsBtn = document.getElementById('export-news-btn');
    if (exportNewsBtn) {
        // Remove any existing handlers by cloning
        const newExportBtn = exportNewsBtn.cloneNode(true);
        if (exportNewsBtn.parentNode) {
            exportNewsBtn.parentNode.replaceChild(newExportBtn, exportNewsBtn);
        }
        
        // Use direct onclick assignment
        newExportBtn.onclick = function() {
            console.log('Export button clicked');
            exportData('newsArticles', 'news-articles');
        };
    }
    
    console.log('News form initialization complete');
}

/**
 * Load news data into the admin table
 */



function loadNewsData() {
    const newsTableBody = document.getElementById('news-table-body');
    if (!newsTableBody) return;
    
    // Get news articles from localStorage
    let newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    
    // Apply filter if any
    const filterSelect = document.getElementById('news-filter');
    if (filterSelect && filterSelect.value !== 'all') {
        const filterValue = filterSelect.value;
        newsArticles = newsArticles.filter(article => article.category === filterValue);
    }
    
    // Clear table
    newsTableBody.innerHTML = '';
    
    // If no news articles, show message
    if (newsArticles.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="5" class="empty-message">No news articles found</td>';
        newsTableBody.appendChild(emptyRow);
        return;
    }
    
    // Add each news article to table
    newsArticles.forEach(article => {
        const row = document.createElement('tr');
        
        // Format date for display
        const articleDate = new Date(article.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        // Format category for display
        let categoryDisplay = article.category.replace(/-/g, ' ');
        categoryDisplay = categoryDisplay.charAt(0).toUpperCase() + categoryDisplay.slice(1);
        
        row.innerHTML = `
            <td>${article.title}</td>
            <td>${articleDate}</td>
            <td>${categoryDisplay}</td>
            <td>${article.featured ? '<span class="featured-badge">Featured</span>' : ''}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${article.id}">Edit</button>
                <button class="view-btn" data-id="${article.id}">View</button>
                <button class="delete-btn" data-id="${article.id}">Delete</button>
            </td>
        `;
        
        newsTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addNewsActionListeners();
    
    // Add filter change listener
    if (filterSelect) {
        filterSelect.addEventListener('change', loadNewsData);
    }
}

/**
 * Add action listeners to news table buttons
 */
function addNewsActionListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('#news-table-body .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.dataset.id;
            editNewsArticle(articleId);
        });
    });
    
    // View buttons
    const viewButtons = document.querySelectorAll('#news-table-body .view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.dataset.id;
            viewNewsArticle(articleId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#news-table-body .delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const articleId = this.dataset.id;
            if (confirm('Are you sure you want to delete this news article?')) {
                deleteNewsArticle(articleId);
            }
        });
    });
}

/**
 * Edit a news article
 * @param {string} articleId - ID of the article to edit
 */
function editNewsArticle(articleId) {
    const newsForm = document.getElementById('news-form');
    const newsEditor = document.getElementById('news-editor');
    
    if (!newsForm || !newsEditor) return;
    
    // Show the form
    newsForm.style.display = 'block';
    
    // Find the article to edit
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    const article = newsArticles.find(a => a.id === parseInt(articleId));
    
    if (!article) {
        showNotification('Article not found', 'error');
        return;
    }
    
    // Fill the form with article data
    document.getElementById('news-id').value = article.id;
    document.getElementById('news-title').value = article.title;
    document.getElementById('news-date').value = article.date;
    document.getElementById('news-category').value = article.category;
    document.getElementById('news-excerpt').value = article.excerpt;
    document.getElementById('news-content').value = article.content;
    document.getElementById('news-featured').checked = article.featured;
    
    // Set image URL and update preview
    const imageField = document.getElementById('news-image');
    if (imageField) {
        imageField.value = article.image || '';
    }
    
    const previewImg = document.querySelector('#news-image-preview img');
    if (previewImg) {
        previewImg.src = article.image || '/api/placeholder/400/200';
    }
    
    // Set form heading
    newsForm.querySelector('h3').textContent = 'Edit News Article';
    
    // Scroll to form
    newsForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * View a news article
 * @param {string} articleId - ID of the article to view
 */
function viewNewsArticle(articleId) {
    const viewModal = document.getElementById('view-news-modal');
    
    if (!viewModal) return;
    
    // Find the article to view
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    const article = newsArticles.find(a => a.id === parseInt(articleId));
    
    if (!article) {
        showNotification('Article not found', 'error');
        return;
    }
    
    // Format date for display
    const articleDate = new Date(article.date).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    // Fill the modal with article data
    viewModal.querySelector('.modal-title').textContent = article.title;
    viewModal.querySelector('.modal-date').textContent = articleDate;
    viewModal.querySelector('.modal-content-text').innerHTML = article.content;
    
    // Add image if modal has an image container
    const imageContainer = viewModal.querySelector('.modal-image');
    if (imageContainer) {
        if (article.image) {
            imageContainer.innerHTML = `<img src="${article.image}" alt="${article.title}">`;
            imageContainer.style.display = 'block';
        } else {
            imageContainer.style.display = 'none';
        }
    }
    
    // Display the modal
    viewModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Delete a news article
 * @param {string} articleId - ID of the article to delete
 */
function deleteNewsArticle(articleId) {
    // Get current news articles
    let newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    
    // Remove the article
    newsArticles = newsArticles.filter(article => article.id !== parseInt(articleId));
    
    // Save updated articles
    localStorage.setItem('newsArticles', JSON.stringify(newsArticles));
    
    // Update the table
    loadNewsData();
    
    // Update dashboard stats if function exists
    if (typeof loadDashboardStats === 'function') {
        loadDashboardStats();
    }
    
    // Sync with website
    syncNewsToWebsite();
    
    // Show notification
    showNotification('News article deleted successfully', 'success');
}

/**
 * Sync news articles with the public website
 */
function syncNewsToWebsite() {
    // Get news articles
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    
    // Create a copy specifically formatted for the website
    const websiteNews = newsArticles.map(article => ({
        id: article.id,
        title: article.title,
        date: article.date,
        formattedDate: formatDate(article.date),
        category: article.category,
        categoryDisplay: formatCategory(article.category),
        excerpt: article.excerpt,
        content: article.content,
        featured: article.featured,
        image: article.image || getCategoryDefaultImage(article.category)
    }));
    
    // Sort by date (newest first) and featured status
    websiteNews.sort((a, b) => {
        // Featured articles first
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // Then by date
        return new Date(b.date) - new Date(a.date);
    });
    
    // Store specifically for website use
    localStorage.setItem('websiteNews', JSON.stringify(websiteNews));
    
    console.log('News synced to website:', websiteNews);
}

/**
 * Format date for display
 * @param {string} dateString - Date string in ISO format
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Format category for display
 * @param {string} category - Category slug
 * @returns {string} - Formatted category
 */
function formatCategory(category) {
    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Get default image for a category
 * @param {string} category - Category slug
 * @returns {string} - Default image URL
 */
function getCategoryDefaultImage(category) {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
    const defaultImages = settings.newsImages || {};
    
    return defaultImages[category] || '/api/placeholder/400/200';
}

/**
 * Export data to JSON file
 * @param {string} dataKey - Key to retrieve data from localStorage
 * @param {string} filename - Filename to use for the export
 */
function exportData(dataKey, filename) {
    // Get data from localStorage
    const data = JSON.parse(localStorage.getItem(dataKey) || '[]');
    
    // Create a JSON blob
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show notification
    showNotification(`${filename} exported successfully`, 'success');
}

function syncNewsToWebsite() {
    const newsArticles = JSON.parse(localStorage.getItem('newsArticles') || '[]');
    
    // Format for website
    const websiteNews = newsArticles.map(article => ({
        ...article,
        formattedDate: new Date(article.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }),
        categoryDisplay: article.category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    })).sort((a, b) => new Date(b.date) - new Date(a.date));
    
    localStorage.setItem('websiteNews', JSON.stringify(websiteNews));
}