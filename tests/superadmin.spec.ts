import { test, expect } from '@playwright/test';

test.describe('Super Admin Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as super admin
    await page.goto('/login/?role=superadmin');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/superadmin/dashboard/');
  });

  test('should display super admin dashboard correctly', async ({ page }) => {
    // Check header elements
    await expect(page.getByText('Platform Management')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    
    // Check statistics cards
    await expect(page.getByText('Total Lawyers')).toBeVisible();
    await expect(page.getByText('Active Firms')).toBeVisible();
    await expect(page.getByText('Total Clients')).toBeVisible();
    
    // Check quick actions
    await expect(page.getByText('Add New Lawyer')).toBeVisible();
    await expect(page.getByText('View All Clients')).toBeVisible();
    await expect(page.getByText('Platform Analytics')).toBeVisible();
    await expect(page.getByText('Support Tickets')).toBeVisible();
  });

  test('should display sidebar navigation correctly', async ({ page }) => {
    // Check sidebar elements
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Lawyer Onboarding')).toBeVisible();
    await expect(page.getByText('Client Management')).toBeVisible();
    await expect(page.getByText('Employee Management')).toBeVisible();
    await expect(page.getByText('Payments')).toBeVisible();
    await expect(page.getByText('Sales')).toBeVisible();
    await expect(page.getByText('Support')).toBeVisible();
    await expect(page.getByText('AI Tools')).toBeVisible();
    await expect(page.getByText('Audit')).toBeVisible();
    await expect(page.getByText('Integrations')).toBeVisible();
    
    // Check badges
    await expect(page.getByText('3', { exact: true })).toBeVisible(); // Lawyer Onboarding badge
    await expect(page.getByText('5', { exact: true })).toBeVisible(); // Support Tickets badge
  });

  test('should navigate to lawyer management page', async ({ page }) => {
    await page.getByText('Lawyer Onboarding').click();
    await expect(page).toHaveURL('/superadmin/lawyers/');
    await expect(page.getByText('Lawyer Management')).toBeVisible();
  });

  test('should navigate to client management page', async ({ page }) => {
    await page.getByText('Client Management').click();
    await expect(page).toHaveURL('/superadmin/clients/');
    await expect(page.getByText('Client Management')).toBeVisible();
  });

  test('should navigate to employee management page', async ({ page }) => {
    await page.getByText('Employee Management').click();
    await expect(page).toHaveURL('/superadmin/employees/');
    await expect(page.getByText('Employee Management')).toBeVisible();
  });

  test('should navigate to payments page', async ({ page }) => {
    await page.getByText('Payments').click();
    await expect(page).toHaveURL('/superadmin/payments/');
    await expect(page.getByText('Payment Management')).toBeVisible();
  });

  test('should navigate to sales page', async ({ page }) => {
    await page.getByText('Sales').click();
    await expect(page).toHaveURL('/superadmin/sales/');
    await expect(page.getByText('Sales Analytics')).toBeVisible();
  });

  test('should navigate to support page', async ({ page }) => {
    await page.getByText('Support').click();
    await expect(page).toHaveURL('/superadmin/support/');
    await expect(page.getByText('Support Tickets')).toBeVisible();
  });

  test('should navigate to AI tools page', async ({ page }) => {
    await page.getByText('AI Tools').click();
    await expect(page).toHaveURL('/superadmin/ai/');
    await expect(page.getByText('AI Tools Management')).toBeVisible();
  });

  test('should navigate to audit page', async ({ page }) => {
    await page.getByText('Audit').click();
    await expect(page).toHaveURL('/superadmin/audit/');
    await expect(page.getByText('Audit Logs')).toBeVisible();
  });

  test('should navigate to integrations page', async ({ page }) => {
    await page.getByText('Integrations').click();
    await expect(page).toHaveURL('/superadmin/integrations/');
    await expect(page.getByText('Platform Integrations')).toBeVisible();
  });

  test('should display lawyer list correctly', async ({ page }) => {
    await page.getByText('Lawyer Onboarding').click();
    
    // Check if lawyer table is displayed
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('David Rodriguez')).toBeVisible();
    await expect(page.getByText('Emily Chen')).toBeVisible();
    
    // Check status indicators
    await expect(page.getByText('Active')).toBeVisible();
    await expect(page.getByText('Pending')).toBeVisible();
  });

  test('should display client list correctly', async ({ page }) => {
    await page.getByText('Client Management').click();
    
    // Check if client table is displayed
    await expect(page.getByText('Michael Chen')).toBeVisible();
    await expect(page.getByText('Lisa Thompson')).toBeVisible();
    await expect(page.getByText('Ahmed Hassan')).toBeVisible();
    
    // Check status indicators
    await expect(page.getByText('Active')).toBeVisible();
    await expect(page.getByText('On-hold')).toBeVisible();
  });

  test('should display employee list correctly', async ({ page }) => {
    await page.getByText('Employee Management').click();
    
    // Check if employee table is displayed
    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('Maria Garcia')).toBeVisible();
    await expect(page.getByText('Alex Johnson')).toBeVisible();
  });

  test('should view lawyer details', async ({ page }) => {
    await page.getByText('Lawyer Onboarding').click();
    await page.getByText('Sarah Johnson').click();
    
    // Should navigate to lawyer detail page
    await expect(page).toHaveURL(/\/superadmin\/lawyers\/1/);
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Immigration Law Partners')).toBeVisible();
  });

  test('should view client details', async ({ page }) => {
    await page.getByText('Client Management').click();
    await page.getByText('Michael Chen').click();
    
    // Should navigate to client detail page
    await expect(page).toHaveURL(/\/superadmin\/clients\/1/);
    await expect(page.getByText('Michael Chen')).toBeVisible();
    await expect(page.getByText('Express Entry')).toBeVisible();
  });

  test('should view employee details', async ({ page }) => {
    await page.getByText('Employee Management').click();
    await page.getByText('John Smith').click();
    
    // Should navigate to employee detail page
    await expect(page).toHaveURL(/\/superadmin\/employees\/1/);
    await expect(page.getByText('John Smith')).toBeVisible();
    await expect(page.getByText('Senior Case Manager')).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu button is visible
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    
    // Click mobile menu button
    await page.getByRole('button', { name: 'Menu' }).click();
    
    // Check if sidebar is visible on mobile
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Lawyer Onboarding')).toBeVisible();
  });

  test('should search functionality work', async ({ page }) => {
    // Click search button
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Check if search input is visible
    await expect(page.getByPlaceholder('Search...')).toBeVisible();
    
    // Type in search
    await page.getByPlaceholder('Search...').fill('Sarah');
    
    // Should show search results
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
  });

  test('should notifications dropdown work', async ({ page }) => {
    // Click notifications button
    await page.getByRole('button', { name: 'Notifications' }).click();
    
    // Check if notifications dropdown is visible
    await expect(page.getByText('Notifications')).toBeVisible();
    
    // Should show notification items
    await expect(page.getByText('New lawyer registration')).toBeVisible();
  });
}); 