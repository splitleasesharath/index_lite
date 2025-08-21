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
    setupDropdownMenus();
    setupFloatingBadge();
}

// Navigation Functionality
function setupNavigation() {
    const header = document.querySelector('.main-header');
    
    // Header stays fixed at all times - no hide/show on scroll

    // Smooth scroll for anchor links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Skip if it's an auth link
            if (this.getAttribute('href') === '#signin' || this.getAttribute('href') === '#signup') {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
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
    
    // Days have been selected
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
            
            if (buttonText.includes('weekend')) {
                // Weekend schedule: Fri-Sun + Mon (days 6,7,1,2)
                redirectToSearch('6,7,1,2', 'weekends');
            } else if (buttonText.includes('weeks of the month')) {
                // Weeks of the month: All days (1,2,3,4,5,6,7)
                redirectToSearch('1,2,3,4,5,6,7', 'weeks');
            } else if (buttonText.includes('weeknight')) {
                // Weeknight schedule: Mon-Fri (days 2,3,4,5,6)  
                redirectToSearch('2,3,4,5,6', 'weeknights');
            } else {
                // Default explore action (monthly)
                redirectToSearch('1,2,3,4,5,6,7', 'monthly');
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
            
            const searchUrl = `https://app.splitlease.app/search?days-selected=${daysParam}`;
            
            window.location.href = searchUrl;
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
            
            const propertyUrl = `https://app.splitlease.app/view-split-lease/${propertyId}?days-selected=${daysParam}`;
            
            window.location.href = propertyUrl;
        });
    });
}

// Create skeleton card
function createSkeletonCard() {
    const card = document.createElement('div');
    card.className = 'listing-card skeleton-card fade-in';
    card.innerHTML = `
        <div class="listing-image-placeholder"></div>
        <div class="listing-details">
            <span class="listing-location">📍</span>
            <h3>Loading...</h3>
            <p>Loading property details...</p>
        </div>
    `;
    return card;
}

// Load more listings dynamically
function loadMoreListings() {
    const listingsGrid = document.querySelector('.listings-grid');
    const showMoreBtn = document.querySelector('.show-more-btn');
    
    // Show loading state
    showMoreBtn.textContent = 'Loading...';
    showMoreBtn.disabled = true;
    
    // Add skeleton cards
    const skeletonCards = [];
    for (let i = 0; i < 2; i++) {
        const skeleton = createSkeletonCard();
        skeletonCards.push(skeleton);
        listingsGrid.appendChild(skeleton);
    }
    
    // Simulate API call
    setTimeout(() => {
        // Remove skeleton cards
        skeletonCards.forEach(card => card.remove());
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
        
        // Listings loaded
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
        
        const propertyUrl = `https://app.splitlease.app/view-split-lease/${propertyId}?days-selected=${daysParam}`;
        
        window.location.href = propertyUrl;
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
            window.location.href = 'tel:1-800-SPLIT-LEASE';
            break;
        case 'faq':
            window.location.href = 'https://app.splitlease.app/faq';
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
            
            if (!selectedMethod || !contact) {
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
    // Enhanced validation
    if (method === 'email') {
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact)) {
            return;
        }
    } else if (method === 'text') {
        // Phone validation - basic check for 10+ digits
        const phoneDigits = contact.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            return;
        }
    }
    
    // Show loading state
    const shareBtn = document.querySelector('.share-btn');
    const originalText = shareBtn.textContent;
    shareBtn.textContent = 'Sending...';
    shareBtn.disabled = true;
    
    // Add spinner
    shareBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        shareBtn.textContent = originalText;
        shareBtn.disabled = false;
        shareBtn.classList.remove('loading');
        
        // Referral processed successfully
        
        // Clear input and reset radio
        document.querySelector('.referral-input').value = '';
        document.querySelectorAll('input[name="referral"]').forEach(radio => {
            radio.checked = false;
        });
    }, 2000);
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

// Toast Notification System - Removed for faster navigation
// All navigation now happens immediately without notifications

