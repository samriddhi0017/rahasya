# Rahasya - Anonymous Messaging Platform

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)

## Project Overview

Rahasya is a modern anonymous messaging platform that enables users to receive anonymous messages through secure, unique links. Built with privacy and security in mind, it offers a seamless experience across mobile and web platforms.

## ✨ Features

- 📱 Cross-platform mobile app (iOS & Android)
- 🔒 Secure anonymous messaging
- 🔗 Unique shareable user links
- ⚡ Real-time message delivery
- 🌐 Responsive web interface
- 🔄 Seamless synchronization across devices

## 🛠️ Tech Stack

### Frontend
- Mobile App: React Native (Expo)
- Web Landing Page: React.js
- UI Components: React Native Paper
- State Management: Redux

### Backend
- Runtime: Node.js
- Framework: Express.js
- Authentication: Firebase Auth
- Database: Firebase Realtime Database

### Infrastructure
- Hosting: Firebase Hosting
- Storage: Firebase Cloud Storage
- Functions: Firebase Cloud Functions

## 📁 Project Structure

```
rahasya/
├── app/
│   ├── src/
│   ├── assets/
│   └── App.js
├── server/
│   ├── src/
│   ├── routes/
│   └── index.js
├── web/
│   ├── src/
│   ├── public/
│   └── package.json
├── link/
│   ├── public/
│   └── firebase.json
└── README.md
└── LICENSE
```

## 🚀 Setup Instructions

### Prerequisites

```bash
# Install Node.js (v14 or later)
# Install Firebase CLI
npm install -g firebase-tools

# Install Expo CLI
npm install -g expo-cli
```

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/samriddhi0017/rahasya.git
cd rahasya
```

2. **Mobile App Setup**
```bash
cd app
npm install
npx expo start
```

3. **Server Setup**
```bash
cd server
npm install
npm run dev
```

4. **Web Setup**
```bash
cd web
npm install
npm start
```

5. **Firebase Configuration**
```bash
firebase login
firebase init
```

## 📦 Deployment

### Deploy Mobile App
```bash
cd app
expo build:android
expo build:ios
```

### Deploy Web
```bash
cd web
npm run build
firebase deploy
```

### Deploy Link
```bash
cd link
npm run build
firebase deploy
```


## 📞 Contact

Project Maintainer: Samriddhi Dubey
- Email: samriddhi0017@gmail.com
- GitHub: [@samriddhi0017](https://github.com/samriddhi0017)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
