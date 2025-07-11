const { GoogleGenerativeAI } = require("@google/generative-ai");
const { fetchRecipes } = require("./fetchRecipes");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function parseDietInput(input) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.2,
                topK: 45,
                topP: 0.7
            }
        });

        const prompt = `You are a healthcare diet assistant. A doctor will write a natural language description of a dietary recommendation for a patient. Parse this into structured JSON with EXACTLY these fields:

- diet_type: e.g. "low-sodium", "high-protein", "diabetic"
- summary: a 1–2 sentence summary that explains the diet plan in plain language
- excluded_foods: array of foods to avoid
- preferred_foods: array of foods to include
- tags: general tags like "plant-based", "heart healthy", "DASH diet"
- recipe_queries: array of 2-3 recipe search terms optimized for Spoonacular API

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
  "summary": "A heart-healthy Mediterranean diet focusing on vegetables, whole grains, and limited sodium intake.",
  "excluded_foods": ["processed foods", "high sodium foods", "canned soups"],
  "preferred_foods": ["olive oil", "fish", "vegetables", "whole grains"],
  "tags": ["mediterranean", "heart healthy", "low sodium", "high fiber"],
  "recipe_queries": ["mediterranean vegetarian", "low sodium fish", "heart healthy salad"]
}

Respond ONLY with a JSON object containing ALL SIX fields.

Input: ${input}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Raw Gemini response:", text);

        // Clean and parse the JSON
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in Gemini response');
        }

        const parsed = JSON.parse(jsonMatch[0]);
        parsed.source = 'Gemini';

        console.log("Parsed diet data:", parsed);
        console.log("Recipe queries from LLM:", parsed.recipe_queries);

        // Fallback: If no recipe_queries, generate them from tags
        if (!parsed.recipe_queries || parsed.recipe_queries.length === 0) {
            console.log("⚠️ No recipe_queries from LLM, generating from other data...");
            parsed.recipe_queries = generateRecipeQueries(parsed);
        }

        console.log("Final recipe queries:", parsed.recipe_queries);

        // Fetch recipes using the queries
        const recipes = await fetchRecipes(parsed.recipe_queries, 7);
        parsed.recipes = recipes;

        console.log("Final result with recipes:", {
            ...parsed,
            recipes: parsed.recipes?.length || 0
        });

        return parsed;
    } catch (error) {
        console.warn("Gemini API failed, using fallback function:", error.message);
        const mock = mockParser(input);
        const recipes = await fetchRecipes(mock.recipe_queries || [], 4);
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

// Mock parser as fallback with rich data
function mockParser(input) {
    console.log("Using mock parser for input:", input);

    // Generate different mock data based on input keywords
    if (input.toLowerCase().includes('diabetic') || input.toLowerCase().includes('diabetes')) {
        return {
            diet_type: 'South Asian diabetic vegetarian',
            summary: 'A diabetes-friendly South Asian vegetarian diet focusing on low glycemic foods, lentils, and whole grains while avoiding white rice and sweets.',
            excluded_foods: ['white rice', 'sweets', 'sugary drinks', 'refined flour', 'processed foods'],
            preferred_foods: ['lentils', 'okra', 'spinach', 'millet roti', 'barley', 'cauliflower', 'bitter gourd'],
            tags: ['south asian', 'vegetarian', 'diabetic', 'low glycemic', 'high fiber'],
            recipe_queries: ['diabetic curry', 'lentil vegetarian', 'indian spinach'],
            source: 'mock'
        };
    } else if (input.toLowerCase().includes('mediterranean')) {
        return {
            diet_type: 'Mediterranean heart-healthy',
            summary: 'A Mediterranean diet rich in olive oil, fish, and vegetables to support heart health and overall wellness.',
            excluded_foods: ['processed meats', 'refined sugars', 'trans fats', 'highly processed foods'],
            preferred_foods: ['olive oil', 'fish', 'vegetables', 'whole grains', 'nuts', 'legumes'],
            tags: ['mediterranean', 'heart healthy', 'omega-3', 'anti-inflammatory'],
            recipe_queries: ['mediterranean fish', 'olive oil vegetables', 'healthy mediterranean'],
            source: 'mock'
        };
    } else {
        return {
            diet_type: 'Balanced healthy diet',
            summary: 'A well-balanced diet focusing on whole foods, lean proteins, and plenty of vegetables for optimal nutrition.',
            excluded_foods: ['processed foods', 'sugary snacks', 'refined grains', 'excessive sodium'],
            preferred_foods: ['leafy greens', 'lean proteins', 'whole grains', 'fresh fruits', 'nuts'],
            tags: ['balanced', 'healthy', 'whole foods', 'nutrient dense'],
            recipe_queries: ['healthy chicken', 'vegetable salad', 'whole grain'],
            source: 'mock'
        };
    }
}

module.exports = { parseDietInput };