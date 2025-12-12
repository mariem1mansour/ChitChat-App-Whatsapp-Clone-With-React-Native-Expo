# 🪧 ChitChat – WhatsApp Clone for Expo Go

A sleek, fully functional WhatsApp-inspired chat app built with **React Native + Expo Go**, featuring real-time messaging, media sharing, contact management, and Firebase-powered authentication — **no phone auth, no OTP, no custom builds**.

---

## ✅ Features Overview

- **Authentication**: Email/password via Firebase Auth  
- **Realtime Messaging**: Text and images via Firestore  
- **User Profiles**: Edit name & avatar (uploaded to Cloudinary)  
- **Contact Management**: Browse & add users by email  
- **Responsive UI**: WhatsApp-like interface using `react-native-paper`  
- **Zero Native Builds**: Runs **entirety in Expo Go** on Android  

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Framework | React Native 0.81.5 + Expo SDK 54 |
| Navigation | React Navigation v7 (Stack + Bottom Tabs) |
| Auth & DB | Firebase Authentication + Firestore |
| Media Storage | Cloudinary |
| UI Library | React Native Paper + Vector Icons |
| Env Mgmt | `.env` (via `expo-constants`) |

> ✅ **Fully compatible with Expo Go** – no `expo-dev-client`, no EAS, no native code.

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "@react-navigation/bottom-tabs": "^7.8.12",
    "@react-navigation/native": "^7.1.25",
    "@react-navigation/native-stack": "^7.8.6",
    "expo": "~54.0.27",
    "expo-constants": "~17.0.5",
    "expo-image-picker": "~16.0.3",
    "expo-status-bar": "~3.0.9",
    "firebase": "^12.6.0",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-paper": "^5.14.5",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-vector-icons": "^10.3.0"
  }
}
```

> ✅ All libraries are Expo Go–compatible. `expo-image-picker` works out-of-the-box on Android.

---

## 📁 Project Structure

```
chitchat/
├── App.js
├── .env.example
├── .gitignore
├── package.json
├──
├── config/
│   ├── firebase.js          # Firebase initialization
│   └── cloudinary.js        # Cloudinary upload helper
│
├── context/
│   ├── AuthContext.js       # Auth state & methods
│   └── ChatContext.js       # Chat logic (optional, or handle in screens)
│
├── screens/
│   ├── SplashScreen.js
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js        # Recent chats (Bottom Tab)
│   ├── ContactScreen.js     # All users (Bottom Tab)
│   ├── AddContactScreen.js
│   ├── ProfileScreen.js     # Edit profile, logout, delete (Bottom Tab)
│   └── ChatRoomScreen.js    # Real-time chat UI
│
├── components/
│   ├── ChatItem.js
│   ├── MessageBubble.js
│   └── UserListItem.js
│
└── assets/
    └── (optional icons/splash)
```

---

## 🔧 Setup & Installation

### Prerequisites
- Windows 11
- Node.js v22.12.0
- npm v11.6.2
- Android device/emulator with **Expo Go** installed

### Steps

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/chitchat.git
   cd chitchat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Rename `.env.example` to `.env`
   - Fill in your Firebase & Cloudinary credentials:

   ```env
   # .env
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abcdef123456

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
   ```

   > 🔐 Never commit `.env` to version control!

4. **Start the app**
   ```bash
   expo start --android
   ```
   Scan the QR code with **Expo Go** on your Android device.

---

## 🔐 Firebase Setup (Required)

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Email/Password** sign-in in **Authentication > Sign-in methods**
3. Enable **Firestore Database** (start in test mode for development)
4. Create a **Cloudinary account**, enable unsigned uploads, and note:
   - Cloud Name
   - Upload Preset (must be **unsigned**)

> ⚠️ Ensure Firestore rules allow authenticated users to read/write their own data and messages.

---

## 🌟 Key Notes

- **No phone auth**: Only email/password supported.
- **Media uploads**: Images are compressed and uploaded to Cloudinary; URLs stored in Firestore.
- **Contact validation**: Adding a contact checks if the email exists in Firebase Auth users (via Firestore user list).
- **Profile photo**: Stored as Cloudinary URL in user document.
- **Logout & Delete**: Profile screen includes secure account deletion (removes auth + Firestore data).

---

## 🎨 UI Inspiration

- Clean green accent (like WhatsApp)
- Message bubbles (sent/received)
- Bottom navigation with Home, Contacts, Profile
- Loading states & error handling in all async actions

---

## 🚀 Ready to Run?

Just run:
```bash
npm install && expo start --android
```

Make sure your `.env` is configured — and chat away! 💬

---

> Developed with ❤️
