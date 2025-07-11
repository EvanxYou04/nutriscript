const { parseDietInput } = require('./utils/parseDiet');
require('dotenv').config();

async function testIntegration() {
    console.log("Testing LLM + Recipe integration...");

    const testInput = "Design a South Asian vegetarian diet suitable for diabetes. Avoid white rice and sweets. Include lentils, okra, spinach, and roti made from millet or barley.";

    try {
        const result = await parseDietInput(testInput);

        console.log("\n=== RESULTS ===");
        console.log("Diet Type:", result.diet_type);
        console.log("Tags:", result.tags);
        console.log("Summary:", result.summary);
        console.log("Recipe_queries:", result.recipe_queries);
        console.log("Preferred Foods:", result.preferred_foods);
        console.log("Excluded Foods:", result.excluded_foods);
        console.log("Recipes Found:", result.recipes?.length || 0);

        if (result.recipes && result.recipes.length > 0) {
            console.log("\n=== RECIPES ===");
            result.recipes.forEach((recipe, i) => {
                console.log(`${i + 1}. ${recipe.title}`);
                console.log(`   Time: ${recipe.readyInMinutes} min`);
                console.log(`   Summmary: ${recipe.summary}`);
                console.log(`   URL: ${recipe.url}`);
                console.log("");
            });
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testIntegration();