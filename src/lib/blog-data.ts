
export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  preview: string;
  content: string; // Full content, can be markdown or HTML string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-decode-indian-food-labels",
    title: "How to Decode Indian Food Labels: A Beginner's Guide",
    category: "Nutrition Basics",
    date: "2024-07-28",
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
   {
    slug: "magic-of-millets",
    title: "The Magic of Millets: A Guide to India's Ancient Grains",
    category: "Healthy Eating",
    date: "2024-07-10",
    preview: "Rediscover the nutritional power of millets like Ragi, Jowar, and Bajra. Learn how to easily incorporate them into your daily meals for better health.",
    content: `
<p>Millets, the ancient grains of India, are making a major comeback, and for good reason. These tiny grains are packed with nutrients, are naturally gluten-free, and are incredibly versatile in the kitchen. Let's explore why you should add millets to your diet.</p>

<h2 class="text-xl font-semibold mt-4 mb-2">Popular Indian Millets:</h2>
<ul class="list-disc list-inside space-y-1 mb-4">
  <li><strong>Finger Millet (Ragi):</strong> Rich in calcium and iron. Great for making rotis, dosas, and porridge.</li>
  <li><strong>Sorghum (Jowar):</strong> A good source of protein and fiber. Jowar rotis (bhakri) are very popular.</li>
  <li><strong>Pearl Millet (Bajra):</strong> High in iron and magnesium. Commonly used to make rotis, especially in winter.</li>
  <li><strong>Foxtail Millet (Kangni):</strong> Helps in managing blood sugar levels and is good for digestion.</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">Health Benefits:</h2>
<ul class="list-disc list-inside space-y-1">
  <li><strong>Rich in Nutrients:</strong> Millets are loaded with fiber, protein, vitamins, and minerals.</li>
  <li><strong>Gluten-Free:</strong> An excellent choice for people with celiac disease or gluten sensitivity.</li>
  <li><strong>Low Glycemic Index:</strong> Helps in managing blood sugar levels, making them ideal for diabetics.</li>
  <li><strong>Good for Heart Health:</strong> They help reduce cholesterol and blood pressure.</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">How to Cook with Millets:</h2>
<p class="mt-4">You can substitute rice with cooked millets. Millet flours can be used to make rotis, cheelas, and baked goods. They can also be used in salads, upma, and khichdi. Start by replacing a portion of your regular grains with millets and gradually increase the quantity.</p>
    `,
  },
  {
    slug: "understanding-fats",
    title: "Understanding Fats: The Good, The Bad, and The Essential",
    category: "Nutrition Basics",
    date: "2024-07-05",
    preview: "Not all fats are created equal. This guide breaks down saturated, unsaturated, and trans fats in the context of Indian diets and cooking oils.",
    content: `
<p>Fat is an essential macronutrient, but it has a bad reputation. The key is to understand the different types of fats and choose wisely, especially with the variety of cooking oils and ghee used in Indian cuisine.</p>

<h2 class="text-xl font-semibold mt-4 mb-2">The Good Fats (Unsaturated):</h2>
<p>These are beneficial for heart health and should be the primary type of fat in your diet.</p>
<ul class="list-disc list-inside space-y-1 my-2">
  <li><strong>Monounsaturated Fats:</strong> Found in mustard oil, groundnut oil, olive oil, avocados, almonds, and cashews.</li>
  <li><strong>Polyunsaturated Fats (Omega-3 & Omega-6):</strong> Found in fatty fish, flaxseeds, walnuts, and sunflower oil.</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">The Bad Fats (Saturated & Trans Fats):</h2>
<p>These should be limited as they can increase the risk of heart disease.</p>
<ul class="list-disc list-inside space-y-1 my-2">
  <li><strong>Saturated Fats:</strong> Found in ghee, butter, coconut oil, palm oil, and red meat. While traditional Indian cooking uses ghee, moderation is key.</li>
  <li><strong>Trans Fats:</strong> The worst type of fat. Found in vanaspati, margarine, and many packaged and fried snacks. Avoid them as much as possible by checking labels for "partially hydrogenated oils".</li>
</ul>

<h2 class="text-xl font-semibold mt-4 mb-2">Making Healthier Choices:</h2>
<ul class="list-disc list-inside space-y-1">
  <li>Use a variety of oils for cooking, such as mustard oil, groundnut oil, or rice bran oil.</li>
  <li>Use ghee and coconut oil in moderation.</li>
  <li>Limit deep-fried foods and packaged snacks.</li>
  <li>Include nuts and seeds in your diet.</li>
</ul>
<p class="mt-4">A balanced approach to fats is crucial for overall health. Focus on incorporating good fats while minimizing the bad ones.</p>
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

    