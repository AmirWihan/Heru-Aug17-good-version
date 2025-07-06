
# ImmiAssist CRM - User Manual

---

## Table of Contents

1.  [**Introduction**](#introduction)
    *   [1.1. What is ImmiAssist CRM?](#what-is-immiassist-crm)
    *   [1.2. Getting Started: Account Creation & Login](#getting-started-account-creation--login)
2.  [**User Role: Applicant**](#user-role-applicant)
    *   [2.1. First-Time Onboarding](#first-time-onboarding)
    *   [2.2. The Applicant Dashboard](#the-applicant-dashboard)
    *   [2.3. Finding and Connecting with Lawyers](#finding-and-connecting-with-lawyers)
    *   [2.4. Managing Your Documents](#managing-your-documents)
    *   [2.5. Messaging Your Lawyer](#messaging-your-lawyer)
3.  [**User Role: Lawyer / Team Member**](#user-role-lawyer--team-member)
    *   [3.1. The Lawyer Dashboard](#the-lawyer-dashboard)
    *   [3.2. Managing Clients](#managing-clients)
    *   [3.3. Case Management: Documents & Tasks](#case-management-documents--tasks)
    *   [3.4. Using AI Tools](#using-ai-tools)
    *   [3.5. Managing Your Team](#managing-your-team)
4.  [**User Role: Super Admin**](#user-role-super-admin)
    *   [4.1. The Super Admin Dashboard](#the-super-admin-dashboard)
    *   [4.2. User Management (All Users)](#user-management-all-users)
    *   [4.3. Platform Analytics & Reports](#platform-analytics--reports)
    *   [4.4. Managing Payments & Subscriptions](#managing-payments--subscriptions)
    *   [4.5. System-Wide Settings](#system-wide-settings)
5.  [**Appendices**](#appendices)
    *   [5.1. Troubleshooting](#troubleshooting)
    *   [5.2. Contact Support](#contact-support)
    *   [5.3. Glossary of Terms](#glossary-of-terms)

---

## 1. Introduction

### 1.1. What is ImmiAssist CRM?

Welcome to ImmiAssist CRM, your all-in-one platform for managing the complexities of the immigration process. Our application is designed to connect applicants with experienced legal professionals, streamline case management, and leverage powerful AI tools to improve efficiency and success rates.

**Key Features:**

*   **Client Management:** A centralized database for lawyers to manage client information, documents, and communication.
*   **AI-Powered Tools:** Includes an Application Checker, Document Summarizer, and AI-Assisted Messaging to save time and reduce errors.
*   **Role-Based Dashboards:** Tailored experiences for Applicants, Lawyers, and Administrators to ensure everyone has access to the information they need.
*   **Secure Communication:** Direct messaging between clients and their legal team.

### 1.2. Getting Started: Account Creation & Login

Accessing the app is simple and secure.

**For New Users:**

1.  Navigate to the registration page.
2.  Select your role: **"Lawyer / Professional"** or **"Client / Applicant"**.
3.  Fill in your full name, email address, and create a secure password.
4.  Click **"Create Account"**.
5.  You will be automatically redirected to the appropriate onboarding or dashboard page.

*[Screenshot of the Registration Page - Figure 1: src/components/pages/register.tsx]*

**For Existing Users:**

1.  Navigate to the login page.
2.  Enter your registered email and password.
3.  Click **"Login"**. You will be securely logged in and redirected to your dashboard.

*[Screenshot of the Login Page - Figure 2: src/components/pages/login.tsx]*

---

## 2. User Role: Applicant

This section guides you through the features available to you as an applicant.

### 2.1. First-Time Onboarding

Upon your first login, you will be guided through an onboarding process to help us understand your immigration goals.

#### **CRS Score Calculator**

The first step is to estimate your Comprehensive Ranking System (CRS) score for Canadian Express Entry.

1.  Answer the questions in the multi-step form, including details about your age, education, work experience, and language skills.
2.  Click **"Next Step"** to proceed through the form.
3.  On the final step, click **"Calculate My Score"**.
4.  The system will display your estimated CRS score along with a detailed breakdown and recommendations.

*[Screenshot of the CRS Calculator - Figure 3: src/components/pages/client-onboarding.tsx]*

### 2.2. The Applicant Dashboard

Your dashboard is your central hub for tracking your application progress.

*   **Welcome Banner:** Displays your current application status and the next immediate step.
*   **AI-Powered Case Timeline:** A personalized, estimated timeline of your immigration journey's key milestones.
*   **Quick Actions:** Quickly access your documents or message your lawyer.
*   **Next Appointment:** Shows details for your next scheduled meeting.

*[Screenshot of the Applicant Dashboard - Figure 4: src/components/pages/client-overview.tsx]*

### 2.3. Finding and Connecting with Lawyers

You can browse a directory of verified immigration professionals.

1.  Navigate to the **"Find a Lawyer"** page from the sidebar.
2.  Use the search bar and filters to find a professional who matches your needs.
3.  Review their profile, including specialties, experience, and success rate.
4.  Click the **"Share Info & Connect"** button on a lawyer's profile card to securely share your profile and initiate contact.

*[Screenshot of the Find a Lawyer Page - Figure 5: src/components/pages/find-lawyer.tsx]*

### 2.4. Managing Your Documents

This section allows you to view and upload documents requested by your legal team.

1.  Navigate to the **"My Documents"** page.
2.  You will see a list of all documents, their status (e.g., Requested, Uploaded, Approved), and the date they were last updated.
3.  For any document with a **"Requested"** status, click the **"Upload"** button to submit your file.
4.  You can also view or download documents that have already been uploaded.

*[Screenshot of the My Documents Page - Figure 6: src/components/pages/my-documents.tsx]*

### 2.5. Messaging Your Lawyer

Communicate securely with your connected legal team.

1.  Navigate to the **"Messages"** page.
2.  Select a conversation from the list on the left.
3.  The main panel will display your message history.
4.  Type your message in the input box at the bottom and click the **"Send"** button.

*[Screenshot of the Messages Interface - Figure 7: src/components/pages/client-messages.tsx]*

---

## 3. User Role: Lawyer / Team Member

This section outlines the tools available to legal professionals for case and client management.

### 3.1. The Lawyer Dashboard

Your dashboard provides a high-level overview of your firm's activities.

*   **Key Metrics:** At-a-glance cards for Total Clients, Pending Applications, Upcoming Appointments, and Monthly Revenue.
*   **AI Risk Alerts:** An AI-powered tool that scans active files and flags potential issues, such as approaching deadlines or missing documents.
*   **Recent Applications & Appointments:** Lists of the most recent activity for quick access.
*   **Quick Actions:** Shortcuts to create a new client, application, or appointment.

*[Screenshot of the Lawyer Dashboard - Figure 8: src/components/pages/dashboard.tsx]*

### 3.2. Managing Clients

The **"Clients"** page is your central CRM database.

1.  Navigate to the **"Clients"** page from the sidebar.
2.  View a table of all your clients. You can search and filter by status, case type, or country.
3.  Click on any client row to open their detailed profile in a side panel.
4.  From the client profile, you can view their case summary, activity log, manage documents, assign tasks, and more.

*[Screenshot of the Client List Page - Figure 9: src/components/pages/clients.tsx]*
*[Screenshot of the Client Profile View - Figure 10: src/components/pages/client-profile.tsx]*

### 3.3. Case Management: Documents & Tasks

*   **Documents:** From the main sidebar, navigate to **"Documents"** to manage your library of document templates. You can create new templates, edit existing ones, and assign them to clients.
*   **Tasks:** From the main sidebar, navigate to **"Tasks"** to view all tasks across your firm. You can filter by status or priority. To create a new task for a specific client, visit their profile page and use the task management tools there.

### 3.4. Using AI Tools

The **"AI Tools"** page provides powerful features to streamline your work.

*   **Document Summarizer:** Paste text from a lengthy document to get a concise summary.
*   **Application Checker:** Paste the text from an application form, select the application type, and the AI will scan for potential errors, omissions, and inconsistencies.
*   **AI-Assisted Messaging:** Generate professional, context-aware messages for clients by providing a name, context, and desired tone.

*[Screenshot of the AI Tools Page - Figure 11: src/components/pages/ai-tools.tsx]*

### 3.5. Managing Your Team

The **"Team Management"** page allows you to view team performance and manage members.

1.  Navigate to **"Team Management"** from the sidebar.
2.  View key performance indicators (KPIs) for your team.
3.  See a list of top-performing team members.
4.  Manage your team roster, including viewing profiles and contact information.

*[Screenshot of the Team Management Page - Figure 12: src/components/pages/team.tsx]*

---

## 4. User Role: Super Admin

This section is for platform administrators who have oversight of the entire system.

### 4.1. The Super Admin Dashboard

The admin dashboard provides a global overview of the entire platform.

*   **Platform-Wide Stats:** View metrics for total applicants, active firms, total revenue, and critical action items.
*   **Action Items:** See a list of urgent tasks that require administrative attention, such as pending lawyer account activations or overdue platform-wide invoices.
*   **Platform-wide Tasks & Messages:** Get a glimpse into the latest tasks and messages across all users.

*[Screenshot of the Super Admin Dashboard - Figure 13: src/components/pages/admin-overview.tsx]*

### 4.2. User Management (All Users)

The **"User Management"** page allows you to manage all lawyer and client accounts on the platform.

1.  Navigate to **"User Management"** from the admin sidebar.
2.  Use the tabs to switch between **"Lawyers / Firms"** and **"Applicants / Clients"**.
3.  From the lawyer tab, you can approve pending activations, suspend accounts, or manage subscription plans.
4.  From the client tab, you can view client details or block accounts if necessary.

*[Screenshot of the User Management Page - Figure 14: src/components/pages/admin-user-management.tsx]*

### 4.3. Platform Analytics & Reports

The **"Analytics"** page provides deep insights into platform growth and performance.

*   **Visual Charts:** View charts for user growth, revenue by case type, application status breakdowns, and more.
*   **Data Tables:** See detailed reports like client geographic distribution.

*[Screenshot of the Platform Analytics Page - Figure 15: src/components/pages/admin-platform-analytics.tsx]*

### 4.4. Managing Payments & Subscriptions

The **"Payments & Subs"** page is the financial hub for the platform.

*   **Firm Subscriptions:** View and manage the subscription status for all legal firms on the platform.
*   **Client Invoices:** See a log of all one-time invoices generated by lawyers for their clients.
*   **Transaction History:** A complete log of all payments processed through the platform.

*[Screenshot of the Payments Page - Figure 16: src/components/pages/admin-payments.tsx]*

### 4.5. System-Wide Settings

The **"Platform Settings"** page gives you control over the entire application.

*   **General:** Manage branding, such as the platform name and logo. Enable or disable global feature flags.
*   **Billing & Subscriptions:** Configure the details and pricing for each subscription plan (Starter, Pro, Enterprise).
*   **Integrations:** Manage API keys for third-party services like Google Cloud and Stripe.

*[Screenshot of the Platform Settings Page - Figure 17: src/components/pages/admin-platform-settings.tsx]*

---

## 5. Appendices

### 5.1. Troubleshooting

*   **Problem: I can't log in.**
    *   **Solution:** Double-check that your email and password are correct. Use the "Forgot Password" link if you need to reset it.
*   **Problem: A page is not loading correctly.**
    *   **Solution:** Try refreshing the page. If the problem persists, clear your browser's cache and cookies and try again.
*   **Problem: I cannot upload a document.**
    *   **Solution:** Ensure your file is in a supported format (e.g., PDF, JPG, PNG) and is smaller than the maximum file size limit (usually 5MB).

### 5.2. Contact Support

If you encounter an issue you cannot resolve, please contact our support team.

*   **In-App Support:** Navigate to the **"Help & Support"** page from your dashboard sidebar to submit a ticket.
*   **Email:** For urgent issues, you can email us at **support@immiassist.com**.

### 5.3. Glossary of Terms

*   **CRM (Customer Relationship Management):** A system for managing a company's relationships and interactions with customers and potential customers.
*   **CRS (Comprehensive Ranking System):** A points-based system used by the Canadian government to assess and score Express Entry candidates.
*   **IRCC (Immigration, Refugees and Citizenship Canada):** The department of the Government of Canada responsible for immigration, refugees, and citizenship.
*   **PNP (Provincial Nominee Program):** A program through which Canadian provinces and territories can nominate individuals for immigration.
*   **LMIA (Labour Market Impact Assessment):** A document that an employer in Canada may need to get before hiring a foreign worker.

