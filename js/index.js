

    // Mobile menu functionality
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Theme access and lock functionality
    function handleThemeClick(event) {
        const themeLink = event.currentTarget;
        if (themeLink.classList.contains('locked')) {
            event.preventDefault();
            alert('This theme is only available for premium users. Upgrade to Pro to unlock all themes!');
            return;
        }
    }
    

    function updateThemeAccess(userRole) {
        const premiumThemes = document.querySelectorAll('.premium-theme');
        premiumThemes.forEach(theme => {
            if (userRole === 'pro_user' || userRole === 'admin') {
                theme.classList.remove('locked');
                theme.setAttribute('onclick', `setTheme('${theme.dataset.theme}')`);
                const lockIcon = theme.querySelector('.fa-lock');
                if (lockIcon) {
                    lockIcon.remove();
                }
            } else {
                theme.classList.add('locked');
                theme.removeAttribute('onclick');
                theme.addEventListener('click', handleThemeClick);
                if (!theme.querySelector('.fa-lock')) {
                    theme.innerHTML += ' <i class="fas fa-lock"></i>';
                }
            }
        });
    }

    // Update UI based on user role
    function updateUIForRole(userRole) {
        // Update body class for pro styling
        document.body.classList.toggle('pro-user', userRole === 'pro_user' || userRole === 'admin');

        // Update pro button
        const proButtonContainer = document.getElementById('pro-button-container');
        if (proButtonContainer) {
            if (!userRole || userRole === 'free_user') {
                proButtonContainer.innerHTML = `
                    <a href="pricing/pricing" class="header-btn pro-btn">
                        <i class="fas fa-crown"></i>
                        <span>Free User</span>
                    </a>`;
            } else if (userRole === 'pro_user') {
                proButtonContainer.innerHTML = `
                    <div class="header-btn pro-btn">
                        <i class="fas fa-crown"></i>
                        <span>Pro User</span>
                    </div>`;
            } else if (userRole === 'admin') {
                proButtonContainer.innerHTML = `
                    <div class="header-btn pro-btn">
                        <i class="fas fa-crown"></i>
                        <span>Admin</span>
                    </div>`;
            }
        }

        // Update theme access
        updateThemeAccess(userRole);
    }

    // Update pro button based on user role
    function updateProButton(userRole) {
        const proButtonContainer = document.getElementById('pro-button-container');
        if (proButtonContainer) {
            if (!userRole || userRole === 'free_user') {
                proButtonContainer.innerHTML = `
                    <a href="pricing/pricing" class="header-btn pro-btn">
                        <i class="fas fa-crown"></i>
                        <span>Free User</span>
                    </a>`;
            } else if (userRole === 'pro_user') {
                proButtonContainer.innerHTML = `
                    <div class="header-btn pro-btn">
                        <i class="fas fa-crown"></i>
                        <span>Pro User</span>
                    </div>`;
            } else if (userRole === 'admin') {
                proButtonContainer.innerHTML = `
                    <div class="header-btn pro-btn">
                        <i class="fas fa-crown"></i>
                        <span>Admin</span>
                    </div>`;
            }
        }
    }

    // Show coming soon message
    function showComingSoonMessage() {
        const userRole = localStorage.getItem('userRole') || 'guest';
        if (userRole === 'pro_user' || userRole === 'admin') {
            alert('Welcome Pro User! You\'ll get early access to this feature. We\'ll notify you as soon as it\'s ready!');
        } else {
            alert('This feature is coming soon! Upgrade to Pro to get early access when available.');
        }
    }

    // Sign out functionality
    function signOut() {
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('userRole');
            window.location.href = 'index';
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }

    // Dropdown functionality
    document.querySelectorAll('.dropdown button').forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
        });

        // Remove active class when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                button.classList.remove('active');
            }
        });
    });

    // Firebase auth state observer
    firebase.auth().onAuthStateChanged((user) => {
        const avatarContainer = document.getElementById('nav-footer-avatar');
        const guestContent = document.getElementById('guest-content');
        const userContent = document.getElementById('user-content');
        const guestFooterContent = document.getElementById('guest-footer-content');
        const userFooterContent = document.getElementById('user-footer-content');

        if (user) {
            // Fetch user data and WCA profile
            Promise.all([
                firebase.database().ref('users/' + user.uid).once('value'),
                firebase.database().ref('wca_profiles/' + user.uid).once('value')
            ]).then(([userSnapshot, wcaSnapshot]) => {
                const userData = userSnapshot.val();
                const wcaData = wcaSnapshot.val();

                if (userData) {
                    // Show avatar container and update UI
                    if (avatarContainer) avatarContainer.style.display = 'block';
                    const userNameElement = document.getElementById('userName');
                    if (userNameElement) userNameElement.textContent = userData.username || user.email;
                    if (guestContent) guestContent.style.display = 'none';
                    if (userContent) userContent.style.display = 'block';
                    if (guestFooterContent) guestFooterContent.style.display = 'none';
                    if (userFooterContent) userFooterContent.style.display = 'block';

                    // Update avatar if WCA ID exists
                    if (wcaData && wcaData.wcaId) {
                        const avatarUrl = `https://www.worldcubeassociation.org/uploads/user/${wcaData.wcaId}.jpg`;
                        const avatarImg = document.getElementById('userAvatar');
                        if (avatarImg) {
                            avatarImg.src = avatarUrl;
                            avatarImg.onerror = function() {
                                this.src = 'img/noprof.png';
                            };
                        }
                    }
                }
            }).catch((error) => {
                console.error('Error fetching user data:', error);
            });

            // Fetch user role and update UI
            firebase.database().ref('users/' + user.uid + '/role').once('value')
                .then((snapshot) => {
                    const userRole = snapshot.val() || 'free_user';
                    localStorage.setItem('userRole', userRole);
                    updateUIForRole(userRole);
                    updateProButton(userRole);
                })
                .catch((error) => {
                    console.error('Error fetching user role:', error);
                });
        } else {
            // Hide avatar container and reset UI for guests
            if (avatarContainer) avatarContainer.style.display = 'none';
            if (guestContent) guestContent.style.display = 'block';
            if (userContent) userContent.style.display = 'none';
            if (guestFooterContent) guestFooterContent.style.display = 'block';
            if (userFooterContent) userFooterContent.style.display = 'none';

            // Reset user role
            localStorage.removeItem('userRole');
            updateUIForRole('guest');
            updateProButton(null);
        }
    });

    // Listen for avatar updates from profile
    window.addEventListener('message', function(event) {
        if (event.data.type === 'avatarUpdate') {
            const avatarImg = document.getElementById('userAvatar');
            if (avatarImg) {
                avatarImg.src = event.data.avatarUrl;
            }
        }
    });

    // Navigation functions
    function navigateToProfile() {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('Please log in to view your profile');
            return;
        }
        window.location.href = 'profile';
    }

    function navigateToSettings() {
        window.location.href = 'settings';
    }