// Add chat widget styles dynamically
const chatStyles = `
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
styleSheet.textContent = chatStyles;
document.head.appendChild(styleSheet);

// Auth Modal Functions - Simplified for redirect
function setupAuthModal() {
    // Modal functionality removed - now redirects directly to Split Lease
}

// Open auth modal with embedded iframe
function openAuthModal() {
    console.log('Opening auth modal with iframe...');
    const modal = document.getElementById('authModal');
    const iframe = document.getElementById('authIframe');
    const loader = document.querySelector('.iframe-loader');
    
    // Show loader each time modal opens
    if (loader) {
        loader.classList.remove('hidden');
    }
    
    // Set the iframe source if not already set
    if (!iframe.src || iframe.src === '' || iframe.src === 'about:blank') {
        console.log('Setting iframe source to Split Lease login...');
        iframe.src = 'https://app.splitlease.app/signup-login';
    }
    
    // Show the modal
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    console.log('Modal opened, iframe loading...');
}

// Close auth modal
function closeAuthModal() {
    console.log('Closing auth modal...');
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Hide iframe loader when content loads
function hideIframeLoader() {
    console.log('Iframe loaded, hiding loader...');
    const loader = document.querySelector('.iframe-loader');
    if (loader) {
        loader.classList.add('hidden');
    }
}

// Legacy functions kept empty for compatibility
function showWelcomeScreen() {}
function showLoginForm() {}
function showSignupForm() {}
function hideAllScreens() {}
function switchToLogin() {}
function switchToSignup() {}
function togglePasswordVisibility() {}
function handleAuthSubmit() {}
function togglePassword() {}
function handleLogin() {}
function handleSignup() {}

// Hero Day Selector Functions - Exact Split Lease Replication
let selectedDays = [];
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function setupHeroDaySelector() {
    // Load initial state from URL or start clean
    loadStateFromURL();
    updateDayBadges();
    updateCheckinCheckout();
}

function loadStateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const daysParam = urlParams.get('days-selected');
    
    if (daysParam) {
        // Parse days from URL parameter (decode URL encoding)
        const decoded = decodeURIComponent(daysParam);
        // Convert from 1-based (Bubble) to 0-based (JavaScript) by subtracting 1
        const bubbleDays = decoded.split(',').map(d => parseInt(d.trim()));
        selectedDays = bubbleDays.map(day => day - 1).filter(d => d >= 0 && d <= 6);
    } else {
        // Default to Monday-Friday (indices 1-5 in JavaScript, days 2-6 in URL)
        selectedDays = [1, 2, 3, 4, 5];
    }
}

function toggleDay(dayIndex) {
    // Day mapping: Sunday=0, Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6
    
    // Treat Sunday like any other day - simple toggle on/off
    const dayNumber = dayIndex;
    
    if (selectedDays.includes(dayNumber)) {
        // Remove the day if it's already selected
        selectedDays = selectedDays.filter(d => d !== dayNumber);
    } else {
        // Add the day if it's not selected
        selectedDays.push(dayNumber);
        selectedDays.sort((a, b) => a - b);
    }
    
    updateDayBadges();
    updateCheckinCheckout();
    updateURL();
}

function updateDayBadges() {
    const badges = document.querySelectorAll('.hero-section .day-badge');
    badges.forEach((badge, index) => {
        // Direct mapping for all days: Sunday=0, Monday=1, etc.
        const isSelected = selectedDays.includes(index);
        
        if (isSelected) {
            badge.classList.add('active');
        } else {
            badge.classList.remove('active');
        }
    });
}

function updateCheckinCheckout() {
    const checkinCheckoutEl = document.getElementById('checkinCheckout');
    
    if (selectedDays.length === 0) {
        checkinCheckoutEl.style.display = 'none';
        return;
    }
    
    // Check if days are continuous
    if (!areDaysContinuous(selectedDays)) {
        // Show error message for non-continuous days
        checkinCheckoutEl.innerHTML = 'Please select a continuous set of days';
        checkinCheckoutEl.style.display = 'block';
        return;
    }
    
    // Calculate check-in and check-out days based on selected days
    let checkinDay, checkoutDay;
    
    if (selectedDays.length === 1) {
        // Single day selection
        checkinDay = dayNames[selectedDays[0]];
        checkoutDay = dayNames[selectedDays[0]];
    } else {
        // Multiple day selection - show first and last
        const sortedDays = [...selectedDays].sort((a, b) => a - b);
        checkinDay = dayNames[sortedDays[0]];
        checkoutDay = dayNames[sortedDays[sortedDays.length - 1]];
    }
    
    // Restore original HTML structure for valid selections
    checkinCheckoutEl.innerHTML = `
        <span><strong>Check-in:</strong> <span id="checkinDay">${checkinDay}</span></span>
        <span class="separator">•</span>
        <span><strong>Check-out:</strong> <span id="checkoutDay">${checkoutDay}</span></span>
    `;
    checkinCheckoutEl.style.display = 'flex';
}

function areDaysContinuous(days) {
    if (days.length <= 1) return true;
    
    // If 6 or more days are selected, they're always continuous
    if (days.length >= 6) return true;
    
    const sortedDays = [...days].sort((a, b) => a - b);
    
    const hasSunday = sortedDays.includes(0);  // Sunday
    const hasSaturday = sortedDays.includes(6); // Saturday
    
    // Implement the Bubble logic:
    // Case when both Sunday and Saturday are selected (weekSun == 0 && weekSat == 6)
    if (hasSunday && hasSaturday) {
        // This is the wrap-around case (Case 2 in Bubble)
        // Example: Fri-Sat-Sun-Mon should be considered continuous
        // The days wrap around from Saturday to Sunday
        
        // For wrap-around to be continuous, we need to check if removing the gap
        // between Sunday and Saturday would make all days continuous
        
        // Find the first day after Sunday and the last day before Saturday
        let firstAfterSunday = -1;
        let lastBeforeSaturday = -1;
        
        for (let i = 0; i < sortedDays.length; i++) {
            const day = sortedDays[i];
            if (day > 0 && day < 6) {
                if (firstAfterSunday === -1) {
                    firstAfterSunday = day;
                }
                lastBeforeSaturday = day;
            }
        }
        
        // Check two groups for continuity:
        // Group 1: From Sunday (0) to the last day before the gap
        // Group 2: From the first day after the gap to Saturday (6)
        
        // Find where the gap is
        let hasGap = false;
        let gapStart = -1;
        let gapEnd = -1;
        
        for (let i = 0; i < sortedDays.length - 1; i++) {
            if (sortedDays[i + 1] - sortedDays[i] > 1) {
                // Found a gap
                if (hasGap) {
                    // More than one gap means not continuous even with wrap
                    return false;
                }
                hasGap = true;
                gapStart = sortedDays[i];
                gapEnd = sortedDays[i + 1];
            }
        }
        
        if (!hasGap) {
            // No gap found, all days are already continuous
            return true;
        }
        
        // For wrap-around to work, the gap must be in the middle of the week
        // and the days at the start and end of the week must connect
        
        // The gap should not include Sunday or Saturday
        if (gapStart === 0 || gapEnd === 6) {
            // The gap is at the week boundary, check regular continuity
            const minDay = Math.min(...sortedDays);
            const maxDay = Math.max(...sortedDays);
            const expectedDays = [];
            for (let i = minDay; i <= maxDay; i++) {
                expectedDays.push(i);
            }
            return expectedDays.length === sortedDays.length &&
                expectedDays.every(day => sortedDays.includes(day));
        }
        
        // If we have a gap in the middle and both Sunday and Saturday,
        // this represents a wrap-around selection that is continuous
        return true;
    } else {
        // Case 1 in Bubble: Regular continuity check (no wrap-around)
        // Create the expected continuous range from min to max
        const minDay = Math.min(...sortedDays);
        const maxDay = Math.max(...sortedDays);
        
        const expectedDays = [];
        for (let i = minDay; i <= maxDay; i++) {
            expectedDays.push(i);
        }
        
        // Check if selected days match the expected continuous range
        return expectedDays.length === sortedDays.length &&
            expectedDays.every(day => sortedDays.includes(day));
    }
}

function updateURL() {
    const currentUrl = new URL(window.location);
    
    if (selectedDays.length === 0) {
        currentUrl.searchParams.delete('days-selected');
    } else {
        // Convert to 1-based indexing for Bubble (add 1 to each day)
        const bubbleDays = selectedDays.map(day => day + 1);
        // Use exact URL encoding format like original site: %2C%20 = ", "
        currentUrl.searchParams.set('days-selected', bubbleDays.join(', '));
    }
    
    // Update URL without page reload
    window.history.replaceState({}, '', currentUrl);
}

function exploreRentals() {
    if (selectedDays.length === 0) {
        return;
    }
    
    // Check if days are continuous before allowing exploration
    if (!areDaysContinuous(selectedDays)) {
        return;
    }
    
    // Convert to 1-based indexing for Bubble (add 1 to each day)
    const bubbleDays = selectedDays.map(day => day + 1);
    
    // Redirect with selected days using exact format
    const searchUrl = `https://app.splitlease.app/search?days-selected=${bubbleDays.join(',')}`;
    
    window.location.href = searchUrl;
}

