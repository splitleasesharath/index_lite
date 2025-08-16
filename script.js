// Split Lease Clone - Interactive JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupDaySelectors();
    setupScheduleControls();
    setupListings();
    setupSupport();
    setupReferral();
    setupAnimations();
    setupAuthModal();
    setupHeroDaySelector();
    setupFooterNavigation();
}

// Navigation Functionality
function setupNavigation() {
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    // Hide/Show header on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Day Selector Functionality - REMOVED (schedule cards are display-only)
function setupDaySelectors() {
    // Schedule cards are now display-only with animation controls
    // Day selection is only available in the hero section
    // This function is kept for backwards compatibility but does nothing
}

// Update schedule display based on selected days
function updateScheduleDisplay(scheduleCard) {
    if (!scheduleCard) return;
    
    const activeDays = scheduleCard.querySelectorAll('.day-badge.active');
    const dayMap = {
        'S': ['Sunday', 'Saturday'],
        'M': 'Monday',
        'T': ['Tuesday', 'Thursday'],
        'W': 'Wednesday',
        'F': 'Friday'
    };
    
    // Create schedule summary
    let selectedDays = [];
    activeDays.forEach(day => {
        const dayText = day.textContent;
        if (dayMap[dayText]) {
            if (Array.isArray(dayMap[dayText])) {
                selectedDays = selectedDays.concat(dayMap[dayText]);
            } else {
                selectedDays.push(dayMap[dayText]);
            }
        }
    });
    
    // Show toast notification with selected days
    if (selectedDays.length > 0) {
        showToast(`Selected days: ${selectedDays.join(', ')}`);
    }
}

// Schedule Controls (removed - no longer using animations)
function setupScheduleControls() {
    // Schedule cards are now static visual representations
    // No animation controls needed
}

// Removed animation-related functions since we're using static visuals now

// Listings Functionality
function setupListings() {
    const exploreButtons = document.querySelectorAll('.explore-btn');
    const ctaButtons = document.querySelectorAll('.cta-button');
    const showMoreBtn = document.querySelector('.show-more-btn');
    
    // Handle schedule explore buttons
    exploreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.toLowerCase();
            
            if (buttonText.includes('weekend') || buttonText.includes('weeks of the month')) {
                // Weekend/weeks schedule: Fri-Sun + Mon-Tue (days 6,0,1,2)
                redirectToSearch('6,7,1,2', 'weekends');
            } else if (buttonText.includes('weeknight')) {
                // Weeknight schedule: Mon-Fri (days 2,3,4,5,6)  
                redirectToSearch('2,3,4,5,6', 'weeknights');
            } else {
                // Default explore action
                redirectToSearch('1,2,3,4,5', 'default');
            }
        });
    });
    
    // Handle general CTA buttons
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Use the hero day selector selection if available
            if (typeof selectedDays !== 'undefined' && selectedDays.length > 0) {
                exploreRentals();
            } else {
                // Default to weeknight schedule
                redirectToSearch('1,2,3,4,5', 'default');
            }
        });
    });
    
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            // Use current day selection if available, otherwise default to all days
            const daysParam = (typeof selectedDays !== 'undefined' && selectedDays.length > 0) 
                ? selectedDays.join(',') 
                : '1,2,3,4,5,6';
            
            const searchUrl = `https://www.split.lease/search?days-selected=${daysParam}`;
            
            showToast('Loading more rentals...');
            
            setTimeout(() => {
                window.open(searchUrl, '_blank');
            }, 1000);
        });
    }
    
    // Add click handlers to listing cards
    const listingCards = document.querySelectorAll('.listing-card');
    listingCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            
            // Property IDs from the original site
            const propertyIds = [
                '1586447992720x748691103167545300', // One Platt | Studio
                '1586449069262x103395043556966670'  // Pied-à-terre
            ];
            
            const propertyId = propertyIds[index] || propertyIds[0];
            
            // Use current day selection if available, otherwise default to weeknights
            const daysParam = (typeof selectedDays !== 'undefined' && selectedDays.length > 0) 
                ? selectedDays.join(',') 
                : '1,2,3,4,5';
            
            const propertyUrl = `https://www.split.lease/view-split-lease/${propertyId}?days-selected=${daysParam}`;
            
            showToast(`Opening ${title}...`);
            
            setTimeout(() => {
                window.open(propertyUrl, '_blank');
            }, 1000);
        });
    });
}

