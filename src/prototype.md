
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

## 2. User Architecture & Portal

The application's architecture revolves around a single, authenticated user role that unlocks personalization and data persistence features.

### 2.1. Registered User Portal

-   **Description:** A user who has completed the signup flow (providing name, email, password) and has successfully verified their email address. This is the only user role with access to the core application features.
-   **Authentication Flow:**
    1.  **Signup:** User creates an account. A user document is created in the `users` collection in Firestore, and an authentication record is created in Firebase Auth. An email verification link is dispatched.
    2.  **Verification:** User clicks the link in their email. Firebase Auth flags their account as verified.
    3.  **Login:** User logs in. The `AuthManager` component confirms their `emailVerified` status with Firebase Auth. If verified, it fetches the corresponding user profile from Firestore to retrieve their username and other details.
-   **Core Features Accessible:**
    -   **Personalized Dashboard (`/saved`):** Central hub for all user-generated content.
    -   **Report Management:** Detailed viewing, editing, sharing, and deletion of saved reports.
    -   **Public Sharing:** Ability to create and manage public, shareable links for reports.
    -   **Account Management (`/account`):** Profile updates and data management.
    -   **Context-Aware AI Chat:** Session-based chat that understands the context of the specific report being viewed.

### 2.2. Detailed Navigation & User Journey

1.  **Login & Redirection:**
    -   A user attempts to access a protected page (e.g., `/analyze`).
    -   The page's client-side logic checks for an authenticated user via the `useAuth` hook.
    -   If the user is not logged in, they are redirected to `/login?redirect=/analyze`. The original intended path is stored in the URL query parameter.
    -   Upon successful login, the application reads the `redirect` parameter and navigates the user to their intended destination (`/analyze`).

2.  **Saved Items Management (`/saved` -> `/saved/[id]`):**
    -   User navigates to the `/saved` page.
    -   The page component fetches all documents from the `reports` Firestore collection where the `uid` field matches the currently logged-in user's UID.
    -   Reports are displayed in a `Tabs` component, allowing the user to filter by `type` ('label', 'recipe', 'nutrition').
    -   The user clicks "View Item" on a specific report card. This navigates them to `/saved/[id]`, where `[id]` is the unique Firestore document ID of that report.
    -   On the `/saved/[id]` page, the application fetches that specific report document. It includes an ownership check to ensure the report's `uid` matches the logged-in user's UID, preventing unauthorized access.
    -   The page then provides options to edit the report's title, manage its public sharing slug, and interact with the AI chat.

---

## 3. Core Features: Processing & Data Flow

This section details the end-to-end process for each of the application's core AI-powered features.

### 3.1. AI Food Label Analysis (`/analyze`)

-   **Objective:** To provide users with a comprehensive health analysis of a food product from its label.
-   **Processing & Data Flow:**
    1.  **Input (Client-Side):** The user interacts with the `AnalyzerForm` component. They can either:
        a. **Upload an image:** An `<input type="file">` captures the image. The `fileToDataUri` utility function converts the `File` object into a Base64-encoded string.
        b. **Manual Entry:** The user types the product name, ingredients, and nutrition facts into `<Input>` and `<Textarea>` fields, managed by `react-hook-form`.
    2.  **API Call (Client to Server):** When the user clicks "Analyze," the client-side `generateHealthReport` function (a wrapper) is called. It passes a `GenerateHealthReportInput` object containing the form data (text inputs or the image data URI) to the backend.
    3.  **Backend Processing (Genkit Flow):** The `generateHealthReportFlow` on the server is invoked.
        -   It receives the input object.
        -   The flow prepares a prompt for the multimodal AI model (Gemini). The prompt is a Handlebars template that instructs the AI on its role (expert Indian nutritionist) and the exact JSON schema required for the output.
        -   Crucially, if a `photoDataUri` is present, it's embedded in the prompt using the `{{media url=photoDataUri}}` Handlebars helper. This tells Gemini to perform Optical Character Recognition (OCR) on the image to extract text like ingredients.
    4.  **AI Generation (Gemini):** Gemini processes the combined prompt (instructions, text data, and image data). It analyzes the ingredients, identifies potential health flags, rates the product on various scales, and formulates healthier Indian alternatives. It structures its entire response to strictly match the `GenerateHealthReportOutputSchema` Zod schema.
    5.  **Response (Server to Client):** The structured JSON output is returned from the Genkit flow back to the client.
    6.  **Rendering (Client-Side):** The returned JSON object is stored in the component's state. This state change triggers a re-render, and the `LabelReportDisplay` component takes the report object as a prop and displays the information in a user-friendly format using `Card`, `Alert`, and `Accordion` components.

### 3.2. AI Recipe Suggestions (`/recipes`)

