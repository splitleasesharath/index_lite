const { chromium } = require('playwright');

const commits = [
    { hash: '7fe87a0', message: 'Pushes' },
    { hash: '588fa5a', message: 'Add major milestones documentation to gitignore' },
    { hash: 'd0b19f5', message: 'Remove auth modal and switch to direct redirect' },
    { hash: '9a84fea', message: 'Update logo link to redirect to splitlease.app' },
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
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to the Google Sheets URL
        console.log('Navigating to Google Sheets...');
        await page.goto('https://docs.google.com/spreadsheets/d/1FOceh2eQGD9G40Bnik3cFu2_56bg4J9L3_KeC31kqsY/edit?usp=sharing');

        // Wait for the page to load completely
        await page.waitForTimeout(5000);

        // Take initial screenshot
        await page.screenshot({ path: 'initial_sheets.png' });

        console.log('Looking for the spreadsheet structure...');

        // Wait for the sheet to load - looking for any grid cell
        await page.waitForSelector('[data-sheets-value]', { timeout: 15000 });

        // Find an empty area to add the commits - let's try going to a new sheet or empty area
        console.log('Looking for a good place to add commit data...');

        // Try to find the last row with data to add after it
        // First, click on cell A1 to ensure we're in the right position
        try {
            // Try multiple approaches to find and click a cell
            const cellSelectors = [
                '[data-sheet-cell][data-row="0"][data-col="0"]',
                '[role="gridcell"]:first-child',
                '[data-sheets-value]:first-child',
                '.grid-container [data-row="0"]'
            ];

            let cellFound = false;
            for (const selector of cellSelectors) {
                try {
                    await page.click(selector, { timeout: 2000 });
                    cellFound = true;
                    console.log(`Successfully clicked cell using selector: ${selector}`);
                    break;
                } catch (e) {
                    console.log(`Selector ${selector} didn't work, trying next...`);
                }
            }

            if (!cellFound) {
                // Fallback: try clicking coordinates where A1 typically is
                await page.click({ x: 96, y: 175 });
                console.log('Used coordinate fallback to click cell A1');
            }

            await page.waitForTimeout(500);

        } catch (error) {
            console.log('Could not locate specific cell, will try keyboard navigation...');
        }

        // Navigate to an empty area - go to around row 10 to be safe
        console.log('Navigating to empty area for commit data...');
        for (let i = 0; i < 10; i++) {
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(50);
        }

        console.log('Starting to add commits...');

        // Add header row
        await page.keyboard.type('=== GIT COMMITS ===');
        await page.keyboard.press('Enter');
        await page.keyboard.type('Commit Hash');
        await page.keyboard.press('Tab');
        await page.keyboard.type('Description');
        await page.keyboard.press('Enter');

        // Add each commit
        for (let i = 0; i < commits.length; i++) {
            const commit = commits[i];
            console.log(`Adding commit ${i + 1}/35: ${commit.hash} - ${commit.message}`);

            // Type commit hash
            await page.keyboard.type(commit.hash);
            await page.keyboard.press('Tab');

            // Type commit message  
            await page.keyboard.type(commit.message);
            await page.keyboard.press('Enter');

            // Small delay between entries
            await page.waitForTimeout(100);
        }

        console.log('All commits added! Taking final screenshot...');
        await page.screenshot({ path: 'final_sheets.png', fullPage: true });

        console.log('Successfully added all 35 commits to the Google Sheets document');

    } catch (error) {
        console.error('Error occurred:', error);
        await page.screenshot({ path: 'error_sheets.png', fullPage: true });
    } finally {
        // Keep browser open for a moment to review
        console.log('Keeping browser open for 30 seconds to review...');
        await page.waitForTimeout(30000);
        await browser.close();
    }
}

addCommitsToGoogleSheets();