function redirectToSearch(daysSelected, preset) {
    // Note: daysSelected here is already a string like "2,3,4,5,6" for weeknight
    // These are already 1-based from the schedule section, so no conversion needed
    const searchUrl = `https://app.splitlease.app/search?days-selected=${daysSelected}`;
    
    window.location.href = searchUrl;
}

// Dropdown Menu Functionality
function setupDropdownMenus() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        let isOpen = false;
        
        // Toggle on click
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            isOpen = !isOpen;
            
            if (isOpen) {
                dropdown.classList.add('active');
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
            } else {
                dropdown.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            }
        });
        
        // Keep open on hover
        dropdown.addEventListener('mouseenter', function() {
            dropdown.classList.add('hover');
        });
        
        dropdown.addEventListener('mouseleave', function() {
            dropdown.classList.remove('hover');
            if (!isOpen) {
                dropdown.classList.remove('active');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
                const menu = dropdown.querySelector('.dropdown-menu');
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
            });
        }
    });
    
    // Keyboard navigation
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const items = dropdown.querySelectorAll('.dropdown-item');
        
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            } else if (e.key === 'ArrowDown' && dropdown.classList.contains('active')) {
                e.preventDefault();
                items[0]?.focus();
            }
        });
        
        items.forEach((item, index) => {
            item.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    items[index + 1]?.focus() || items[0].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    items[index - 1]?.focus() || trigger.focus();
                } else if (e.key === 'Escape') {
                    dropdown.classList.remove('active');
                    trigger.focus();
                }
            });
        });
    });
}

