// Global state for intent-based preloading
let userIntentScore = 0;
let hasPreloadedIframe = false;
// Auth state management
let isUserLoggedIn = false;
let authCheckAttempts = 0;
const MAX_AUTH_CHECK_ATTEMPTS = 3;

// ========================================
// AUTHENTICATION AND SESSION MANAGEMENT

// Helper function to check cross-domain cookies from .split.lease
function checkSplitLeaseCookies() {
    const cookies = document.cookie.split('; ');
    const loggedInCookie = cookies.find(c => c.startsWith('loggedIn='));
    const usernameCookie = cookies.find(c => c.startsWith('username='));
    
    const isLoggedIn = loggedInCookie ? loggedInCookie.split('=')[1] === 'true' : false;
    // Parse username and remove any surrounding quotes
    let username = usernameCookie ? decodeURIComponent(usernameCookie.split('=')[1]) : null;
    if (username) {
        // Remove surrounding quotes if present (both single and double quotes)
        username = username.replace(/^["']|["']$/g, '');
    }
    
    // Log the authentication status to console
    console.log('🔐 Split Lease Auth Check:');
    console.log('   Logged In:', isLoggedIn);
    console.log('   Username:', username || 'not set');
    console.log('   Raw Cookies:', { loggedInCookie, usernameCookie });
    
    return { isLoggedIn, username };
}

// Lightweight authentication status check (now includes cross-domain cookies)
function checkAuthStatus() {
    console.log('🔍 Checking authentication status...');
    
    // First check cross-domain cookies from .split.lease
    const splitLeaseAuth = checkSplitLeaseCookies();
    
    if (splitLeaseAuth.isLoggedIn) {
        console.log('✅ User authenticated via Split Lease cookies');
        console.log('   Username:', splitLeaseAuth.username);
        isUserLoggedIn = true;
        handleLoggedInUser(splitLeaseAuth.username);
        return true;
    }
    
    // Fallback to localStorage check
    const authToken = localStorage.getItem('splitlease_auth_token');
    const sessionId = localStorage.getItem('splitlease_session_id');
    const lastAuthTime = localStorage.getItem('splitlease_last_auth');
    
    // Check for legacy auth cookie
    const authCookie = document.cookie.split('; ').find(row => row.startsWith('splitlease_auth='));
    
    // Validate session age (24 hours)
    const sessionValid = lastAuthTime && 
        (Date.now() - parseInt(lastAuthTime)) < 24 * 60 * 60 * 1000;
    
    if ((authToken || sessionId || authCookie) && sessionValid) {
        console.log('✅ User authenticated via localStorage/legacy cookies');
        isUserLoggedIn = true;
        handleLoggedInUser();
        return true;
    } else {
        console.log('❌ User not authenticated');
        isUserLoggedIn = false;
        return false;
    }
}

// Intent-based preloading system
const IframeLoader = {
    intentScore: 0,
    preloadThreshold: 30,
    hasPreloaded: false,
    
    trackIntent(points) {
        this.intentScore += points;
        // Intent score: {points} | Total: {this.intentScore}
        
        if (this.intentScore >= this.preloadThreshold && !this.hasPreloaded) {
            this.preloadAuthIframe();
        }
    },
    
    preloadAuthIframe() {
        if (!this.hasPreloaded) {
            // Intent detected - preloading auth iframe
            this.hasPreloaded = true;
            // Actual loading would happen here
        }
    }
};

// Show login alert UI
function showLoginAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.id = 'loginAlert';
    alertDiv.className = 'login-alert';
    alertDiv.innerHTML = `
        <div class="login-alert-content">
            <div class="login-alert-spinner"></div>
            <p>Checking authentication...</p>
        </div>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        const alert = document.getElementById('loginAlert');
        if (alert) {
            alert.remove();
        }
    }, 2000);
}

// Handle logged-in state
function handleLoggedInUser(username = null) {
    // User is logged in - updating UI
    isUserLoggedIn = true;
    
    if (username) {
        console.log(`👤 Welcome back, ${username}!`);
        // Store username globally for use in redirects
        window.currentUsername = username;
    }
    
    // Update all sign-in/sign-up buttons to show Hello username
    const signinBtns = document.querySelectorAll('.btn-primary');
    signinBtns.forEach(btn => {
        if (btn.textContent.includes('Sign')) {
            if (username) {
                btn.textContent = `Hello ${username}`;
                // Make button clickable to go to profile
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                // Update onclick to go to profile instead of login
                btn.onclick = function() {
                    window.location.href = 'https://app.split.lease/account-profile';
                };
            } else {
                btn.textContent = 'Already logged in';
                btn.disabled = true;
                btn.style.opacity = '0.6';
            }
        }
    });
    
    // Update any links that point to signup-login
    document.querySelectorAll('[onclick*="openAuthModal"]').forEach(el => {
        // Check if it's a Sign In or Sign Up link in the nav
        if (el.textContent.includes('Sign In') || el.textContent.includes('Sign Up')) {
            if (username) {
                // Replace both Sign In and Sign Up with Hello username
                if (el.textContent.includes('Sign In')) {
                    el.textContent = `Hello ${username}`;
                    // Also hide the divider and Sign Up link
                    const divider = el.nextElementSibling;
                    const signupLink = divider?.nextElementSibling;
                    if (divider?.classList?.contains('divider')) {
                        divider.style.display = 'none';
                    }
                    if (signupLink?.textContent?.includes('Sign Up')) {
                        signupLink.style.display = 'none';
                    }
                } else if (el.textContent.includes('Sign Up')) {
                    // Hide Sign Up link when logged in
                    el.style.display = 'none';
                }
            }
        }
        
        // Update onclick to go to profile
        el.onclick = function() {
            window.location.href = 'https://app.split.lease/account-profile';
        };
    });
}

// ========================================
// NAVIGATION AND SMOOTH SCROLLING
function setupNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Listen for postMessage responses (from iframes)
window.addEventListener('message', function(event) {
    // Only accept messages from trusted origin
    if (event.origin !== 'https://app.split.lease') {
        return;
    }
    
    // Check if user is logged in
    if (event.data.type === 'auth-status' && event.data.isLoggedIn === true) {
        handleLoggedInUser();
    }
    
    // Legacy format support
    if (event.data.authenticated === true || event.data.loggedIn === true) {
        handleLoggedInUser();
    }
    
    // Handle auth state response from Market Research iframe
    if (event.data.type === 'auth-state-response') {
        const isLoggedIn = event.data.elementId === '596573';
        
        console.log(`🔐 Auth Status: User is ${isLoggedIn ? 'LOGGED IN' : 'NOT LOGGED IN'}`);
        
        
        // Show alert if user is logged in
        if (isLoggedIn) {
            alert('Logging in...');
        }
        
        // Always update cache with fresh auth state
        
        localStorage.setItem('bubble_market_research_auth', isLoggedIn.toString());
        localStorage.setItem('bubble_market_research_auth_time', Date.now().toString());
        
        // Mark cache as fresh to prevent duplicate checks
        localStorage.setItem('bubble_market_research_auth_fresh', 'true');
    }
});

// ========================================
// PAGE INITIALIZATION
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded - Initializing Split Lease authentication check...');
    
    // Check auth status immediately and log results
    const isAuthenticated = checkAuthStatus();
    console.log(`📊 Initial auth check complete: ${isAuthenticated ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
    
    // Test function to simulate logged-in state (for development)
    window.simulateLogin = function() {
        // Set auth tokens in localStorage
        localStorage.setItem('splitlease_auth_token', 'test_token_' + Date.now());
        localStorage.setItem('splitlease_session_id', 'test_session_' + Date.now());
        localStorage.setItem('splitlease_last_auth', Date.now().toString());
        
        console.log('✅ Simulated login - refresh page to see preload effect');
        console.log('Run window.clearLogin() to clear the test login state');
    };
    
    // Clear test login
    window.clearLogin = function() {
        localStorage.removeItem('splitlease_auth_token');
        localStorage.removeItem('splitlease_session_id');
        localStorage.removeItem('splitlease_last_auth');
        console.log('🗑️ Login state cleared');
    };
    
    // ========================================
    // DEFERRED RESOURCE LOADING
    
    // Load market research iframe after a delay (not blocking page load)
    setTimeout(() => {
        console.log('📊 Starting deferred resource loading...');
        
        // Check if user already showed intent to view market research
        const marketResearchBtn = document.querySelector('.market-research-badge');
        if (marketResearchBtn) {
            marketResearchBtn.addEventListener('mouseenter', () => {
                IframeLoader.trackIntent(40);
            });
        }
    }, 3000);
    
    // Clear stale auth cache on page load (older than 2 minutes)
    const cachedTime = localStorage.getItem('bubble_market_research_auth_time');
    if (cachedTime) {
        const cacheAge = Date.now() - parseInt(cachedTime);
        if (cacheAge > 120000) { // 2 minutes
            console.log('🧹 Clearing stale auth cache (older than 2 minutes)');
            localStorage.removeItem('bubble_market_research_auth');
            localStorage.removeItem('bubble_market_research_auth_time');
            localStorage.removeItem('bubble_market_research_auth_fresh');
        }
    }
    
    
    // Rest of the initialization code
    setupNavigation();
    setupDaySelectors();
    setupScheduleControls();
    setupPropertyCards();
    setupAuthModal();
    setupMarketResearchModal();
    setupReferralForm();
    setupImportForm();
    setupFloatingBadge();
    
    // Track sign-in intent
    document.querySelectorAll('[onclick*="openAuthModal"]').forEach(el => {
        el.addEventListener('mouseenter', () => IframeLoader.trackIntent(40));
    });
    
    // Track idle time for preloading
    let idleTimer;
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            IframeLoader.trackIntent(15);
            // Skip if it's an auth link
        }, 5000);
    }
    
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    resetIdleTimer();
});

