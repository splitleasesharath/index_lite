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

// Day Selector Functionality
function setupDaySelectors() {
    const dayBadges = document.querySelectorAll('.day-badge');
    
    dayBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            // Toggle active/inactive state
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.classList.add('inactive');
            } else {
                this.classList.remove('inactive');
                this.classList.add('active');
            }
            
            // Update schedule based on selection
            updateScheduleDisplay(this.closest('.schedule-card'));
        });
    });
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

// Schedule Controls (Play/Pause/Stop)
function setupScheduleControls() {
    // Lottie Animation Controls
    const playPauseButtons = document.querySelectorAll('.play-pause');
    const stopButtons = document.querySelectorAll('.stop');
    const seekInputs = document.querySelectorAll('.lottie-seek-input');
    const loopButtons = document.querySelectorAll('.loop-toggle');
    
    // Play/Pause buttons
    playPauseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scheduleType = this.dataset.schedule;
            const scheduleCard = this.closest('.schedule-card');
            handlePlayPause(scheduleType, scheduleCard, this);
        });
    });
    
    // Stop buttons
    stopButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scheduleType = this.dataset.schedule;
            const scheduleCard = this.closest('.schedule-card');
            handleStop(scheduleType, scheduleCard, this);
        });
    });
    
    // Seek sliders
    seekInputs.forEach(slider => {
        slider.addEventListener('input', function() {
            const scheduleType = this.dataset.schedule;
            const scheduleCard = this.closest('.schedule-card');
            handleSeek(scheduleType, scheduleCard, this.value);
        });
    });
    
    // Loop toggle buttons
    loopButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scheduleType = this.dataset.schedule;
            handleLoopToggle(scheduleType, this);
        });
    });
    
    // Legacy control buttons (for backwards compatibility)
    const legacyControlButtons = document.querySelectorAll('.control-btn:not(.play-pause):not(.stop):not(.loop-toggle)');
    legacyControlButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.classList.contains('play') ? 'play' :
                          this.classList.contains('pause') ? 'pause' : 'stop';
            
            handleScheduleControl(action, this.closest('.schedule-card'));
        });
    });
}

// Handle schedule control actions
function handleScheduleControl(action, scheduleCard) {
    switch(action) {
        case 'play':
            animateSchedule(scheduleCard);
            showToast('Schedule animation started');
            break;
        case 'pause':
            pauseSchedule(scheduleCard);
            showToast('Schedule animation paused');
            break;
        case 'stop':
            resetSchedule(scheduleCard);
            showToast('Schedule reset');
            break;
    }
}

// Animate schedule selection
function animateSchedule(scheduleCard) {
    const dayBadges = scheduleCard.querySelectorAll('.day-badge');
    let index = 0;
    
    scheduleCard.animationInterval = setInterval(() => {
        // Remove all active states
        dayBadges.forEach(badge => {
            badge.classList.remove('active');
            badge.classList.add('inactive');
        });
        
        // Activate current day
        dayBadges[index].classList.remove('inactive');
        dayBadges[index].classList.add('active');
        
        index = (index + 1) % dayBadges.length;
    }, 500);
}

// Pause schedule animation
function pauseSchedule(scheduleCard) {
    if (scheduleCard.animationInterval) {
        clearInterval(scheduleCard.animationInterval);
        scheduleCard.animationInterval = null;
    }
}

// Reset schedule to default
function resetSchedule(scheduleCard) {
    pauseSchedule(scheduleCard);
    
    const h3Text = scheduleCard.querySelector('h3').textContent;
    const dayBadges = scheduleCard.querySelectorAll('.day-badge');
    
    // Reset based on schedule type
    if (h3Text.includes('Weeknight')) {
        // M-F active, S inactive
        dayBadges.forEach((badge, index) => {
            if (index === 0 || index === 6) {
                badge.classList.add('inactive');
                badge.classList.remove('active');
            } else {
                badge.classList.add('active');
                badge.classList.remove('inactive');
            }
        });
    } else if (h3Text.includes('Weekend')) {
        // F-S active, M-T inactive
        dayBadges.forEach((badge, index) => {
            if (index === 0 || index === 5 || index === 6) {
                badge.classList.add('active');
                badge.classList.remove('inactive');
            } else {
                badge.classList.add('inactive');
                badge.classList.remove('active');
            }
        });
    } else {
        // All active for monthly
        dayBadges.forEach(badge => {
            badge.classList.add('active');
            badge.classList.remove('inactive');
        });
    }
}

// Lottie Animation Control Handlers
let scheduleStates = {
    weeknight: { playing: false, looping: false, frame: 0, interval: null },
    weekend: { playing: false, looping: false, frame: 0, interval: null },
    monthly: { playing: false, looping: false, frame: 0, interval: null }
};

function handlePlayPause(scheduleType, scheduleCard, button) {
    const state = scheduleStates[scheduleType];
    const playIcon = 'data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M8 5V19L19 12L8 5Z\' fill=\'currentColor\'/%3E%3C/svg%3E';
    const pauseIcon = 'data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'6\' y=\'6\' width=\'4\' height=\'12\' fill=\'currentColor\'/%3E%3Crect x=\'14\' y=\'6\' width=\'4\' height=\'12\' fill=\'currentColor\'/%3E%3C/svg%3E';
    
    if (state.playing) {
        // Pause
        pauseScheduleAnimation(scheduleType, scheduleCard);
        button.querySelector('img').src = playIcon;
        button.classList.remove('active');
        showToast(`${scheduleType} animation paused`);
    } else {
        // Play
        startScheduleAnimation(scheduleType, scheduleCard);
        button.querySelector('img').src = pauseIcon;
        button.classList.add('active');
        showToast(`${scheduleType} animation started`);
    }
}

