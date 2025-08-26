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
        slowMo: 50
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        console.log('Opening Google Sheets...');
        await page.goto('https://docs.google.com/spreadsheets/d/1FOceh2eQGD9G40Bnik3cFu2_56bg4J9L3_KeC31kqsY/edit?usp=sharing');

        // Simple wait for the page
        console.log('Waiting for page to settle...');
        await page.waitForTimeout(8000);

        // Take screenshot to confirm we're in the right place
        await page.screenshot({ path: 'ready_to_start.png' });

        console.log('Clicking on empty area to start entering data...');
        
        // Click on column E (which should be empty) to start our data there
        await page.mouse.click(600, 200);
        await page.waitForTimeout(1000);

        console.log('Adding commit header...');
        
        // Type the header for our section
        await page.keyboard.type('=== GIT COMMIT HISTORY ===');
        await page.keyboard.press('Enter');
        await page.keyboard.press('Enter');
        
        // Add column headers
        await page.keyboard.type('Commit Hash');
        await page.keyboard.press('Tab');
        await page.keyboard.type('Commit Description');
        await page.keyboard.press('Enter');
        
        // Add separator
        await page.keyboard.type('===========');
        await page.keyboard.press('Tab');
        await page.keyboard.type('================================================');
        await page.keyboard.press('Enter');

        console.log('Starting to add all 35 commits...');

        // Add all commits one by one
        for (let i = 0; i < commits.length; i++) {
            const commit = commits[i];
            
            console.log(`[${i + 1}/35] Adding: ${commit.hash} - ${commit.message.substring(0, 50)}...`);

            // Type commit hash
            await page.keyboard.type(commit.hash);
            await page.keyboard.press('Tab');

            // Type commit description
            await page.keyboard.type(commit.message);
            await page.keyboard.press('Enter');

            // Short pause between entries
            await page.waitForTimeout(100);

            // Take a progress screenshot every 5 commits
            if ((i + 1) % 5 === 0) {
                await page.screenshot({ path: `commits_progress_${i + 1}.png` });
            }
        }

        console.log('\n🎉 SUCCESS! All 35 commits have been added to the spreadsheet!');

        // Take final screenshots
        await page.screenshot({ path: 'all_commits_added.png', fullPage: true });

        // Scroll to show the beginning of our data
        await page.keyboard.press('Control+Home');
        await page.waitForTimeout(1000);
        await page.mouse.click(600, 200); // Click back on our data area
        await page.screenshot({ path: 'final_view.png' });

        console.log('\nFinal screenshots saved. You can review the results in the browser.');
        console.log('The browser will remain open for 60 seconds for your review...');

    } catch (error) {
        console.error('\n❌ An error occurred:', error.message);
        await page.screenshot({ path: 'error_final.png', fullPage: true });
        throw error;
    } finally {
        // Give time to review the results
        await page.waitForTimeout(60000);
        await browser.close();
        console.log('Browser closed. Task completed!');
    }
}

// Run the function
addCommitsToGoogleSheets()
    .then(() => {
        console.log('\n✅ Script completed successfully!');
        console.log('📋 All 35 git commits have been added to the Google Sheets document.');
        console.log('📸 Check the generated screenshots to verify the results.');
    })
    .catch(error => {
        console.error('\n💥 Script failed:', error.message);
        process.exit(1);
    });