// ========================================
// DAY SELECTOR FUNCTIONALITY
function setupDaySelectors() {
    const dayBadges = document.querySelectorAll('.day-badge');
    const exploreBtn = document.querySelector('.cta-primary');
    
    // Initialize with default state (Monday-Friday)
    let selectedDays = [2, 3, 4, 5, 6]; // Default weeknight selection
    
    // Update UI to reflect default state
    updateDaySelection();
    updateExploreURL();
    
    // Add click handlers to day badges
    dayBadges.forEach((badge, index) => {
        badge.addEventListener('click', function() {
            const dayNumber = index + 1; // 1-7 for Sunday-Saturday
            
            // Special Sunday toggle logic based on original site behavior
            if (dayNumber === 1) { // Sunday clicked
                if (selectedDays.length === 0) {
                    // Empty → Full week except Sunday
                    selectedDays = [2, 3, 4, 5, 6];
                } else if (selectedDays.includes(1)) {
                    // Remove Sunday if selected
                    selectedDays = selectedDays.filter(d => d !== 1);
                } else {
                    // Add Sunday
                    selectedDays.push(1);
                    selectedDays.sort((a, b) => a - b);
                }
            } else {
                // Regular day toggle
                if (selectedDays.includes(dayNumber)) {
                    selectedDays = selectedDays.filter(d => d !== dayNumber);
                } else {
                    selectedDays.push(dayNumber);
                    selectedDays.sort((a, b) => a - b);
                }
            }
            
            // Update UI
            updateDaySelection();
            updateExploreURL();
        });
    });
    
    function updateDaySelection() {
        dayBadges.forEach((badge, index) => {
            const dayNumber = index + 1;
            if (selectedDays.includes(dayNumber)) {
                badge.classList.add('active');
            } else {
                badge.classList.remove('active');
            }
        });
        
        // Update check-in/out display
        updateCheckInOutDisplay();
        
        // Update URL parameters (matching original site format)
        updateURLParameters();
    }
    
    function updateCheckInOutDisplay() {
        const checkInOut = document.querySelector('.check-in-out');
        if (!checkInOut) return;
        
        if (selectedDays.length === 0) {
            checkInOut.innerHTML = '<span>Select days</span>';
            return;
        }
        
        // Check if days are continuous
        const continuous = areDaysContinuous(selectedDays);
        
        if (continuous && selectedDays.length > 1) {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const firstDay = dayNames[selectedDays[0] - 1];
            const lastDay = dayNames[selectedDays[selectedDays.length - 1] - 1];
            checkInOut.innerHTML = `
                <span>Check-in: ${firstDay} 3PM</span>
                <span class="separator">→</span>
                <span>Check-out: ${lastDay} 10AM</span>
            `;
        } else {
            // Non-continuous or single day
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const selectedDayNames = selectedDays.map(d => dayNames[d - 1]).join(', ');
            checkInOut.innerHTML = `<span>Selected: ${selectedDayNames}</span>`;
        }
    }
    
    function updateURLParameters() {
        const params = new URLSearchParams(window.location.search);
        
        if (selectedDays.length > 0) {
            // Match original site format with %2C%20 encoding
            const daysParam = selectedDays.join(', ');
            params.set('days-selected', daysParam);
        } else {
            params.delete('days-selected');
        }
        
        // Update URL without page reload
        const newURL = window.location.pathname + 
            (params.toString() ? '?' + params.toString() : '');
        window.history.replaceState({}, '', newURL);
    }
    
    function updateExploreURL() {
        if (exploreBtn) {
            const baseURL = 'https://app.split.lease/search-split-leases';
            const params = new URLSearchParams();
            
            // Only add parameters if days are selected
            if (selectedDays.length > 0) {
                params.set('Days', selectedDays.join(','));
                params.set('Frequency', 'Weekly');
            }
            
            const targetURL = params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
            
            // Update button click handler
            exploreBtn.onclick = function() {
                window.open(targetURL, '_blank');
            };
        }
    }
}

