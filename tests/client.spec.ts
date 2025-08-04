import { test, expect } from '@playwright/test';

test.describe('Client Dashboard Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as client
    await page.goto('/login/?role=client');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page).toHaveURL('/client/dashboard/');
  });

  test('should display client dashboard correctly', async ({ page }) => {
    // Check welcome banner
    await expect(page.getByText('Welcome, Michael')).toBeVisible();
    await expect(page.getByText('Connected to Sarah Johnson')).toBeVisible();
    
    // Check application progress
    await expect(page.getByText('Application Progress')).toBeVisible();
    await expect(page.getByText('Current Stage: Document Review')).toBeVisible();
    
    // Check quick actions
    await expect(page.getByText('Upload Document')).toBeVisible();
    await expect(page.getByText('Schedule Meeting')).toBeVisible();
    await expect(page.getByText('Ask AI Assistant')).toBeVisible();
    await expect(page.getByText('View Timeline')).toBeVisible();
  });

  test('should display sidebar navigation correctly', async ({ page }) => {
    // Check sidebar elements
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('My Documents')).toBeVisible();
    await expect(page.getByText('My Lawyers')).toBeVisible();
    await expect(page.getByText('Messages')).toBeVisible();
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should navigate to documents page', async ({ page }) => {
    await page.getByText('My Documents').click();
    await expect(page).toHaveURL('/client/documents/');
    await expect(page.getByText('Document Management')).toBeVisible();
  });

  test('should navigate to lawyers page', async ({ page }) => {
    await page.getByText('My Lawyers').click();
    await expect(page).toHaveURL('/client/lawyers/');
    await expect(page.getByText('My Lawyers')).toBeVisible();
  });

  test('should navigate to messages page', async ({ page }) => {
    await page.getByText('Messages').click();
    await expect(page).toHaveURL('/client/messages/');
    await expect(page.getByText('Messages')).toBeVisible();
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.getByText('Settings').click();
    await expect(page).toHaveURL('/client/settings/');
    await expect(page.getByText('Settings')).toBeVisible();
  });

  test('should display documents correctly', async ({ page }) => {
    await page.getByText('My Documents').click();
    
    // Check if document list is displayed
    await expect(page.getByText('Passport Copy')).toBeVisible();
    await expect(page.getByText('Educational Credentials')).toBeVisible();
    await expect(page.getByText('Work Experience Letter')).toBeVisible();
    
    // Check document status
    await expect(page.getByText('Approved')).toBeVisible();
    await expect(page.getByText('Pending Review')).toBeVisible();
  });

  test('should upload document', async ({ page }) => {
    await page.getByText('My Documents').click();
    
    // Click upload button
    await page.getByText('Upload Document').click();
    
    // Check if upload modal is visible
    await expect(page.getByText('Upload New Document')).toBeVisible();
    
    // Test file upload (mock)
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByText('Choose File').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('tests/fixtures/sample-document.pdf');
    
    // Fill document details
    await page.getByLabel('Document Type').selectOption('Educational Credentials');
    await page.getByLabel('Description').fill('Bachelor Degree Certificate');
    
    // Submit upload
    await page.getByRole('button', { name: 'Upload' }).click();
    
    // Should show success message
    await expect(page.getByText('Document uploaded successfully')).toBeVisible();
  });

  test('should display lawyers correctly', async ({ page }) => {
    await page.getByText('My Lawyers').click();
    
    // Check if lawyer information is displayed
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Immigration Law Partners')).toBeVisible();
    await expect(page.getByText('+1 (555) 123-4567')).toBeVisible();
    await expect(page.getByText('sarah.johnson@immigrationlaw.com')).toBeVisible();
  });

  test('should message lawyer', async ({ page }) => {
    await page.getByText('My Lawyers').click();
    
    // Click message button
    await page.getByText('Message Lawyer').click();
    
    // Should navigate to messages page
    await expect(page).toHaveURL('/client/messages/');
    await expect(page.getByText('Messages')).toBeVisible();
  });

  test('should view lawyer profile', async ({ page }) => {
    await page.getByText('My Lawyers').click();
    
    // Click view profile button
    await page.getByText('View Profile').click();
    
    // Should show lawyer profile details
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Immigration Law Partners')).toBeVisible();
    await expect(page.getByText('Specialties')).toBeVisible();
  });

  test('should display messages correctly', async ({ page }) => {
    await page.getByText('Messages').click();
    
    // Check if message list is displayed
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    await expect(page.getByText('Document Review Update')).toBeVisible();
    await expect(page.getByText('Meeting Scheduled')).toBeVisible();
  });

  test('should send message', async ({ page }) => {
    await page.getByText('Messages').click();
    
    // Click on a conversation
    await page.getByText('Sarah Johnson').click();
    
    // Type message
    await page.getByPlaceholder('Type your message...').fill('Hello, I have a question about my application.');
    
    // Send message
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Should show sent message
    await expect(page.getByText('Hello, I have a question about my application.')).toBeVisible();
  });

  test('should use AI assistant', async ({ page }) => {
    await page.getByText('Ask AI Assistant').click();
    
    // Should navigate to AI assistant page
    await expect(page).toHaveURL('/client/ai-assist/');
    await expect(page.getByText('AI Assistant')).toBeVisible();
    
    // Type question
    await page.getByPlaceholder('Ask me anything about your immigration process...').fill('What documents do I need for Express Entry?');
    
    // Send question
    await page.getByRole('button', { name: 'Send' }).click();
    
    // Should show AI response
    await expect(page.getByText('AI Response')).toBeVisible();
  });

  test('should schedule meeting', async ({ page }) => {
    await page.getByText('Schedule Meeting').click();
    
    // Check if meeting modal is visible
    await expect(page.getByText('Schedule Meeting')).toBeVisible();
    
    // Fill meeting details
    await page.getByLabel('Meeting Type').selectOption('Document Review');
    await page.getByLabel('Date').fill('2024-02-15');
    await page.getByLabel('Time').selectOption('10:00 AM');
    await page.getByLabel('Notes').fill('Need to discuss document requirements');
    
    // Schedule meeting
    await page.getByRole('button', { name: 'Schedule Meeting' }).click();
    
    // Should show success message
    await expect(page.getByText('Meeting scheduled successfully')).toBeVisible();
  });

  test('should view timeline', async ({ page }) => {
    await page.getByText('View Timeline').click();
    
    // Should show application timeline
    await expect(page.getByText('Application Timeline')).toBeVisible();
    await expect(page.getByText('Application Submitted')).toBeVisible();
    await expect(page.getByText('Document Review')).toBeVisible();
    await expect(page.getByText('Interview Scheduled')).toBeVisible();
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
    await expect(page.getByText('My Documents')).toBeVisible();
  });

  test('should quick actions work', async ({ page }) => {
    // Test Upload Document button
    await page.getByText('Upload Document').click();
    await expect(page.getByText('Upload New Document')).toBeVisible();
    
    await page.goBack();
    
    // Test Schedule Meeting button
    await page.getByText('Schedule Meeting').click();
    await expect(page.getByText('Schedule Meeting')).toBeVisible();
    
    await page.goBack();
    
    // Test Ask AI Assistant button
    await page.getByText('Ask AI Assistant').click();
    await expect(page).toHaveURL('/client/ai-assist/');
    
    await page.goBack();
    
    // Test View Timeline button
    await page.getByText('View Timeline').click();
    await expect(page.getByText('Application Timeline')).toBeVisible();
  });

  test('should display application progress correctly', async ({ page }) => {
    // Check progress bar
    await expect(page.locator('.progress-bar')).toBeVisible();
    
    // Check current stage
    await expect(page.getByText('Current Stage: Document Review')).toBeVisible();
    
    // Check next steps
    await expect(page.getByText('Next Steps:')).toBeVisible();
    await expect(page.getByText('Submit additional documents')).toBeVisible();
  });

  test('should display connected lawyer info correctly', async ({ page }) => {
    // Check lawyer name
    await expect(page.getByText('Connected to Sarah Johnson')).toBeVisible();
    
    // Check lawyer firm
    await expect(page.getByText('Immigration Law Partners')).toBeVisible();
    
    // Check contact buttons
    await expect(page.getByText('Message Lawyer')).toBeVisible();
    await expect(page.getByText('View Profile')).toBeVisible();
  });
}); 