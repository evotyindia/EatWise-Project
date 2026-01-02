# TechSprint Hackathon Presentation: EatWise India

## Slide 1: Title Slide
**Project Name:** EatWise India
**Tagline:** Decode Your Food. Unleash Your Health.
**Team Name:** [Your Team Name]
**Team Leader:** [Your Name]
**Hackathon:** TechSprint (GDG on Campus)

---

## Slide 2: Team Details
**Meet the Team**
*   **[Member 1 Name]** – [Role, e.g., Full Stack Developer & AI Lead]
*   **[Member 2 Name]** – [Role, e.g., Frontend Developer & UI/UX Designer]
*   **[Member 3 Name]** – [Role, e.g., Backend Developer & Cloud Architect]
*   **[Member 4 Name]** – [Role, e.g., Research & Content Strategist]

---

## Slide 3: Problem Statement
**The Challenge: Nutritional Literacy in India**
*   **Confusion:** Indian consumers struggle to understand complex food labels and "hidden" ingredients (sugar aliases, preservatives).
*   **Misinformation:** Generic health advice often ignores Indian dietary habits and local food context.
*   **Health Crisis:** Rising lifestyle diseases (diabetes, hypertension) linked to processed food consumption.
*   **The Gap:** Existing apps focus on calorie counting, not *ingredients quality* or *health context*.

---

## Slide 4: Problem Analysis & Opportunities
**Why Now?**
*   **Market Gap:** Most label scanners are built for Western markets (USDA data) and fail to recognize Indian packaged foods or home-cooked meals.
*   **Opportunity:** A growing middle class is becoming health-conscious but lacks actionable tools.
*   **Analysis:** Users need more than just "Bad for you." They need to know *why* and *what else* they can eat.

---

## Slide 5: Proposed Solution – Overview
**EatWise India: Your AI Nutrition Assistant**
*   **Core Idea:** An intelligent web platform that "reads" food labels for you and suggests healthier Indian alternatives.
*   **Value Proposition:** Instant clarity. Snap a photo of a label, and get a simplified health report with a traffic-light rating system.
*   **Innovation:** We combine OCR (text recognition) with **Google Gemini AI** to provide culturally relevant advice (e.g., suggesting *Jaggery* instead of *Refined Sugar*).

---

## Slide 6: How It Solves the Problem
**From Confusion to Clarity in 3 Steps**
1.  **Scan/Input:** User uploads a photo of a food label or types ingredients.
2.  **Analyze:** Our AI engine decodes chemical names, identifies allergens, and flags hidden sugars.
3.  **Act:** The user receives a personalized "EatWise Score," a breakdown of risks, and suggestions for healthier Indian alternatives.

*   **Impact:** Empowers users to make informed buying decisions in seconds, directly at the grocery store.

---

## Slide 7: Unique & Innovative Approach
**What Sets Us Apart?**
*   **Hyper-Local Context:** Unlike global apps, we understand "Namkeen," "Ghee," and "Atta." We recommend alternatives available in local Indian kirana stores.
*   **Genkit-Powered Context:** We use **Firebase Genkit** to create structured, consistent AI outputs, ensuring reliability over generic chatbots.
*   **Holistic Health:** We go beyond calories to analyze *chemical composition* and *long-term health impact*.

---

## Slide 8: Key Features
**Feature Set**
*   **📸 Smart Label Scanner:** Extracts text from images and analyzes nutritional tables.
*   **🍲 AI Recipe Generator:** Suggests healthy Indian recipes based on available ingredients.
*   **📊 Nutrition Deep Dive:** Detailed breakdown of macro and micronutrients.
*   **📝 Dynamic Blog Hub:** AI-assisted content education on health topics.
*   **🤖 Chat Assistant:** Context-aware Q&A about specific food items.

---

## Slide 9: Google Technologies Used
**Powered by Google Cloud & AI**
*   **Google Gemini (via Vertex AI/Genkit):** The core intelligence engine. We use Gemini 1.5 Flash for high-speed, low-latency text analysis and recipe generation.
*   **Firebase Authentication:** Secure, seamless user login (Google Sign-In).
*   **Firebase Firestore:** Real-time NoSQL database for storing user reports, blogs, and profiles.
*   **Firebase Genkit:** typescript framework used to build, deploy, and monitor our AI flows ensuring production-grade reliability.

---

## Slide 10: Architecture Diagram (Description)
**System Architecture**
1.  **Frontend:** Next.js (React) app hosted on Vercel/Firebase Hosting. UI components by Tailwind/Shadcn.
2.  **API Layer:** Next.js Server Actions act as the secure gateway.
3.  **AI Engine:** **Firebase Genkit** orchestrates calls to **Google Gemini**.
4.  **Database:** **Firestore** stores users, blog posts, and saved analysis reports.
5.  **Storage:** Cloudflare R2 (S3 compatible) for optimized image storage.

_(Diagram would show arrows flowing from User -> Next.js -> Genkit -> Gemini -> Response)_

---

## Slide 11: Process Flow / Use-Case
**User Journey: The "Analyze" Flow**
1.  **User Action:** User clicks "Analyze Label" and uploads an image.
2.  **Processing:** Image is sent to server; OCR extracts text.
3.  **AI Analysis:** Extracted text is sent to the `generateHealthReport` flow (Genkit).
4.  **Data Structuring:** Gemini returns a JSON object with `score`, `risks`, `positives`.
5.  **Result:** User sees a colorful, easy-to-read Dashboard with the verdict.

---

## Slide 12: Wireframes / MVP Status
**Current Implementation Status**
*   **✅ Completed:** Authentication, Label Analysis Engine, Recipe Generator, Admin Blog System.
*   **✅ Live:** Fully responsive web application.
*   **🛠 In Progress:** Mobile App (React Native), Barcode Scanning integration.

---

## Slide 13: Future Scope & Scalability
**Roadmap**
*   **Barcode Database:** Integration with a massive database for instant barcode scanning.
*   **Personalized Health Plans:** AI generating weekly meal plans based on user health data.
*   **Community:** "EatWise Connect" to share healthy finds and recipes.
*   **Scalability:** Migrating to a fully serverless architecture on Google Cloud Run for auto-scaling.

---

## Slide 14: Links & Resources
**Check It Out**
*   **Live MVP:** [Insert Deployed Link Here]
*   **GitHub Repo:** [Insert GitHub Link Here]
*   **Demo Video:** [Insert YouTube/Drive Link Here]

*Thank you! Questions?*
