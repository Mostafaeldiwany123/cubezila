document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const navLinks = document.querySelectorAll('.sidebar-link');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');

    // Function to toggle sidebar
    const toggleSidebar = () => {
        mobileSidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    };

    // Mobile menu open
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }

    // Mobile menu close
    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when overlay is clicked
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileSidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    // Dropdown toggle for user profile
    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (dropdown && !dropdown.contains(event.target) && !dropdownToggle.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});