// Check if selected days are continuous
function areDaysContinuous(days) {
    if (days.length <= 1) return true;
    
    const sorted = [...days].sort((a, b) => a - b);
    
    // Check if days wrap around (e.g., Fri-Sat-Sun-Mon)
    const hasWrapAround = sorted.includes(1) && sorted.includes(7);
    
    if (hasWrapAround) {
        // For wrap-around, we need to check two segments
        // Split into two groups: start of week and end of week
        const startWeek = sorted.filter(d => d <= sorted.find(d => {
            const nextDay = d === 7 ? 1 : d + 1;
            return !sorted.includes(nextDay) && d !== Math.max(...sorted);
        }));
        
        const endWeek = sorted.filter(d => !startWeek.includes(d));
        
        // Check continuity of each segment
        const startContinuous = startWeek.every((day, i) => {
            if (i === 0) return true;
            return day === startWeek[i - 1] + 1;
        });
        
        const endContinuous = endWeek.every((day, i) => {
            if (i === 0) return true;
            return day === endWeek[i - 1] + 1;
        });
        
        // Check if end connects to start (wrap-around)
        const wrapsCorrectly = endWeek.length === 0 || 
            (endWeek[endWeek.length - 1] === 7 && startWeek[0] === 1);
        
        return startContinuous && endContinuous && wrapsCorrectly;
    } else {
        // No wrap-around, check simple continuity
        return sorted.every((day, i) => {
            if (i === 0) return true;
            return day === sorted[i - 1] + 1;
        });
    }
}

