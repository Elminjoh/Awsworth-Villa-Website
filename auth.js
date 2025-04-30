// Enhanced auth.js file with registration, login, and admin verification

document.addEventListener('DOMContentLoaded', function() {
    // Initialize users array in localStorage if it doesn't exist
    if (!localStorage.getItem('users')) {
        const defaultAdmin = {
            id: 1,
            name: 'Admin User',
            email: 'admin@awsworthvilla.com',
            password: 'admin123', // In a real app, this would be hashed
            role: 'admin',
            registeredOn: new Date().toISOString(),
            lastLogin: null
        };
        
        localStorage.setItem('users', JSON.stringify([defaultAdmin]));
    }
    
    // Check if user is logged in
    checkLoginStatus();
    
    // Tab switching functionality for login/register
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    if (authTabs.length > 0 && authForms.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and forms
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                // Add active class to current tab
                this.classList.add('active');
                
                // Show the corresponding form
                const formId = this.dataset.tab + '-form';
                document.getElementById(formId).classList.add('active');
            });
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const messageEl = document.getElementById('login-message');
            
            // Simple validation
            if (!email || !password) {
                messageEl.textContent = 'Please fill in all fields';
                messageEl.className = 'form-message error';
                return;
            }
            
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Find user with matching email
            const user = users.find(u => u.email === email);
            
            if (user && user.password === password) {
                // Update last login time
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('users', JSON.stringify(users));
                
                // Set current user in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Show success message
                messageEl.textContent = 'Login successful. Redirecting...';
                messageEl.className = 'form-message success';
                
                // Redirect based on user role
                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);
            } else {
                // Show error message
                messageEl.textContent = 'Invalid email or password';
                messageEl.className = 'form-message error';
            }
        });
    }
    
    // Registration form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const messageEl = document.getElementById('register-message');
            
            // Simple validation
            if (!name || !email || !password || !confirmPassword) {
                messageEl.textContent = 'Please fill in all fields';
                messageEl.className = 'form-message error';
                return;
            }
            
            if (password !== confirmPassword) {
                messageEl.textContent = 'Passwords do not match';
                messageEl.className = 'form-message error';
                return;
            }
            
            // Check for password strength (basic check)
            if (password.length < 6) {
                messageEl.textContent = 'Password must be at least 6 characters long';
                messageEl.className = 'form-message error';
                return;
            }
            
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                messageEl.textContent = 'Email already registered';
                messageEl.className = 'form-message error';
                return;
            }
            
            // Create new user object
            const newUser = {
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                name,
                email,
                password, // In a real app, this would be hashed
                role: 'user', // Default role
                registeredOn: new Date().toISOString(),
                lastLogin: null
            };
            
            // Add to users array and update localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message
            messageEl.textContent = 'Registration successful! You can now log in.';
            messageEl.className = 'form-message success';
            
            // Reset form
            registerForm.reset();
            
            // Switch to login tab after successful registration
            setTimeout(() => {
                document.querySelector('[data-tab="login"]').click();
            }, 1500);
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

// Function to check login status and update UI
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginLinks = document.querySelectorAll('.login-link');
    const userMenus = document.querySelectorAll('.user-menu');
    const adminLinks = document.querySelectorAll('.admin-link');
    
    if (user) {
        // User is logged in
        loginLinks.forEach(link => {
            // Replace login link with username
            const parentLi = link.parentElement;
            
            // Create user menu HTML
            const userMenuHTML = `
                <div class="user-menu">
                    <span class="username">${user.name.split(' ')[0]}</span>
                    <div class="user-dropdown">
                        ${user.role === 'admin' ? '<a href="admin-dashboard.html">Admin Dashboard</a>' : '<a href="admin-verify.html">Request Admin Access</a>'}
                        <a href="profile.html">Profile</a>
                        <a href="#" id="logout-btn">Logout</a>
                    </div>
                </div>
            `;
            
            // Replace login link with user menu
            parentLi.innerHTML = userMenuHTML;
            
            // Add event listener to logout button
            const newLogoutBtn = parentLi.querySelector('#logout-btn');
            if (newLogoutBtn) {
                newLogoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }
        });
        
        // Show/hide admin links based on role
        adminLinks.forEach(link => {
            if (user.role === 'admin') {
                link.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        });
    } else {
        // User is not logged in
        userMenus.forEach(menu => {
            // Replace user menu with login link
            const parentLi = menu.parentElement;
            parentLi.innerHTML = '<a href="login.html" class="login-link">Login</a>';
        });
        
        // Hide admin links
        adminLinks.forEach(link => {
            link.style.display = 'none';
        });
    }
}

// Function to handle logout
function logout() {
    // Clear current user from localStorage
    localStorage.removeItem('currentUser');
    
    // Show notification if available
    if (typeof showNotification === 'function') {
        showNotification('You have been logged out successfully', 'info');
    }
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check for admin restrictions
function checkAdminAccess() {
    // Check if current page is admin dashboard or related
    if (window.location.pathname.includes('admin') && !window.location.pathname.includes('admin-verify')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!user || user.role !== 'admin') {
            // Redirect non-admin users attempting to access admin pages
            alert('You do not have permission to access this page');
            window.location.href = 'index.html';
        }
    }
}

// Helper function to show notifications
function showAuthNotification(message, type) {
    // Create notification element
    let notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Run admin check on page load
checkAdminAccess();