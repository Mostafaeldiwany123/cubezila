class CustomDropdown {
    constructor(select) {
        this.originalSelect = select;
        if (select.id === 'sessionSelector') {
            return; // Don't initialize for session selector
        }
        this.init();
    }

    init() {
        this.createDropdown();
        this.originalSelect.style.display = 'none';
        this.setupEventListeners();
        this.updateValue(this.originalSelect.value);
    }

    createDropdown() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'custom-select-wrapper';
        
        this.trigger = document.createElement('button');
        this.trigger.className = 'custom-select-trigger';
        
        this.selectedText = document.createElement('span');
        this.selectedText.className = 'selected-text';
        
        this.icon = document.createElement('i');
        this.icon.className = 'fas fa-chevron-down';
        
        this.trigger.appendChild(this.selectedText);
        this.trigger.appendChild(this.icon);
        
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'custom-select-dropdown';
        
        this.optionsList = document.createElement('ul');
        this.optionsList.className = 'custom-select-options';
        
        Array.from(this.originalSelect.options).forEach(option => {
            const li = document.createElement('li');
            li.dataset.value = option.value;
            li.textContent = option.text;
            // Apply the font family to the option text if it's a font selector
            if (this.originalSelect.id === 'timerFont' || 
                this.originalSelect.id === 'scrambleFont' || 
                this.originalSelect.id === 'rootFont') {
                li.style.fontFamily = option.value;
            }
            if (option.selected) li.classList.add('selected');
            this.optionsList.appendChild(li);
        });
        
        // Also apply the font to the trigger text for font selectors
        if (this.originalSelect.id === 'timerFont' || 
            this.originalSelect.id === 'scrambleFont' || 
            this.originalSelect.id === 'rootFont') {
            this.selectedText.style.fontFamily = this.originalSelect.value;
        }
        
        this.dropdown.appendChild(this.optionsList);
        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.dropdown);
        
        this.originalSelect.parentNode.insertBefore(this.wrapper, this.originalSelect.nextSibling);
        
        // Add tools-dropdown class if it's a tools select
        if (this.originalSelect.classList.contains('tools-select')) {
            this.wrapper.classList.add('tools-dropdown');
        }
    }

    setupEventListeners() {
        this.trigger.addEventListener('click', () => this.toggle());
        
        this.optionsList.addEventListener('click', (e) => {
            const option = e.target.closest('li');
            if (!option) return;
            
            this.updateValue(option.dataset.value);
            this.close();
            
            // Trigger change event on original select
            this.originalSelect.value = option.dataset.value;
            this.originalSelect.dispatchEvent(new Event('change'));
        });
        
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) this.close();
        });
    }

    toggle() {
        this.wrapper.classList.toggle('open');
    }

    close() {
        this.wrapper.classList.remove('open');
    }

    updateValue(value) {
        const option = this.originalSelect.querySelector(`option[value="${value}"]`);
        if (!option) return;
        
        this.selectedText.textContent = option.text;
        
        // Update font family for font selectors
        if (this.originalSelect.id === 'timerFont' || 
            this.originalSelect.id === 'scrambleFont' || 
            this.originalSelect.id === 'rootFont') {
            this.selectedText.style.fontFamily = value;
        }
        
        Array.from(this.optionsList.children).forEach(li => {
            li.classList.toggle('selected', li.dataset.value === value);
        });
    }
}

// Initialize dropdowns after DOM load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('select').forEach(select => {
        if (select.id !== 'sessionSelector' ) {
            new CustomDropdown(select);
        }
    });
});
