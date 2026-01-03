# EatWise India - Comprehensive Project Specifications & Architecture

This document provides a highly detailed specification for the EatWise India project, covering brand identity, user architecture, core feature processing, data models, and backend integration. It serves as the primary blueprint for development and understanding the application's functionality.

---

## 1. Brand Identity & Design System

The brand identity is engineered to be trustworthy, modern, and accessible, reflecting its health-centric mission for an Indian audience.

### 1.1. Typography System

The font selection creates a clear visual hierarchy, enhancing readability and user experience.

-   **Heading & Brand Font:** `Poppins`
    -   **Usage:** Main page titles, navigation branding, and major section headers.
    -   **Weights:** Extra-Bold for the logo, Bold for H1/H2 titles.
    -   **Rationale:** Poppins was chosen for its clean, geometric, and friendly letterforms, which convey a sense of modern authority and approachability. This makes complex nutritional information feel less intimidating.

-   **Sub-Heading Font:** `Poppins`
    -   **Usage:** Card titles, form section headers, and secondary headings.
    -   **Weight:** Semi-Bold.
    -   **Rationale:** Maintains consistency with the primary heading font while using a lighter weight to create a clear distinction and guide the user's eye.

-   **Text Content Font:** `Inter`
    -   **Usage:** All body text, including paragraphs, descriptions, AI-generated reports, and form inputs.
    -   **Weight:** Regular.
    -   **Rationale:** Inter is a variable font designed specifically for high readability on screens, especially for smaller text sizes. Its tall x-height ensures clarity, which is crucial for displaying detailed nutritional reports without causing eye strain.

### 1.2. Color Palette & Theming

The color scheme is managed via CSS custom properties (variables) in `src/app/globals.css`, allowing for seamless light/dark mode switching.

-   **Primary Colors:**
    -   `#0f172a` (Deep Blue): The foundational color for dark mode backgrounds and light mode text. Conveys stability, trust, and intelligence.
    -   `#eef6f5` (Subtle Cyan): A light, airy color used as a secondary background and accent in light mode, evoking a sense of cleanliness and health.

-   **Accent Colors:**
    -   `#10b981` (Vibrant Emerald Green): The primary action color. Used for buttons, highlights, icons, and to signify positive attributes (e.g., "Green Flags"). It's associated with nature, health, and success.
    -   `#f43f5e` (Bright Red): Used exclusively for destructive actions (e.g., delete buttons), critical errors, and high-risk alerts (e.g., "Red Flags"). Its high visibility ensures users pause and take notice.

-   **Thematic Application (Light Mode):**
    -   **Background (`--background`):** `#f8fafc` (Off-White) - A soft white that's easier on the eyes than pure white.
    -   **Text (`--foreground`):** `#0f172a` (Deep Blue) - High contrast for excellent readability.
    -   **Primary UI (`--primary`):** A slightly muted green (`#1a9474`) is used for primary buttons to feel grounded.
    -   **Accent (`--accent`):** The brighter emerald green (`#10b981`) is used for highlights and interactive elements.

-   **Thematic Application (Dark Mode):**
    -   **Background (`--background`):** `#0f172a` (Deep Blue) - The core dark theme color.
    -   **Text (`--foreground`):** `#e2e8f0` (Light Grey) - A soft off-white for text that avoids the harsh glare of pure white on a dark background.
    -   **Primary UI (`--primary`):** A light, desaturated cyan (`#a7d8cf`) is used for buttons to provide a soft, calming call-to-action.
    -   **Accent (`--accent`):** A brighter, more luminous green (`#17d19c`) is used to make accents pop against the dark background.

---

## 2. User Architecture & Portals

The application features two distinct user roles/portals: the **Registered User** (public) and the **Administrator** (private).

### 2.1. Registered User Portal (Public)

-   **Description:** For general users accessing health features.
-   **Authentication:** 
    -   **Methods:** Email/Password and Google Sign-In.
    -   **Flow:** Signup -> Email Verification (if Email/Pass) -> Login.
    -   **Verification:** `emailVerified` check is enforced for interactive features.
-   **Core Features:**
    -   **Personalized Dashboard (`/saved`):** Hub for saved labels and recipes.
    -   **AI Tools:** `/analyze`, `/recipes`, `/nutrition-check`.
    -   **Context-Aware Chat:** Session-based AI chat tied to specific reports.

### 2.2. Administrator Portal (Private)

-   **Description:** A secure, robust dashboard for managing the platform's content and users.
-   **Authentication:**
    -   **Method:** Email/Password ONLY 
    -   **Route:** `/admin/login`.
    -   **Access Control:** Strict checking of the user's `uid` against a hardcoded list of admin UIDs in `src/app/admin/layout.tsx`.
