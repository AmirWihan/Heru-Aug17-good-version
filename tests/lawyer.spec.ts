import { test, expect } from '@playwright/test';

test.describe('Lawyer Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as lawyer
    await page.goto('/login/?role=lawyer');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/lawyer/dashboard/');
  });

  test('should display lawyer dashboard correctly', async ({ page }) => {
    // Check header elements
    await expect(page.getByText('Welcome back, Sarah')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Notifications' })).toBeVisible();
    
    // Check statistics cards
    await expect(page.getByText('Active Clients')).toBeVisible();
    await expect(page.getByText('Pending Tasks')).toBeVisible();
    await expect(page.getByText('Revenue')).toBeVisible();
    await expect(page.getByText('Success Rate')).toBeVisible();
    
    // Check quick actions
    await expect(page.getByText('Add New Client')).toBeVisible();
    await expect(page.getByText('Run AI Analysis')).toBeVisible();
    await expect(page.getByText('Schedule Meeting')).toBeVisible();
    await expect(page.getByText('Upload Document')).toBeVisible();
  });

  test('should display sidebar navigation correctly', async ({ page }) => {
    // Check sidebar elements
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Clients')).toBeVisible();
    await expect(page.getByText('Team')).toBeVisible();
    await expect(page.getByText('Tasks')).toBeVisible();
    await expect(page.getByText('Documents')).toBeVisible();
    await expect(page.getByText('AI Tools')).toBeVisible();
    await expect(page.getByText('Messages')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should navigate to clients page', async ({ page }) => {
    await page.getByText('Clients').click();
    await expect(page).toHaveURL('/lawyer/clients/');
    await expect(page.getByText('Client Management')).toBeVisible();
  });

  test('should navigate to team page', async ({ page }) => {
    await page.getByText('Team').click();
    await expect(page).toHaveURL('/lawyer/team/');
    await expect(page.getByText('Team Management')).toBeVisible();
  });

  test('should navigate to tasks page', async ({ page }) => {
    await page.getByText('Tasks').click();
    await expect(page).toHaveURL('/lawyer/tasks/');
    await expect(page.getByText('Task Management')).toBeVisible();
  });

  test('should navigate to documents page', async ({ page }) => {
    await page.getByText('Documents').click();
    await expect(page).toHaveURL('/lawyer/documents/');
    await expect(page.getByText('Document Management')).toBeVisible();
  });

  test('should navigate to AI tools page', async ({ page }) => {
    await page.getByText('AI Tools').click();
    await expect(page).toHaveURL('/lawyer/ai-tools/');
    await expect(page.getByText('AI Tools')).toBeVisible();
  });

  test('should navigate to messages page', async ({ page }) => {
    await page.getByText('Messages').click();
    await expect(page).toHaveURL('/lawyer/messages/');
    await expect(page.getByText('Messages')).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.getByText('Settings').click();
    await expect(page).toHaveURL('/lawyer/settings/');
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should display client list correctly', async ({ page }) => {
    await page.getByText('Clients').click();
    
    // Check if client table is displayed
    await expect(page.getByText('Michael Chen')).toBeVisible();
    await expect(page.getByText('Lisa Thompson')).toBeVisible();
    await expect(page.getByText('Ahmed Hassan')).toBeVisible();
    
    // Check status indicators
    await expect(page.getByText('Active')).toBeVisible();
    await expect(page.getByText('On-hold')).toBeVisible();
  });

  test('should view client details', async ({ page }) => {
    await page.getByText('Clients').click();
    await page.getByText('Michael Chen').click();
    
    // Should navigate to client detail page
    await expect(page).toHaveURL(/\/lawyer\/clients\/1/);
    await expect(page.getByText('Michael Chen')).toBeVisible();
    await expect(page.getByText('Express Entry')).toBeVisible();
  });

  test('should display AI tools correctly', async ({ page }) => {
    await page.getByText('AI Tools').click();
    
    // Check AI tools sections
    await expect(page.getByText('Document Analysis')).toBeVisible();
    await expect(page.getByText('Risk Analyzer')).toBeVisible();
    await expect(page.getByText('Cover Letter Generator')).toBeVisible();
    await expect(page.getByText('Resume Builder')).toBeVisible();
    await expect(page.getByText('Application Checker')).toBeVisible();
    await expect(page.getByText('Success Predictor')).toBeVisible();
  });

  test('should upload document in AI tools', async ({ page }) => {
    await page.getByText('AI Tools').click();
    
    // Click on Document Analysis
    await page.getByText('Document Analysis').click();
    
    // Check if upload area is visible
    await expect(page.getByText('Upload Document')).toBeVisible();
    
    // Test file upload (mock)
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Choose File').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/sample-document.pdf');
    
    // Should show upload progress
    await expect(page.getByText('Uploading...')).toBeVisible();
  });

  test('should run risk analyzer', async ({ page }) => {
    await page.getByText('AI Tools').click();
    await page.getByText('Risk Analyzer').click();
    
    // Fill in risk analyzer form
    await page.getByLabel('Age').fill('30');
    await page.getByLabel('Education Level').selectOption('Bachelor');
    await page.getByLabel('Work Experience').fill('5');
    await page.getByLabel('Language Proficiency').selectOption('CLB 8');
    
    // Submit form
    await page.getByRole('button', { name: 'Analyze Risk' }).click();
    
    // Should show analysis results
    await expect(page.getByText('Risk Assessment Results')).toBeVisible();
  });

  test('should generate cover letter', async ({ page }) => {
    await page.getByText('AI Tools').click();
    await page.getByText('Cover Letter Generator').click();
    
    // Fill in cover letter form
    await page.getByLabel('Position Title').fill('Software Engineer');
    await page.getByLabel('Company Name').fill('Tech Corp');
    await page.getByLabel('Key Skills').fill('JavaScript, React, Node.js');
    
    // Submit form
    await page.getByRole('button', { name: 'Generate Cover Letter' }).click();
    
    // Should show generated cover letter
    await expect(page.getByText('Generated Cover Letter')).toBeVisible();
  });

  test('should build resume', async ({ page }) => {
    await page.getByText('AI Tools').click();
    await page.getByText('Resume Builder').click();
    
    // Fill in resume form
    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    await page.getByLabel('Phone').fill('+1-555-0123');
    
    // Submit form
    await page.getByRole('button', { name: 'Generate Resume' }).click();
    
    // Should show generated resume
    await expect(page.getByText('Generated Resume')).toBeVisible();
  });

  test('should check application', async ({ page }) => {
    await page.getByText('AI Tools').click();
    await page.getByText('Application Checker').click();
    
    // Fill in application checker form
    await page.getByLabel('Application Type').selectOption('Express Entry');
    await page.getByLabel('CRS Score').fill('450');
    await page.getByLabel('Province').selectOption('Ontario');
    
    // Submit form
    await page.getByRole('button', { name: 'Check Application' }).click();
    
    // Should show application analysis
    await expect(page.getByText('Application Analysis')).toBeVisible();
  });

  test('should predict success', async ({ page }) => {
    await page.getByText('AI Tools').click();
    await page.getByText('Success Predictor').click();
    
    // Fill in success predictor form
    await page.getByLabel('Profile Score').fill('85');
    await page.getByLabel('Document Quality').selectOption('Excellent');
    await page.getByLabel('Application Type').selectOption('Express Entry');
    
    // Submit form
    await page.getByRole('button', { name: 'Predict Success' }).click();
    
    // Should show prediction results
    await expect(page.getByText('Success Prediction')).toBeVisible();
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
    await expect(page.getByText('Clients')).toBeVisible();
  });

  test('should search functionality work', async ({ page }) => {
    // Click search button
    await page.getByRole('button', { name: 'Search' }).click();
    
    // Check if search input is visible
    await expect(page.getByPlaceholder('Search...')).toBeVisible();
    
    // Type in search
    await page.getByPlaceholder('Search...').fill('Michael');
    
    // Should show search results
    await expect(page.getByText('Michael Chen')).toBeVisible();
  });

  test('should notifications dropdown work', async ({ page }) => {
    // Click notifications button
    await page.getByRole('button', { name: 'Notifications' }).click();
    
    // Check if notifications dropdown is visible
    await expect(page.getByText('Notifications')).toBeVisible();
    
    // Should show notification items
    await expect(page.getByText('New client message')).toBeVisible();
  });

  test('should quick actions work', async ({ page }) => {
    // Test Add New Client button
    await page.getByText('Add New Client').click();
    await expect(page.getByText('Add New Client')).toBeVisible();
    
    await page.goBack();
    
    // Test Run AI Analysis button
    await page.getByText('Run AI Analysis').click();
    await expect(page).toHaveURL('/lawyer/ai-tools/');
    
    await page.goBack();
    
    // Test Schedule Meeting button
    await page.getByText('Schedule Meeting').click();
    await expect(page.getByText('Schedule Meeting')).toBeVisible();
    
    await page.goBack();
    
    // Test Upload Document button
    await page.getByText('Upload Document').click();
    await expect(page.getByText('Upload Document')).toBeVisible();
  });
}); 