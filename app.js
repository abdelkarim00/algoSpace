document.addEventListener('DOMContentLoaded', function() {
    // Main app container
    const app = {
        currentPage: null,

        // Initialize the application
        init: function() {
            this.setupEventListeners();
            this.loadPageOnStartup(); // Renamed for clarity
        },

        // Set up event listeners
        setupEventListeners: function() {
            // Handle hash changes
            window.addEventListener('hashchange', () => this.loadPageFromHash());

            // Handle sidebar clicks
            document.querySelectorAll('#sidebar li a').forEach(link => { // Directly target links in sidebar
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default anchor behavior
                    const page = e.target.parentNode.getAttribute('data-page'); // Get data-page from the parent li
                    if (page) {
                        this.navigateTo(page);
                    }
                });
            });
        },

        // Navigate to a specific page
        navigateTo: function(page) {
            window.location.hash = page;
        },

        // Load page based on URL hash or default
        loadPageOnStartup: function() {
            const initialPage = window.location.hash ? window.location.hash.substring(1) : 'bubble-sort';
            this.loadPage(initialPage);
        },

        // Load page based on URL hash
        loadPageFromHash: function() {
            const page = window.location.hash.substring(1) || 'bubble-sort';
            this.loadPage(page);
        },

        // Load page content from external file
        loadPage: async function(page) {
            // Show loading indicator
            document.getElementById('loading').style.display = 'block';
            document.getElementById('page-content').style.display = 'none';
            document.getElementById('page-content').className = 'page'; // Reset transition class

            try {
                // Fetch the page content
                const response = await fetch(`pages/${page}.html`);

                if (!response.ok) {
                    throw new Error('Page not found');
                }

                const content = await response.text();

                // Update the page content
                document.getElementById('page-content').innerHTML = content;

                // Update active state in sidebar
                this.updateActiveNavItem(page);

                // Store current page
                this.currentPage = page;

                // Hide loading indicator and show content with transition
                document.getElementById('loading').style.display = 'none';
                document.getElementById('page-content').classList.add('active');
                document.getElementById('page-content').style.display = 'block';


            } catch (error) {
                console.error('Failed to load page:', error);

                // Load error page or fallback
                document.getElementById('page-content').innerHTML = `
                    <h1>Page Not Found</h1>
                    <p>The requested page could not be loaded.</p>
                    <a href="#bubble-sort">Return to Algorithms</a>
                `;

                document.getElementById('loading').style.display = 'none';
                document.getElementById('page-content').classList.add('active');
                document.getElementById('page-content').style.display = 'block';
            }
        },

        // Update active navigation item
        updateActiveNavItem: function(page) {
            document.querySelectorAll('#sidebar li').forEach(item => { // Target li elements in sidebar
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