# QR-Check

Modern attendance, training, participation, and competency tracking using QR codes.

## Features

### ✅ Implemented
- **Attendance System**
  - QR code scanning for check-in/check-out
  - Real-time attendance tracking
  - Event management with QR code generation
  - Mobile-first responsive design

### 🚧 Coming Soon
- Training Module (QR links to materials, progress tracking)
- Participation Tracking (activity check-ins, points system)
- Competency Assessment (assessor sign-off, skill tracking)

## Tech Stack

- Next.js 15 + React 19 + TypeScript
- Tailwind CSS 4
- Firebase/Firestore
- QR Libraries: `qrcode`, `html5-qrcode`

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (already configured)

### Installation

```bash
npm install
```

### Set up Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/project/qr-class-df724/firestore)
2. Enable Firestore Database
3. Create collections: `events`, `attendance`
4. Set test rules (⚠️ development only):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

### Admin (Generate QR Codes)
1. Go to **Admin** page
2. Enter event details
3. Generate and download QR code
4. Print and display at location

### Users (Check-in/out)
1. Go to **Attendance** page
2. Enter your name (first time)
3. Scan QR code to check-in
4. Scan again to check-out

## Project Structure

```
qr-check/
├── app/                  # Next.js pages
├── components/           # React components
├── lib/                  # Firebase, QR service, utilities
├── types/                # TypeScript definitions
└── .env.local            # Firebase config
```

## Security Notes

Current setup is **development only**:
- No authentication (uses localStorage)
- Open Firestore rules
- No QR encryption

For production, implement:
- Firebase Authentication
- Secure Firestore rules
- QR expiration/validation
- User roles

## Troubleshooting

**Camera not working**: Grant permissions, use HTTPS
**QR not scanning**: Good lighting, steady hand
**Firebase errors**: Check Firestore is enabled with correct rules

## Future Enhancements

- User authentication
- Admin dashboard with analytics
- Training/participation/competency modules
- Reports and exports
- Mobile app

---

**Built with Next.js and Firebase**
