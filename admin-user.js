/**
 * AWSWORTH VILLA FC - Admin Users Module
 * 
 * This file contains all functionality related to user management
 * in the admin dashboard.
 */

/**
 * Initialize user form and functionality
 */
function initUserForm() {
    const addUserBtn = document.getElementById('add-user-btn');
    const userForm = document.getElementById('user-form');
    const userEditor = document.getElementById('user-editor');
    const cancelBtn = userForm ? userForm.querySelector('.cancel-button') : null;
    
    // Add new user button
    if (addUserBtn && userForm) {
        addUserBtn.addEventListener('click', function() {
            // Clear form
            userEditor.reset();
            
            // Clear ID field (indicates this is a new user)
            document.getElementById('user-id').value = '';
            
            // Show form
            userForm.style.display = 'block';
            
            // Set form heading
            userForm.querySelector('h3').textContent = 'Add New User';
            
            // Scroll to form
            userForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Cancel button
    if (cancelBtn && userForm) {
        cancelBtn.addEventListener('click', function() {
            userForm.style.display = 'none';
        });
    }
    
    // Form submission
    if (userEditor) {
        userEditor.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const userId = document.getElementById('user-id').value;
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const role = document.getElementById('user-role').value;
            const password = document.getElementById('user-password').value;
            
            // Get current users
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Create or update user
            if (userId) {
                // Update existing user
                const index = users.findIndex(u => u.id === parseInt(userId));
                
                if (index !== -1) {
                    // Check if email is already used by another user
                    const isDuplicateEmail = users.some(u => 
                        u.email.toLowerCase() === email.toLowerCase() && u.id !== parseInt(userId)
                    );
                    
                    if (isDuplicateEmail) {
                        showNotification('Email address is already in use', 'error');
                        return;
                    }
                    
                    users[index].name = name;
                    users[index].email = email;
                    users[index].role = role;
                    
                    // Update password only if provided
                    if (password) {
                        users[index].password = password;
                    }
                    
                    // If this is the current user, update currentUser in localStorage
                    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                    if (currentUser && currentUser.id === parseInt(userId)) {
                        currentUser.name = name;
                        currentUser.email = email;
                        currentUser.role = role;
                        if (password) {
                            currentUser.password = password;
                        }
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    }
                    
                    // Show notification
                    showNotification('User updated successfully', 'success');
                }
            } else {
                // Check if email is already registered
                const isDuplicateEmail = users.some(u => 
                    u.email.toLowerCase() === email.toLowerCase()
                );
                
                if (isDuplicateEmail) {
                    showNotification('Email address is already registered', 'error');
                    return;
                }
                
                // Validate password
                if (!password) {
                    showNotification('Password is required for new users', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showNotification('Password must be at least 6 characters long', 'error');
                    return;
                }
                
                // Generate new ID
                const newId = generateUniqueId(users);
                
                // Add new user
                const newUser = {
                    id: newId,
                    name,
                    email,
                    password,
                    role,
                    registeredOn: new Date().toISOString(),
                    lastLogin: null
                };
                
                users.push(newUser);
                
                // Show notification
                showNotification('User added successfully', 'success');
            }
            
            // Save updated users
            localStorage.setItem('users', JSON.stringify(users));
            
            // Hide form
            userForm.style.display = 'none';
            
            // Update the table
            loadUsersData();
            
            // Update dashboard stats if function exists
            if (typeof loadDashboardStats === 'function') {
                loadDashboardStats();
            }
        });
    }
    
    // Export button
    const exportUsersBtn = document.getElementById('export-users-btn');
    if (exportUsersBtn) {
        exportUsersBtn.addEventListener('click', function() {
            exportData('users', 'users-data');
        });
    }
}

/**
 * Load users data into the admin table
 */
function loadUsersData() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;
    
    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Apply filter if any
    const roleFilter = document.getElementById('role-filter');
    if (roleFilter && roleFilter.value !== 'all') {
        const roleValue = roleFilter.value;
        users = users.filter(user => user.role === roleValue);
    }
    
    // Clear table
    usersTableBody.innerHTML = '';
    
    // If no users, show message
    if (users.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6" class="empty-message">No users found</td>';
        usersTableBody.appendChild(emptyRow);
        return;
    }
    
    // Add each user to table
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // Format dates for display
        const registeredDate = new Date(user.registeredOn).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        const lastLoginDate = user.lastLogin 
            ? new Date(user.lastLogin).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : 'Never';
        
        // Don't allow deletion of current user
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isCurrentUser = currentUser && user.id === currentUser.id;
        
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'Administrator' : 'Regular User'}</td>
            <td>${registeredDate}</td>
            <td>${lastLoginDate}</td>
            <td class="actions">
                <button class="edit-btn" data-id="${user.id}">Edit</button>
                <button class="delete-btn" data-id="${user.id}" ${isCurrentUser ? 'disabled' : ''}>
                    Delete
                </button>
            </td>
        `;
        
        usersTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addUserActionListeners();
    
    // Add filter change listener
    if (roleFilter) {
        roleFilter.addEventListener('change', loadUsersData);
    }
}

/**
 * Add action listeners to user table buttons
 */
function addUserActionListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('#users-table-body .edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.id;
            editUser(userId);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('#users-table-body .delete-btn:not([disabled])');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.dataset.id;
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(userId);
            }
        });
    });
}

/**
 * Edit a user
 * @param {string} userId - ID of the user to edit
 */
function editUser(userId) {
    const userForm = document.getElementById('user-form');
    const userEditor = document.getElementById('user-editor');
    
    if (!userForm || !userEditor) return;
    
    // Show the form
    userForm.style.display = 'block';
    
    // Find the user to edit
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === parseInt(userId));
    
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }
    
    // Fill the form with user data
    document.getElementById('user-id').value = user.id;
    document.getElementById('user-name').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-password').value = ''; // Always empty for security
    
    // Set form heading
    userForm.querySelector('h3').textContent = 'Edit User';
    
    // Scroll to form
    userForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Delete a user
 * @param {string} userId - ID of the user to delete
 */
function deleteUser(userId) {
    // Get current users
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Remove the user
    users = users.filter(user => user.id !== parseInt(userId));
    
    // Save updated users
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update the table
    loadUsersData();
    
    // Update dashboard stats if function exists
    if (typeof loadDashboardStats === 'function') {
        loadDashboardStats();
    }
    
    // Show notification
    showNotification('User deleted successfully', 'success');
}