const { GoogleGenAI } = require("@google/genai");
const { fetchRecipes } = require("./fetchRecipes");
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function parseDietInput(input) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: input,
            config: {
                systemInstruction: `
        You are a healthcare diet assistant. A doctor will write a natural language description of a dietary recommendation for a patient. Parse this into structured JSON that includes:

        - diet_type: e.g. "low-sodium", "high-protein", "diabetic"
        - excluded_foods: array of foods to avoid
        - preferred_foods: array of foods to include
        - tags: general tags like "plant-based", "heart healthy", "DASH diet"
        - recipe_queries: array of 1-2 recipe search terms optimized for Spoonacular API (e.g. "diabetic", "vegetarian", "mediterranean")

        Guidelines for recipe_queries:
        - Use terms that work well in recipe search engines
        - Combine diet type with cuisine or protein
        - Keep each query 2-4 words maximum
        - Focus on searchable recipe terms, not medical conditions

        Example input:
        "Recommend a low-sodium Mediterranean-style diet with high fiber, mostly vegetarian meals."

        Example output:
        {
        "diet_type": "low-sodium Mediterranean",
        "excluded_foods": ["processed foods", "high sodium foods", "canned soups"],
        "preferred_foods": ["olive oil", "fish", "vegetables", "whole grains"],
        "tags": ["mediterranean", "heart healthy", "low sodium", "high fiber"],
        "recipe_queries": ["mediterranean vegetarian", "low sodium fish", "heart healthy salad"]
        }

        Respond ONLY with a JSON object.
        `,
                temperature: 0.2,
                topK: 35,
                topP: 1,
            },
        });

        // clean and parse the data 
        const raw = response.candidates[0].content.parts[0].text;
        const jsonMatch = raw.match(/\{[\s\S]*\}/); // extract first JSON-looking object
        if (!jsonMatch) {
            throw new Error('No valid JSON found in Gemini response');
        }
        const parsed = JSON.parse(jsonMatch[0]);
        parsed.source = 'Gemini';

        // Fallback: If no recipe_queries, generate them from tags
        if (!parsed.recipe_queries || parsed.recipe_queries.length === 0) {
            console.log("No recipe_queries from LLM, generating from tags...");
            parsed.recipe_queries = generateRecipeQueries(parsed);
        }

        // Fetch recipes based on tags
        const recipes = await fetchRecipes(parsed.recipe_queries || []);
        parsed.recipes = recipes;

        return parsed;
    } catch (error) {
        console.warn("Gemini API failed, using fallback function:", error.message);
        const mock = mockParser(input);
        const recipes = await fetchRecipes(mock.tags || []);
        mock.recipes = recipes;
        return mock;

    }


}

// Helper function to generate recipe queries from other data
function generateRecipeQueries(parsed) {
    const queries = [];

    // Combine diet type with cuisine/protein
    if (parsed.diet_type) {
        queries.push(parsed.diet_type.split(',')[0].trim()); // First part of diet type
    }

    // Use key preferred foods
    if (parsed.preferred_foods && parsed.preferred_foods.length > 0) {
        queries.push(parsed.preferred_foods[0]); // First preferred food
    }

    // Use relevant tags
    if (parsed.tags && parsed.tags.length > 0) {
        const goodTags = parsed.tags.filter(tag =>
            ['vegetarian', 'diabetic', 'mediterranean', 'indian', 'healthy'].some(keyword =>
                tag.toLowerCase().includes(keyword)
            )
        );
        if (goodTags.length > 0) {
            queries.push(goodTags[0]);
        }
    }

    // Fallback
    if (queries.length === 0) {
        queries.push('healthy vegetarian');
    }

    return queries.slice(0, 3); // Max 3 queries
}

// Mock parser as fallback
function mockParser(input) {
    return {
        diet_type: 'low-sodium, Mediterranean',
        excluded_foods: ['processed foods', 'salty snacks'],
        preferred_foods: ['leafy greens', 'whole grains', 'olive oil'],
        tags: ['heart healthy', 'high fiber', 'plant-based'],
        source: 'mock'
    }; 22
}

module.exports = { parseDietInput };