-   **Objective:** To generate healthy, relevant Indian meal ideas based on ingredients the user has on hand.
-   **Unique Architecture (Two-Step Flow):** This feature is intentionally split into two separate AI calls (`getRecipeSuggestions` and `getDetailedRecipe`) to enhance user experience. Instead of a long wait for a full recipe, the user first gets a quick list of ideas, providing instant feedback and a sense of progress.
-   **Processing & Data Flow:**
    1.  **Input (Client-Side):** In the `RecipeForm`, the user enters available ingredients, health concerns, and household size.
    2.  **Step 1: Get Suggestions (API Call):** The form submission calls the `getRecipeSuggestions` flow.
        -   **Backend:** The prompt instructs the AI to act as a creative chef and return only an array of dish *names* and a brief introductory message, based on the inputs.
        -   **Client:** The `RecipeForm` receives the `GetRecipeSuggestionsOutput` (an array of strings) and displays these dish names as clickable buttons.
    3.  **Step 2: Get Detailed Recipe (User Interaction & API Call):** The user clicks on a suggested dish name (e.g., "Palak Paneer").
        -   This action triggers a call to the `getDetailedRecipe` flow, passing the selected `dishName` along with the *original* form inputs (ingredients, health concerns, etc.) for full context.
    4.  **Backend Processing (Detailed Recipe Flow):**
        -   The `getDetailedRecipeFlow` receives this comprehensive input.
        -   Its prompt is much more detailed, instructing the AI to scale ingredient quantities based on household size, provide step-by-step instructions, and include specific health notes tailored to the user's concerns. It also includes the new requirement to generate a nutritional breakdown.
    5.  **Response & Rendering (Client-Side):** The detailed `GetDetailedRecipeOutput` JSON object is returned and stored in the component's state. The `RecipeDisplay` component then renders this detailed recipe, and the `Context-Aware AI Chat` is initialized with the context of this specific recipe.

### 3.3. Context-Aware AI Chat

-   **Objective:** To provide a seamless, stateful chat experience where the AI understands the context of the report or recipe being viewed.
-   **Processing & Data Flow:**
    1.  **Initialization:** When a report (label, recipe, or nutrition) is generated or loaded, the page calls the `contextAwareAIChat` flow with a special `userQuestion`: `"INIT_CHAT_WELCOME"`.
    2.  **Context Building:** The client-side logic dynamically builds a `context` object based on the report type. For a recipe, this includes the dish name and health notes; for a label analysis, it includes the product name and summary.
    3.  **Welcome Message:** The AI receives the "INIT_CHAT_WELCOME" instruction and the context object. Its prompt guides it to generate a tailored welcome message (e.g., "Hello! I see you're looking at the Palak Paneer recipe. How can I help?").
    4.  **User Interaction:** The user types a follow-up question.
    5.  **API Call with History:** The `handleChatSubmit` function calls the `contextAwareAIChat` flow again, this time passing:
        -   The new `userQuestion`.
        -   The `chatHistory` (an array of previous user/assistant messages).
        -   The same `context` object from the initial report.
    6.  **AI Response:** The AI's prompt is designed to synthesize all three inputs—the new question, the conversation history, and the static report context—to provide a relevant and intelligent answer. The process then repeats.

---

## 4. Data & Storage Architecture

The application uses Google's Firestore, a NoSQL document database, for all its data storage needs.

### 4.1. Firestore Collections (Database Tables)

-   **`users`:**
    -   **Description:** The primary collection for storing user profile data. Each document represents one user.
    -   **Key Fields:**
        -   `uid` (string): The unique ID from Firebase Authentication. This is the primary key for linking data across the system.
        -   `name` (string): The user's full name.
        -   `username` (string): A unique, user-chosen, lowercase identifier used for public-facing URLs.
        -   `email` (string): The user's email address (stored in lowercase for consistency).
        -   `emailVerified` (boolean): A flag synchronized from Firebase Auth, crucial for granting access.

-   **`usernames`:**
    -   **Description:** A simple, top-level collection used to enforce the uniqueness of usernames and enable fast lookups. This prevents costly queries on the entire `users` collection just to check for a username.
    -   **Document ID:** The lowercase username itself (e.g., document ID is `rahul_k`).
    -   **Key Fields:**
        -   `uid` (string): The `uid` of the user who owns this username.

-   **`reports`:**
    -   **Description:** A central collection for all user-generated content, from all features.
    -   **Key Fields:**
        -   `uid` (string): Foreign key linking the report to a document in the `users` collection.
        -   `type` (string): An enum ('label', 'recipe', 'nutrition') used to determine how to render the data and what context to provide to the AI chat.
        -   `title` (string): A user-editable title for the report.
        -   `data` (map/object): The complete, raw JSON output from the corresponding Genkit AI flow. Storing the full object ensures that even if the display component changes, the original data is preserved.
        -   `userInput` (map/object): The original input provided by the user to the AI flow. This is essential for providing context to the AI chat and for debugging.
        -   `isPublic` (boolean): A flag to control public visibility.
        -   `publicSlug` (string): A user-customizable, URL-friendly string for the public share link.

---

## 5. UI Component Guidelines & Implementation

The UI is built with **ShadCN UI**, leveraging its composition-first approach for consistency and accessibility.

-   **`Card`:** The foundational UI element. Used as the primary container for forms (`AnalyzerForm`, `RecipeForm`), report displays (`LabelReportDisplay`), and list items (`BlogList`, saved items). Provides a consistent, modular layout.
-   **`Accordion`:** Implemented within the `LabelReportDisplay` and `NutritionReportDisplay` components. It's used to conditionally hide complex information like the "Ingredient Deep Dive" or "Nutrient-by-Nutrient Breakdown," preventing information overload while keeping the details accessible.
-   **`Dialog`:** Used for focused, in-context user actions. Examples include the "Save Report" dialog on the analysis pages and the "Browse Ingredients" dialog in the recipe form. This keeps the user on the current page without a disruptive redirect.
-   **`Form`, `Input`, `Textarea`, `Checkbox`:** These are the core building blocks for all data entry, standardized via `react-hook-form` for validation and state management across all feature pages.
-   **`Alert`:** Used extensively in report displays to draw attention to key takeaways. They are color-coded based on a `variant` prop (`success` for Green Flags, `destructive` for Red Flags) to provide immediate visual cues about the nature of the information.
-   **`Tabs`:** Implemented on the `/saved` page to allow users to efficiently filter their saved reports by type, improving navigation and content discovery.
