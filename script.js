// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Update navigation and scroll progress on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    
    // Update navbar background
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(12, 12, 12, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(12, 12, 12, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Update scroll progress bar
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    
    if (scrollProgressBar) {
        scrollProgressBar.style.width = scrollPercent + '%';
    }
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('aos-animate');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Pricing plan selection
function selectPlan(planType) {
    const plans = {
        starter: {
            name: 'Starter Plan',
            price: 'Free',
            description: '1 page website with basic features'
        },
        professional: {
            name: 'Professional Plan',
            price: '€29.95',
            description: 'Up to 3 pages with advanced features'
        },
        enterprise: {
            name: 'Enterprise Plan',
            price: '€59.95',
            description: 'Up to 10 pages with premium features'
        }
    };
    
    const selectedPlan = plans[planType];
    
    // Update the contact form service dropdown
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.value = planType;
        
        // Scroll to contact form
        scrollToSection('contact');
        
        // Add visual feedback
        const contactSection = document.getElementById('contact');
        contactSection.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
        
        setTimeout(() => {
            contactSection.style.background = 'linear-gradient(135deg, #2d2d2d 0%, #0c0c0c 100%)';
        }, 2000);
    }
    
    // Show notification
    showNotification(`${selectedPlan.name} selected! Please fill out the contact form below.`);
}



// Hosting selection
function selectHosting() {
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.value = 'hosting';
        scrollToSection('contact');
    }
    
    showNotification('HTML Hosting selected! Please fill out the contact form below.');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 1500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Contact form handling with Formspree
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!data.name || !data.email || !data.service || !data.message) {
        showNotification('Please fill in all fields.');
        return;
    }
    
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        // Submit to Formspree
        const response = await fetch('https://formspree.io/f/mnnzpran', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Reset form
            contactForm.reset();
            
            // Show success modal
            showModal();
            
            console.log('Form submitted successfully to Formspree');
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('There was an error sending your message. Please try again.');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// Modal functions
function showModal() {
    successModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    successModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.style.display === 'block') {
        closeModal();
    }
});

// Pricing card hover effects
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
    });
    
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        } else {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        }
    });
});

// Service card interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (rect.width / 2 - size / 2) + 'px';
        ripple.style.top = (rect.height / 2 - size / 2) + 'px';
        
        card.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .service-card {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        setTimeout(() => {
            typeWriter(heroTitle, originalText.replace(/<[^>]*>/g, ''), 50);
        }, 1000);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Add smooth reveal animation for sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.8s ease';
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    sectionObserver.observe(section);
});

// Add counter animation for pricing
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Initialize counters when pricing section is visible
const pricingSection = document.getElementById('pricing');
let countersAnimated = false;

const pricingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            const counters = entry.target.querySelectorAll('.amount');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent);
                animateCounter(counter, target);
            });
            countersAnimated = true;
        }
    });
}, {
    threshold: 0.5
});

if (pricingSection) {
    pricingObserver.observe(pricingSection);
}

// Initialize About section stats animation
const aboutSection = document.getElementById('about');
let aboutStatsAnimated = false;

const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !aboutStatsAnimated) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(statNumber => {
                const target = parseInt(statNumber.getAttribute('data-target'));
                animateCounter(statNumber, target, 2500);
            });
            aboutStatsAnimated = true;
        }
    });
}, {
    threshold: 0.3
});

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// FAQ Accordion Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
                
                // Smooth scroll to keep the question in view
                setTimeout(() => {
                    const rect = question.getBoundingClientRect();
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    
                    if (rect.top < navHeight + 20) {
                        window.scrollTo({
                            top: window.pageYOffset + rect.top - navHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }, 300);
            }
        });
        
        // Add keyboard accessibility
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Make question focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        // Update aria-expanded when toggled
        const observer = new MutationObserver(() => {
            const isActive = item.classList.contains('active');
            question.setAttribute('aria-expanded', isActive.toString());
        });
        
        observer.observe(item, { attributes: true, attributeFilter: ['class'] });
    });
}

// Initialize FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFAQ);

