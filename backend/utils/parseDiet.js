import { GoogleGenAI } from "@google/genai";
import 'dotenv/config'
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

        Example input:
        "Recommend a low-sodium Mediterranean-style diet with high fiber, mostly vegetarian meals."

        Respond ONLY with a JSON object.
        `,
                temperature: 0.2,
                topK: 40,
                topP: 1,
            },
        });

        let data = response.text;
        // clean and parse the data
        let raw = response.candidates[0].content.parts[0].text;
        let clean = raw.match(/\{[\s\S]*\}/); // extract first JSON-looking object
        const parsed = JSON.parse(clean[0]);
        parsed.source = 'Gemini';
        return parsed;
    } catch (error) {
        console.warn("Gemini API failed, using fallback function:", error.message);
        return mockParser(input);
    }


}

// Mock parser as fallback
function mockParser(input) {
    return {
        diet_type: 'low-sodium, Mediterranean',
        excluded_foods: ['processed foods', 'salty snacks'],
        preferred_foods: ['leafy greens', 'whole grains', 'olive oil'],
        tags: ['heart healthy', 'high fiber', 'plant-based'],
        source: 'mock'
    };
}

module.exports = { parseDietInput };