// Load more listings dynamically
function loadMoreListings() {
    const listingsGrid = document.querySelector('.listings-grid');
    const showMoreBtn = document.querySelector('.show-more-btn');
    
    // Show loading state
    showMoreBtn.textContent = 'Loading...';
    showMoreBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Sample new listings data
        const newListings = [
            {
                title: 'Luxury Downtown Loft',
                description: '1 bedroom • 1 bed • 1 bathroom • Gym Access',
                image: 'assets/listing3.jpg'
            },
            {
                title: 'Cozy Brooklyn Studio',
                description: 'Studio • 1 bed • 1 bathroom • Rooftop Access',
                image: 'assets/listing4.jpg'
            }
        ];
        
        // Add new listings to grid
        newListings.forEach(listing => {
            const listingCard = createListingCard(listing);
            listingsGrid.appendChild(listingCard);
        });
        
        // Reset button
        showMoreBtn.textContent = 'Show me more Rentals';
        showMoreBtn.disabled = false;
        
        showToast('New listings loaded!');
    }, 1000);
}

// Create listing card element
function createListingCard(listing) {
    const card = document.createElement('div');
    card.className = 'listing-card fade-in';
    card.innerHTML = `
        <img src="${listing.image}" alt="${listing.title}" class="listing-image">
        <div class="listing-details">
            <span class="listing-location">📍</span>
            <h3>${listing.title}</h3>
            <p>${listing.description}</p>
        </div>
    `;
    
    card.addEventListener('click', function() {
        // Use default property ID for new listings
        const propertyId = '1586447992720x748691103167545300';
        const daysParam = (typeof selectedDays !== 'undefined' && selectedDays.length > 0) 
            ? selectedDays.join(',') 
            : '1,2,3,4,5';
        
        const propertyUrl = `https://www.split.lease/view-split-lease/${propertyId}?days-selected=${daysParam}`;
        
        showToast(`Opening ${listing.title}...`);
        
        setTimeout(() => {
            window.open(propertyUrl, '_blank');
        }, 1000);
    });
    
    return card;
}

// Support Section
function setupSupport() {
    const supportCards = document.querySelectorAll('.support-card');
    
    supportCards.forEach(card => {
        card.addEventListener('click', function() {
            const supportType = this.querySelector('p').textContent;
            handleSupportAction(supportType);
        });
    });
}

// Handle support actions
function handleSupportAction(type) {
    switch(type.toLowerCase()) {
        case 'chat':
            openChatWidget();
            break;
        case 'email':
            window.location.href = 'mailto:support@splitlease.com';
            break;
        case 'call':
            showToast('Call us at: 1-800-SPLIT-LEASE');
            break;
        case 'faq':
            showToast('Opening FAQ section...');
            break;
    }
}

