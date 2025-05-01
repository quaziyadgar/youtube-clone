# YouTube Clone Frontend

This is the frontend for a YouTube clone application, built with **React**, **Vite**, **Tailwind CSS**, and **Redux Toolkit**. It provides a user interface for browsing videos, liking/disliking videos, commenting, and managing user authentication. The frontend integrates with a Node.js/Express/MongoDB backend deployed at `https://youtube-clone-server-sage.vercel.app`.

## Features

- **Video Browsing**: View a list of videos with thumbnails, titles, and view counts on the home page.
- **Video Playback**: Play videos with like, dislike, and comment functionality.
- **User Authentication**: Login/logout with email and password, persisting user state across refreshes.
- **Like/Dislike Videos**: Toggle likes and dislikes, synced with the backend.
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS.
- **State Management**: Redux Toolkit for managing videos, user data, and API states.
- **Error Handling**: Displays loading states and errors for API calls.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **npm**: Version 8.x or higher.
- **Vercel CLI**: For deployment (`npm install -g vercel`).
- **Backend**: Running at `https://youtube-clone-server-sage.vercel.app` or locally at `http://localhost:3000`.
- **Git**: For cloning the repository.

## Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/quaziyadgar/youtube-clone-server.git
   cd youtube-clone-server/client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the `client` directory:
     ```env
     VITE_API_URL=https://youtube-clone-server-sage.vercel.app
     ```
   - `VITE_API_URL`: Points to the backend API. Use `http://localhost:3000` for local development if the backend is running locally.

4. **Run Locally**:
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:5173`.
   - Ensure the backend is running (see backend README).

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Home.jsx          # Home page with video list
│   │   ├── VideoPlayer.jsx   # Video playback with like/dislike
│   │   ├── Channel.jsx       # Channel profile page
│   │   ├── Login.jsx         # Login page
│   ├── features/
│   │   ├── auth/             # Redux slice for authentication
│   │   ├── videos/           # Redux slice for video fetching
│   ├── store.js              # Redux store configuration
│   ├── App.jsx               # Main app with routing
│   ├── main.jsx              # Entry point
├── public/                   # Static assets
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
```

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the app for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint for code linting.

## Deployment to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   - From the `client` directory:
     ```bash
     vercel
     ```
   - For production:
     ```bash
     vercel --prod
     ```

4. **Configure Vercel Settings**:
   - Vercel automatically detects Vite/React.
   - Ensure environment variables are set in Vercel dashboard:
     - `VITE_API_URL=https://youtube-clone-server-sage.vercel.app`
   - **Framework Preset**: Vite.
   - **Build Command**: `npm run build`.
   - **Output Directory**: `dist`.
   - **Root Directory**: `client` (if deploying from monorepo).

5. **Vercel Configuration** (Optional):
   - Add `vercel.json` in `client/`:
     ```json
     {
       "framework": "vite",
       "buildCommand": "npm run build",
       "outputDirectory": "dist",
       "env": {
         "VITE_API_URL": "https://youtube-clone-server-sage.vercel.app"
       }
     }
     ```

6. **Verify Deployment**:
   - Access the deployed URL (e.g., `https://youtube-clone-frontend.vercel.app`).
   - Test login, video browsing, and like/dislike features.

## Backend Integration

The frontend communicates with the backend at `https://youtube-clone-server-sage.vercel.app`. Key APIs:

- `POST /api/auth/login`: Authenticate users (email: `test@example.com`, password: `password123`).
- `GET /api/videos`: Fetch all videos.
- `POST /api/videos/:videoId/like`: Toggle like for a video.
- `POST /api/videos/:videoId/dislike`: Toggle dislike for a video.

Ensure the backend is deployed and MongoDB Atlas is accessible (whitelist `0.0.0.0/0` for testing).

## Troubleshooting

- **userId Undefined on Refresh**:
  - Ensure `authSlice.js` persists `user` and `token` in localStorage:
    ```jsx
    const initialState = {
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
    };
    ```
  - Verify `user._id` is accessed safely: `useSelector((state) => state.auth.user?._id)`.

- **Video API Not Triggering**:
  - Check `Home.jsx` has `useEffect`:
    ```jsx
    useEffect(() => {
      dispatch(fetchVideos());
    }, [dispatch]);
    ```
  - Verify `videosSlice.js` uses correct `VITE_API_URL`.

- **CORS Errors**:
  - Ensure backend `index.js` includes:
    ```javascript
    app.use(cors());
    ```

- **Extension Errors**:
  - Disable React/Redux DevTools in production or use production builds (`npm run build`).

- **Console Logs**:
  - Open Chrome DevTools (F12) to check Network tab for API calls and console for errors.
  - Log Redux actions: `console.log('Fetching videos');`.

## Security Notes