// ========================================
// SCHEDULE CONTROLS (ANIMATION)
function setupScheduleControls() {
    const scheduleCards = document.querySelectorAll('.schedule-card');
    
    scheduleCards.forEach(card => {
        const controls = card.querySelector('.schedule-controls');
        if (!controls) return;
        
        const playPauseBtn = controls.querySelector('.control-play-pause');
        const stopBtn = controls.querySelector('.control-stop');
        const seekSlider = controls.querySelector('.seek-slider');
        const loopToggle = controls.querySelector('.loop-toggle');
        
        let isPlaying = false;
        let currentFrame = 0;
        let animationInterval = null;
        let isLooping = true;
        
        // Play/Pause functionality
        playPauseBtn?.addEventListener('click', () => {
            if (isPlaying) {
                pauseAnimation();
            } else {
                playAnimation();
            }
        });
        
        // Stop functionality
        stopBtn?.addEventListener('click', () => {
            stopAnimation();
        });
        
        // Seek slider
        seekSlider?.addEventListener('input', (e) => {
            currentFrame = parseInt(e.target.value);
            updateFrame();
        });
        
        // Loop toggle
        loopToggle?.addEventListener('click', () => {
            isLooping = !isLooping;
            loopToggle.classList.toggle('active', isLooping);
        });
        
        function playAnimation() {
            isPlaying = true;
            playPauseBtn.innerHTML = '⏸';
            
            animationInterval = setInterval(() => {
                currentFrame++;
                
                if (currentFrame > 100) {
                    if (isLooping) {
                        currentFrame = 0;
                    } else {
                        pauseAnimation();
                        return;
                    }
                }
                
                updateFrame();
            }, 100); // 10fps animation
        }
        
        function pauseAnimation() {
            isPlaying = false;
            playPauseBtn.innerHTML = '▶️';
            clearInterval(animationInterval);
        }
        
        function stopAnimation() {
            pauseAnimation();
            currentFrame = 0;
            updateFrame();
        }
        
        function updateFrame() {
            if (seekSlider) {
                seekSlider.value = currentFrame;
            }
            
            // Update visual representation based on frame
            updateScheduleVisual(card, currentFrame);
        }
        
        function updateScheduleVisual(card, frame) {
            const dayBadges = card.querySelectorAll('.calendar-week .day');
            const scheduleType = card.dataset.schedule || 'weeknight';
            
            // Define animation patterns for each schedule type
            const patterns = {
                'weeknight': [0, 1, 1, 1, 1, 1, 0], // Mon-Fri
                'weekend': [1, 1, 0, 0, 0, 1, 1],   // Fri-Mon
                'monthly': [1, 1, 1, 1, 1, 1, 1]    // All days
            };
            
            const pattern = patterns[scheduleType];
            
            // Simple animation: highlight days in sequence
            dayBadges.forEach((badge, index) => {
                const shouldHighlight = pattern[index] && (frame % 20 < 10);
                badge.classList.toggle('active', shouldHighlight);
            });
        }
    });
}

// ========================================
// PROPERTY CARDS FUNCTIONALITY
function setupPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    const loadMoreBtn = document.querySelector('.btn-outline');
    
    // Real property IDs from the original Split Lease site
    const propertyData = [
        { id: '1586447992720x748691103167545300', name: 'Brooklyn Studio' },
        { id: '1586468591337x654204646951084000', name: 'Manhattan 1BR' },
        { id: '1594744685684x357917078141157400', name: 'Queens 2BR' }
    ];
    
    propertyCards.forEach((card, index) => {
        if (propertyData[index]) {
            card.dataset.propertyId = propertyData[index].id;
            
            // Add click handler to redirect to property page
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                const propertyId = this.dataset.propertyId;
                const selectedDays = getSelectedDaysFromURL();
                
                // Build URL matching original Split Lease structure
                const baseURL = 'https://app.split.lease/view-split-lease';
                const params = new URLSearchParams();
                params.set('id', propertyId);
                
                if (selectedDays.length > 0) {
                    params.set('days', selectedDays.join(','));
                }
                
                const targetURL = `${baseURL}?${params.toString()}`;
                
                // Show notification before redirect
                showToast('Redirecting to property page...');
                
                setTimeout(() => {
                    window.open(targetURL, '_blank');
                }, 500);
            });
        }
    });
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreListings);
    }
}

// Get selected days from URL parameters
function getSelectedDaysFromURL() {
    const params = new URLSearchParams(window.location.search);
    const daysParam = params.get('days-selected');
    
    if (daysParam) {
        // Parse the days parameter (format: "1, 2, 3, 4, 5")
        return daysParam.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
    }
    
    // Return default weeknight selection if no parameter
    return [2, 3, 4, 5, 6];
}

// Load more listings function
function loadMoreListings() {
    // Since this is a demo, redirect to search page with current filters
    const selectedDays = getSelectedDaysFromURL();
    const baseURL = 'https://app.split.lease/search-split-leases';
    const params = new URLSearchParams();
    
    if (selectedDays.length > 0) {
        params.set('Days', selectedDays.join(','));
        params.set('Frequency', 'Weekly');
    }
    
    const targetURL = params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
    
    showToast('Loading more rentals...');
    
    setTimeout(() => {
        window.open(targetURL, '_blank');
    }, 500);
}

// ========================================
// AUTHENTICATION MODAL
// Auth Modal Functions - Simplified for redirect
function setupAuthModal() {
    // All auth-related clicks now redirect directly to Split Lease
    // Modal elements kept for compatibility but not shown
}

// State management for iframe loading
const modal = document.getElementById('authModal');
const iframe = document.getElementById('authIframe');

