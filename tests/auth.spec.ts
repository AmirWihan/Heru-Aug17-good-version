import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page with all role options', async ({ page }) => {
    // Check if all three role cards are visible
    await expect(page.getByText('I am an Applicant')).toBeVisible();
    await expect(page.getByText('I am a Lawyer')).toBeVisible();
    
    // Check for desktop app section
    await expect(page.getByText('Desktop App')).toBeVisible();
    
    // Check for the crown button (Super Admin)
    await expect(page.locator('button[title="Super Admin Login"]')).toBeVisible();
  });

  test('should navigate to login page when clicking role cards', async ({ page }) => {
    // Test Applicant card
    await page.getByRole('button', { name: 'Proceed as Applicant' }).click();
    await expect(page).toHaveURL(/.*login.*role=client/);
    
    await page.goto('/');
    
    // Test Lawyer card
    await page.getByRole('button', { name: 'Proceed as Lawyer' }).click();
    await expect(page).toHaveURL(/.*login.*role=lawyer/);
  });

  test('should navigate to login page when clicking Super Admin crown', async ({ page }) => {
    // Click the crown button
    await page.locator('button[title="Super Admin Login"]').click();
    
    // Should redirect to dashboard-select
    await expect(page).toHaveURL('/dashboard-select');
  });

  test('should pre-fill email based on role parameter', async ({ page }) => {
    // Test client role
    await page.goto('/login?role=client');
    await page.waitForSelector('input[type="email"]');
    const emailValue = await page.getByLabel('Email').inputValue();
    expect(emailValue).toBe('james.wilson@example.com');
    
    // Test lawyer role
    await page.goto('/login?role=lawyer');
    await page.waitForSelector('input[type="email"]');
    const lawyerEmailValue = await page.getByLabel('Email').inputValue();
    expect(lawyerEmailValue).toBe('sarah.johnson@example.com');
  });

  test('should validate form fields', async ({ page }) => {
    await page.goto('/login');
    
    // Test empty email
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    
    // Test invalid email format
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
    
    // Test empty password
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').clear();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Password must be at least 6 characters.')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for password field to be available
    await page.waitForSelector('input[type="password"]');
    const passwordInput = page.getByLabel('Password');
    
    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Find and click eye icon
    const eyeIcon = page.locator('button').filter({ has: page.locator('svg') }).first();
    await eyeIcon.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click eye icon again to hide password
    await eyeIcon.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should successfully login as Super Admin via crown button', async ({ page }) => {
    // Click the crown button to login as admin
    await page.locator('button[title="Super Admin Login"]').click();
    
    // Should redirect to dashboard-select
    await expect(page).toHaveURL('/dashboard-select');
    
    // Should show admin options
    await expect(page.getByText('Super Admin')).toBeVisible();
  });

  test('should successfully login as Lawyer', async ({ page }) => {
    await page.goto('/login?role=lawyer');
    
    // Wait for form to load
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    
    // Password is already filled by default
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should redirect to lawyer dashboard
    await expect(page).toHaveURL('/lawyer/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should successfully login as Client', async ({ page }) => {
    await page.goto('/login?role=client');
    
    // Wait for form to load
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    
    // Password is already filled by default
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should redirect to client dashboard
    await expect(page).toHaveURL('/client/dashboard');
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login?role=lawyer');
    
    // Wait for form to load
    await page.waitForSelector('input[type="email"]');
    await page.waitForSelector('input[type="password"]');
    
    // Change password to wrong one
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Should show error message
    await expect(page.getByText('Login Failed')).toBeVisible();
  });

  test('should handle Google login button', async ({ page }) => {
    await page.goto('/login');
    
    // Click Google login button
    await page.getByRole('button', { name: 'Sign in with Google' }).click();
    
    // Should show coming soon message
    await expect(page.getByText('Feature Coming Soon')).toBeVisible();
  });

  test('should display login page features', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login features showcase
    await expect(page.getByText('AI-Powered Tools')).toBeVisible();
    await expect(page.getByText('Document Management')).toBeVisible();
    await expect(page.getByText('Team Collaboration')).toBeVisible();
  });

  test('should handle mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if elements are still visible on mobile
    await expect(page.getByText('I am an Applicant')).toBeVisible();
    await expect(page.getByText('I am a Lawyer')).toBeVisible();
    
    // Check if crown button is still accessible
    await expect(page.locator('button[title="Super Admin Login"]')).toBeVisible();
  });
}); 