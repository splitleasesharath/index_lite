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
    const controlButtons = document.querySelectorAll('.control-btn');
    
    controlButtons.forEach(button => {
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

// Listings Functionality
function setupListings() {
    const exploreButtons = document.querySelectorAll('.explore-btn, .cta-button');
    const showMoreBtn = document.querySelector('.show-more-btn');
    
    exploreButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Simulate loading listings
            this.classList.add('loading');
            this.innerHTML = '<span class="spinner"></span> Loading...';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = this.textContent.replace('Loading...', 'Explore Rentals');
                showToast('Loading available rentals...');
                
                // Scroll to listings section
                const listingsSection = document.querySelector('.listings-section');
                if (listingsSection) {
                    listingsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1500);
        });
    });
    
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function() {
            loadMoreListings();
        });
    }
    
    // Add click handlers to listing cards
    const listingCards = document.querySelectorAll('.listing-card');
    listingCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showToast(`Opening details for: ${title}`);
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
        showToast(`Opening details for: ${listing.title}`);
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

// Export functions for global use
window.closeChatWidget = closeChatWidget;
window.showToast = showToast;