// If modal exists, set up listeners
if (modal && iframe) {
    // Event listeners are now handled by IframeLoader.loadAuthIframe()
}

// Close button functionality
const closeBtn = document.querySelector('.auth-modal-close');
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        closeAuthModal();
    });
}

// Click outside to close
window.addEventListener('click', (event) => {
    const authModal = document.getElementById('authModal');
    
    // If click target is the modal overlay (not the content)
    if (event.target === authModal) {
        closeAuthModal();
    }
});

// ========================================
// IFRAME LOADING STATE MANAGEMENT
// Manages loading states for auth and market research iframes
window.IframeLoader = {
    states: {
        marketResearch: 'NOT_LOADED',
        auth: 'NOT_LOADED',
    },
    
    intentScore: 0,
    preloadThreshold: 30,
    hasPreloaded: false,
    
    loadAuthIframe() {
        if (this.states.auth !== 'NOT_LOADED') {
            // Auth iframe already loaded or loading
            return;
        }
        
        const iframe = document.getElementById('authIframe');
        if (iframe) {
            // Loading auth iframe on demand
            this.states.auth = 'LOADING';
            iframe.src = 'https://app.split.lease/signup-login';
            
            iframe.onload = () => {
                clearTimeout(loadTimeout);
                this.states.auth = 'LOADED';
                // Auth iframe loaded successfully
            };
            
            const loadTimeout = setTimeout(() => {
                if (this.states.auth === 'LOADING') {
                    this.states.auth = 'ERROR';
                    console.error('Auth iframe failed to load');
                }
            }, 10000);
        }
    },
    
    preloadAuthIframe() {
        if (this.states.auth === 'NOT_LOADED') {
            // Intent detected - preloading auth iframe
            this.hasPreloaded = true;
            
            // Only preload if we have high confidence user will click sign in
            if (this.intentScore >= 50) {
                // High intent - preload now
                this.loadAuthIframe();
            }
        }
    },
    
    trackIntent(points) {
        this.intentScore += points;
        // Intent: +{points} | Total: {this.intentScore}
        
        if (this.intentScore >= this.preloadThreshold && this.states.auth === 'NOT_LOADED') {
            this.preloadAuthIframe();
        }
    }
};

// Direct redirect to login page or profile if logged in
function openAuthModal(section) {
    // Check if user is logged in
    const authStatus = checkSplitLeaseCookies();
    
    if (authStatus.isLoggedIn) {
        // User is logged in, redirect to profile
        console.log(`🔀 Redirecting to profile for ${authStatus.username}`);
        window.location.href = 'https://app.split.lease/account-profile';
    } else {
        // User not logged in, redirect to login page
        let url = 'https://app.split.lease/signup-login';
        if (section) {
            url += `#${section}`;
        }
        window.location.href = url;
    }
}

// Close auth modal (kept for compatibility but not used)
function closeAuthModal() {
    // No longer used since we redirect directly
}

// Market Research Modal Functions with Login Detection
function setupMarketResearchModal() {
    const modal = document.getElementById('marketResearchModal');
    const iframe = document.getElementById('marketResearchIframe');
    const loader = document.getElementById('marketResearchLoader');
    
    if (modal && iframe) {
        // Configure message listener for closing modal
        window.addEventListener('message', function(event) {
            if (event.origin === 'https://app.split.lease') {
                if (event.data === 'close-market-research' || 
                    event.data.action === 'close' ||
                    event.data.type === 'close-modal') {
                    closeMarketResearchModal();
                }
            }
        });
    }
}

function openMarketResearchModal() {
    const modal = document.getElementById('marketResearchModal');
    const iframe = document.getElementById('marketResearchIframe');
    const loader = document.getElementById('marketResearchLoader');
    
    if (modal) {
        modal.classList.add('active');
        
        if (iframe && (!iframe.src || iframe.src === '' || iframe.src === 'about:blank')) {
            if (loader) loader.style.display = 'block';
            iframe.src = 'https://app.split.lease/embed-ai-drawer';
            iframe.onload = function() {
                // Hide loader and check auth when iframe loads
                if (loader) loader.style.display = 'none';
                iframe.style.visibility = 'visible';
                
                // Check auth state after iframe loads
                checkBubbleAuthState(iframe);
            };
        } else {
            // If already loaded, hide loader immediately and check auth
            if (loader) loader.style.display = 'none';
            if (iframe) iframe.style.visibility = 'visible';
            
            // Check auth state for preloaded iframe
            checkBubbleAuthState(iframe);
        }
    }
}