// FAQ Search Functionality (bonus feature)
function createFAQSearch() {
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;
    
    // Create search input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'faq-search';
    searchContainer.innerHTML = `
        <div class="search-input-container">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search FAQ..." id="faqSearch">
            <button type="button" id="clearSearch" style="display: none;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add search styles
    const searchStyles = `
        .faq-search {
            margin-bottom: 2rem;
        }
        
        .search-input-container {
            position: relative;
            max-width: 400px;
            margin: 0 auto;
        }
        
        .search-input-container i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
        }
        
        #faqSearch {
            width: 100%;
            padding: 12px 45px 12px 45px;
            background: var(--card-gradient);
            border: 1px solid var(--border-color);
            border-radius: 25px;
            color: var(--text-primary);
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        #faqSearch:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        #clearSearch {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        #clearSearch:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-primary);
        }
        
        .faq-item.hidden {
            display: none;
        }
        
        .no-results {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
            font-style: italic;
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = searchStyles;
    document.head.appendChild(styleSheet);
    
    // Insert search before FAQ container
    faqContainer.parentNode.insertBefore(searchContainer, faqContainer);
    
    // Search functionality
    const searchInput = document.getElementById('faqSearch');
    const clearButton = document.getElementById('clearSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        let visibleCount = 0;
        
        // Show/hide clear button
        clearButton.style.display = searchTerm ? 'block' : 'none';
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
                item.classList.remove('active'); // Close if hidden
            }
        });
        
        // Show/hide no results message
        let noResultsMsg = document.querySelector('.no-results');
        if (visibleCount === 0 && searchTerm) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results';
                noResultsMsg.textContent = 'No FAQ items match your search. Try different keywords.';
                faqContainer.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
    
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
    });
}

// Initialize FAQ search
document.addEventListener('DOMContentLoaded', createFAQSearch);

// Cookies Banner Functionality
class CookieManager {
    constructor() {
        this.cookieName = 'webcraft_cookie_preferences';
        this.banner = document.getElementById('cookiesBanner');
        this.settingsModal = document.getElementById('cookieSettingsModal');
        this.preferences = this.loadPreferences();
        
        this.init();
    }
    
    init() {
        // Show banner if no preferences are saved
        if (!this.preferences) {
            this.showBanner();
        }
        
        // Load saved preferences into settings modal
        this.updateSettingsModal();
        
        // Add event listeners
        this.addEventListeners();
    }
    
    showBanner() {
        if (this.banner) {
            setTimeout(() => {
                this.banner.classList.add('show');
            }, 1000); // Show after 1 second
        }
    }
    
    hideBanner() {
        if (this.banner) {
            this.banner.classList.remove('show');
        }
    }
    
    loadPreferences() {
        try {
            const saved = localStorage.getItem(this.cookieName);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.warn('Could not load cookie preferences:', e);
            return null;
        }
    }
    
    savePreferences(preferences) {
        try {
            localStorage.setItem(this.cookieName, JSON.stringify({
                ...preferences,
                timestamp: Date.now(),
                version: '1.0'
            }));
            this.preferences = preferences;
            this.applyPreferences();
        } catch (e) {
            console.warn('Could not save cookie preferences:', e);
        }
    }
    