// Footer Navigation Functionality
function setupFooterNavigation() {
    // Only handle the emergency assistance link
    const emergencyBtn = document.querySelector('.footer-column a.emergency');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Direct call to 911
            window.location.href = 'tel:911';
        });
    }
}


// Mobile Menu Toggle
function toggleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navCenter = document.querySelector('.nav-center');
    const navRight = document.querySelector('.nav-right');
    
    hamburger.classList.toggle('active');
    navCenter.classList.toggle('mobile-active');
    navRight.classList.toggle('mobile-active');
}

// Handle Import Listing
function handleImportListing() {
    const url = document.getElementById('importUrl').value;
    const email = document.getElementById('importEmail').value;
    
    if (!url || !email) {
        return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
        return;
    }
    
    // Show loading state
    const btn = document.querySelector('.import-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Importing...';
    btn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Import completed successfully
        
        // Clear inputs
        document.getElementById('importUrl').value = '';
        document.getElementById('importEmail').value = '';
    }, 2000);
}


// Floating Badge Setup
function setupFloatingBadge() {
    const badge = document.querySelector('.floating-badge');
    if (!badge) return;
    
    // Show badge by default (unless user is logged in)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'block';
    }
    
    // Hide badge when user logs in
    window.addEventListener('userLoggedIn', function() {
        badge.style.display = 'none';
        localStorage.setItem('isLoggedIn', 'true');
    });
    
    // Show badge when user logs out
    window.addEventListener('userLoggedOut', function() {
        badge.style.display = 'block';
        localStorage.setItem('isLoggedIn', 'false');
    });
}

// Export functions for global use
window.closeChatWidget = closeChatWidget;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.hideIframeLoader = hideIframeLoader;
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.togglePassword = togglePassword;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.toggleDay = toggleDay;
window.exploreRentals = exploreRentals;
window.toggleMobileMenu = toggleMobileMenu;
window.handleImportListing = handleImportListing;