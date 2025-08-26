const { chromium } = require('playwright');

const commits = [
    { hash: '7fe87a0', message: 'Pushes' },
    { hash: '588fa5a', message: 'Add major milestones documentation to gitignore' },
    { hash: 'd0b19f5', message: 'Remove auth modal and switch to direct redirect' },
    { hash: '9a84fea', message: 'Update logo link to redirect to split.lease' },
    { hash: 'fee9bc7', message: 'Fix: Keep login embedded in popup instead of redirecting' },
    { hash: 'ce558c1', message: 'Clean up lazy loading implementation - production ready' },
    { hash: 'b6e6ea5', message: 'Simplify loading experience and identify performance bottleneck' },
    { hash: '9666502', message: 'Phase 4: Enhanced loading states and visual feedback' },
    { hash: 'fe3b4ad', message: 'Phase 3: Add intent-based preloading for auth iframe' },
    { hash: '4034652', message: 'Phase 1: Remove hidden auth iframe for 2-3MB performance gain' },
    { hash: '94e4b09', message: 'ROLLBACK: Restore embed version with iframe modals - Fixed missing function exports' },
    { hash: '0577a37', message: 'Further reduce Free Market Research button size on mobile to prevent cutoff - 30px bottom margin, 90px width, 60px Lottie' },
    { hash: 'bc0d489', message: 'Fix mobile issues: hide Explore Rentals in header, fix Free Market Research button cutoff' },
    { hash: 'e07fd98', message: 'Add authentication state awareness with auto-redirect for logged-in users' },
    { hash: '4414e5d', message: 'Fix horizontal scrollbar in market research popup - set width to 480px and hide horizontal overflow' },
    { hash: '62ed4d6', message: 'Update listings with actual properties, make popups responsive with content wrapping, fix 4:3 aspect ratio for images' },
    { hash: '6c8b34b', message: 'Add listing details template file for 4 property cards' },
    { hash: 'cb0f1d6', message: 'Force rebuild on Cloudflare Pages' },
    { hash: '37c5c06', message: 'Remove cache-busting version parameters - rely on Cloudflare cache purging instead' },
    { hash: 'e51ef8a', message: 'Add cache-busting version parameters to CSS and JS files to prevent Cloudflare caching issues' },
    { hash: '938476e', message: 'Apply anti-flickering fix to auth/sign-up popup - same optimizations as market research modal' },
    { hash: 'c0f5b41', message: 'Fix screen flickering when market research popup opens - removed backdrop-filter blur and optimized animations' },
    { hash: '0767842', message: 'Add market research popup modal with embedded iframe for split.lease/embed-ai-drawer' },
    { hash: 'a124353', message: 'Hide iOS download and Alexa sections from footer on mobile devices' },
    { hash: 'b17a8b9', message: 'Add 4 listing cards with horizontal scroll on mobile, reduce floating badge mobile size by 50% width and 25% height' },
    { hash: '06f2d14', message: 'Move Free Market Research badge to bottom-right and reduce size by 15%' },
    { hash: 'c7536e9', message: 'Merge remote changes - keeping local iframe embedding and all improvements' },
    { hash: '8e01630', message: 'Stretch header elements - wider spacing, larger buttons, 90% width for better horizontal use' },
    { hash: '1b6c30c', message: 'Fix Lottie player size - increased from 24px to 120px inline styles' },
    { hash: '9d515d4', message: 'Double atom icon size to 120px and reduce text to accommodate - better visual balance' },
    { hash: 'c03fdcf', message: 'Double the size of Free Market Research floating badge - 2x all dimensions and fonts' },
    { hash: '7882b5c', message: 'Fix iframe preload detection - handle empty src attribute that defaults to current page URL' },
    { hash: 'b8a7465', message: 'Add 2-second preloading with full debug monitoring - keeps all logging intact' },
    { hash: 'f1469d5', message: 'Simplified iframe implementation with visible debug monitoring - no hiding, direct confirmation' },
    { hash: '716a4df', message: 'CYCLE 6: Optimize iframe loading with preload, timeout handling, and error management' }
];

async function addCommitsToGoogleSheets() {
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 100 // Add some delay between actions for reliability
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Navigating to Google Sheets...');
        await page.goto('https://docs.google.com/spreadsheets/d/1FOceh2eQGD9G40Bnik3cFu2_56bg4J9L3_KeC31kqsY/edit?usp=sharing');

        // Wait for page to fully load
        console.log('Waiting for page to load...');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Take initial screenshot
        await page.screenshot({ path: 'sheets_loaded.png' });

        console.log('Looking for empty area to add commits...');

        // Try to click somewhere in the spreadsheet area to focus it
        // Use coordinates that should be in the spreadsheet area
        await page.click({ x: 200, y: 300 });
        await page.waitForTimeout(1000);

        // Navigate to an empty area using keyboard shortcuts
        console.log('Navigating to empty column...');
        
        // Press Ctrl+Right to go to the rightmost column with data
        await page.keyboard.press('Control+Right');
        await page.waitForTimeout(500);
        
        // Move one column to the right to find empty space
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(500);

        // Go to the top of this column
        await page.keyboard.press('Control+Home');
        await page.waitForTimeout(500);
        
        // Move to the empty column we identified
        await page.keyboard.press('Control+Right');
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(500);

        console.log('Starting to add commit data...');

        // Add section header
        await page.keyboard.type('GIT COMMIT HISTORY');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');

        // Add column headers
        await page.keyboard.type('Commit Hash');
        await page.keyboard.press('Tab');
        await page.keyboard.type('Description');
        await page.keyboard.press('Enter');

        // Add separator line
        await page.keyboard.type('----------');
        await page.keyboard.press('Tab');
        await page.keyboard.type('----------');
        await page.keyboard.press('Enter');

        // Add each commit
        for (let i = 0; i < commits.length; i++) {
            const commit = commits[i];
            console.log(`Adding commit ${i + 1}/35: ${commit.hash}`);

            // Add commit hash
            await page.keyboard.type(commit.hash);
            await page.keyboard.press('Tab');

            // Add commit message
            await page.keyboard.type(commit.message);
            await page.keyboard.press('Enter');

            // Small delay between entries
            await page.waitForTimeout(150);

            // Take progress screenshot every 10 commits
            if ((i + 1) % 10 === 0) {
                await page.screenshot({ path: `progress_${i + 1}.png` });
                console.log(`Progress screenshot taken at commit ${i + 1}`);
            }
        }

        console.log('All commits added successfully!');

        // Take final screenshot
        await page.screenshot({ path: 'commits_complete.png', fullPage: true });

        // Scroll to top to show the added data
        await page.keyboard.press('Control+Home');
        await page.waitForTimeout(1000);
        
        // Navigate back to our added data
        await page.keyboard.press('Control+Right');
        await page.keyboard.press('ArrowRight');
        
        await page.screenshot({ path: 'final_result.png', fullPage: true });

        console.log('SUCCESS: All 35 git commits have been added to the Google Sheets document!');

    } catch (error) {
        console.error('Error occurred:', error);
        await page.screenshot({ path: 'final_error.png', fullPage: true });
        throw error;
    } finally {
        // Keep browser open for review
        console.log('Review the results in the browser window...');
        console.log('Browser will close in 45 seconds...');
        await page.waitForTimeout(45000);
        await browser.close();
    }
}

addCommitsToGoogleSheets().catch(console.error);