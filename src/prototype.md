
# EatWise India - Project Prototype & Specifications

## 1. Brand Identity & Design Specifications

### 🖋 Typography

-   **Heading Font:** `Poppins` (Bold, 24-40px) - Clean, modern, and friendly for titles and major headings.
-   **Sub Heading Font:** `Poppins` (Semi-Bold, 18px) - Used for card titles and section headers.
-   **Text Content Font:** `Inter` (Regular, 16px) - Chosen for its high readability for body text, descriptions, and reports.
-   **Brand Name & Logo Font:** `Poppins` (Extra-Bold) - Uses the primary heading font with a heavier weight for brand recognition.

### 🎨 Color Scheme

The color palette is designed to be calm, trustworthy, and fresh, reflecting the app's health-focused mission.

-   **Primary Colors:**
    -   `#0f172a` (Deep Blue) - Used for primary UI elements, text, and dark mode background.
    -   `#eef6f5` (Subtle Cyan) - A very light secondary color used for backgrounds and accents in light mode.
-   **Accent Colors:**
    -   `#10b981` (Vibrant Emerald Green) - Used for calls-to-action, highlights, icons, and to signify success or positive attributes.
    -   `#f43f5e` (Bright Red) - Reserved for destructive actions, errors, and high-risk alerts (`destructive` theme color).
-   **Neutral Colors:**
    -   `#f8fafc` (Off-White) - Primary background for light mode.
    -   `#ffffff` (White) - Card backgrounds in light mode.
    -   `#e2e8f0` (Light Grey) - Borders and inputs.
    -   `#64748b` (Slate Grey) - Muted foreground text.

### 🌙 Dark Mode & ☀️ Light Mode Variants

-   **Light Mode:**
    -   **Background:** `#f8fafc` (Off-White)
    -   **Text:** `#0f172a` (Deep Blue)
    -   **Primary Buttons:** `#1a9474` (Primary Green)
    -   **Secondary/Accent:** `#10b981` (Vibrant Emerald Green)
-   **Dark Mode:**
    -   **Background:** `#0f172a` (Deep Blue)
    -   **Text:** `#e2e8f0` (Light Grey)
    -   **Primary Buttons:** `#a7d8cf` (Light Cyan)
    -   **Secondary/Accent:** `#17d19c` (Bright Emerald Green)

---

## 2. User Roles & Dashboards

The application primarily centers around one main user role, with functionality unlocked upon authentication.

### 👤 Registered User Portal

-   **Description:** Any user who signs up and verifies their email. This role grants access to personalization and data persistence features.
-   **Key Features:**
    -   **Personalized Dashboard (`/saved`):** A central hub to view, search, and manage all saved reports (label analyses, recipes, nutrition checks).
    -   **Report Management:** Ability to view detailed reports, delete old ones, and manage sharing settings.
    -   **Public Sharing:** Users can make reports public and set custom, human-readable share links (e.g., `eatwise.com/username/my-favorite-recipe`).
    -   **Account Management (`/account`):** Update personal details, manage security settings, and delete account data.
    -   **AI Chat Context:** The AI chat within each saved report remembers the context of that specific item.
-   **Navigation Flow:**
    1.  User logs in → Redirected to their intended page or `/`.
    2.  Navigates to `/saved` → Views a personalized list of all their generated content.
    3.  Clicks a report → Views the detailed report page (`/saved/[id]`) with edit and sharing options.
    4.  Navigates to `/account` → Manages their profile and data.

---

## 3. Core Features & Disruptive Elements

### 📌 Key Features

-   **AI-Powered Food Label Analysis (`/analyze`):**
    -   **Input:** OCR via image upload or manual text entry of ingredients.
    -   **Output:** Generates a comprehensive health report including:
        -   Overall health rating (1-5 stars).
        -   Green/Red flags for key ingredients.
        -   Detailed analysis of processing level, macronutrients, and sugar.
        -   Personalized consumption tips and dietary context.
        -   Suggestions for healthier Indian alternatives.
-   **AI-Powered Recipe Suggestions (`/recipes`):**
    -   **Input:** User-provided ingredients, health concerns (e.g., diabetes), and household size.
    -   **Output:** Generates a list of suitable Indian dish ideas. Upon selection, a detailed recipe is created with scaled ingredients, step-by-step instructions, and health notes.
-   **AI-Powered Nutrition Analysis (`/nutrition-check`):**
    -   **Input:** OCR via nutrition table image upload or manual entry of values (calories, fats, vitamins, etc.).
    -   **Output:** A detailed report on nutritional balance, dietary suitability, and an overall nutrient density rating.
