# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Split Lease website clone - a fully responsive, interactive web application built with vanilla HTML, CSS, and JavaScript. The project was created as a modern recreation of the split.lease website, implementing periodic tenancy rental features.

## Development Context & History

### Project Creation
- Originally created by analyzing the Split Lease website (https://split.lease) 
- Built from scratch using vanilla web technologies (no frameworks)
- Designed to demonstrate modern web development practices
- Repository: https://github.com/splitleasesharath/index_lite

### Key Implementation Decisions
1. **No External Dependencies**: Pure HTML/CSS/JS for maximum portability
2. **Placeholder Assets**: Uses emoji icons and gradient placeholders instead of images to avoid asset dependencies
3. **GitHub Pages Ready**: Optimized for static hosting without backend requirements
4. **Responsive First**: Mobile-friendly design with CSS Grid and Flexbox

## Commands

### Local Development
```bash
# Run local server (Python)
python -m http.server 8000

# Open in browser directly (Windows)
start index.html

# Run local server (Node.js alternative)
npx http-server
```

### Git Operations (MANDATORY WORKFLOW)
**CRITICAL RULE**: ALWAYS pull before making changes, push after making changes
```bash
# STEP 1: Always pull first before making any changes
git pull origin main

# STEP 2: Make your changes to files
# (edit files here)

# STEP 3: Stage and commit changes (without sensitive files)
git add index.html styles.css script.js README.md CLAUDE.md
git commit -m "Your commit message with context"

# STEP 4: Always push immediately after committing
git push origin main
```

**MANDATORY**: This workflow must be followed religiously for EVERY SINGLE change to prevent merge conflicts and ensure continuous deployment.

### GitHub Pages Deployment
- Repository is configured for GitHub Pages
- Site URL: https://splitleasesharath.github.io/index_lite
- Deployment: Automatic on push to main branch
- Settings: Repository Settings → Pages → Deploy from main branch (root)

## Architecture

### File Structure
```
index_lite/
├── index.html       # Single-page application structure
├── styles.css       # All styling (responsive, animations, components)
├── script.js        # Interactive functionality and DOM manipulation
├── README.md        # User-facing documentation
└── CLAUDE.md        # This file - AI assistant guidance
```

### Core Components

#### Interactive Schedule System
- **Day Selector**: Clickable badges for S M T W T F S
- **Schedule Types**: Weeknight, Weekend, Monthly presets
- **Animation Controls**: Play/pause/stop functionality
- **State Management**: Tracks active/inactive days per schedule

#### Dynamic Features
- **Toast Notifications**: Custom notification system (`showToast()` function)
- **Chat Widget**: Simulated support chat (`openChatWidget()`, `closeChatWidget()`)
- **Property Loading**: Dynamic card generation (`loadMoreListings()`)
- **Referral System**: Form validation and processing (`processReferral()`)

#### Responsive Behaviors
- **Header Auto-hide**: Hides on scroll down, shows on scroll up
- **Smooth Scrolling**: Anchor links with smooth behavior
- **Parallax Effects**: Hero image transforms on scroll
- **Intersection Observer**: Fade-in animations on scroll

### CSS Architecture
- **CSS Custom Properties**: Design tokens in `:root`
- **BEM-like Naming**: Component-based class structure
- **Utility Classes**: Spacing and text alignment helpers
- **Media Queries**: Breakpoint at 768px for mobile

### JavaScript Patterns
- **Event Delegation**: Single DOMContentLoaded listener
- **Module Pattern**: Functions organized by feature (`setupNavigation()`, `setupDaySelectors()`, etc.)
- **State Management**: Complex state tracking for multiple interactive systems
- **Animation Control**: SetInterval/clearInterval for schedules with frame-based timing
- **Toast Notification System**: Centralized `showToast()` for user feedback
- **Modal Management**: Multi-screen authentication system with state transitions
- **URL Parameter Management**: Dynamic URL updates reflecting user selections
- **Focus Management**: Proper keyboard navigation and accessibility patterns

## Advanced Interactive Systems

### Multi-Modal Architecture
The application implements a sophisticated modal system with three distinct screens:
- **Welcome Screen**: Initial user greeting with navigation options
- **Login Screen**: Email/password authentication with validation
- **Signup Screen**: Multi-field registration with government ID matching requirements
- **State Transitions**: Smooth screen switching with proper focus management
- **Overlay Interactions**: Click-to-close and ESC key handling

### Schedule Animation Engine
Custom-built animation system simulating Lottie functionality:
- **Frame-Based Timing**: 0-100 frame range with 10fps animation speed
- **Control Interface**: Play/pause, stop, seek slider, loop toggle
- **State Persistence**: Animation states tracked per schedule type
- **Visual Feedback**: Real-time day badge updates during animation
- **Performance Optimization**: Interval cleanup and memory management

### Day Selection State System
Sophisticated state management for rental day preferences:
- **Multi-State Tracking**: Active/inactive states per day across multiple contexts
- **URL Synchronization**: Real-time URL parameter updates
- **Cross-Component Communication**: State sharing between hero selector and schedule cards
- **Persistence**: State maintained across user interactions and page navigation
- **Validation**: Ensures at least one day selected for meaningful interactions

### Property Navigation System
Dynamic property redirect system with real data integration:
- **Property ID Management**: Real property IDs from original Split Lease site
- **Parameter Construction**: Dynamic URL building with current user state
- **Fallback Handling**: Default values when user state is incomplete
- **External Integration**: Seamless redirection to original site functionality

### Interactive Feedback Architecture
Comprehensive user feedback system throughout the application:
- **Toast Notifications**: Non-intrusive status messages with auto-dismiss
- **Loading States**: Visual feedback during asynchronous operations
- **Hover Effects**: Immediate visual response to user interactions
- **Focus Indicators**: Clear visual cues for keyboard navigation
- **Error Handling**: Graceful degradation with meaningful error messages

## Important Implementation Notes

### Asset Handling
- Images replaced with CSS gradients and emoji to avoid missing assets
- Logo uses initials "SL" in a styled div instead of image
- Property images use gradient placeholders

### GitHub Pages Compatibility
- All paths are relative for subdomain compatibility
- No external API calls (CORS-safe)
- Static content only (no server-side processing)

### Known Limitations
1. Chat widget is simulated (no backend)
2. Property listings are hardcoded examples
3. Referral system doesn't actually send messages
4. "Load More" generates placeholder content

### Security Considerations
- Original downloaded files contained API keys and were removed from git history
- Use orphan branch technique if secrets accidentally committed
- Never commit files from "Old files" directory

## Common Tasks

### Adding New Property Listings
Edit the `loadMoreListings()` function in script.js to add real data or modify the placeholder generation.

### Customizing Schedule Presets
Modify the `resetSchedule()` function to change default day selections for each schedule type.

### Changing Color Scheme
Update CSS custom properties in `:root` selector in styles.css:
- `--primary-color`: Main brand color
- `--primary-hover`: Hover state color
- `--text-dark`: Primary text color
- `--bg-light`: Background color

### Enabling Real Chat Support
Replace `openChatWidget()` function with actual chat service integration (e.g., Intercom, Drift, or custom WebSocket implementation).

## Development Methodology

### Systematic Reverse Engineering Approach
This project follows a unique **CYCLE-based development methodology** for achieving 1:1 functional parity with the original Split Lease website:

1. **Browser Automation Testing**: Use Playwright/browser tools to interact with original site
2. **Screenshot Analysis**: Capture and analyze visual states and interactions  
3. **Behavior Documentation**: Record exact URL patterns, parameter structures, and user flows
4. **Implementation**: Build matching functionality in the clone
5. **Validation**: Test clone behavior against original site patterns
6. **Immediate Deployment**: Commit and push every change for continuous integration

### CYCLE Development Pattern
Each development cycle focuses on one specific interactive element:
- **CYCLE N: [Feature Name]** - Systematic analysis and implementation
- **Browser Testing**: Test original site functionality with automated tools
- **Parameter Analysis**: Document exact URL patterns and data structures
- **Implementation**: Build matching behavior in clone
- **Validation**: Ensure 1:1 functional parity

### Key Development Principles
- **Immediate Git Commits**: Every change committed and pushed immediately
- **Original Site Integration**: Clone redirects to original site for backend functionality
- **Progressive Enhancement**: Build complex interactions incrementally
- **State Consistency**: Maintain consistent state across all user interactions
- **External Compatibility**: Ensure parameters match original site expectations

## Testing Checklist

### Core Functionality Testing
When making changes, verify:
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Day selector toggles work correctly across all contexts
- [ ] Schedule controls animate properly with state persistence
- [ ] Smooth scrolling functions throughout the site
- [ ] Toast notifications appear/disappear with proper timing
- [ ] Header hide/show on scroll with correct thresholds
- [ ] Hover effects on cards and buttons maintain visual consistency
- [ ] Form validation in referral section prevents invalid submissions

### Advanced Interactive Testing
- [ ] Modal system transitions between screens smoothly
- [ ] Authentication forms validate inputs correctly
- [ ] Password visibility toggle functions properly
- [ ] Day selector state persists across page interactions
- [ ] URL parameters update correctly with user selections
- [ ] Property redirects use correct IDs and parameters
- [ ] Footer navigation handles auth-required vs external links
- [ ] Lottie animation controls maintain proper state
- [ ] Support system provides appropriate user feedback
- [ ] All external redirects open in new tabs correctly

### Cross-Browser and Accessibility Testing
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible and logical
- [ ] Screen reader compatibility maintained
- [ ] Touch interactions work on mobile devices
- [ ] Animation performance is smooth across devices

## CRITICAL DEVELOPMENT RULES

**MANDATORY GIT WORKFLOW**: Follow this exact pattern religiously for EVERY change:

### Git Workflow (REQUIRED FOR EVERY CHANGE):
1. **PULL FIRST**: Always run `git pull origin main` before making any modifications
2. **MAKE CHANGES**: Edit files as needed
3. **STAGE**: `git add [files]`
4. **COMMIT**: `git commit -m "descriptive message"`
5. **PUSH**: `git push origin main`

**This workflow applies to**:
- After EVERY file edit (HTML, CSS, JS, MD)
- After EVERY new feature addition
- After EVERY bug fix
- After EVERY refactoring
- No batching of changes allowed
- No exceptions - follow the workflow religiously

### Changelog Management:
- **MANDATORY**: Append detailed context to CLAUDE.md changelog after every change
- Include specific technical details, files modified, and reasoning
- Use reverse chronological order (newest first)
- Never skip changelog updates

This ensures continuous deployment, real-time GitHub Pages updates, and complete change tracking.

<!-- CYCLE 3/5: Verifying workflow consistency across platforms -->
<!-- DEMO 1: Git workflow synchronization test -->
<!-- DEMO 2: Continuous synchronization across machines -->
<!-- DEMO 3: Multi-machine workflow validation -->
<!-- DEMO 4: Testing merge conflict resolution -->

## Deployment Notes

### GitHub Pages Status
- Check deployment: https://github.com/splitleasesharath/index_lite/actions
- Typical deployment time: 3-10 minutes after push
- Cache may need clearing: Ctrl+F5 for hard refresh

### Troubleshooting Deployment
1. Ensure Pages is enabled in repository settings
2. Verify main branch is selected as source
3. Check for build errors in Actions tab
4. Confirm index.html exists in root directory

## Changelog

All changes to the codebase are documented here in reverse chronological order (newest first). This is an append-only section.

### 2025-08-17 (Current Session)
- **MOBILE OVERFLOW FIX**: Complete resolution of schedule cards bleeding outside viewport on mobile
  - Reduced calendar grid max-width from 260px to 240px for better mobile fit
  - Reduced schedule card padding from 1.5rem to 1rem to create more space
  - Optimized calendar header with smaller font size (0.7rem) and reduced padding (0.2rem)
  - Improved calendar day cells with smaller font size (0.8rem) and proper width constraints
  - Enhanced schedule info section to use full width (100%) with proper padding (0.5rem)
  - Fixed explore buttons to use full width without overflow, added text-overflow ellipsis
  - Applied box-sizing: border-box throughout for proper mobile containment
  - All schedule sections (Weeknight, Weekend, Month) now properly contain within mobile viewports
  - Fixed both horizontal bleeding and layout inconsistencies across all mobile screen sizes
- **CRITICAL DEVELOPMENT WORKFLOW**: Enhanced Git workflow documentation in CLAUDE.md
  - Added mandatory 5-step Git workflow: pull → changes → stage → commit → push
  - Added changelog management requirements with detailed context documentation
  - Enforced religious adherence to workflow for every single change

### 2025-08-17 (Previous Session)
- **LAYOUT OPTIMIZATION SESSION**: Addressed user priority requests for space-efficient design
- **Removed 70px white space above header**: 
  - Removed `scroll-padding-top: 80px` from html element that was creating unwanted space
  - Added `margin-top: 72px` to hero section to properly account for fixed header height (72px)
  - Hero section now starts immediately below header with no white gap
- **Fixed showcase sections to single column layout (PRIORITY TASK)**:
  - Converted schedule grid from 3-column desktop layout to single column for all screen sizes
  - Reduced gap from `2rem` to `1rem` for more contracted spacing
  - Added `max-width: 600px` and `margin: 0 auto` for centered, constrained layout
  - Reduced schedule card padding from `2rem` to `1.5rem` for tighter, more efficient design
  - Saves significant vertical space and improves mobile-first responsive experience
- **Updated Git workflow documentation**: Added mandatory pull-before-changes, push-after-changes rule to CLAUDE.md
- **Resolved merge conflicts**: Successfully merged remote changes while maintaining user-requested single column layout

### 2025-08-17 (Earlier Session)
- **30 CYCLES COMPLETE**: Comprehensive feature development across 6 sprints
- **SPRINT 1 (Cycles 1-5)**: Implemented host/stay dropdown menus, fixed footer links, added mobile hamburger menu, enhanced forms with validation, created import listing functionality
- **SPRINT 2 (Cycles 6-10)**: Added loading states for async operations, implemented app download section, added Alexa skill section, created emergency assistance handling, added proper error handling for imports
- **SPRINT 3 (Cycles 11-15)**: Implemented proper form validation (email, phone, URL), added form field focus states, created submit button loading states, added success message animations, implemented form reset after submission
- **SPRINT 4 (Cycles 16-20)**: Added smooth scroll behavior for anchor links, implemented proper focus management for modals, added keyboard shortcuts (Ctrl+K, Ctrl+L, etc.), optimized images with lazy loading, added comprehensive SEO meta tags (Open Graph, Twitter Cards)
- **SPRINT 5 (Cycles 21-25)**: Added Progressive Web App (PWA) support with manifest.json, implemented service worker for offline functionality, added cookie consent banner with localStorage persistence, implemented scroll-to-top button with smooth animation, added search functionality to filter property listings
- **SPRINT 6 (Cycles 26-30)**: Added loading skeleton screens for better UX, implemented dark mode toggle with theme persistence, added property comparison feature (up to 3 properties), implemented testimonials carousel with auto-rotation, added final performance optimizations (preload directives, will-change CSS, error boundaries)

### 2025-08-16
- **SYSTEMATIC REVERSE ENGINEERING PROJECT**: 12+ cycle deep analysis of original Split Lease site
- Added CRITICAL DEVELOPMENT RULE for immediate Git pushes after every change
- Added Changelog section to CLAUDE.md for tracking all modifications
- Updated color scheme to match original purple theme (#5B21B6)
- Fixed header styling with purple background and white text
- Fixed footer styling with purple background and proper text colors
- Added floating "Free Market Research" badge with gradient background
- Implemented complete sign-in/sign-up modal system with three screens:
  - Welcome screen with "Have we met before?" message
  - Login form with email and password fields
  - Signup form with first name, last name, and email
- Added modal animations, transitions, and password visibility toggle
- Modal matches original site design with proper styling and interactions
- **CYCLE 1**: Implemented interactive hero section day selector functionality:
  - Added clickable day badges (S M T W T F S) with purple highlight
  - Added check-in/check-out display that updates based on selection
  - Added URL parameter tracking (?days-selected=1,2,3,4,5)
  - Matches original site behavior exactly with default weeknight selection
- **CYCLE 2**: Implemented Explore Rentals button redirect functionality:
  - Button now redirects to search page with proper URL parameters
  - Passes selected days and weekly frequency to search URL
  - Opens original Split Lease search page in new tab
  - Matches original site redirect behavior exactly
- **CYCLE 3**: Implemented Lottie animation controls for schedule section:
  - Added play/pause, stop, seek slider, and loop toggle controls
  - SVG icons for all control buttons with hover states
  - Frame-based animation system with 0-100 range
  - Simulated Lottie-like functionality without external dependencies
- **CYCLE 4**: Implemented explore button functionality for schedule sections:
  - Weeknight listings redirect with days 2,3,4,5,6 (Mon-Fri)
  - Weekend listings redirect with days 6,7,1,2 (Fri-Sun+Mon-Tue)
  - Proper URL parameter construction matching original site patterns
- **CYCLE 5**: Implemented property card click redirects to original listings:
  - Real property IDs from original site (1586447992720x748691103167545300, etc.)
  - Click handlers redirect to view-split-lease pages with day parameters
  - Toast notifications for user feedback before redirect
- **CYCLE 6**: Implemented Show me more Rentals button redirect:
  - Redirects to search page with current day selection
  - Falls back to default days if no selection active
  - Matches original site's load-more functionality
- **CYCLE 7**: Implemented support contact options analysis and functionality:
  - Chat widget simulation with Crisp-style interface
  - Call support with toast notification
  - Email and FAQ placeholder functionality
  - Matches original site's support structure
- **CYCLE 8**: Implemented footer navigation functionality:
  - Authentication-required links (List Property Now, How to List, Speak to an Agent)
  - External navigation links to original site URLs
  - Emergency assistance with safety messaging
  - Toast notifications for all footer interactions

### 2025-08-17 (Continued Session)
- **URL BEHAVIOR IMPLEMENTATION**: Implemented exact day selector URL behavior matching original site:
  - Analyzed original site by systematically clicking each day selector 5 times
  - Documented URL patterns with %2C%20 encoding for "days-selected" parameter  
  - Implemented identical toggle behavior for Sunday with specific patterns:
    - Empty → 1,2,3,4,5,6 → 2,3,4,5,6 → 1,2,3,4,5,6 cycle
  - Added URL parameter state management and persistence
  - Modified script.js with complete day selector rewrite
- **HERO IMAGE POSITIONING**: Repositioned hero section images 10% lower for better visual balance:
  - Left illustration: changed bottom from 15% to 5%  
  - Right illustration: changed bottom from 10% to 0%
  - Modified styles.css hero illustration positioning
- **SCHEDULE LAYOUT OPTIMIZATION**: Implemented horizontal desktop layout for schedule sections:
  - Added !important override to ensure 3-column grid on desktop (min-width: 1024px)
  - Maintained existing mobile responsiveness with single column layout
  - Schedule cards now display horizontally on desktop: Weeknight | Weekend | Month
- **COMPACT SCHEDULE DESIGN**: Made schedule cards more compact and professional:
  - Changed content layout from centered to top-aligned (flex-start)
  - Reduced gap from 3rem to 2rem and padding from 2rem to 1.5rem
  - Set fixed calendar width (280px) for consistency across cards
  - Positioned text content to the right of calendar visuals
  - Enhanced schedule-info with proper flex column layout
  - Modified styles.css schedule visual and grid styling
- **GIT WORKFLOW ENHANCEMENT**: Updated CLAUDE.md with mandatory pull-before-push workflow:
  - Added explicit git workflow pattern: pull → change → push  
  - Enhanced critical development rules with changelog update requirements
  - Documented mandatory change tracking in CLAUDE.md