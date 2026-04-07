# Pulse AI - Terminal Protocol 2.0

Pulse AI is a high-performance, full-stack editorial platform built with modern web technologies. It features a unique "Terminal Protocol" design system — a skeuomorphic aesthetic blending deep shadows, intense neon glows (pulse red accents), and massive typography to deliver an immersive, high-octane reading experience.

## Technical Architecture

The platform is engineered using a robust modern tech stack tailored for speed, scalability, and seamless content delivery.

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom Skeuomorphic utilities (glassmorphism, inner shadows, neon glows)
- **Authentication & RBAC**: Clerk authentication with protected admin and user routes.
- **Database**: MongoDB via Mongoose for dynamic content modeling.
- **Generative AI Engine**: Integrated with Groq AI for automated content generation and curation in the admin dashboard.
- **Icons & UI**: Lucide-react and custom svg assets.

## Key Features

- **Immersive Skeuomorphic UI**: Features custom `shadow-skeuo-in`, `shadow-skeuo-out`, and `text-glow-red` utilities to create a "glass and neon" terminal interface.
- **Editorial Archive**: High-density grid layouts parsing intelligence reports with dynamic category filtering and text-based search capabilities.
- **Admin Command Center**: A protected dashboard for authorized admins to manage users, monitor API health, execute bulk asset deletion, and trigger AI content generation.
- **Content Editor**: Integrated editing capabilities to draft, modify, and publish editorial posts dynamically.
- **SEO & Performance Optimized**: Generates dynamic metadata for individual posts to ensure optimal indexability by global network crawlers.

## Application Structure

The platform is separated into public-facing frontends and secured admin environments:
- **`/` (Root)**: The landing interface, highlighting top intelligence reports and system architecture.
- **`/blog`**: The primary intelligence database for all broadcasted reports.
- **`/blog/[slug]`**: Detailed view for individual reports, fully formatted with a markdown parser.
- **`/dashboard`**: Complete system overview (Admin only).
- **`/dashboard/posts`**: Asset management table (Draft, Publish, Purge operations).
- **`/dashboard/create` / `/dashboard/edit`**: WYSIWYG capabilities for managing raw text protocols prior to broadcast.

## Local Development Initialization

1. **Clone the matrix repository.**
2. **Setup environment variables**:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   MONGODB_URI=...
   GROQ_API_KEY=...
   ```
3. **Install dependencies**: `npm install`
4. **Boot systems**: `npm run dev`

---
*© 2024 Pulse AI Network. All Rights Reserved.*