// Check Bubble auth state using cross-origin safe methods only
function checkBubbleAuthState(iframe) {
    console.log('🔍 Iframe loaded - Checking auth state...');
    
    // First check cookies set by Bubble app
    const cookieAuth = checkSplitLeaseCookies();
    if (cookieAuth.isLoggedIn) {
        console.log('✅ Iframe auth confirmed via cookies:');
        console.log('   Username:', cookieAuth.username);
        return true;
    }
    
    // Send postMessage to request auth state from iframe
    try {
        iframe.contentWindow.postMessage(
            { type: 'request-auth-state' }, 
            'https://app.split.lease'
        );
        console.log('📨 Sent auth state request via postMessage');
    } catch (postMessageError) {
        console.error('Failed to send postMessage:', postMessageError);
    }
    
    // Check cached auth state as fallback
    setTimeout(() => {
        const cachedAuth = localStorage.getItem('bubble_market_research_auth');
        const cachedTime = localStorage.getItem('bubble_market_research_auth_time');
        
        if (cachedAuth && cachedTime) {
            const timeDiff = Date.now() - parseInt(cachedTime);
            // Use cache if less than 1 minute old
            if (timeDiff < 60000) {
                const isLoggedIn = cachedAuth === 'true';
                console.log(`🔐 Auth Status (from cache): User is ${isLoggedIn ? 'LOGGED IN' : 'NOT LOGGED IN'}`);
                
                // Show alert if user is logged in (from cache)
                if (isLoggedIn) {
                    alert('Logging in...');
                }
                
                return isLoggedIn;
            } else {
                console.log('🔄 Cache expired, clearing...');
                localStorage.removeItem('bubble_market_research_auth');
                localStorage.removeItem('bubble_market_research_auth_time');
            }
        } else {
            console.log('ℹ️ No cached auth state available');
        }
    }, 500);
    
    return null;
}

// Delayed preload for Market Research iframe
function setupDelayedMarketResearchPreload() {
    console.log('⏰ Scheduling Market Research iframe preload in 4 seconds...');
    
    setTimeout(() => {
        console.log('🏃 Starting delayed preload now...');
        preloadMarketResearchIframe();
    }, 4000);
}

// Preload Market Research iframe
function preloadMarketResearchIframe() {
    const iframe = document.getElementById('marketResearchIframe');
    
    if (iframe && (!iframe.src || iframe.src === '' || iframe.src === 'about:blank' || iframe.src === window.location.href)) {
        console.log('🚀 Starting to preload Market Research iframe...');
        
        // Set the iframe source to preload it
        iframe.src = 'https://app.split.lease/embed-ai-drawer';
        
        // Hide the iframe while preloading
        const modal = document.getElementById('marketResearchModal');
        if (modal && !modal.classList.contains('active')) {
            iframe.style.visibility = 'hidden';
        }
        
        // Set iframe state
        IframeLoader.states.marketResearch = 'LOADING';
        
        // When iframe loads, check auth state
        iframe.onload = function() {
            console.log('✅ Market Research iframe preloaded successfully');
            console.log('🔐 Checking authentication after iframe load...');
            IframeLoader.states.marketResearch = 'LOADED';
            iframe.style.visibility = 'hidden'; // Keep hidden until modal opens
            
            // Check auth state after a delay to allow Bubble page to fully render
            setTimeout(() => {
                console.log('🕒 Delayed auth check (allowing Bubble to set cookies)...');
                const authResult = checkBubbleAuthState(iframe);
                console.log(`📊 Iframe auth check result: ${authResult ? 'AUTHENTICATED' : 'CHECKING/NOT AUTHENTICATED'}`);
            }, 2000);
        };
        
        iframe.onerror = function() {
            console.log('❌ Failed to preload Market Research iframe');
            IframeLoader.states.marketResearch = 'ERROR';
        };
    } else if (iframe && iframe.src && iframe.src !== 'about:blank') {
        console.log('✅ Market Research iframe already loaded');
        
        // Check auth state with delay to ensure Bubble page is fully rendered
        setTimeout(() => {
            console.log('🕒 Checking auth state after delay...');
            checkBubbleAuthState(iframe);
        }, 2000);
    }
}

