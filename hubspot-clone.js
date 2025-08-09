// HubSpot Clone JS - Adds simple interactivity

document.addEventListener('DOMContentLoaded', function() {
  // Navigation/Header
  document.getElementById('main-header').innerHTML = `
    <nav class="container" style="display:flex;align-items:center;justify-content:space-between;padding:24px 0;">
      <div style="display:flex;align-items:center;gap:12px;">
        <img src='https://cdn2.hubspot.net/hubfs/53/image/hubspot-wordmark-nav.svg' alt='HubSpot Logo' style='height:36px;'>
      </div>
      <ul style="display:flex;gap:32px;list-style:none;margin:0;padding:0;font-weight:600;">
        <li><a href="#platform">Platform</a></li>
        <li><a href="#ai-solution">AI</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
      <div>
        <a href="https://app.hubspot.com/login" class="btn secondary">Log in</a>
        <a href="https://app.hubspot.com/signup-hubspot/crm" class="btn primary">Get started free</a>
      </div>
    </nav>
  `;

  // Footer
  document.getElementById('main-footer').innerHTML = `
    <div class="container" style="padding:40px 0;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;">
      <div style="display:flex;align-items:center;gap:10px;">
        <img src='https://cdn2.hubspot.net/hubfs/53/image/hubspot-wordmark-nav.svg' alt='HubSpot Logo' style='height:28px;'>
        <span style="font-weight:bold;">&copy; 2025 HubSpot, Inc.</span>
      </div>
      <div style="display:flex;gap:24px;">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  `;

  // Pricing Table (static, can be made interactive)
  document.getElementById('pricing-tables').innerHTML = `
    <div class="platform-grid">
      <div class="hub-card">
        <h3>Starter</h3>
        <p>Starting at <span class="result-num">$20/mo</span></p>
        <ul><li>Email Marketing</li><li>Forms</li><li>Live Chat</li></ul>
        <a href="https://www.hubspot.com/pricing" class="btn secondary">Choose Starter</a>
      </div>
      <div class="hub-card">
        <h3>Professional</h3>
        <p>Starting at <span class="result-num">$890/mo</span></p>
        <ul><li>Marketing Automation</li><li>ABM Tools</li><li>Campaign Management</li></ul>
        <a href="https://www.hubspot.com/pricing" class="btn secondary">Choose Professional</a>
      </div>
      <div class="hub-card">
        <h3>Enterprise</h3>
        <p>Starting at <span class="result-num">$3,600/mo</span></p>
        <ul><li>Custom Reporting</li><li>Single Sign-On</li><li>Advanced Permissions</li></ul>
        <a href="https://www.hubspot.com/pricing" class="btn secondary">Choose Enterprise</a>
      </div>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://www.hubspot.com/pricing" class="btn primary">See all pricing options</a>
    </div>
  `;

  // Menu interactivity for mobile (basic example)
  // (Optional: Add hamburger menu for mobile, modal popups, etc.)
});
