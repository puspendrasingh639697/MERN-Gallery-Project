# Image Gallery (Full-Stack)

A feature-rich Image Gallery platform with a dedicated Admin Dashboard for management and a Public Website for users, built with the MERN stack and Next.js.

##  Live Links
- **Public Website:** [Insert Vercel Link Here]
- **Admin Dashboard:** [Insert Vercel Link Here]
- **Backend API:** [Insert Render Link Here]

## Features

###  User Side (Next.js)
- **Google Authentication:** Secure login using Firebase Auth.
- **Image Interaction:** Like/Unlike images (reflected in real-time).
- **Personalization:** Dedicated "Liked Images" page for each user.
- **Advanced Sorting:** Sort by Newest, Oldest, or Most Popular (Backend-driven).
- **Smooth UX:** Loading states and empty state handling.

###  Admin Side (React.js)
- **JWT Auth:** Secure Admin login with hashed passwords.
- **CRUD Operations:** Upload, Edit Title, and Delete images.
- **Cloud Storage:** Images are securely stored on Cloudinary.
- **Protected Routes:** Only authorized admins can access the dashboard.

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React.js, Tailwind CSS.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas.
- **Authentication:** Firebase Admin SDK (Token Validation), JWT, Bcrypt.
- **Image Hosting:** Cloudinary.

## Security Implementation
- **Firebase Token Validation:** Every "Like" request is verified on the backend using Firebase Admin SDK to prevent unauthorized API calls.
- **Password Hashing:** Admin credentials are encrypted using Bcrypt.
- **CORS Configuration:** Strictly defined allowed origins for production.

##  Local Setup Instructions
  ## Backend Setup: 
  Go to backend/ folder.
     Run npm install.

Create a .env file with: MONGO_URI, JWT_SECRET, CLOUDINARY_URL, FIREBASE_SERVICE_ACCOUNT_PATH.

Run npm start.

## Frontend Setup:

Go to website/ or admin/ folder.

Run npm install.

Add NEXT_PUBLIC_API_URL to your .env.local.

Run npm run dev.

Made with by [Puspendra Singh]

1. **Clone the project:**
   ```bash
   git clone <your-repo-link>