- **userId Vulnerability**:
  - `userId` is stored in localStorage (`user._id`). Use HTTPS to prevent interception.
  - Backend validates `userId` via JWT in `authMiddleware`.
  - Avoid exposing `userId` in DOM (e.g., `<div data-userid={userId}>`).

- **JWT**:
  - Store token in localStorage, validated by backend.
  - Consider `secure-ls` for encrypted storage:
    ```bash
    npm install secure-ls
    ```

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b feature-name`.
3. Commit changes: `git commit -m "Add feature"`.
4. Push: `git push origin feature-name`.
5. Open a pull request.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contact

- **Author**: Quazi Yadgar
- **GitHub**: [quaziyadgar](https://github.com/quaziyadgar)
- **Email**: [Your email, if desired]



---

### How to Use the README
1. **Save the README**:
   - Create or update `client/README.md`:
     ```bash
     cd C:\Users\quazi\OneDrive\Documents\GitHub\youtube-clone-server\client
     echo. > README.md
     ```
   - Copy the content inside the `<xaiArtifact>` tag (excluding the tag) into `README.md`.

2. **Commit and Push**:
   ```bash
   git add README.md
   git commit -m "Add frontend README"
   git push origin main
   ```

3. **Verify on GitHub**:
   - Check `https://github.com/quaziyadgar/youtube-clone-server/client/README.md`.

---

### Addressing Recent Issues
The README incorporates solutions for your recent issues:
- **userId Undefined on Refresh**:
  - Documents localStorage persistence in `authSlice.js`.
  - Suggests safe `userId` access: `state.auth.user?._id`.
- **Video API Not Triggering**:
  - Instructs adding `useEffect` in `Home.jsx`.
  - Confirms `VITE_API_URL` usage.
- **Deployment**:
  - Provides Vercel deployment steps, avoiding backend timeout issues (e.g., optimized `vercel.json`).
- **Security**:
  - Addresses `userId` vulnerability with HTTPS, JWT, and optional `secure-ls`.

---

### Deploying with the README
To deploy the frontend with the new README:
1. **Ensure Fixes**:
   - Update `authSlice.js` (from previous response) for `userId` persistence.
   - Update `Home.jsx` to trigger `fetchVideos`:
     ```jsx
     useEffect(() => {
       dispatch(fetchVideos());
     }, [dispatch]);
     ```

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy**:
   ```bash
   cd client
   vercel --prod
   ```

4. **Set Environment Variable**:
   - In Vercel dashboard: Project Settings > Environment Variables.
   - Add: `VITE_API_URL=https://youtube-clone-server-sage.vercel.app`.

5. **Test**:
   - Visit deployed URL (e.g., `https://youtube-clone-frontend.vercel.app`).
   - Login (`test@example.com`, `password123`).
   - Verify videos load, `userId` persists on refresh, and like/dislike works.

---

### Testing the Frontend
1. **Local**:
   ```bash
   cd client
   npm run dev
   ```
   - Test `http://localhost:5173`:
     - Login, refresh, check `userId`.
     - Verify video list loads.

2. **Deployed**:
   - Test Vercel URL:
     - Login, browse videos, like/dislike.
     - Check console for errors (F12).

3. **Backend**:
   ```bash
   curl https://youtube-clone-server-sage.vercel.app/api/videos
   ```

---

### Why This README Works
- **Comprehensive**: Covers setup, deployment, and troubleshooting.
- **User-Friendly**: Clear instructions for developers and Vercel deployment.
- **Project-Specific**: Includes your backend URL, test credentials, and issue fixes.
- **Professional**: Follows standard README structure with security notes.

---

### Clarifications Needed
1. **Repository**:
   - Is the frontend in `youtube-clone-server/client` or a separate repo (e.g., `youtube-clone-client`)?
   - Share the GitHub URL if separate.
2. **Features**:
   - Any additional features to list (e.g., search, subscriptions)?
3. **authSlice.js**, **Home.jsx**:
   - Share current code to confirm `userId` and video API fixes.
4. **Console Logs**:
   - Errors on home page or refresh?
5. **vercel.json**:
   - Share frontend `vercel.json` (if any).
6. **Backend Status**:
   - Is the backend deployed successfully after timeout fixes?
7. **Next Steps**:
   - Sticky header, YouTube icon, or other features?

---

### Next Steps
1. **Save README**:
   - Add to `client/README.md`.

2. **Apply Fixes**:
   - Update `authSlice.js`, `Home.jsx`.

3. **Deploy**:
   - Run `vercel --prod` in `client`.

4. **Test**:
   - Local and deployed frontend.
   - Backend integration.

5. **Share**:
   - Repository URL, `authSlice.js`, `Home.jsx`.
   - Console logs, deployment errors.
   - Backend status, `vercel.json`.
   - Next feature priorities.


GITHUB LINK - https://github.com/quaziyadgar/youtube-clone
DEPLOYED LINK - https://youtube-clone-bice-pi.vercel.app/