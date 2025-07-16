
# Deploying Your Application to Firebase App Hosting

This guide provides the steps to deploy your Next.js application to Firebase App Hosting.

## Prerequisites

1.  **Node.js:** Ensure you have Node.js installed on your machine.
2.  **Firebase Account:** You need a Firebase account and a Firebase project.
3.  **Firebase CLI:** You must have the Firebase CLI installed. If you don't, run this command in your terminal:
    ```bash
    npm install -g firebase-tools
    ```

## Deployment Steps

Follow these steps from your project's root directory in your terminal.

### 1. Log in to Firebase

First, you need to authenticate with your Google account.

```bash
firebase login
```

This will open a browser window for you to log in.

### 2. Initialize Firebase (If not already done)

Your project already contains a `firebase.json` file, so it's likely initialized. However, if you were starting from scratch, you would run:

```bash
firebase init hosting
```

During the setup, you would:
- Select an existing Firebase project.
- Choose **"App Hosting"** as your hosting option.
- Specify your web framework (Next.js).

### 3. Deploy Your Application

This is the final step. The following command will build your Next.js application for production and deploy it to Firebase App Hosting.

```bash
firebase deploy
```

The command will provide you with a unique URL where your live application can be accessed. That's it! Your app is now live.
