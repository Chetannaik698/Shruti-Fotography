# LumiFrame Studio — Full MERN Application

A production-ready photography studio website: a polished, animated React frontend backed by a
Node.js/Express/MongoDB REST API, with JWT authentication, role-based admin access, Cloudinary image
hosting, likes/favorites, category-based browsing, one-click WhatsApp enquiries, and a studio location
section with an embedded Google Map.

```
lumiframe-studio-mern/
├── backend/     Express + MongoDB REST API
└── frontend/    React (Vite) client
```

---

## Features

**Public site**
- Animated hero, portfolio, about, services, testimonials, pricing, FAQ, contact sections
- Gallery browsing by category, pulled live from the database
- Like / favorite images (requires login) — favorites saved per user
- One-click WhatsApp enquiry with a pre-filled message, from the floating button and from any image
- Studio Location section with hours + an embedded Google Map
- Signup / Login with JWT

**Admin panel** (`/admin`, visible only to `role: admin` users)
- Dashboard with live stats (images, categories, users, likes, most-liked, recently uploaded)
- Upload images to Cloudinary, edit or delete them
- Create / edit / delete categories (Wedding, Pre-Wedding, Engagement, Baby Shoot, etc.)
- Promote/demote other users to admin
- All changes reflect instantly on the public site (no redeploy or refresh needed)

**Backend**
- REST API for auth, categories, gallery, likes, and admin operations
- MongoDB via Mongoose (Users, Categories, Images, Likes)
- JWT auth (httpOnly cookie + Bearer token support) with bcrypt password hashing
- Role-based middleware (`protect`, `adminOnly`)
- Cloudinary image storage via Multer (memory storage) + streaming upload
- Centralized validation and error handling

---

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either a local instance or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com) account (for image uploads)

---

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

| Variable | Description |
|---|---|
| `PORT` | Port the API runs on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | URL of the frontend, for CORS (e.g. `http://localhost:5173`) |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | A long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` | From your Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | From your Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used only by the optional seed script below |

Run the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API will be live at `http://localhost:5000/api` (health check: `GET /api/health`).

### Creating your first admin account

You have two options:

1. **Automatic:** the very first account ever registered through `/api/auth/signup` (on the public
   Sign Up page) is automatically made an admin. Simplest for a fresh database.
2. **Seed script:** run `node seed.js` from the `backend` folder to create default categories
   (Wedding, Pre-Wedding, Engagement, Baby Shoot, Maternity, Portrait, Events) and bootstrap an admin
   account from the `ADMIN_*` values in your `.env`, if no admin exists yet.

To promote an existing user later, use the **Users** tab in the Admin panel (an existing admin can
promote/demote other accounts), or update their `role` field to `"admin"` directly in MongoDB.

---

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Set `frontend/.env`:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:5173`.

Build for production:

```bash
npm run build      # outputs to frontend/dist
npm run preview    # preview the production build locally
```

---

## 4. Using the App

1. Go to **Sign Up** and create the first account — it becomes the studio owner/admin automatically.
2. Log in and open the **Admin** link (now visible next to your profile icon in the navbar).
3. In **Categories**, add categories such as Wedding, Pre-Wedding, Engagement, Baby Shoot.
4. In **Gallery Images**, upload photos, assign each to a category, and mark tall/featured as needed.
5. Visit the homepage — the Portfolio section and category filters update instantly from the database.
6. Create a second, normal account (or log out and sign up again) to see the regular user experience:
   no Admin link, but full ability to browse, like/favorite images, and enquire via WhatsApp.

---

## 5. API Reference

Base URL: `/api`

**Auth**
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/signup` | Public | Register (first user becomes admin) |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | Private | Get current user |
| POST | `/auth/logout` | Private | Clear auth cookie |

**Categories**
| Method | Route | Access |
|---|---|---|
| GET | `/categories` | Public |
| POST | `/categories` | Admin |
| PUT | `/categories/:id` | Admin |
| DELETE | `/categories/:id` | Admin |

**Gallery**
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | `/gallery?category=slug` | Public | `category=all` or omitted returns everything |
| GET | `/gallery/:id` | Public | |
| POST | `/gallery` | Admin | `multipart/form-data`, field `image` + `title`, `category`, `description`, `tall`, `featured` |
| PUT | `/gallery/:id` | Admin | Same fields, `image` optional to replace the file |
| DELETE | `/gallery/:id` | Admin | Also removes the file from Cloudinary |

**Likes**
| Method | Route | Access |
|---|---|---|
| GET | `/likes/me` | Private — current user's favorites |
| POST | `/likes/:imageId` | Private — toggle like/unlike |

**Admin**
| Method | Route | Access |
|---|---|---|
| GET | `/admin/stats` | Admin |
| GET | `/admin/users` | Admin |
| PUT | `/admin/users/:id/role` | Admin — `{ role: "admin" \| "user" }` |

All private routes accept the JWT either as an `Authorization: Bearer <token>` header or as the
`token` httpOnly cookie set automatically on login/signup.

---

## 6. Deployment Notes

- Deploy `backend/` to any Node host (Render, Railway, Fly.io, a VPS, etc.). Set all `.env` variables
  in your host's environment settings — never commit `.env`.
- Deploy `frontend/` as a static build (`npm run build` → `dist/`) to Vercel, Netlify, or similar.
  Set `VITE_API_URL` to your deployed backend's URL.
- Update `CLIENT_URL` in the backend's environment to your deployed frontend URL so CORS allows it.
- In production, set `NODE_ENV=production` so auth cookies are issued with `Secure`/`SameSite=None`
  (required for cross-domain cookies over HTTPS).

---

## 7. Customization

- **Studio location / map:** edit `frontend/src/data/content.js` → `contactInfo.mapEmbed` (a Google
  Maps "Embed a map" iframe `src`) and `studioLocation` (address, hours, directions link).
- **WhatsApp number:** edit `contactInfo.whatsapp` in the same file.
- **Branding/colors:** edit `frontend/tailwind.config.js`.
