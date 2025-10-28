// Navigation configuration
const NAV_CONFIG = {
    items: [
        {
            icon: 'fas fa-home',
            tooltip: 'Home',
            link: '../index.html',
            ariaLabel: 'Navigate to Home page'
        },
        {
            icon: 'fas fa-cubes',
            tooltip: 'Tools Dashboard',
            link: 'tools.html',
            ariaLabel: 'Navigate to Tools Dashboard'
        },
        {
            icon: 'fas fa-exchange-alt',
            tooltip: 'Algorithm Inverter',
            link: 'inverter.html',
            ariaLabel: 'Navigate to Algorithm Inverter'
        },
        {
            icon: 'fas fa-arrows-h',
            tooltip: 'Right to Left Converter',
            link: 'right2left.html',
            ariaLabel: 'Navigate to Right to Left Converter'
        }
    ],
    theme: {
        background: '#1a1a1acc',
        hoverBackground: '#2a2a2acc',
        textColor: '#ffffff',
        accentColor: '#3498db'
    }
};

// Styles for the navigation
const STYLES = `
    .nav-labels {
        position: fixed;
        left: -60px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        background-color: ${NAV_CONFIG.theme.background};
        padding: 15px 10px;
        border-radius: 0 10px 10px 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .nav-labels::after {
        content: '›';
        position: absolute;
        right: -30px;
        top: 50%;
        transform: translateY(-50%);
        color: ${NAV_CONFIG.theme.textColor};
        font-size: 24px;
        width: 30px;
        height: 50px;
        background: ${NAV_CONFIG.theme.background};
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0 8px 8px 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
    }
    
    .nav-labels:hover,
    .nav-labels.active {
        left: 0;
        background-color: ${NAV_CONFIG.theme.hoverBackground};
    }
    
    .nav-labels:hover::after,
    .nav-labels.active::after {
        transform: translateY(-50%) rotate(180deg);
        background-color: ${NAV_CONFIG.theme.hoverBackground};
    }
    
    .nav-label {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        z-index: 1000;
        margin: 12px 0;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 8px;
    }
    
    .nav-label:hover {
        transform: scale(1.1);
        background-color: ${NAV_CONFIG.theme.accentColor}33;
    }
    
    .nav-label i {
        color: ${NAV_CONFIG.theme.textColor};
        font-size: 18px;
        transition: color 0.2s ease;
    }
    
    .nav-label:hover i {
        color: ${NAV_CONFIG.theme.accentColor};
    }
    
    .nav-label .tooltip {
        position: absolute;
        left: 50px;
        background-color: ${NAV_CONFIG.theme.background};
        color: ${NAV_CONFIG.theme.textColor};
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 14px;
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateX(-10px);
    }
    
    .nav-label:hover .tooltip {
        opacity: 1;
        transform: translateX(0);
    }

    .nav-label.active {
        background-color: ${NAV_CONFIG.theme.accentColor}33;
    }

    .nav-label.active i {
        color: ${NAV_CONFIG.theme.accentColor};
    }

    @media (max-width: 768px) {
        .nav-labels {
            left: -50px;
            padding: 10px 8px;
        }

        .nav-label {
            width: 35px;
            height: 35px;
            margin: 10px 0;
        }

        .nav-label i {
            font-size: 16px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .nav-labels,
        .nav-label,
        .tooltip {
            transition: none !important;
        }
    }
`;

class NavigationLabels {
    constructor() {
        this.container = null;
        this.isActive = false;
        this.init();
    }

    init() {
        this.createStyles();
        this.loadFontAwesome();
        this.createContainer();
        this.createNavigationItems();
        this.setupEventListeners();
    }

    createStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = STYLES;
        document.head.appendChild(styleSheet);
    }

    loadFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
        }
    }

    createContainer() {
        this.container = document.createElement('nav');
        this.container.className = 'nav-labels';
        this.container.setAttribute('role', 'navigation');
        this.container.setAttribute('aria-label', 'Main navigation');
        document.body.appendChild(this.container);
    }

    createNavigationItems() {
        NAV_CONFIG.items.forEach(item => {
            const navLabel = document.createElement('div');
            navLabel.className = 'nav-label';
            navLabel.setAttribute('role', 'button');
            navLabel.setAttribute('aria-label', item.ariaLabel);
            navLabel.setAttribute('tabindex', '0');
            navLabel.setAttribute('data-link', item.link);
            
            navLabel.innerHTML = `
                <i class="${item.icon}" aria-hidden="true"></i>
                <span class="tooltip" role="tooltip">${item.tooltip}</span>
            `;

            navLabel.addEventListener('click', () => window.location.href = item.link);
            navLabel.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    window.location.href = item.link;
                }
            });

            this.container.appendChild(navLabel);
        });

        // Highlight current page after creating items
        this.highlightCurrentPage();
    }

    setupEventListeners() {
        // Toggle navigation on click of the arrow
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container || e.target.closest('.nav-labels::after')) {
                this.toggleNavigation();
            }
        });

        // Close navigation when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-labels') && this.isActive) {
                this.toggleNavigation();
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.toggleNavigation();
            }
        });
    }

    toggleNavigation() {
        this.isActive = !this.isActive;
        this.container.classList.toggle('active', this.isActive);
    }

    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLabels = this.container.querySelectorAll('.nav-label');
        
        navLabels.forEach(label => {
            const link = label.getAttribute('data-link');
            if (link && currentPath.includes(link)) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => new NavigationLabels());
