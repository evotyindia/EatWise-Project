# EatWise India / Swasth Bharat Advisor 🇮🇳

**Decode Your Food. Unleash Your Health.**

EatWise India is an AI-powered nutritional assistant tailored for the Indian market. It moves beyond simple calorie counting to provide deep, chemical-level insights into packaged foods, helping users understand what they are really eating.

🔗 **Live Demo:** [https://eatwise.evotyindia.me](https://eatwise.evotyindia.me)

---

## 🚀 Key Features

### 1. 🔍 AI Label Scanner
Upload a photo of any packaged food label. Our **Gemini 1.5 Flash** powered engine utilizes OCR to read the ingredients and nutrients, helping to:
- **Decode Additives:** Explain what "E450" or "Maltodextrin" actually does.
- **Hidden Sugars:** Identify over 50+ aliases for sugar.
- **Health Score:** Assign a simple RAG (Red-Amber-Green) rating.
- **Better Alternatives:** Suggest healthier, locally available Indian substitutes.

### 2. 👨‍🍳 AI Recipe Generator
Tailored for Indian kitchens. Enter your available ingredients, and our AI constructs:
- **Zero-Waste Recipes:** Uses what you have.
- **Dietary Adjustments:** Vegan, Gluten-Free, High-Protein options.
- **Cultural Context:** Recipes that taste like home.

### 3. 📝 Dynamic Blog & Admin Panel
A fully featured CMS built into the platform:
- **Secure Admin Access:** Protected via email allowlist (`admin@evotyindia.me`) and Firestore Security Rules.
- **AI Auto-Writer:** Generate complete, SEO-friendly articles with one click.
- **Image Prompts:** Automatically generates high-quality prompts for Midjourney/DALL-E for blog covers.
- **Rich Text Editor:** Full formatting support for engaging content.

### 4. 🖼️ Cloudflare R2 Integration
- Optimized, low-cost storage for blog images.
- High-performance delivery via global CDN.
- Secure, presigned URL uploads.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, ShadCN UI
- **AI:** Google Gemini 1.5 Flash, Firebase Genkit
- **Backend:** Next.js Server Actions, Firebase Firestore (NoSQL)
- **Auth:** Firebase Authentication 
- **Storage:** Cloudflare R2 (S3 Compatible)
- **Language:** TypeScript

---

## ⚡ Deployment & Setup

### 1. Clone & Install
```bash
git clone https://github.com/evotyindia/EatWise-Project
cd EatWise-Project
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory. You need keys for Firebase, Google AI, and Cloudflare R2.

```env
# Google AI (Gemini)
GOOGLE_API_KEY=your_gemini_api_key

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# App Config
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Security (Comma-separated emails)
NEXT_PUBLIC_ADMIN_EMAILS=admin@eatwise.evotyindia.me

# Cloudflare R2 (Image Storage)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
NEXT_PUBLIC_R2_PUBLIC_DOMAIN=...
```

### 3. Run Locally
```bash
# Start Genkit for AI Flows
npm run genkit:dev

# Start Next.js App
npm run dev
```
Visit `http://localhost:3000`.

---

## 🔐 Security

This project implements strict security measures:
- **Frontend Gate:** The `/admin` routes verify the user's email against `NEXT_PUBLIC_ADMIN_EMAILS`. Unauthorized users are redirected immediately.
- **Backend Rules:** `firestore.rules` enforces that only the specific admin email can write/delete from the `posts` collection, preventing API spoofing.

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a PR.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License.