-   **Core Features:**
    -   **Dashboard Overview:** Key metrics (Users, Blog Views, Storage Usage).
    -   **Blog Management (`/admin/create`, `/admin/edit`):** Advanced WYSIWYG editor with AI generation capabilities.
    -   **Storage Management (`/admin/storage`):** R2 cloud storage explorer with "Used/Unused" detection logic for image cleanup.
    -   **User Management:** List, verify, and delete registered users.

### 2.3. User Experience Enhancements

-   **Global Cinematic Loader (`InitialLoader`):**
    -   **Behavior:** Runs on every page refresh (no session cache).
    -   **Design:** Full-screen, dark-mode only, "Eat Wise India" branding with sequential gradient typography and deep-space orbital animations.
    -   **Tech:** Framer Motion with hardware acceleration (`will-change-transform`) for 60fps performance on low-end devices.

---

## 3. Core Features: Processing & Data Flow

### 3.1. AI Food Label Analysis (`/analyze`)

-   **Objective:** Comprehensive health analysis from label photos or text.
-   **Flow:**
    1.  **Input:** Image upload (Base64) or Manual Text.
    2.  **OCR & Analysis (Genkit):** `generateHealthReportFlow` uses Gemini Multimodal. The prompt embeds the image via Handlebars (`{{media url=photoDataUri}}`) for OCR.
    3.  **Output:** JSON matching `GenerateHealthReportOutputSchema`.
    4.  **Display:** `LabelReportDisplay` renders the data with Accordions for deep dives and Color-coded Alerts for health flags.

### 3.2. AI Recipe Suggestions (`/recipes`)

-   **Objective:** Generate healthy Indian meal ideas from available ingredients.
-   **Architecture:** Two-step "Suggestion -> Detail" flow to minimize latency.
    1.  **Step 1 (Suggestions):** `getRecipeSuggestions` returns a list of dish names (~2 seconds).
    2.  **Step 2 (Detail):** User clicks a dish -> `getDetailedRecipe` generates full instructions, nutritional info, and health notes (~8-10 seconds).

### 3.3. AI Blog Generator (`/admin/create`)

-   **Objective:** Assist admins in creating high-quality, SEO-optimized blog content.
-   **Flow:**
    1.  **Input:** Admin enters a Topic and Tone.
    2.  **Generation:** `generateBlogPostFlow` produces:
        -   **Metadata:** Title, Slug, Excerpt, Reading Time, Category, Tags.
        -   **Content:** Full HTML body with tailored headings and formatting.
        -   **Media:** A highly detailed, scene-descriptive prompt for generating a cover image (e.g., via Midjourney/DALL-E).
    3.  **review:** Admin reviews and edits the content in the Tiptap-based editor before publishing.

---

## 4. Data & Storage Architecture

### 4.1. Cloudflare R2 (Object Storage)

The project uses a hybrid approach for efficiency and performance.

-   **Purpose:** Storing user-uploaded images (Label photos) and Blog assets.
-   **Integration:**
    -   **Upload:** Direct S3-compatible API calls using `aws-sdk`.
    -   **Serving:** Public Read access via Custom Domain.
    -   **Management:** The `/admin/storage` page lists all objects in the bucket, cross-references them with Firestore (Blog posts) to identify "Orphaned" files, and allows deletion to save costs.

### 4.2. Firestore Collections (Database)

-   **`users`:** User profiles (`uid`, `name`, `username`, `email`, `role`).
-   **`usernames`:** Uniqueness reservation table.
-   **`reports`:** User-generated analyses. Stores raw JSON data to ensure forward compatibility.
    -   *Indexes:* Compound indexes created for querying by `uid` + `createdAt` (for "My Saved" lists).
-   **`blogs`:** Published content.
    -   **Fields:** `title`, `slug` (unique ID), `content` (HTML), `excerpt`, `coverImage` (R2 URL), `author`, `publishedAt`, `views`.
    -   *Indexes:* Indexed by `slug` for fast public lookup (`/blogs/[slug]`).

---

## 5. UI Component Guidelines & Implementation

Built with **ShadCN UI** (Radix Primitives + Tailwind CSS).

-   **Layouts:**
    -   **Public:** `Navbar` + `Footer` (Responsive, Mobile Menu).
    -   **Admin:** Sticky `Sidebar` + Scrollable Content Area. No Header/Footer.
-   **Key Components:**
    -   **`Card`:** Universal container.
    -   **`Accordion`:** Progressive disclosure of complex data.
    -   **`Dialog`:** Contextual actions (Save, Edit) without navigation.
    -   **`Form`:** `react-hook-form` + `zod` for strictly typed validation.
    -   **`Tiptap Editor`:** Custom WYSIWYG implementation for Blog management.
