document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');

    const toggleSidebar = () => {
        mobileSidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when a link is clicked
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileSidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
    });

    // User Profile Dropdown
    const userContent = document.getElementById('user-content');
    if (userContent) {
        const dropdown = userContent.querySelector('.dropdown');
        const dropdownToggle = userContent.querySelector('.dropdown-toggle');

        if (dropdown && dropdownToggle) {
            dropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling up to document
                dropdown.classList.toggle('active');
            });

            // Close dropdown if clicked outside
            document.addEventListener('click', (e) => {
                if (dropdown.classList.contains('active') && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    }
});