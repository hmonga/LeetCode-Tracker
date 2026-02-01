# Firestore Security Rules Setup

The app is working, but you need to configure Firestore security rules to allow users to read and write their own data.

## Steps to Fix Firestore Permissions:

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `leetcodetracker-d8036`
3. **Click on "Firestore Database"** in the left menu
4. **Click on the "Rules" tab**
5. **Replace the default rules with the following**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

6. **Click "Publish"** to save the rules

## What these rules do:

- Only authenticated users can access the `users` collection
- Users can only read and write their own document (matching their user ID)
- This ensures data security while allowing the app to function properly

## Alternative: Test Mode (Development Only)

If you want to allow all reads and writes for development (NOT recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Warning**: The test mode rules above allow any authenticated user to read/write any document. Only use this for development!

## After updating the rules:

1. Refresh your browser
2. The permission errors should disappear
3. Your LeetCode username will be saved to Firestore
4. The app will work fully with data persistence

