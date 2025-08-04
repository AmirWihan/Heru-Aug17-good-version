#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function debugRegistration() {
  console.log('🔍 Starting registration debug...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to registration page
    console.log('📝 Navigating to registration page...');
    await page.goto('http://localhost:9002/register');
    await page.waitForSelector('form');
    
    // Fill in client registration form
    console.log('📝 Filling registration form...');
    
    // Select client role
    await page.click('input[value="client"]');
    
    // Fill in basic details
    await page.type('input[name="fullName"]', 'Test Client');
    await page.type('input[name="email"]', 'testclient@example.com');
    await page.type('input[name="password"]', 'password123');
    
    // Check terms agreement
    await page.click('input[name="termsAgreed"]');
    
    // Submit form
    console.log('📝 Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait for any response
    await page.waitForTimeout(3000);
    
    // Check for errors
    const errors = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('[role="alert"], .text-red-500, .text-destructive');
      return Array.from(errorElements).map(el => el.textContent);
    });
    
    if (errors.length > 0) {
      console.log('❌ Errors found:', errors);
    } else {
      console.log('✅ No visible errors found');
    }
    
    // Check current URL
    const currentUrl = page.url();
    console.log('📍 Current URL:', currentUrl);
    
    // Check for success message
    const successMessage = await page.evaluate(() => {
      const successEl = document.querySelector('[data-testid="success"], .text-green-500');
      return successEl ? successEl.textContent : null;
    });
    
    if (successMessage) {
      console.log('✅ Success message:', successMessage);
    }
    
    // Wait a bit more to see what happens
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('💥 Error during debug:', error);
  } finally {
    await browser.close();
  }
}

debugRegistration().catch(console.error); 