// Chat widget simulation
function openChatWidget() {
    // Create chat widget if it doesn't exist
    let chatWidget = document.getElementById('chat-widget');
    if (!chatWidget) {
        chatWidget = document.createElement('div');
        chatWidget.id = 'chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-header">
                <span>Chat Support</span>
                <button onclick="closeChatWidget()">×</button>
            </div>
            <div class="chat-body">
                <div class="chat-message">Hello! How can we help you today?</div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
            </div>
        `;
        document.body.appendChild(chatWidget);
    }
    
    chatWidget.classList.add('active');
}

// Close chat widget
function closeChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    if (chatWidget) {
        chatWidget.classList.remove('active');
    }
}

// Referral System
function setupReferral() {
    const shareBtn = document.querySelector('.share-btn');
    const referralOptions = document.querySelectorAll('input[name="referral"]');
    const referralInput = document.querySelector('.referral-input');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const selectedMethod = document.querySelector('input[name="referral"]:checked');
            const contact = referralInput.value;
            
            if (!selectedMethod) {
                showToast('Please select a referral method');
                return;
            }
            
            if (!contact) {
                showToast('Please enter contact information');
                return;
            }
            
            // Process referral
            processReferral(selectedMethod.value, contact);
        });
    }
    
    // Update placeholder based on selection
    referralOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'text') {
                referralInput.placeholder = "Your friend's phone number";
            } else {
                referralInput.placeholder = "Your friend's email";
            }
        });
    });
}

// Process referral submission
function processReferral(method, contact) {
    // Show loading state
    const shareBtn = document.querySelector('.share-btn');
    shareBtn.textContent = 'Sending...';
    shareBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        shareBtn.textContent = 'Share now';
        shareBtn.disabled = false;
        
        showToast(`Referral sent via ${method} to ${contact}!`);
        
        // Clear input
        document.querySelector('.referral-input').value = '';
    }, 1500);
}

// Animations and Effects
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Parallax effect for hero image
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Toast Notification System
function showToast(message, duration = 3000) {
    // Remove any existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

// Add toast styles dynamically
const toastStyles = `
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 10000;
        max-width: 300px;
    }
    
    .toast.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .scroll-down {
        transform: translateY(-100%);
    }
    
    .scroll-up {
        transform: translateY(0);
    }
    
    #chat-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 450px;
        background: white;
        border-radius: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        z-index: 9999;
    }
    
    #chat-widget.active {
        display: flex;
    }
    
    .chat-header {
        background: var(--primary-color);
        color: white;
        padding: 1rem;
        border-radius: 1rem 1rem 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .chat-header button {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .chat-body {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
    }
    
    .chat-message {
        background: #f0f0f0;
        padding: 0.75rem;
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .chat-input {
        display: flex;
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
    }
    
    .chat-input input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.25rem;
        margin-right: 0.5rem;
    }
    
    .chat-input button {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
    }
`;

// Inject toast styles
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Auth Modal Functions
function setupAuthModal() {
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAuthModal();
        }
    });
}

// Open auth modal
function openAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.add('active');
    showWelcomeScreen();
    document.body.style.overflow = 'hidden';
}

// Close auth modal
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.reset();
    });
}

// Show welcome screen
function showWelcomeScreen() {
    hideAllScreens();
    document.getElementById('welcomeScreen').classList.add('active');
}

// Show login form
function showLoginForm() {
    hideAllScreens();
    document.getElementById('loginScreen').classList.add('active');
}

// Show signup form
function showSignupForm() {
    hideAllScreens();
    document.getElementById('signupScreen').classList.add('active');
}

// Hide all auth screens
function hideAllScreens() {
    document.querySelectorAll('.auth-screen').forEach(screen => {
        screen.classList.remove('active');
    });
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.parentElement.querySelector('.password-toggle');
    const eyeIcon = toggle.querySelector('.eye-icon');
    
    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.textContent = '🙈';
    } else {
        input.type = 'password';
        eyeIcon.textContent = '👁';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    showToast('Login functionality coming soon!');
    closeAuthModal();
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    
    if (!firstName || !lastName || !email) {
        showToast('Please fill in all fields');
        return;
    }
    
    // Simulate signup process
    showToast('Registration functionality coming soon!');
    closeAuthModal();
}

// Hero Day Selector Functions - Simplified
let selectedDays = [];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function setupHeroDaySelector() {
    // Start with no days selected - clean slate
    selectedDays = [];
    updateDayBadges();
    updateCheckinCheckout();
}

function toggleDay(dayIndex) {
    // Simple toggle logic - if selected, remove it; if not, add it
    if (selectedDays.includes(dayIndex)) {
        selectedDays = selectedDays.filter(d => d !== dayIndex);
    } else {
        selectedDays.push(dayIndex);
        selectedDays.sort((a, b) => a - b);
    }
    
    updateDayBadges();
    updateCheckinCheckout();
}

function updateDayBadges() {
    const badges = document.querySelectorAll('.hero-section .day-badge');
    badges.forEach((badge, index) => {
        if (selectedDays.includes(index)) {
            badge.classList.add('active');
        } else {
            badge.classList.remove('active');
        }
    });
}

function updateCheckinCheckout() {
    const checkinCheckoutEl = document.getElementById('checkinCheckout');
    const checkinDayEl = document.getElementById('checkinDay');
    const checkoutDayEl = document.getElementById('checkoutDay');
    
    if (selectedDays.length === 0) {
        checkinCheckoutEl.style.display = 'none';
        return;
    }
    
    // Show selected days as a simple list
    if (selectedDays.length === 1) {
        checkinDayEl.textContent = dayNames[selectedDays[0]];
        checkoutDayEl.textContent = dayNames[selectedDays[0]];
    } else {
        // Show first and last day of selection
        const firstDay = Math.min(...selectedDays);
        const lastDay = Math.max(...selectedDays);
        checkinDayEl.textContent = dayNames[firstDay];
        checkoutDayEl.textContent = dayNames[lastDay];
    }
    checkinCheckoutEl.style.display = 'flex';
}

function exploreRentals() {
    if (selectedDays.length === 0) {
        showToast('Please select at least one day to explore rentals');
        return;
    }
    
    // Simple redirect with selected days
    const searchUrl = `https://www.split.lease/search?days-selected=${selectedDays.join(',')}`;
    
    showToast('Redirecting to search results...');
    
    setTimeout(() => {
        window.open(searchUrl, '_blank');
    }, 1000);
}

function redirectToSearch(daysSelected, preset) {
    // Simple redirect with just the days
    const searchUrl = `https://www.split.lease/search?days-selected=${daysSelected}`;
    
    showToast(`Redirecting to ${preset || 'rental'} listings...`);
    
    setTimeout(() => {
        window.open(searchUrl, '_blank');
    }, 1000);
}

// Footer Navigation Functionality
function setupFooterNavigation() {
    // Footer links that require authentication (open modal)
    const authRequiredLinks = [
        'List Property Now',
        'How to List', 
        'Speak to an Agent'
    ];
    
    // Footer links that navigate to external pages
    const externalLinks = {
        'Terms of Use': 'https://www.split.lease/policies/terms-of-use',
        'About Periodic Tenancy': 'https://www.split.lease/about',
        'About the Team': 'https://www.split.lease/team',
        'Careers at Split Lease': 'https://www.split.lease/careers',
        'View Blog': 'https://www.split.lease/blog',
        'Explore Split Leases': 'https://www.split.lease/search',
        'Success Stories': 'https://www.split.lease/success-stories',
        'View FAQ': 'https://www.split.lease/faq',
        'Legal Section': 'https://www.split.lease/legal',
        'Guarantees': 'https://www.split.lease/guarantees',
        'Free House Manual': 'https://www.split.lease/house-manual'
    };
    
    // Add click handlers to all footer links
    const footerLinks = document.querySelectorAll('.footer-column a');
    
    footerLinks.forEach(link => {
        const linkText = link.textContent.trim();
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (authRequiredLinks.includes(linkText)) {
                // Open login modal for auth-required links
                showToast(`${linkText} requires authentication`);
                setTimeout(() => {
                    openAuthModal();
                }, 1000);
            } else if (externalLinks[linkText]) {
                // Navigate to external page
                showToast(`Opening ${linkText}...`);
                setTimeout(() => {
                    window.open(externalLinks[linkText], '_blank');
                }, 1000);
            } else {
                // Default action for other links
                showToast(`${linkText} functionality coming soon!`);
            }
        });
    });
    
    // Handle Emergency assistance button
    const emergencyBtn = document.querySelector('.footer-column a.emergency');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('For emergencies, call 911. For urgent Split Lease matters, use our chat support.');
        });
    }
}

// Export functions for global use
window.closeChatWidget = closeChatWidget;
window.showToast = showToast;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.togglePassword = togglePassword;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.toggleDay = toggleDay;
window.exploreRentals = exploreRentals;