function handleStop(scheduleType, scheduleCard, button) {
    const state = scheduleStates[scheduleType];
    const playPauseButton = scheduleCard.querySelector('.play-pause');
    const seekSlider = scheduleCard.querySelector('.lottie-seek-input');
    const playIcon = 'data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M8 5V19L19 12L8 5Z\' fill=\'currentColor\'/%3E%3C/svg%3E';
    
    pauseScheduleAnimation(scheduleType, scheduleCard);
    state.frame = 0;
    seekSlider.value = 0;
    playPauseButton.querySelector('img').src = playIcon;
    playPauseButton.classList.remove('active');
    
    // Reset to default day pattern
    resetSchedule(scheduleCard);
    showToast(`${scheduleType} animation stopped and reset`);
}

function handleSeek(scheduleType, scheduleCard, value) {
    const state = scheduleStates[scheduleType];
    state.frame = parseInt(value);
    
    // Update visual state based on seek position
    updateAnimationFrame(scheduleType, scheduleCard, state.frame);
    showToast(`Seeking to frame ${value}`);
}

function handleLoopToggle(scheduleType, button) {
    const state = scheduleStates[scheduleType];
    state.looping = !state.looping;
    
    if (state.looping) {
        button.classList.add('active');
        showToast(`${scheduleType} looping enabled`);
    } else {
        button.classList.remove('active');
        showToast(`${scheduleType} looping disabled`);
    }
}

function startScheduleAnimation(scheduleType, scheduleCard) {
    const state = scheduleStates[scheduleType];
    const seekSlider = scheduleCard.querySelector('.lottie-seek-input');
    
    state.playing = true;
    
    state.interval = setInterval(() => {
        state.frame = (state.frame + 1) % 101; // 0-100 frame range
        seekSlider.value = state.frame;
        
        updateAnimationFrame(scheduleType, scheduleCard, state.frame);
        
        // If reached end and not looping, stop
        if (state.frame === 100 && !state.looping) {
            handleStop(scheduleType, scheduleCard, scheduleCard.querySelector('.stop'));
        }
    }, 100); // 10fps animation
}

function pauseScheduleAnimation(scheduleType, scheduleCard) {
    const state = scheduleStates[scheduleType];
    state.playing = false;
    
    if (state.interval) {
        clearInterval(state.interval);
        state.interval = null;
    }
}

function updateAnimationFrame(scheduleType, scheduleCard, frame) {
    const dayBadges = scheduleCard.querySelectorAll('.day-badge');
    const progress = frame / 100;
    
    // Create animated day selection based on frame
    dayBadges.forEach((badge, index) => {
        const delay = index * 0.1;
        const shouldBeActive = (progress + delay) % 1 > 0.5;
        
        if (shouldBeActive) {
            badge.classList.add('active');
            badge.classList.remove('inactive');
        } else {
            badge.classList.remove('active');
            badge.classList.add('inactive');
        }
    });
}

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
            loadMoreListings();
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

// Hero Day Selector Functions
let selectedDays = [];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function setupHeroDaySelector() {
    // Initialize with default weeknight selection (M-F)
    selectedDays = [1, 2, 3, 4, 5];
    updateDayBadges();
    updateCheckinCheckout();
    updateURL();
}

function toggleDay(dayIndex) {
    if (selectedDays.includes(dayIndex)) {
        // Remove day from selection
        selectedDays = selectedDays.filter(d => d !== dayIndex);
    } else {
        // Add day to selection
        selectedDays.push(dayIndex);
        selectedDays.sort((a, b) => a - b);
    }
    
    updateDayBadges();
    updateCheckinCheckout();
    updateURL();
}

function updateDayBadges() {
    const badges = document.querySelectorAll('.day-badge');
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
    
    // Find the first and last selected days for continuous range
    const firstDay = Math.min(...selectedDays);
    const lastDay = Math.max(...selectedDays);
    
    checkinDayEl.textContent = dayNames[firstDay];
    checkoutDayEl.textContent = dayNames[lastDay];
    checkinCheckoutEl.style.display = 'flex';
}

function updateURL() {
    if (selectedDays.length > 0) {
        const params = new URLSearchParams();
        params.set('days-selected', selectedDays.join(','));
        const newURL = window.location.pathname + '?' + params.toString();
        window.history.replaceState({}, '', newURL);
    } else {
        // Remove query parameters if no days selected
        window.history.replaceState({}, '', window.location.pathname);
    }
}

function exploreRentals() {
    if (selectedDays.length === 0) {
        showToast('Please select at least one day to explore rentals');
        return;
    }
    
    // Build URL parameters exactly like the original site
    const params = new URLSearchParams();
    params.set('weekly-frequency', 'Every week');
    params.set('days-selected', selectedDays.join(','));
    
    // In this demo, redirect to the original Split Lease search page
    // In a real clone, this would redirect to our own search page
    const searchUrl = `https://www.split.lease/search?${params.toString()}`;
    
    showToast('Redirecting to search results...');
    
    // Small delay to show the toast, then redirect
    setTimeout(() => {
        window.open(searchUrl, '_blank');
    }, 1000);
}

function redirectToSearch(daysSelected, preset) {
    const params = new URLSearchParams();
    params.set('days-selected', daysSelected);
    params.set('weekly-frequency', 'Every week');
    
    if (preset && preset !== 'default') {
        params.set('preset', preset);
    }
    
    const searchUrl = `https://www.split.lease/search?${params.toString()}`;
    
    showToast(`Redirecting to ${preset} listings...`);
    
    setTimeout(() => {
        window.open(searchUrl, '_blank');
    }, 1000);
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