require('dotenv').config();

async function fetchRecipes(queries, count = 4) {
    const apiKey = process.env.SPOONACULAR_API_KEY;

    console.log("🔑 API Key present:", !!apiKey);
    console.log("📝 Recipe queries received:", queries);

    if (!apiKey) {
        console.warn("❌ Missing Spoonacular API Key, returning mock recipes");
        return getMockRecipes(queries);
    }

    if (!queries || queries.length === 0) {
        console.log("❌ No recipe queries provided, returning mock recipes");
        return getMockRecipes(['healthy']);
    }

    try {
        const allRecipes = [];

        // Process each query
        for (const query of queries.slice(0, 3)) {
            const searchQuery = encodeURIComponent(query.trim());
            const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=${Math.ceil(count / queries.length)}&query=${searchQuery}&addRecipeInformation=true`;

            console.log(`🔍 Searching for: "${query}"`);

            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`❌ Failed to fetch for query "${query}": ${response.status}`);
                continue;
            }

            const data = await response.json();
            console.log(`📊 Found ${data.results?.length || 0} recipes for "${query}"`);

            if (data.results && data.results.length > 0) {
                const recipes = data.results.map(recipe => ({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    url: recipe.sourceUrl || recipe.spoonacularSourceUrl,
                    readyInMinutes: recipe.readyInMinutes || 'N/A',
                    summary: recipe.summary?.replace(/<[^>]*>/g, "").substring(0, 150) + "..." || "No description available",
                    healthScore: recipe.healthScore || 0,
                    servings: recipe.servings || 1,
                    queryUsed: query
                }));

                allRecipes.push(...recipes);
            }

            // Small delay to be nice to the API
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Remove duplicates based on recipe ID and limit results
        const uniqueRecipes = allRecipes.filter((recipe, index, self) =>
            index === self.findIndex(r => r.id === recipe.id)
        ).slice(0, count);

        console.log(`✅ Found ${uniqueRecipes.length} unique recipes from Spoonacular`);

        // If no recipes found, return mock recipes
        if (uniqueRecipes.length === 0) {
            console.log("⚠️ No recipes found from API, returning mock recipes");
            return getMockRecipes(queries);
        }

        return uniqueRecipes;

    } catch (error) {
        console.error("❌ Spoonacular fetch failed:", error.message);
        console.log("🔄 Returning mock recipes as fallback");
        return getMockRecipes(queries);
    }
}

// Mock recipes for fallback
function getMockRecipes(queries) {
    const mockRecipeBank = {
        'diabetic': [
            {
                id: 'mock-1',
                title: 'Diabetic-Friendly Lentil Curry',
                image: 'https://via.placeholder.com/312x231/4CAF50/white?text=Lentil+Curry',
                url: '#',
                readyInMinutes: 30,
                summary: 'A delicious and nutritious lentil curry perfect for diabetic diets, low in glycemic index and high in protein...',
                healthScore: 85,
                servings: 4,
                queryUsed: 'diabetic curry'
            },
            {
                id: 'mock-2',
                title: 'Spinach and Okra Stir-Fry',
                image: 'https://via.placeholder.com/312x231/4CAF50/white?text=Spinach+Okra',
                url: '#',
                readyInMinutes: 15,
                summary: 'A quick and healthy South Asian vegetable dish with spinach and okra, perfect for diabetic meal planning...',
                healthScore: 90,
                servings: 3,
                queryUsed: 'indian spinach'
            }
        ],
        'mediterranean': [
            {
                id: 'mock-3',
                title: 'Mediterranean Grilled Fish',
                image: 'https://via.placeholder.com/312x231/2196F3/white?text=Grilled+Fish',
                url: '#',
                readyInMinutes: 25,
                summary: 'Fresh Mediterranean-style grilled fish with olive oil, herbs, and vegetables for a heart-healthy meal...',
                healthScore: 88,
                servings: 2,
                queryUsed: 'mediterranean fish'
            },
            {
                id: 'mock-4',
                title: 'Mediterranean Vegetable Salad',
                image: 'https://via.placeholder.com/312x231/2196F3/white?text=Med+Salad',
                url: '#',
                readyInMinutes: 10,
                summary: 'A refreshing Mediterranean salad with olive oil, fresh vegetables, and herbs for optimal nutrition...',
                healthScore: 92,
                servings: 4,
                queryUsed: 'mediterranean vegetables'
            }
        ],
        'healthy': [
            {
                id: 'mock-5',
                title: 'Healthy Quinoa Bowl',
                image: 'https://via.placeholder.com/312x231/FF9800/white?text=Quinoa+Bowl',
                url: '#',
                readyInMinutes: 20,
                summary: 'A nutritious quinoa bowl packed with vegetables, lean protein, and healthy fats for balanced nutrition...',
                healthScore: 87,
                servings: 2,
                queryUsed: 'healthy bowl'
            },
            {
                id: 'mock-6',
                title: 'Grilled Chicken with Vegetables',
                image: 'https://via.placeholder.com/312x231/FF9800/white?text=Chicken+Veggies',
                url: '#',
                readyInMinutes: 35,
                summary: 'Lean grilled chicken breast served with a colorful mix of roasted vegetables for a complete healthy meal...',
                healthScore: 85,
                servings: 3,
                queryUsed: 'healthy chicken'
            }
        ]
    };

    // Determine which category to use based on queries
    let category = 'healthy';
    if (queries.some(q => q.toLowerCase().includes('diabetic') || q.toLowerCase().includes('curry') || q.toLowerCase().includes('lentil'))) {
        category = 'diabetic';
    } else if (queries.some(q => q.toLowerCase().includes('mediterranean') || q.toLowerCase().includes('fish'))) {
        category = 'mediterranean';
    }

    console.log(`🍽️ Returning ${mockRecipeBank[category].length} mock recipes for category: ${category}`);
    return mockRecipeBank[category];
}

module.exports = { fetchRecipes };