document.addEventListener('DOMContentLoaded', function() {
    // Main app container
    const app = {
        currentPage: null,
        
        // Initialize the application
        init: function() {
            this.setupEventListeners();
            this.loadPageFromHash();
        },
        
        // Set up event listeners
        setupEventListeners: function() {
            // Handle hash changes
            window.addEventListener('hashchange', () => this.loadPageFromHash());
            
            // Handle sidebar clicks
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // Prevent default if it's an anchor tag
                    if (e.target.tagName === 'A') {
                        e.preventDefault();
                    }
                    
                    const page = item.getAttribute('data-page');
                    this.navigateTo(page);
                });
            });
        },
        
        // Navigate to a specific page
        navigateTo: function(page) {
            window.location.hash = page;
        },
        
        // Load page based on URL hash
        loadPageFromHash: function() {
            const page = window.location.hash.substring(1) || 'bubble-sort';
            this.loadPage(page);
        },
        
        // Load page content from external file
        loadPage: async function(page) {
            // Show loading indicator
            // document.getElementById('loading').style.display = 'block';
            // document.getElementById('page-content').style.display = 'none';
            
            try {
                // Fetch the page content
                const response = await fetch(`pages/${page}.html`);
                
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                
                const content = await response.text();
                
                // Update the page content
                document.getElementById('page-content').innerHTML = content;
                document.getElementById('page-content').className = 'page-transition';
                
                // Update active state in sidebar
                this.updateActiveNavItem(page);
                
                // Store current page
                this.currentPage = page;
                
                // Hide loading indicator
                document.getElementById('loading').style.display = 'none';
                document.getElementById('page-content').style.display = 'block';
                
            } catch (error) {
                console.error('Failed to load page:', error);
                
                // Load error page or fallback
                document.getElementById('page-content').innerHTML = `
                    <h1>Page Not Found</h1>
                    <p>The requested page could not be loaded.</p>
                    <a href="#home">Return to Home</a>
                `;
                
                document.getElementById('loading').style.display = 'none';
                document.getElementById('page-content').style.display = 'block';
            }
        },
        
        // Update active navigation item
        updateActiveNavItem: function(page) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === page) {
                    item.classList.add('active');
                }
            });
        }
    };
    
    // Initialize the app
    app.init();
});


document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const pageContentDiv = document.getElementById('page-content');
    const loadingDiv = document.getElementById('loading');
    const navLinks = sidebar.querySelectorAll('a');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

    function loadPage(page) {
        loadingDiv.style.display = 'block';
        fetch(`pages/${page}.html`)
            .then(response => response.text())
            .then(html => {
                pageContentDiv.innerHTML = html;
                hljs.highlightAll();
                loadingDiv.style.display = 'none';
                if (mobileNavToggle && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    mobileNavToggle.classList.remove('open');
                }
            })
            .catch(error => {
                console.error('Error loading page:', error);
                pageContentDiv.innerHTML = '<p>Error loading content.</p>';
                loadingDiv.style.display = 'none';
                if (mobileNavToggle && sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    mobileNavToggle.classList.remove('open');
                }
            });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const page = this.parentNode.getAttribute('data-page');
            if (page) {
                loadPage(page);
                window.location.hash = this.getAttribute('href');
            }
        });
    });

    // Load initial content if a hash is present
    if (window.location.hash) {
        const initialPage = window.location.hash.substring(1);
        loadPage(initialPage);
    } else {
        // Optionally load a default page on initial load
        loadPage('home'); // Create a home.html if you want a default
    }

    // Mobile navigation toggle functionality
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mobileNavToggle.classList.toggle('open');
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(event.target) && event.target !== mobileNavToggle) {
            sidebar.classList.remove('open');
            mobileNavToggle.classList.remove('open');
        }
    });
});