-   **Context-Aware AI Chat:**
    -   Integrated into each report page, the AI chat (powered by Gemini) understands the context of the specific report being viewed, allowing for targeted follow-up questions.
-   **User Authentication & Data Persistence:**
    -   Secure user signup and login flow with email verification.
    -   All generated reports can be saved to a user's account, accessible via the `/saved` page.
-   **Blog & Informational Content:**
    -   A dedicated section for articles on nutrition, healthy eating, and wellness, establishing the app as a knowledge hub.

### 💡 Unique Disruptive Features

-   **Hyper-Contextual Indian Alternatives:** The AI doesn't just identify "bad" ingredients; it suggests specific, healthier *Indian* replacements, making the advice immediately actionable and culturally relevant.
-   **Ingredient-Based Recipe Generation:** Moves beyond simple recipe lookup by creating tailored meal ideas from the user's available pantry items, reducing food waste and simplifying meal planning.
-   **Unified AI Interaction Model:** A single, consistent AI chat model (`contextAwareAIChat`) is used across all features, providing a seamless user experience whether they are asking about a Maggi packet, a homemade recipe, or nutrition facts.

---

## 4. Data Flow & Storage Management

### 🗄 Database Tables (Firestore Collections)

-   **`users`:**
    -   **Fields:** `uid` (Auth ID), `name`, `username`, `email`, `phone`, `emailVerified`.
    -   **Description:** Stores user profile information. The Firestore Document ID is the primary key for internal lookups.
-   **`usernames`:**
    -   **Fields:** Document ID is the lowercase username.
    -   **Fields:** `uid`.
    -   **Description:** A separate collection to enforce unique usernames and allow for quick lookups.
-   **`reports`:**
    -   **Fields:** `uid`, `type` ('label', 'recipe', 'nutrition'), `title`, `summary`, `createdAt`, `data` (JSON object of AI output), `userInput` (JSON object of user's input), `isPublic`, `publicSlug`.
    -   **Description:** The central collection for all user-generated content, linked to the user via their `uid`.

### 🔗 APIs & Backend Integration (Genkit AI Flows)

The application uses Google's Genkit as its AI backend, with flows defined as server-side TypeScript functions.

-   **`generateHealthReport`:**
    -   **Input:** `productName`, `ingredients`, `nutritionFacts`, `photoDataUri`.
    -   **Process:** Uses Gemini's multimodal capabilities to analyze text and image data.
    -   **Output:** A structured JSON object containing the detailed health report.
-   **`getRecipeSuggestions` & `getDetailedRecipe`:**
    -   **Process:** A two-step flow. First, `getRecipeSuggestions` generates dish names from ingredients. Then, `getDetailedRecipe` takes a selected dish name and other context to generate a full recipe.
    -   **Output:** Structured JSON objects for both suggestions and the final recipe.
-   **`analyzeNutrition`:**
    -   **Input:** A mix of numeric nutritional data and an optional image URI.
    -   **Process:** Uses Gemini to analyze the balance and suitability based on the provided numbers.
    -   **Output:** A structured JSON object with the nutritional analysis.
-   **`contextAwareAIChat`:**
    -   **Input:** `userQuestion`, `chatHistory`, and a `context` object (which varies based on the report type).
    -   **Process:** Gemini generates a response based on the provided context, acting as a specialized advisor for that specific report.
    -   **Output:** A JSON object containing the AI's answer.

---

## 5. UI Component Guidelines

The UI is built with **ShadCN UI** components, ensuring consistency and accessibility.

-   **Cards (`Card`):** The primary container for displaying all content, from forms to reports to blog posts. Heavily used for a modular layout.
-   **Accordions (`Accordion`):** Used within report pages to collapse and expand detailed sections like "Ingredient Deep Dive" and "Nutritional Breakdown," preventing information overload.
-   **Dialogs (`Dialog`):** Used for focused actions like saving a report or browsing ingredients, keeping the user in context.
-   **Forms (`Form`, `Input`, `Textarea`, `Checkbox`):** Standardized input elements for all user data entry.
-   **Alerts (`Alert`):** Used to display key takeaways, summaries, and color-coded "Green/Red Flags" in reports.
-   **Buttons (`Button`):** Styled consistently for primary, secondary, and destructive actions.
-   **Tabs (`Tabs`):** Used on the `/saved` page to allow users to filter between different types of saved reports.
