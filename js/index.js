 
       // Mobile Sidebar Implementation
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const dropdownToggles = document.querySelectorAll('.sidebar-dropdown-toggle');
        
        // Toggle mobile sidebar
        function toggleSidebar() {
            mobileSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            document.body.style.overflow = mobileSidebar.classList.contains('active') ? 'hidden' : '';
        }
        
        mobileMenuBtn.addEventListener('click', toggleSidebar);
        sidebarClose.addEventListener('click', toggleSidebar);
        sidebarOverlay.addEventListener('click', toggleSidebar);
        
        // Handle sidebar dropdowns
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdownId = toggle.getAttribute('data-dropdown');
                const dropdown = document.getElementById(`${dropdownId}-dropdown`);
                
                // Close all other dropdowns
                document.querySelectorAll('.sidebar-dropdown.active').forEach(d => {
                    if (d.id !== `${dropdownId}-dropdown`) {
                        d.classList.remove('active');
                        // Reset icon rotation for other dropdowns
                        const otherToggle = document.querySelector(`[data-dropdown="${d.id.replace('-dropdown', '')}"]`);
                        if (otherToggle) {
                            const otherIcon = otherToggle.querySelector('.fa-chevron-down');
                            if (otherIcon) otherIcon.style.transform = 'rotate(0)';
                        }
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                
                // Toggle icon rotation
                const icon = toggle.querySelector('.fa-chevron-down');
                if (dropdown.classList.contains('active')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0)';
                }
            });
        });

        // Free Trial Banner - Show once with animation
        const freeTrialBanner = document.getElementById('freeTrialBanner');
        const closeBanner = document.getElementById('closeBanner');
        
        // Check if banner was already shown
        const bannerShown = localStorage.getItem('bannerShown');
        
        if (!bannerShown) {
            // Show banner after 2 seconds with animation
            setTimeout(() => {
                freeTrialBanner.classList.add('show');
            }, 2000);
        } else {
            // Hide banner if already shown
            freeTrialBanner.style.display = 'none';
        }
        
        closeBanner.addEventListener('click', () => {
            freeTrialBanner.classList.remove('show');
            setTimeout(() => {
                freeTrialBanner.style.display = 'none';
            }, 500);
            // Mark banner as shown
            localStorage.setItem('bannerShown', 'true');
        });

        // Dropdown functionality with slide animation
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            // Set initial styles for animation
            menu.style.display = 'block';
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-20px)';
            menu.style.transition = 'all 0.3s ease';
            
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close all other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown && d.classList.contains('active')) {
                        d.classList.remove('active');
                        const dMenu = d.querySelector('.dropdown-menu');
                        dMenu.style.opacity = '0';
                        dMenu.style.visibility = 'hidden';
                        dMenu.style.transform = 'translateY(-20px)';
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
                
                if (dropdown.classList.contains('active')) {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                } else {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-20px)';
                }
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            dropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('active')) {
                    dropdown.classList.remove('active');
                    const menu = dropdown.querySelector('.dropdown-menu');
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-20px)';
                }
            });
        });
        
        // Prevent dropdown menu clicks from closing the dropdown
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Theme handling
        document.querySelectorAll('.theme-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = item.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
        });

        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Initialize auth state listener
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                document.getElementById('guest-content').style.display = 'none';
                document.getElementById('user-content').style.display = 'block';
                document.getElementById('sidebar-guest-content').style.display = 'none';
                document.getElementById('sidebar-user-content').style.display = 'block';
                
                // Fetch user data
                firebase.database().ref('users/' + user.uid).once('value')
                    .then((snapshot) => {
                        const userData = snapshot.val();
                        if (userData) {
                            document.getElementById('userName').textContent = userData.username;
                            
                            // Check for WCA profile
                            if (userData.wcaId) {
                                const wcaImageUrl = `https://www.worldcubeassociation.org/uploads/user/${userData.wcaId}.jpg`;
                                document.getElementById('userAvatar').src = wcaImageUrl;
                            }
                        }
                    });
            } else {
                document.getElementById('guest-content').style.display = 'block';
                document.getElementById('user-content').style.display = 'none';
                document.getElementById('sidebar-guest-content').style.display = 'block';
                document.getElementById('sidebar-user-content').style.display = 'none';
            }
        });

        // Add floating animation to some elements
        document.querySelectorAll('.card-icon').forEach(icon => {
            icon.classList.add('floating');
        });