function closeMarketResearchModal() {
    const modal = document.getElementById('marketResearchModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Keep existing interface functions for compatibility
window.openMarketResearchModal = openMarketResearchModal;
window.closeMarketResearchModal = closeMarketResearchModal;

// Make this available globally (for testing from console)
window.checkBubbleAuthState = checkBubbleAuthState;

// Override to use iframe loader
IframeLoader.states.auth = 'LOADED';

// Empty functions for backward compatibility
function showLoginForm() {}
function showSignupForm() {}
function switchToWelcome() {}
function switchToLogin() {}
function switchToSignup() {}
function handleAuthSubmit() {}
function showForgotPassword() {}
function handleLogin() {}
function handleSignup() {}

// Auth State Discovery System - Hybrid Approach
const AuthStateManager = {
    isLoggedIn: false,
    hasAttemptedCheck: false,
    checkTimeout: null,
    checkAttempts: 0,
    maxCheckAttempts: 2,
    
    // Initialize auth state checking after page load
    init() {
        // Start with cached check
        this.checkCachedAuth();
        
        // Then try fetch API
        this.checkViaAPI();
        
        // Backup: iframe probe
        setTimeout(() => {
            if (!this.hasAttemptedCheck) {
                this.checkViaIframe();
            }
        }, 2000);
    },
    
    // Check cached auth state
    checkCachedAuth() {
        const lastAuth = localStorage.getItem('split_lease_last_auth');
        const authExpiry = localStorage.getItem('split_lease_auth_expiry');
        
        if (lastAuth && authExpiry) {
            const now = Date.now();
            const expiryTime = parseInt(authExpiry);
            
            // Check if auth is still valid (within 24 hours)
            if (now < expiryTime) {
                this.isLoggedIn = true;
                this.updateUIForLoggedInState();
                // Likely logged in (from cache)
            } else {
                // Auth expired, clean up
                localStorage.removeItem('split_lease_last_auth');
                localStorage.removeItem('split_lease_auth_expiry');
            }
        } else {
            // No cached auth found
        }
    },
    
    // Check via API (CORS-friendly endpoint)
    checkViaAPI() {
        if (this.checkAttempts >= this.maxCheckAttempts) {
            // Max attempts reached
            return;
        }
        
        this.checkAttempts++;
        this.hasAttemptedCheck = true;
        
        // Attempting API auth check...
        
        fetch('https://app.split.lease/api/1.1/wf/check_auth', {
            method: 'GET',
            // This endpoint returns user data if logged in, or empty/error if not
            mode: 'cors',
            credentials: 'include', // Include cookies for auth
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            // Auth check response
            
            // Even a 200 with empty data means not authenticated
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Not authenticated');
            }
        })
        .then(data => {
            // Check if data contains user information
            const hasUserData = data && (
                data.user_id || 
                data.email || 
                data.authenticated === true ||
                Object.keys(data).length > 0
            );
            
            // Auth check data received
            const timestamp = Date.now();
            const wasLoggedIn = this.isLoggedIn;
            this.isLoggedIn = hasUserData;
            
            if (hasUserData) {
                // User is logged in
                localStorage.setItem('split_lease_last_auth', timestamp.toString());
                localStorage.setItem('split_lease_auth_expiry', (timestamp + 86400000).toString()); // 24 hours
                
                if (!wasLoggedIn) {
                    this.updateUIForLoggedInState();
                } else {
                    // Still logged in
                }
            } else {
                // No user data means not logged in
                localStorage.removeItem('split_lease_last_auth');
                localStorage.removeItem('split_lease_auth_expiry');
                
                if (wasLoggedIn) {
                    this.updateUIForLoggedOutState();
                } else {
                    // Not logged in
                }
            }
            
            clearTimeout(this.checkTimeout);
        })
        .catch(error => {
            // Auth check error
            
            // Error means not authenticated or CORS issue
            // In production, this is normal for logged-out users
            
            // Only treat as logged-out if this is our first real check
            if (this.checkAttempts === 1) {
                // Assume logged out
                const wasLoggedIn = this.isLoggedIn;
                this.isLoggedIn = false;
                
                localStorage.removeItem('split_lease_last_auth');
                localStorage.removeItem('split_lease_auth_expiry');
                
                if (wasLoggedIn) {
                    this.updateUIForLoggedOutState();
                } else {
                // Not logged in
                }
            }
        });
        
        // Timeout fallback - assume logged out if no response in 5 seconds
        this.checkTimeout = setTimeout(() => {
            if (this.hasAttemptedCheck && !this.isLoggedIn) {
                // Check timeout - assuming logged out
                this.isLoggedIn = false;
                localStorage.removeItem('split_lease_last_auth');
                localStorage.removeItem('split_lease_auth_expiry');
                this.updateUIForLoggedOutState();
            }
        }, 5000);
    },
    
    // Check via hidden iframe (backup method)
    checkViaIframe() {
        // Attempting iframe auth check...
        
        // Create a minimal iframe to check auth
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.src = 'https://app.split.lease/api/1.1/wf/check_auth';
        
        testFrame.onload = () => {
            // Try to check if load was successful
            try {
                // If we can access it, user might be logged in
                const doc = testFrame.contentDocument || testFrame.contentWindow.document;
                
                // If we get here without error, might indicate auth
                // But we can't read cross-origin content
                
                // Optimistically assume logged in if no error
                const timestamp = Date.now();
                if (!this.isLoggedIn) {
                    this.isLoggedIn = true;
                    localStorage.setItem('split_lease_last_auth', timestamp.toString());
                    localStorage.setItem('split_lease_auth_expiry', (timestamp + 86400000).toString());
                    this.updateUIForLoggedInState();
                } else {
                    // Can't access content but load succeeded - likely authenticated
                }
            } catch (e) {
                // Cross-origin error is expected
                // Can't determine auth state this way
            }
            
            // Clean up
            document.body.removeChild(testFrame);
        };
        
        testFrame.onerror = () => {
            // Iframe failed - not logged in
            this.isLoggedIn = false;
            localStorage.removeItem('split_lease_last_auth');
            localStorage.removeItem('split_lease_auth_expiry');
            this.updateUIForLoggedOutState();
            
            // Clean up
            if (testFrame.parentNode) {
                document.body.removeChild(testFrame);
            }
        };
        
        // Add to page (hidden)
        document.body.appendChild(testFrame);
        
        // Timeout cleanup
        setTimeout(() => {
            if (testFrame.parentNode) {
                document.body.removeChild(testFrame);
            }
        }, 10000);
    },
    
    // Update UI to reflect logged-in state
    updateUIForLoggedInState() {
        
        // User is LOGGED IN
    },
    
    // Update UI to reflect logged-out state  
    updateUIForLoggedOutState() {
        
        // User is LOGGED OUT
    },
    
    // Force a fresh auth check
    forceCheck() {
        this.checkAttempts = 0;
        this.hasAttemptedCheck = false;
        this.checkViaAPI();
    },
    
    // Get current state
    isAuthenticated() {
        return this.isLoggedIn;
    },
    
    // Get current auth state
    getState() {
        return {
            isLoggedIn: this.isLoggedIn,
            lastChecked: localStorage.getItem('split_lease_last_auth'),
            expiresAt: localStorage.getItem('split_lease_auth_expiry')
        };
    }
};

// Auth state discovery removed - using delayed preload instead

// ========================================
// REFERRAL FORM FUNCTIONALITY
function setupReferralForm() {
    const referralForm = document.querySelector('.referral-form');
    if (!referralForm) return;
    
    const messageInput = referralForm.querySelector('input[type="text"]');
    const emailOption = referralForm.querySelector('input[value="email"]');
    const smsOption = referralForm.querySelector('input[value="sms"]');
    const shareBtn = referralForm.querySelector('.share-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            processReferral();
        });
    }
    
    function processReferral() {
        const message = messageInput?.value || '';
        const method = emailOption?.checked ? 'email' : 'sms';
        
        if (!message) {
            showToast('Please enter a message');
            return;
        }
        
        // Simulate referral processing
        showToast(`Sending referral via ${method}...`);
        
        setTimeout(() => {
            showToast('Referral sent successfully! 🎉');
            messageInput.value = '';
        }, 1500);
    }
}

