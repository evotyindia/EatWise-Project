
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
      <p>Navigating the aisles of an Indian supermarket can be overwhelming. Food labels are designed to inform, but they can often be confusing. Understanding these labels is the first step towards making conscious, healthy choices for you and your family. This guide will help you decode the common terms and figures you'll find on Indian food packaging.</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">1. The Ingredients List: What's Really Inside?</h2>
      <p>This is the most crucial part of the label. Ingredients are listed in descending order by weight, meaning the first few ingredients make up the bulk of the product. If sugar, salt, or an unhealthy fat is listed first, it's a red flag.</p>
      <ul class="list-disc list-inside space-y-1 mb-4">
        <li><strong>Spot Hidden Sugars:</strong> Look for names like corn syrup, dextrose, fructose, maltodextrin, and fruit juice concentrate.</li>
        <li><strong>Identify Unhealthy Fats:</strong> "Partially hydrogenated oil" is another name for trans fat, which you should avoid completely. Palm oil is a common saturated fat.</li>
        <li><strong>Check for Whole Grains:</strong> A product might say "made with whole grains," but the ingredient list will reveal if it's the main ingredient or just a small fraction.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">2. The Nutritional Information Panel</h2>
      <p>This panel provides a detailed breakdown of nutrients. Values are usually given 'per 100g/ml' and 'per serving'. Always check the serving size first, as it's often smaller than what people typically consume in one sitting.</p>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Energy (Calories/kcal):</strong> This tells you how much energy the food provides.</li>
        <li><strong>Carbohydrates:</strong> This includes starches, fiber, and sugars. Pay close attention to 'Added Sugar' – this is the sugar that doesn't occur naturally in the food and should be minimized.</li>
        <li><strong>Protein:</strong> Essential for growth and repair. Higher protein can help you feel fuller for longer.</li>
        <li><strong>Fats:</strong> Look at the breakdown. Aim for low amounts of Saturated Fat and zero Trans Fat.</li>
        <li><strong>Sodium:</strong> High sodium (salt) content is linked to high blood pressure. Compare products and choose the one with lower sodium.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">3. Important Symbols and Declarations</h2>
      <p>Indian labels have some unique marks that are important to understand.</p>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>Vegetarian/Non-Vegetarian Marks:</strong> A green dot inside a square signifies a vegetarian product. A brown/maroon dot signifies a non-vegetarian product.</li>
        <li><strong>FSSAI License Number:</strong> This indicates the product is approved by the Food Safety and Standards Authority of India, ensuring it meets basic safety standards.</li>
        <li><strong>Allergen Information:</strong> If the product contains common allergens like nuts, dairy, gluten, or soy, it must be clearly declared.</li>
      </ul>

      <p class="mt-6 font-semibold">By spending a few extra seconds reading the labels, you can take significant steps toward a healthier lifestyle and gain full control over what you eat.</p>
    `,
  },
  {
    slug: "hidden-sugars-in-common-snacks",
    title: "The Sweet Trap: Uncovering Hidden Sugars in Common Indian Snacks",
    category: "Healthy Eating",
    date: "2024-07-25",
    preview: "Many popular Indian snacks are loaded with hidden sugars. Discover how to identify them and find healthier alternatives.",
    content: `
      <p>We all know that sweets, chocolates, and sodas are full of sugar. But what about the savory snacks, "healthy" breakfast cereals, and sauces we consume daily? Sugar is a master of disguise, and manufacturers often hide it in products you wouldn't expect, especially in the Indian market where it's used to balance flavors.</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">Why is Added Sugar a Problem?</h2>
      <p>Our bodies don't need added sugar to function. While natural sugars in fruits and milk are fine in moderation, excessive consumption of added sugar is linked to numerous health issues, including weight gain, type 2 diabetes, heart disease, and dental cavities. It provides empty calories with no nutritional benefit.</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">Sugar's Many Aliases</h2>
      <p>To identify hidden sugars, you need to know their names. Scan the ingredients list for these terms:</p>
      <ul class="list-disc list-inside space-y-1 my-2">
        <li>Syrups: High-fructose corn syrup (HFCS), corn syrup, rice syrup</li>
        <li>Words ending in "-ose": Dextrose, Fructose, Glucose, Sucrose, Maltose</li>
        <li>Other names: Maltodextrin, Molasses, Cane juice, Fruit juice concentrate, Caramel</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Common Culprits in the Indian Pantry</h2>
      <ul class="list-disc list-inside space-y-2 my-2">
        <li><strong>Packaged Biscuits & Cookies:</strong> Even "digestive," "oat," or "multigrain" biscuits often have sugar as a primary ingredient.</li>
        <li><strong>Breakfast Cereals:</strong> Many cereals, especially those marketed to kids, are coated in sugar. Check the "added sugar" value on the nutrition label.</li>
        <li><strong>Ketchup & Sauces:</strong> Tomato ketchup, chutneys, and many cooking sauces can have a surprisingly high sugar content to enhance taste and act as a preservative.</li>
        <li><strong>Flavored Yogurts:</strong> A small cup of flavored yogurt can contain several teaspoons of added sugar.</li>
        <li><strong>Energy & Granola Bars:</strong> Some are no better than candy bars. Always check the nutrition facts.</li>
        <li><strong>Packaged Fruit Juices:</strong> Even 100% juice is a concentrated source of sugar without the beneficial fiber of whole fruit.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Tips to Cut Down on Hidden Sugars</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Read labels diligently. Aim for products with less than 5g of added sugar per serving.</li>
        <li>Choose whole, unprocessed foods like fruits, nuts, and seeds for snacking.</li>
        <li>Make your own sauces and chutneys at home to control the sugar content.</li>
        <li>Opt for plain yogurt (dahi) and add your own fresh fruit for sweetness.</li>
        <li>Drink water, nimbu pani, or buttermilk instead of sugary juices and soft drinks.</li>
      </ul>
      <p class="mt-4">Being mindful of hidden sugars is a powerful step towards taking control of your health.</p>
    `,
  },
  {
    slug: "healthy-tiffin-box-ideas-for-kids",
    title: "Nutritious & Delicious: Healthy Tiffin Box Ideas for Indian Kids",
    category: "Kids Nutrition",
    date: "2024-07-20",
    preview: "Packing a healthy and appealing tiffin box can be a challenge. Get creative ideas for nutritious meals your kids will love.",
    content: `
      <p>A child's tiffin box is more than just a midday meal; it's a vital source of energy and nutrients that fuels their concentration in class and their energy for play. For Indian parents, balancing tradition, nutrition, and a child's picky palate can be a daily challenge. Here are some ideas and principles to make tiffin time both healthy and exciting.</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">The 4 Pillars of a Perfect Tiffin:</h2>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Balance:</strong> Aim to include a source of complex carbohydrates (for sustained energy), protein (for growth and fullness), healthy fats (for brain development), and a fruit or vegetable (for vitamins and minerals).</li>
        <li><strong>Variety:</strong> Nobody likes eating the same thing every day. Rotate meals through the week to prevent boredom and ensure your child gets a wide range of nutrients.</li>
        <li><strong>Appeal:</strong> Kids eat with their eyes first! Make the tiffin colorful and visually interesting. Use cookie cutters for sandwiches or fruit, and arrange items neatly.</li>
        <li><strong>Safety & Practicality:</strong> Pack foods that can stay safe at room temperature for a few hours. Avoid anything too messy that could spill.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Creative & Healthy Tiffin Ideas:</h2>
      <ul class="list-disc list-inside space-y-3">
        <li><strong>Mini Vegetable Idlis:</strong> Grate carrots or beets into the idli batter for color and nutrients. Pack with a small container of coconut chutney.</li>
        <li><strong>Vegetable Poha or Upma:</strong> A classic for a reason. Be generous with veggies like peas, carrots, corn, and beans. Garnish with peanuts for a protein punch.</li>
        <li><strong>Stuffed Whole Wheat Parathas/Theplas:</strong> Roll them thin and stuff with paneer bhurji, mashed dal, or finely chopped vegetables. Cut them into rolls or wedges for easy handling. Serve with a small portion of curd.</li>
        <li><strong>Moong Dal Cheela (Pancakes):</strong> These protein-rich pancakes can be rolled up with a paneer or vegetable filling.</li>
        <li><strong>Tricolor Sandwich:</strong> Use whole wheat bread and create layers with mint chutney, carrot/cucumber slices, and a thin layer of cheese or hummus.</li>
        <li><strong>Sprouts and Corn Salad:</strong> A refreshing and light option. Pack a small lemon wedge for them to squeeze just before eating.</li>
        <li><strong>Homemade Trail Mix:</strong> A small portion of roasted chana, peanuts, almonds, and a few raisins. Avoid for very young children due to choking hazards.</li>
      </ul>
      
      <h2 class="text-xl font-semibold mt-6 mb-2">Foods to Limit in the Tiffin Box:</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Sugary drinks and packaged fruit juices.</li>
        <li>Packaged chips, biscuits, and instant noodles.</li>
        <li>Chocolates and candies.</li>
      </ul>
      <p class="mt-4">Involving your child in planning their tiffin can make a big difference. They are much more likely to eat a meal they helped choose and prepare!</p>
    `,
  },
  {
    slug: "indian-superfoods-under-50",
    title: "Budget-Friendly Powerhouses: Indian Superfoods Under ₹50",
    category: "Healthy Eating",
    date: "2024-07-15",
    preview: "Eating healthy doesn't have to be expensive. Explore common Indian superfoods that offer incredible nutritional benefits without breaking the bank.",
    content: `
      <p>The term "superfood" often brings to mind exotic and pricey ingredients like quinoa, kale, or blueberries. However, the Indian kitchen has always been home to its own set of nutritional powerhouses that are both affordable and readily available. Here are some superfoods you can easily incorporate into your diet, often for under ₹50 (prices may vary by region and season).</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">Your Economical Superfood Shopping List:</h2>
      <ul class="list-disc list-inside space-y-3">
        <li><strong>Spinach (Palak):</strong> An excellent source of iron for energy, Vitamin K for bone health, Vitamin A for vision, and numerous antioxidants. A small bunch is usually very cheap.</li>
        <li><strong>Lentils (Dals):</strong> Moong, masoor, toor, chana - all are fantastic sources of plant-based protein, dietary fiber which aids digestion, and essential minerals like iron and folate.</li>
        <li><strong>Bananas (Kela):</strong> A convenient energy source packed with potassium, crucial for heart health and blood pressure regulation, and Vitamin B6.</li>
        <li><strong>Amla (Indian Gooseberry):</strong> One of the richest sources of Vitamin C, a powerful antioxidant that boosts immunity. Can be eaten raw, pickled, juiced, or as a powder.</li>
        <li><strong>Turmeric (Haldi):</strong> Contains curcumin, a compound with potent anti-inflammatory and antioxidant properties. A cornerstone of Indian cooking and traditional medicine.</li>
        <li><strong>Ginger (Adrak):</strong> Famous for its digestive benefits, it soothes the stomach and has strong anti-inflammatory and anti-nausea effects.</li>
        <li><strong>Millets (Bajra, Ragi, Jowar):</strong> These ancient grains are gluten-free and rich in fiber, protein, and micronutrients like magnesium and iron. They are often more affordable than refined wheat or rice.</li>
        <li><strong>Curd (Dahi):</strong> A great source of probiotics for gut health, high-quality protein, and bone-building calcium. Homemade curd is extremely economical.</li>
        <li><strong>Garlic (Lehsun):</strong> Known for its heart-protective properties and its ability to boost the immune system.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Simple Ways to Incorporate Them:</h2>
      <p>Integrating these superfoods is easy:</p>
      <ul class="list-disc list-inside space-y-1 my-2">
        <li>Add a handful of spinach to your daily dal, sabzi, or even paratha dough.</li>
        <li>Ensure you have at least one bowl of dal every day.</li>
        <li>Start your day with a banana or have it as a pre-workout snack.</li>
        <li>Chew on a piece of amla or add amla powder to a glass of water in the morning.</li>
        <li>Use turmeric, ginger, and garlic generously as the base for your cooking.</li>
        <li>Replace rice or wheat with millets a few times a week, perhaps as millet khichdi or jowar roti.</li>
        <li>Enjoy a bowl of curd with your lunch to aid digestion.</li>
      </ul>
      <p class="mt-4 font-semibold">By choosing local, seasonal, and traditional foods, you can harness the power of superfoods without straining your wallet.</p>
    `,
  },
  {
    slug: "magic-of-millets",
    title: "The Magic of Millets: A Guide to India's Ancient Grains",
    category: "Healthy Eating",
    date: "2024-07-10",
    preview: "Rediscover the nutritional power of millets like Ragi, Jowar, and Bajra. Learn how to easily incorporate them into your daily meals for better health.",
    content: `
      <p>For centuries, millets were a staple food across India. These hardy, ancient grains are now making a well-deserved comeback as a "smart food" – good for you, good for the farmer, and good for the planet. Let's explore why you should welcome these tiny grains back to your plate.</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">Meet the Mighty Millets:</h2>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Finger Millet (Ragi):</strong> A powerhouse of calcium, essential for bone health. Its high iron content helps combat anemia. Perfect for making rotis, dosas, and porridge.</li>
        <li><strong>Sorghum (Jowar):</strong> Rich in protein and fiber, it promotes satiety and aids digestion. Jowar rotis (bhakri) are a nutritious, gluten-free alternative to wheat rotis.</li>
        <li><strong>Pearl Millet (Bajra):</strong> Loaded with iron, magnesium, and protein. Its warming properties make bajra rotis a winter favorite in many parts of India.</li>
        <li><strong>Foxtail Millet (Kangni/Thinai):</strong> High in fiber and complex carbohydrates, it helps in the slow release of sugar, benefiting those with diabetes.</li>
        <li><strong>Barnyard Millet (Samak):</strong> With the lowest carbohydrate content and highest fiber among all millets, it's excellent for weight management. Often used during fasting.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">The Incredible Health Benefits:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Rich in Nutrients:</strong> Millets are nutritional powerhouses, packed with fiber, protein, B-vitamins, and essential minerals like iron, magnesium, and phosphorus.</li>
        <li><strong>Naturally Gluten-Free:</strong> An excellent choice for people with celiac disease or gluten intolerance.</li>
        <li><strong>Low Glycemic Index (GI):</strong> Their high fiber content ensures a slow release of glucose into the bloodstream, which helps manage blood sugar levels and is highly beneficial for diabetics.</li>
        <li><strong>Promotes Heart Health:</strong> They help reduce cholesterol and blood pressure, thanks to their fiber and magnesium content.</li>
        <li><strong>Aids Digestion:</strong> The high fiber content helps prevent constipation and keeps the digestive system healthy.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Getting Started with Millets:</h2>
      <p>Cooking with millets is easy. It's crucial to soak them for at least 6-8 hours to break down phytic acid, which can inhibit nutrient absorption.</p>
      <ul class="list-disc list-inside space-y-1 mt-2">
        <li><strong>As a Rice Substitute:</strong> Cook millets like rice (usually a 1:2 millet-to-water ratio) and serve with dal or sabzi.</li>
        <li><strong>In Flour Form:</strong> Use ragi, jowar, or bajra flour to make rotis, cheelas, and even baked goods like cookies and cakes.</li>
        <li><strong>For Breakfast:</strong> Make a nutritious porridge with ragi or foxtail millet, or prepare millet upma or poha.</li>
        <li><strong>In Salads & Khichdi:</strong> Cooked millets can be a great addition to salads or can be used to make a hearty and wholesome khichdi.</li>
      </ul>
      <p class="mt-4">Start by replacing one meal's grains with millets and gradually explore their versatility. Embracing millets is a simple step towards a healthier, more sustainable diet.</p>
    `,
  },
  {
    slug: "understanding-fats",
    title: "Understanding Fats: The Good, The Bad, and The Essential",
    category: "Nutrition Basics",
    date: "2024-07-05",
    preview: "Not all fats are created equal. This guide breaks down saturated, unsaturated, and trans fats in the context of Indian diets and cooking oils.",
    content: `
      <p>For decades, fat has been demonized in the world of nutrition. This fear has led to a market flooded with "low-fat" products, which are often high in sugar and refined carbohydrates. The truth is, fat is an essential macronutrient vital for energy, hormone production, and the absorption of certain vitamins. The key is to understand the different types of fats and choose wisely, especially within the context of an Indian diet rich in diverse cooking oils and ghee.</p>

      <h2 class="text-xl font-semibold mt-6 mb-2">The Good Fats: Unsaturated Fats</h2>
      <p>These are the heart-healthy fats that should form the majority of your fat intake. They help lower bad cholesterol (LDL) and raise good cholesterol (HDL).</p>
      <ul class="list-disc list-inside space-y-2 my-2">
        <li><strong>Monounsaturated Fats:</strong> Found in oils like groundnut, mustard, and olive oil, as well as in avocados, almonds, and cashews.</li>
        <li><strong>Polyunsaturated Fats (Omega-3 & Omega-6):</strong> These are essential fatty acids that our bodies cannot produce. Omega-3s (found in fatty fish, flaxseeds/alsi, walnuts) are anti-inflammatory, while Omega-6s (found in sunflower, safflower oils) are also necessary but need to be balanced with Omega-3s.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Fats to Limit: Saturated Fats</h2>
      <p>Found primarily in animal products and some plant oils, saturated fats can raise bad cholesterol levels and should be consumed in moderation.</p>
      <ul class="list-disc list-inside space-y-1 my-2">
        <li><strong>Sources:</strong> Ghee, butter, coconut oil, palm oil, red meat, and full-fat dairy products.</li>
        <li><strong>The Ghee & Coconut Oil Context:</strong> While high in saturated fat, traditional fats like ghee and coconut oil (when used in moderation) have some benefits due to their medium-chain fatty acids. The key is not to make them the only source of fat in your diet.</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">The Ugly Fats: Trans Fats</h2>
      <p>These are the worst type of fat, created by an industrial process called hydrogenation. They raise bad cholesterol, lower good cholesterol, and increase inflammation. Aim for zero trans fats.</p>
      <ul class="list-disc list-inside space-y-1 my-2">
        <li><strong>Sources:</strong> Vanaspati (dalda), margarine, and many commercially fried foods, baked goods (like puffs and biscuits), and packaged snacks. Always check labels for "partially hydrogenated oils."</li>
      </ul>

      <h2 class="text-xl font-semibold mt-6 mb-2">Practical Tips for the Indian Kitchen:</h2>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>Rotate Your Oils:</strong> Don't stick to just one cooking oil. Rotating between oils like mustard, groundnut, and sesame oil can provide a better balance of fatty acids.</li>
        <li><strong>Use Ghee Judiciously:</strong> Use ghee for tempering (tadka) or for smearing on rotis, but not as the primary cooking medium for everything.</li>
        <li><strong>Limit Deep-Frying:</strong> Deep-frying foods, especially in the same oil repeatedly, can create harmful compounds. Opt for shallow frying, baking, or steaming.</li>
        <li><strong>Include Nuts and Seeds:</strong> A handful of mixed nuts and seeds every day is a great way to get healthy fats.</li>
      </ul>
      <p class="mt-4 font-semibold">A balanced approach to fats is crucial. Focus on incorporating a variety of good fats while minimizing the bad and ugly ones for optimal health.</p>
    `,
  },
   {
    slug: "vegetarian-protein-power",
    title: "Vegetarian Protein Power: Top Sources for a Strong Indian Diet",
    category: "Nutrition Basics",
    date: "2024-07-01",
    preview: "Think you can't get enough protein on a vegetarian diet? Think again! Explore top plant-based protein sources available in India.",
    content: `
      <p>A common concern about vegetarian diets, particularly in India, is whether they provide enough protein. Protein is a crucial macronutrient, essential for building and repairing tissues, making enzymes and hormones, and supporting immune function. The great news is that a well-planned Indian vegetarian diet can be incredibly rich in protein.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Why Protein is Important</h2>
      <p>Adequate protein intake helps with muscle maintenance, keeps you feeling full and satisfied (aiding in weight management), and stabilizes blood sugar levels. It's vital for everyone, from growing children to active adults and seniors.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Top Vegetarian Protein Sources in India:</h2>
      <ul class="list-disc list-inside space-y-3">
        <li><strong>Lentils and Legumes (Dals and Pulses):</strong> The backbone of Indian cuisine. A single cup of cooked dal can provide 15-18 grams of protein. Include a variety like moong, masoor, toor, chana, and rajma in your daily meals.</li>
        <li><strong>Paneer (Indian Cottage Cheese):</strong> An excellent source of slow-digesting casein protein. 100 grams of paneer offers about 18-20 grams of protein, making it a fantastic post-workout option.</li>
        <li><strong>Yogurt and Curd (Dahi):</strong> Greek yogurt, in particular, is strained to remove whey, resulting in a higher protein concentration. A cup of dahi is also a great source of protein and probiotics.</li>
        <li><strong>Soy Products:</strong> Tofu (soya paneer) and soya chunks are complete proteins, meaning they contain all nine essential amino acids. Soya chunks are incredibly protein-dense, with over 50g of protein per 100g (dry weight).</li>
        <li><strong>Nuts and Seeds:</strong> Almonds, walnuts, peanuts, and seeds like pumpkin, chia, and flax are not just sources of healthy fats but also provide a good protein boost. Peanut butter is another great option.</li>
        <li><strong>Millets and Grains:</strong> While not as high as lentils, certain grains like quinoa and amaranth (rajgira) are complete proteins. Even whole wheat and oats contribute to your daily protein intake.</li>
        <li><strong>Sprouts:</strong> Sprouting lentils and legumes increases their protein availability and makes them easier to digest.</li>
      </ul>
      <h2 class="text-xl font-semibold mt-4 mb-2">The Concept of a 'Complete' Protein</h2>
      <p>Most plant-based proteins are 'incomplete' (lacking one or more essential amino acids). However, this is easily solved by combining different food groups. The classic Indian meal of <strong>Dal and Rice</strong> or <strong>Dal and Roti</strong> creates a complete protein profile. By eating a varied diet throughout the day, you can easily get all the amino acids your body needs.</p>
    `,
  },
  {
    slug: "hydration-is-key",
    title: "Beyond Water: Creative Ways to Stay Hydrated in the Indian Climate",
    category: "Healthy Living",
    date: "2024-06-28",
    preview: "Staying hydrated is more than just drinking water. Discover delicious and refreshing Indian drinks and foods that help you beat the heat.",
    content: `
      <p>In the often scorching heat and humidity of the Indian climate, staying hydrated is absolutely critical for health and well-being. Dehydration doesn't just make you feel thirsty; it can lead to fatigue, headaches, dizziness, and in severe cases, serious health issues like heatstroke. While drinking plain water is essential, there are many other traditional and tasty ways to maintain your fluid balance and replenish lost electrolytes.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Early Signs of Dehydration to Watch For:</h2>
      <ul class="list-disc list-inside space-y-1">
        <li>Feeling thirsty (by the time you're thirsty, you're already dehydrated)</li>
        <li>Dark yellow and strong-smelling urine</li>
        <li>Feeling dizzy or lightheaded</li>
        <li>Dry mouth, lips, and eyes</li>
        <li>Feeling tired or sluggish</li>
      </ul>
      <h2 class="text-xl font-semibold mt-4 mb-2">Refreshing and Hydrating Indian Options:</h2>
      <ul class="list-disc list-inside space-y-3">
        <li><strong>Coconut Water (Nariyal Pani):</strong> Often called nature's sports drink, it's packed with electrolytes like potassium, which are lost through sweat. It's a natural and effective way to rehydrate.</li>
        <li><strong>Buttermilk (Chaas):</strong> This cooling probiotic drink not only replenishes fluids but also aids digestion and soothes the stomach after a spicy meal. A pinch of black salt and roasted cumin powder adds flavor and digestive benefits.</li>
        <li><strong>Lemon Water (Nimbu Pani):</strong> A simple, cheap, and effective way to get Vitamin C and stay hydrated. It can be made sweet (with a healthy sweetener like jaggery) or salty (Shikanji-style) to help replace lost sodium.</li>
        <li><strong>Aam Panna:</strong> A traditional summer drink made from raw mangoes. It's known to prevent heat stroke by replenishing sodium and iron reserves.</li>
        <li><strong>Water-Rich Foods:</strong> Don't just drink your water, eat it too! Foods like watermelon, cucumber, tomatoes, oranges, and muskmelon have very high water content and provide essential vitamins.</li>
        <li><strong>Herbal Teas:</strong> Unsweetened, caffeine-free herbal teas like hibiscus, mint, or chamomile can be a refreshing alternative to plain water, served hot or cold.</li>
      </ul>
      <p class="mt-4">Remember to sip fluids throughout the day, not just when you feel thirsty. Make hydration a delicious and integral part of your daily routine to stay energetic and healthy, no matter the weather.</p>
    `,
  },
  {
    slug: "mastering-nutrition-tables",
    title: "Mastering the Nutrition Table: From Calories to Vitamins",
    category: "Nutrition Basics",
    date: "2024-06-25",
    preview: "Go beyond the ingredients list. This guide helps you understand the numbers on the nutrition facts table to make truly healthy choices.",
    content: `
      <p>The nutrition facts table on packaged foods is a powerful tool for anyone looking to manage their health. At first glance, it might seem like a confusing jumble of numbers and percentages, but understanding it is simpler than you think. Learning to read it correctly allows you to see past marketing claims and make genuinely informed decisions about what you eat.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Step 1: Start with the Serving Size</h2>
      <p>This is the most critical and often overlooked part of the label. All the numbers that follow apply to this specific amount of food. Ask yourself: Is this the amount I will actually eat? Often, a small packet of chips or biscuits contains 2-3 servings, which can triple the calories, sugar, and fat you consume if you eat the whole thing.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Step 2: Check the Calories (Energy)</h2>
      <p>This tells you how much energy you get from one serving. It's a useful guide for weight management, but calories are not the whole story. The quality of those calories matters more.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Step 3: Understand the Macronutrients</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Total Fat:</strong> Look deeper at the types of fat. Aim for low amounts of <strong>Saturated Fat</strong> and zero <strong>Trans Fat</strong>.</li>
        <li><strong>Total Carbohydrates:</strong> This includes everything from fiber to sugar. Look for higher <strong>Dietary Fiber</strong>, which is good for digestion. Pay close attention to <strong>Total Sugars</strong> and, most importantly, <strong>'Added Sugars'</strong>. This is the sugar that has been added during processing and should be kept to a minimum.</li>
        <li><strong>Protein:</strong> An essential nutrient for building and repairing tissues. Choosing products with higher protein can help you feel fuller.</li>
      </ul>
      <h2 class="text-xl font-semibold mt-4 mb-2">Step 4: Look at the Micronutrients</h2>
        <ul class="list-disc list-inside space-y-2">
          <li><strong>Sodium:</strong> High sodium (salt) intake is linked to high blood pressure. Many packaged and processed foods in India are very high in sodium. Compare products and choose options with lower values.</li>
          <li><strong>Vitamins & Minerals:</strong> This section lists key vitamins (like Vitamin D) and minerals (like Calcium, Iron). It can help you choose more nutrient-dense foods.</li>
        </ul>
      <p class="mt-4">Using the nutrition table empowers you to compare products side-by-side. It helps you see beyond attractive packaging and health claims like "low-fat" or "all-natural" to understand what your food is truly made of.</p>
    `,
  },
  {
    slug: "art-of-mindful-eating",
    title: "The Art of Mindful Eating: Connecting with Your Food",
    category: "Healthy Living",
    date: "2024-06-20",
    preview: "Improve your digestion, satisfaction, and relationship with food. Learn the simple practice of mindful eating.",
    content: `
      <p>In our hyper-connected, fast-paced lives, eating has often become a mindless act. We eat while working, watching TV, or scrolling through our phones, barely registering the taste or texture of our food. Mindful eating is the practice of bringing your full, compassionate attention to the entire experience of nourishment. It’s not a diet; it’s a way to cultivate a healthier and more joyful relationship with food.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">The Powerful Benefits of Mindful Eating:</h2>
      <ul class="list-disc list-inside space-y-2">
        <li><strong>Better Digestion:</strong> Eating slowly and chewing thoroughly prepares your body for digestion, reducing issues like gas and bloating.</li>
        <li><strong>Weight Management:</strong> By paying attention to your body's signals, you learn to recognize true hunger and satiety, preventing overeating.</li>
        <li><strong>Increased Satisfaction:</strong> When you truly savor your food, you can feel more satisfied with smaller portions.</li>
        <li><strong>Reduced Stress:</strong> It helps in breaking the cycle of stress-eating and emotional eating by making you aware of your triggers.</li>
      </ul>
      <h2 class="text-xl font-semibold mt-4 mb-2">Simple Steps to Practice Mindful Eating:</h2>
      <ul class="list-disc list-inside space-y-3">
        <li><strong>Acknowledge Gratitude:</strong> Before you eat, take a moment to consider the journey your food has taken to reach your plate. This fosters a sense of gratitude.</li>
        <li><strong>Remove Distractions:</strong> This is the most important step. Sit at a table. Turn off the TV, put away your phone, and close your laptop.</li>
        <li><strong>Engage All Your Senses:</strong>
          <ul class="list-inside list-[circle] ml-4 mt-1">
            <li><strong>Sight:</strong> Look at the colors and shapes on your plate.</li>
            <li><strong>Smell:</strong> Inhale the aromas before you take the first bite.</li>
            <li><strong>Taste:</strong> Identify all the different flavors—sweet, salty, sour, spicy.</li>
            <li><strong>Texture:</strong> Notice the feel of the food in your mouth—is it soft, crunchy, smooth?</li>
          </ul>
        </li>
        <li><strong>Chew Thoroughly:</strong> Try chewing each mouthful 20-30 times. Put your fork or spoon down between bites. This gives your brain time to register that you're full.</li>
        <li><strong>Listen to Your Body:</strong> Ask yourself, "Am I truly hungry?" before you start, and check in with yourself halfway through the meal. Stop eating when you feel comfortably full, not stuffed.</li>
      </ul>
      <p class="mt-4">Mindful eating transforms a daily routine into a practice of self-care and presence. It helps you rediscover the pleasure of food and build a healthier connection with your body.</p>
    `,
  },
  {
    slug: "spice-up-your-health",
    title: "Spice Up Your Health: The Medicinal Power of Indian Masalas",
    category: "Healthy Eating",
    date: "2024-06-15",
    preview: "Your masala dabba is a treasure chest of health benefits. Learn about the powerful medicinal properties of common Indian spices.",
    content: `
      <p>The Indian masala dabba (spice box) is the heart of our cuisine, a vibrant palette of flavors and aromas. But these spices do far more than just make our food delicious; they are a treasure chest of potent medicinal compounds. For centuries, Ayurveda has utilized these spices for their healing properties, and modern science is now beginning to confirm these ancient beliefs.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">The Pharmacy in Your Kitchen:</h2>
      <ul class="list-disc list-inside space-y-3">
        <li><strong>Turmeric (Haldi):</strong> The star of the show. Its active compound, curcumin, is a powerful anti-inflammatory and antioxidant. It boosts immunity, supports joint health, and is being studied for its role in preventing chronic diseases.</li>
        <li><strong>Cumin (Jeera):</strong> An excellent digestive aid that stimulates enzymes. It's also a good source of iron, which is vital for energy production.</li>
        <li><strong>Coriander (Dhaniya):</strong> Both the seeds and leaves are beneficial. They are known to help lower blood sugar levels, ease digestive discomfort, and are rich in immune-boosting antioxidants.</li>
        <li><strong>Ginger (Adrak):</strong> A world-renowned remedy for nausea, motion sickness, and indigestion. Its compound, gingerol, has powerful anti-inflammatory and antioxidant effects.</li>
        <li><strong>Fenugreek (Methi):</strong> The seeds are particularly effective in helping control blood sugar levels, making them beneficial for diabetics. They can also help reduce cholesterol.</li>
        <li><strong>Cinnamon (Dalchini):</strong> Known for its ability to improve insulin sensitivity and lower blood sugar levels. It's also packed with antioxidants.</li>
        <li><strong>Black Pepper (Kali Mirch):</strong> Its active ingredient, piperine, not only has its own antioxidant properties but also dramatically increases the absorption of curcumin from turmeric by up to 2000%.</li>
        <li><strong>Cloves (Laung):</strong> High in antioxidants and have antimicrobial properties that can help kill bacteria.</li>
      </ul>
      <h2 class="text-xl font-semibold mt-4 mb-2">Maximizing the Benefits:</h2>
      <ul class="list-disc list-inside space-y-1">
        <li><strong>Use them in combination:</strong> Many spices work synergistically, like turmeric and black pepper.</li>
        <li><strong>Store them properly:</strong> Keep spices in airtight containers away from heat and light to preserve their potency.</li>
        <li><strong>Fresh is often best:</strong> Use fresh ginger, garlic, and turmeric when possible.</li>
      </ul>
      <p class="mt-4">By generously using a variety of these spices in your daily cooking, you are not just adding flavor; you are actively investing in your long-term health.</p>
    `,
  },
  {
    slug: "healthy-indian-breakfasts",
    title: "Power Your Morning: Healthy Indian Breakfast Ideas",
    category: "Healthy Eating",
    date: "2024-06-10",
    preview: "Ditch the unhealthy options and start your day right. Explore a variety of nutritious and easy-to-make Indian breakfast recipes.",
    content: `
      <p>Breakfast, or 'nashta', is often called the most important meal of the day. A well-balanced breakfast kickstarts your metabolism, replenishes your energy stores after a night's sleep, improves focus, and can prevent unhealthy cravings later in the day. Fortunately, traditional Indian cuisine offers a wide array of breakfast options that are both delicious and nutritious.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">What Makes a Healthy Breakfast?</h2>
      <p>A good breakfast should contain a mix of complex carbohydrates for sustained energy, protein to keep you full, and some fiber and healthy fats. Avoid breakfasts that are high in refined carbohydrates and sugar, as they can lead to a quick energy spike followed by a crash.</p>
      <h2 class="text-xl font-semibold mt-4 mb-2">Top Healthy Indian Breakfast Choices:</h2>
      <ul class="list-disc list-inside space-y-3">
        <li><strong>Poha:</strong> This flattened rice dish is light, easy to digest, and a good source of carbohydrates and iron.
          <br><strong>Healthy Twist:</strong> Load it with vegetables like peas, onions, and carrots. Add peanuts or sprouts for a protein boost.</li>
        <li><strong>Upma:</strong> A thick porridge typically made from semolina (suji).
          <br><strong>Healthy Twist:</strong> Use broken wheat (dalia) or quinoa instead of suji for more fiber and protein. Add plenty of finely chopped veggies.</li>
        <li><strong>Idli Sambar:</strong> Steamed, fermented rice and lentil cakes are low in calories and fat. The fermentation process makes them easy to digest. Paired with sambar (a lentil-based stew), it becomes a complete protein meal.</li>
        <li><strong>Moong Dal Cheela:</strong> A savory pancake made from moong dal batter. It's an excellent source of protein and fiber.
          <br><strong>Healthy Twist:</strong> Stuff it with grated paneer or mixed vegetables.</li>
        <li><strong>Besan Cheela (Gram Flour Pancake):</strong> Another high-protein, gluten-free option that is quick to make.</li>
        <li><strong>Masala Oats:</strong> A savory and quick option. Cook oats with Indian spices and vegetables for a warm, filling breakfast.</li>
        <li><strong>Ragi Dosa or Porridge:</strong> Ragi (finger millet) is rich in calcium and iron. A ragi dosa is a great gluten-free option, and ragi porridge is perfect for a nourishing start.</li>
      </ul>
      <h2 class="text-xl font-semibold mt-4 mb-2">Breakfasts to Limit:</h2>
      <p>While delicious, options like deep-fried puris, parathas loaded with butter, and sugary packaged cereals should be reserved for occasional treats rather than daily consumption.</p>
      <p class="mt-4">Starting your day with one of these wholesome Indian breakfasts will keep you energized, focused, and satisfied until lunchtime.</p>
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
