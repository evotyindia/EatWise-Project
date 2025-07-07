
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
  {
    slug: "vegetarian-protein-power",
    title: "Vegetarian Protein Power: Top Sources for a Strong Indian Diet",
    category: "Nutrition Basics",
    date: "2024-07-01",
    preview: "Think you can't get enough protein on a vegetarian diet? Think again! Explore top plant-based protein sources available in India.",
    content: `
      <p>A common myth is that vegetarian diets lack sufficient protein. However, an Indian vegetarian diet can be rich in protein if you know which foods to include. Protein is essential for muscle repair, immune function, and overall health.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Top Vegetarian Protein Sources:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Lentils and Legumes (Dals and Chanas):</strong> From moong and masoor to chickpeas and rajma, these are staples for a reason. They are packed with protein and fiber.</li>
        <li><strong>Paneer (Indian Cottage Cheese):</strong> An excellent source of slow-digesting casein protein, making you feel full for longer.</li>
        <li><strong>Tofu and Soya Chunks:</strong> Made from soybeans, these are complete proteins, meaning they contain all nine essential amino acids.</li>
        <li><strong>Greek Yogurt and Curd:</strong> Especially Greek yogurt, which is strained to remove whey, resulting in higher protein content.</li>
        <li><strong>Nuts and Seeds:</strong> Almonds, walnuts, peanuts, pumpkin seeds, and chia seeds are great for a protein boost.</li>
        <li><strong>Millets:</strong> Grains like quinoa and amaranth (rajgira) are complete proteins.</li>
      </ul>
      <p class="mt-4">By combining different sources, for example, dal with rice or roti, you can ensure you get a complete amino acid profile. A well-planned vegetarian diet is more than capable of meeting your protein needs.</p>
    `,
  },
  {
    slug: "hydration-is-key",
    title: "Beyond Water: Creative Ways to Stay Hydrated in the Indian Climate",
    category: "Healthy Living",
    date: "2024-06-28",
    preview: "Staying hydrated is more than just drinking water. Discover delicious and refreshing Indian drinks and foods that help you beat the heat.",
    content: `
      <p>In the heat and humidity of the Indian climate, staying hydrated is crucial for health. Dehydration can lead to fatigue, headaches, and serious health issues. While drinking plain water is essential, there are many other traditional and tasty ways to maintain your fluid balance.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Refreshing Hydration Options:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Coconut Water (Nariyal Pani):</strong> Nature's sports drink. It's rich in electrolytes like potassium, making it excellent for rehydration.</li>
        <li><strong>Buttermilk (Chaas):</strong> A cooling probiotic drink that aids digestion and replenishes fluids and electrolytes.</li>
        <li><strong>Lemon Water (Nimbu Pani):</strong> A simple and effective way to get Vitamin C and stay hydrated. Can be made sweet or salty.</li>
        <li><strong>Water-Rich Fruits:</strong> Watermelon, cucumber, oranges, and muskmelon have high water content and help you stay hydrated while providing essential vitamins.</li>
        <li><strong>Herbal Teas:</strong> Unsweetened herbal teas like hibiscus or mint can be a refreshing alternative to plain water.</li>
        <li><strong>Aam Panna:</strong> A traditional summer drink made from raw mangoes that helps prevent heat stroke.</li>
      </ul>
      <p class="mt-4">Listen to your body's thirst signals and make hydration a delicious part of your daily routine.</p>
    `,
  },
  {
    slug: "mastering-nutrition-tables",
    title: "Mastering the Nutrition Table: From Calories to Vitamins",
    category: "Nutrition Basics",
    date: "2024-06-25",
    preview: "Go beyond the ingredients list. This guide helps you understand the numbers on the nutrition facts table to make truly healthy choices.",
    content: `
      <p>The nutrition facts table on packaged foods can look intimidating, but it's a powerful tool for managing your health. Learning to read it correctly allows you to compare products and make informed decisions.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Breaking Down the Table:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Serving Size:</strong> This is the first thing to check. All the numbers on the label apply to this amount. Is it realistic? Often, a small package contains multiple servings.</li>
        <li><strong>Calories (Energy):</strong> This tells you how much energy you get from a serving.</li>
        <li><strong>Macronutrients:</strong>
          <ul class="list-inside list-[circle] ml-4">
            <li><strong>Fat:</strong> Look at the breakdown. Limit Saturated and Trans Fats.</li>
            <li><strong>Carbohydrates:</strong> Check the amount of Dietary Fiber (aim for more) and Total Sugars. Pay close attention to "Added Sugars" if available.</li>
            <li><strong>Protein:</strong> An essential nutrient for building and repairing tissues.</li>
          </ul>
        </li>
        <li><strong>Sodium:</strong> High sodium intake is linked to high blood pressure. Compare products to choose the one with lower sodium.</li>
        <li><strong>Micronutrients (Vitamins & Minerals):</strong> This section lists key vitamins and minerals. It can help you choose more nutrient-dense foods.</li>
      </ul>
      <p class="mt-4">Using the nutrition table helps you see beyond marketing claims and understand what you are truly eating.</p>
    `,
  },
  {
    slug: "art-of-mindful-eating",
    title: "The Art of Mindful Eating: Connecting with Your Food",
    category: "Healthy Living",
    date: "2024-06-20",
    preview: "Improve your digestion, satisfaction, and relationship with food. Learn the simple practice of mindful eating.",
    content: `
      <p>In our fast-paced lives, we often eat while distracted—watching TV, working, or scrolling on our phones. Mindful eating is the practice of paying full attention to the experience of eating and drinking, both inside and outside the body.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Benefits of Mindful Eating:</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Better digestion by eating more slowly.</li>
        <li>Increased recognition of your body's hunger and fullness cues, which can help with weight management.</li>
        <li>Greater satisfaction from your food.</li>
        <li>Reduced stress and anxiety around food.</li>
      </ul>
      <h2 class="text-xl font-semibold mt-4 mb-2">How to Practice Mindful Eating:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Remove Distractions:</strong> Sit at a table and put away your phone and turn off the TV.</li>
        <li><strong>Engage Your Senses:</strong> Look at the colors on your plate, smell the aromas, notice the textures in your mouth, and savor the flavors.</li>
        <li><strong>Chew Thoroughly:</strong> Put your fork down between bites and chew your food slowly and completely.</li>
        <li><strong>Listen to Your Body:</strong> Eat when you're hungry and stop when you're full. It's okay to leave food on your plate.</li>
      </ul>
      <p class="mt-4">Mindful eating isn't a diet; it's a shift in mindset that can lead to a healthier and more enjoyable relationship with food.</p>
    `,
  },
  {
    slug: "spice-up-your-health",
    title: "Spice Up Your Health: The Medicinal Power of Indian Masalas",
    category: "Healthy Eating",
    date: "2024-06-15",
    preview: "Your masala dabba is a treasure chest of health benefits. Learn about the powerful medicinal properties of common Indian spices.",
    content: `
      <p>Indian spices do more than just add flavor and aroma to our food; they are packed with potent health benefits and have been used in Ayurvedic medicine for centuries. Your everyday masala box is a powerhouse of medicinal compounds.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">The Power in Your Spice Box:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Turmeric (Haldi):</strong> Contains curcumin, a strong anti-inflammatory and antioxidant. It's good for joint health and immunity.</li>
        <li><strong>Cumin (Jeera):</strong> Aids digestion, is a good source of iron, and has antioxidant properties.</li>
        <li><strong>Coriander (Dhaniya):</strong> Both seeds and leaves are beneficial. They can help lower blood sugar and are rich in antioxidants.</li>
        <li><strong>Ginger (Adrak):</strong> A powerful remedy for nausea and indigestion. It also has strong anti-inflammatory effects.</li>
        <li><strong>Cinnamon (Dalchini):</strong> Known to lower blood sugar levels and has powerful antioxidant and anti-inflammatory properties.</li>
        <li><strong>Fenugreek (Methi):</strong> Helps control blood sugar levels and can improve cholesterol.</li>
      </ul>
      <p class="mt-4">Incorporating a variety of these spices into your daily cooking is a simple and delicious way to boost your overall health.</p>
    `,
  },
  {
    slug: "healthy-indian-breakfasts",
    title: "Power Your Morning: Healthy Indian Breakfast Ideas",
    category: "Healthy Eating",
    date: "2024-06-10",
    preview: "Ditch the unhealthy options and start your day right. Explore a variety of nutritious and easy-to-make Indian breakfast recipes.",
    content: `
      <p>Breakfast is often called the most important meal of the day. A nutritious breakfast can kickstart your metabolism, improve your focus, and set the tone for healthier choices all day. Here are some healthy and popular Indian breakfast options.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Nutritious Breakfast Choices:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Poha:</strong> Made from flattened rice, it's light on the stomach and a good source of carbohydrates and iron. Load it with vegetables and peanuts to make it more nutritious.</li>
        <li><strong>Upma:</strong> A thick porridge made from semolina (suji). It's a quick and filling option. Again, add plenty of veggies.</li>
        <li><strong>Idli:</strong> Steamed, fermented rice and lentil cakes. They are low in calories and easy to digest. Serve with sambar for a protein boost.</li>
        <li><strong>Dosa:</strong> A fermented crepe made from rice and lentils. Opt for plain or minimally stuffed dosas instead of those loaded with butter and cheese.</li>
        <li><strong>Moong Dal Cheela:</strong> A savory pancake made from moong dal batter. It's an excellent source of protein.</li>
        <li><strong>Oats:</strong> A versatile option. You can make savory masala oats or sweet porridge with fruits and nuts.</li>
      </ul>
      <p class="mt-4">Starting your day with a balanced breakfast that includes carbohydrates, protein, and fiber will keep you energized and full until your next meal.</p>
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