// ========================================
// IMPORT LISTING FORM
function setupImportForm() {
    const importSection = document.querySelector('.footer-column:last-child');
    if (!importSection) return;
    
    const urlInput = importSection.querySelector('input[type="url"]');
    const importBtn = importSection.querySelector('.import-btn');
    
    if (importBtn) {
        importBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleImportListing();
        });
    }
    
    function handleImportListing() {
        const url = urlInput?.value || '';
        
        if (!url) {
            showToast('Please enter a listing URL');
            return;
        }
        
        if (!isValidURL(url)) {
            showToast('Please enter a valid URL');
            return;
        }
        
        // Check if it's an Airbnb or similar platform URL
        const supportedPlatforms = ['airbnb.com', 'vrbo.com', 'booking.com', 'zillow.com'];
        const isSupported = supportedPlatforms.some(platform => url.includes(platform));
        
        if (!isSupported) {
            showToast('Please enter a URL from Airbnb, VRBO, Booking.com, or Zillow');
            return;
        }
        
        showToast('Importing listing...');
        
        // Simulate import process
        setTimeout(() => {
            showToast('Listing imported successfully! 🏠');
            urlInput.value = '';
        }, 2000);
    }
    
    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// ========================================
// FLOATING MARKET RESEARCH BADGE
function setupFloatingBadge() {
    const badge = document.querySelector('.market-research-badge');
    
    if (!badge) {
        // Create the badge if it doesn't exist
        const badgeHTML = `
            <div class="market-research-badge" onclick="openMarketResearchModal()">
                <span class="badge-text">Free Market Research</span>
                <span class="badge-close" onclick="event.stopPropagation(); this.parentElement.style.display='none';">×</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', badgeHTML);
    }
    
    // Show badge by default (unless user is logged in)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        if (badge) badge.style.display = 'none';
    }
    
    // Listen for auth events
    window.addEventListener('userLoggedIn', function() {
        const badge = document.querySelector('.market-research-badge');
        localStorage.setItem('isLoggedIn', 'true');
        if (badge) badge.style.display = 'none';
    });
    
    window.addEventListener('userLoggedOut', function() {
        const badge = document.querySelector('.market-research-badge');
        localStorage.setItem('isLoggedIn', 'false');
        if (badge) badge.style.display = 'flex';
    });
}

// ========================================
// TOAST NOTIFICATIONS
function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========================================
// HEADER SCROLL BEHAVIOR
let lastScroll = 0;
const header = document.querySelector('header');
const headerHeight = header?.offsetHeight || 72;

window.addEventListener('scroll', () => {
    if (!header) return;
    
    const currentScroll = window.pageYOffset;
    
    // Show header when scrolling up or at top
    if (currentScroll <= 0 || currentScroll < lastScroll) {
        header.style.transform = 'translateY(0)';
    } else if (currentScroll > lastScroll && currentScroll > headerHeight) {
        // Hide header when scrolling down
        header.style.transform = 'translateY(-100%)';
    }
    
    lastScroll = currentScroll;
});

// Emergency Assistance button handler
function handleEmergencyAssistance() {
    const authStatus = checkSplitLeaseCookies();
    
    if (authStatus.isLoggedIn) {
        // User is logged in, redirect to profile
        console.log(`🚨 Emergency Assistance - Redirecting to profile for ${authStatus.username}`);
        window.location.href = 'https://app.split.lease/account-profile';
    } else {
        // User not logged in, redirect to login page
        window.location.href = 'https://app.split.lease/signup-login';
    }
}

// ========================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
window.showToast = showToast;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.processReferral = processReferral;
window.loadMoreListings = loadMoreListings;
window.IframeLoader = IframeLoader;
window.AuthStateManager = AuthStateManager;
window.checkBubbleAuthState = checkBubbleAuthState;
window.handleEmergencyAssistance = handleEmergencyAssistance;

// Empty functions to maintain compatibility
window.showLoginForm = showLoginForm;
window.showSignupForm = showSignupForm;
window.switchToWelcome = switchToWelcome;
window.handleLogin = handleLogin;