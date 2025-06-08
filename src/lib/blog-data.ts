
export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  featuredImage: string;
  dataAiHint: string;
  preview: string;
  content: string; // Full content, can be markdown or HTML string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-decode-indian-food-labels",
    title: "How to Decode Indian Food Labels: A Beginner's Guide",
    category: "Nutrition Basics",
    date: "2024-07-28",
    featuredImage: "https://placehold.co/600x400.jpg",
    dataAiHint: "food label magnifying glass",
    preview: "Confused by complex food labels? Learn how to read and understand them to make healthier choices in the Indian market.",
    content: `
<p>Navigating the aisles of an Indian supermarket can be overwhelming, especially when faced with a barrage of food labels. Understanding these labels is crucial for making informed dietary choices. This guide will help you decode the common terms and figures you'll find on Indian food packaging.</p>

<h2 class="text-xl font-semibold mt-4 mb-2">Key Sections of a Food Label:</h2>
<ul class="list-disc list-inside space-y-1 mb-4">
  <li><strong>Ingredients List:</strong> Listed in descending order by weight. Pay attention to the first few ingredients as they make up the bulk of the product. Look out for hidden sugars, unhealthy fats, and artificial additives.</li>
  <li><strong>Nutritional Information:</strong> Usually per 100g/100ml and per serving. Key values include energy (calories), protein, carbohydrates (total and added sugars), fats (saturated, trans fats), and sodium.</li>
  <li><strong>Allergen Information:</strong> Mandatory declaration for common allergens like nuts, dairy, gluten, soy.</li>
  <li><strong>Vegetarian/Non-Vegetarian Marks:</strong> The green dot (vegetarian) and brown/maroon dot (non-vegetarian) are unique to India.</li>
  <li><strong>FSSAI License Number:</strong> Indicates the product is approved by the Food Safety and Standards Authority of India.</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">Common Pitfalls:</h2>
<ul class="list-disc list-inside space-y-1">
  <li><strong>Serving Sizes:</strong> Often smaller than what people typically consume. Calculate nutrition based on your actual portion.</li>
  <li><strong>Health Claims:</strong> "Low Fat", "No Added Sugar", "Natural" can be misleading. Always check the full ingredients list and nutrition panel.</li>
  <li><strong>Hidden Sugars:</strong> Ingredients like corn syrup, dextrose, maltodextrin are all forms of sugar.</li>
</ul>
<p class="mt-4">By becoming a savvy label reader, you can take control of your health and make choices that align with your nutritional goals.</p>
    `,
  },
  {
    slug: "hidden-sugars-in-common-snacks",
    title: "The Sweet Trap: Uncovering Hidden Sugars in Common Indian Snacks",
    category: "Healthy Eating",
    date: "2024-07-25",
    featuredImage: "https://placehold.co/600x400.png",
    dataAiHint: "sweets cookies snacks",
    preview: "Many popular Indian snacks are loaded with hidden sugars. Discover how to identify them and find healthier alternatives.",
    content: `
<p>Sugar is a major contributor to various health issues, and it's often lurking where you least expect it, especially in packaged snacks. While you might avoid overtly sweet items, many savory snacks, sauces, and even "healthy" breakfast cereals popular in India contain significant amounts of added sugar.</p>

<h2 class="text-xl font-semibold mt-4 mb-2">Names for Hidden Sugar:</h2>
<p>Manufacturers use various names for sugar on ingredient lists. Be wary of terms like:</p>
<ul class="list-disc list-inside space-y-1 my-2">
  <li>Corn syrup, High-fructose corn syrup (HFCS)</li>
  <li>Dextrose, Fructose, Glucose, Sucrose, Maltose</li>
  <li>Maltodextrin, Molasses, Cane juice, Fruit juice concentrate</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">Snacks to Watch Out For:</h2>
<ul class="list-disc list-inside space-y-1 my-2">
  <li><strong>Packaged Biscuits & Cookies:</strong> Even "digestive" or "oat" biscuits can be high in sugar.</li>
  <li><strong>Breakfast Cereals:</strong> Many children's cereals and even some adult "healthy" options are sugar-laden.</li>
  <li><strong>Ketchup & Sauces:</strong> Tomato ketchup, BBQ sauce, and other condiments can have surprisingly high sugar content.</li>
  <li><strong>Flavored Yogurts:</strong> Often contain more sugar than plain yogurt with fresh fruit.</li>
  <li><strong>Energy Bars:</strong> Some are glorified candy bars. Check the sugar content carefully.</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">Tips to Reduce Sugar Intake:</h2>
<ul class="list-disc list-inside space-y-1">
  <li>Read labels diligently. Focus on "added sugars" if listed, or total carbohydrates and ingredients.</li>
  <li>Opt for whole, unprocessed foods like fruits, nuts, and seeds for snacking.</li>
  <li>Make homemade versions of snacks where you can control the sugar content.</li>
  <li>Choose plain yogurt and add your own fruit.</li>
</ul>
<p class="mt-4">Being mindful of hidden sugars is a key step towards a healthier diet.</p>
    `,
  },
  {
    slug: "healthy-tiffin-box-ideas-for-kids",
    title: "Nutritious & Delicious: Healthy Tiffin Box Ideas for Indian Kids",
    category: "Kids Nutrition",
    date: "2024-07-20",
    featuredImage: "https://placehold.co/600x400.png",
    dataAiHint: "lunchbox kids school",
    preview: "Packing a healthy and appealing tiffin box can be a challenge. Get creative ideas for nutritious meals your kids will love.",
    content: `
<p>A child's tiffin box is more than just a midday meal; it's a vital source of energy and nutrients that fuels their learning and play. For Indian parents, balancing nutrition with taste preferences can be tricky. Here are some ideas to make tiffin time both healthy and exciting.</p>

<h2 class="text-xl font-semibold mt-4 mb-2">Key Principles for a Healthy Tiffin:</h2>
<ul class="list-disc list-inside space-y-1 mb-4">
  <li><strong>Balance:</strong> Include a source of carbohydrates (for energy), protein (for growth), healthy fats, and vitamins/minerals (from fruits & veggies).</li>
  <li><strong>Variety:</strong> Rotate meals to prevent boredom and ensure a wider range of nutrients.</li>
  <li><strong>Portion Control:</strong> Pack age-appropriate serving sizes.</li>
  <li><strong>Appeal:</strong> Make it colorful and visually appealing. Use cookie cutters for sandwiches or fruit.</li>
  <li><strong>Safety:</strong> Pack foods that can stay safe at room temperature for a few hours.</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">Tiffin Ideas:</h2>
<ul class="list-disc list-inside space-y-2">
  <li><strong>Mini Idlis/Dosas:</strong> With a small container of sambar or chutney. Add grated carrots to idli batter for extra nutrition.</li>
  <li><strong>Vegetable Poha/Upma:</strong> Packed with veggies like peas, carrots, and beans.</li>
  <li><strong>Whole Wheat Parathas/Theplas:</strong> Stuffed with paneer, dal, or mixed vegetables. Serve with a small portion of curd.</li>
  <li><strong>Moong Dal Cheela:</strong> Protein-rich and can be made savory or slightly sweet.</li>
  <li><strong>Fruit Chaat & Sprouts Salad:</strong> A refreshing and light option. Pack dressing separately.</li>
  <li><strong>Whole Wheat Sandwiches:</strong> With fillings like cucumber-tomato, paneer bhurji, or boiled egg.</li>
  <li><strong>Trail Mix:</strong> A small portion of nuts, seeds, and dried fruits (avoid for very young children due to choking hazard).</li>
</ul>
<p class="mt-4">Remember to involve your child in planning their tiffin sometimes; they are more likely to eat what they've helped choose!</p>
    `,
  },
  {
    slug: "indian-superfoods-under-50",
    title: "Budget-Friendly Powerhouses: Indian Superfoods Under ₹50",
    category: "Healthy Eating",
    date: "2024-07-15",
    featuredImage: "https://placehold.co/600x400.png",
    dataAiHint: "vegetables fruits market",
    preview: "Eating healthy doesn't have to be expensive. Explore common Indian superfoods that offer incredible nutritional benefits without breaking the bank.",
    content: `
<p>The term "superfood" often brings to mind exotic and pricey ingredients. However, many traditional Indian foods, readily available and affordable, are nutritional powerhouses. Here are some superfoods you can incorporate into your diet for under ₹50 (prices may vary by region and season).</p>

<h2 class="text-xl font-semibold mt-4 mb-2">Affordable Indian Superfoods:</h2>
<ul class="list-disc list-inside space-y-2">
  <li><strong>Spinach (Palak):</strong> Rich in iron, Vitamin A, K, and antioxidants. A small bunch is usually very cheap.</li>
  <li><strong>Lentils (Dals):</strong> Moong, masoor, toor - all are excellent sources of plant-based protein, fiber, and iron.</li>
  <li><strong>Bananas:</strong> Packed with potassium, Vitamin B6, and provide quick energy.</li>
  <li><strong>Amla (Indian Gooseberry):</strong> Extremely high in Vitamin C and antioxidants. Can be eaten raw, pickled, or as juice.</li>
  <li><strong>Turmeric (Haldi):</strong> Contains curcumin, a powerful anti-inflammatory and antioxidant. A staple in Indian cooking.</li>
  <li><strong>Ginger (Adrak):</strong> Known for its digestive and anti-inflammatory properties.</li>
  <li><strong>Millet (Bajra, Ragi, Jowar):</strong> Gluten-free grains rich in fiber, protein, and micronutrients. Often cheaper than wheat or rice.</li>
  <li><strong>Curd (Dahi):</strong> A great source of probiotics, calcium, and protein. Homemade curd is very economical.</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">Incorporating Them into Your Diet:</h2>
<p>These superfoods can be easily added to your daily meals:</p>
<ul class="list-disc list-inside space-y-1 my-2">
  <li>Add spinach to dals, sabzis, parathas, or smoothies.</li>
  <li>Make dal a regular part of your lunch or dinner.</li>
  <li>Have a banana as a snack or add it to your breakfast.</li>
  <li>Eat a piece of amla daily or add amla powder to water.</li>
  <li>Use turmeric and ginger generously in your cooking.</li>
  <li>Replace rice or wheat with millets a few times a week.</li>
  <li>Include a bowl of curd with your meals.</li>
</ul>
<p class="mt-4">By choosing local, seasonal, and traditional foods, you can enjoy the benefits of superfoods without straining your budget.</p>
    `,
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
}

export const getBlogCategories = (): string[] => {
  const categories = new Set(blogPosts.map(post => post.category));
  return ["All", ...Array.from(categories)];
}

