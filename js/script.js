document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const headerControls = document.querySelector('.header-controls');
    const menuOverlay = document.querySelector('.menu-overlay');

    menuToggle.addEventListener('click', function() {
        headerControls.classList.toggle('active');
        menuOverlay.classList.toggle('active');
    });

    menuOverlay.addEventListener('click', function() {
        headerControls.classList.remove('active');
        menuOverlay.classList.remove('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!headerControls.contains(e.target) && !menuToggle.contains(e.target)) {
            headerControls.classList.remove('active');
            menuOverlay.classList.remove('active');
        }
    });

    // Add dropdown toggle functionality for mobile
    document.querySelectorAll('.header-controls .dropdown').forEach(dropdown => {
        const button = dropdown.querySelector('button');
        button.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.header-controls .dropdown.active').forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.header-controls .dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});