    applyPreferences() {
        if (!this.preferences) return;
        
        // Apply analytics cookies
        if (this.preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Apply marketing cookies
        if (this.preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
        
        console.log('Cookie preferences applied:', this.preferences);
    }
    
    enableAnalytics() {
        // Placeholder for analytics initialization
        // In a real implementation, you would initialize Google Analytics, etc.
        console.log('Analytics cookies enabled');
    }
    
    disableAnalytics() {
        // Placeholder for analytics cleanup
        console.log('Analytics cookies disabled');
    }
    
    enableMarketing() {
        // Placeholder for marketing cookies
        console.log('Marketing cookies enabled');
    }
    
    disableMarketing() {
        // Placeholder for marketing cleanup
        console.log('Marketing cookies disabled');
    }
    
    updateSettingsModal() {
        if (!this.preferences) return;
        
        const analyticsCheckbox = document.getElementById('analyticsCookies');
        const marketingCheckbox = document.getElementById('marketingCookies');
        
        if (analyticsCheckbox) {
            analyticsCheckbox.checked = this.preferences.analytics || false;
        }
        
        if (marketingCheckbox) {
            marketingCheckbox.checked = this.preferences.marketing || false;
        }
    }
    
    addEventListeners() {
        // Close settings modal when clicking outside
        if (this.settingsModal) {
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) {
                    this.closeSettings();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.settingsModal && this.settingsModal.style.display === 'block') {
                    this.closeSettings();
                }
            }
        });
    }
    
    acceptAll() {
        const preferences = {
            essential: true,
            analytics: true,
            marketing: true
        };
        
        this.savePreferences(preferences);
        this.hideBanner();
        this.showNotification('All cookies accepted. Thank you!', 'success');
    }
    
    acceptEssential() {
        const preferences = {
            essential: true,
            analytics: false,
            marketing: false
        };
        
        this.savePreferences(preferences);
        this.hideBanner();
        this.showNotification('Essential cookies only. Preferences saved!', 'info');
    }
    
    showSettings() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const firstInput = this.settingsModal.querySelector('input, button');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }
    
    closeSettings() {
        if (this.settingsModal) {
            this.settingsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    saveCustomPreferences() {
        const analyticsCheckbox = document.getElementById('analyticsCookies');
        const marketingCheckbox = document.getElementById('marketingCookies');
        
        const preferences = {
            essential: true, // Always true
            analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
            marketing: marketingCheckbox ? marketingCheckbox.checked : false
        };
        
        this.savePreferences(preferences);
        this.closeSettings();
        this.hideBanner();
        this.showNotification('Cookie preferences saved successfully!', 'success');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `cookie-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 2500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    // Method to check if specific cookie type is allowed
    isAllowed(type) {
        if (!this.preferences) return false;
        return this.preferences[type] || false;
    }
    
    // Method to manually show banner (for testing or re-consent)
    resetConsent() {
        localStorage.removeItem(this.cookieName);
        this.preferences = null;
        this.showBanner();
    }
}

// Global functions for HTML onclick handlers
function acceptAllCookies() {
    if (window.cookieManager) {
        window.cookieManager.acceptAll();
    }
}

function acceptEssentialCookies() {
    if (window.cookieManager) {
        window.cookieManager.acceptEssential();
    }
}

function showCookieSettings() {
    if (window.cookieManager) {
        window.cookieManager.showSettings();
    }
}

function closeCookieSettings() {
    if (window.cookieManager) {
        window.cookieManager.closeSettings();
    }
}

function saveCookiePreferences() {
    if (window.cookieManager) {
        window.cookieManager.saveCustomPreferences();
    }
}

// Initialize cookie manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieManager();
});

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.canvas = document.getElementById('mouseTrail');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.maxParticles = 15;
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        this.bindEvents();
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Create new particle
            this.particles.push({
                x: this.mouse.x,
                y: this.mouse.y,
                size: Math.random() * 8 + 4,
                life: 1,
                decay: Math.random() * 0.02 + 0.02,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
            
            // Remove excess particles
            if (this.particles.length > this.maxParticles) {
                this.particles.shift();
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update particle
            particle.life -= particle.decay;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.size *= 0.98;
            
            // Remove dead particles
            if (particle.life <= 0 || particle.size < 0.5) {
                this.particles.splice(i, 1);
                continue;
            }
            
            // Draw particle with gradient
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            
            // Use site's gradient colors with opacity based on life
            const alpha = particle.life * 0.8;
            gradient.addColorStop(0, `rgba(102, 126, 234, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(118, 75, 162, ${alpha * 0.6})`);
            gradient.addColorStop(1, `rgba(102, 126, 234, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize mouse trail when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MouseTrail();
});

// Add cookie notification styles
const cookieNotificationStyles = `
    .cookie-notification .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .cookie-notification i {
        font-size: 1.2rem;
    }
`;

const cookieStyleSheet = document.createElement('style');
cookieStyleSheet.textContent = cookieNotificationStyles;
document.head.appendChild(cookieStyleSheet);
