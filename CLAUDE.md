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

### Git Operations
```bash
# Commit changes (without sensitive files)
git add index.html styles.css script.js README.md
git commit -m "Your commit message"
git push origin main
```

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
- **Module Pattern**: Functions organized by feature
- **State Management**: Schedule states tracked in DOM classes
- **Animation Control**: SetInterval/clearInterval for schedules

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

## Testing Checklist

When making changes, verify:
- [ ] Responsive layout on mobile/tablet/desktop
- [ ] Day selector toggles work correctly
- [ ] Schedule controls animate properly
- [ ] Smooth scrolling functions
- [ ] Toast notifications appear/disappear
- [ ] Header hide/show on scroll
- [ ] Hover effects on cards and buttons
- [ ] Form validation in referral section

## CRITICAL DEVELOPMENT RULE

**MANDATORY**: Every single code change MUST be immediately committed and pushed to GitHub. This includes:
- After EVERY file edit (HTML, CSS, JS, MD)
- After EVERY new feature addition
- After EVERY bug fix
- After EVERY refactoring
- No batching of changes allowed
- Push immediately after each atomic change

This ensures continuous deployment and real-time GitHub Pages updates.

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

### 2025-08-16
- Added CRITICAL DEVELOPMENT RULE for immediate Git pushes after every change
- Added Changelog section to CLAUDE.md for tracking all modifications