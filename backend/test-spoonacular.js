require('dotenv').config();

async function testSpoonacular() {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    console.log("API Key:", apiKey ? "Present" : "Missing");

    if (!apiKey) {
        console.error("❌ No Spoonacular API key found");
        return;
    }

    // Test a simple search
    const testQuery = "vegetarian";
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=2&query=${testQuery}&addRecipeInformation=true`;

    console.log("Testing URL:", url);

    try {
        const response = await fetch(url);
        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", errorText);
            return;
        }

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2));

        if (data.results && data.results.length > 0) {
            console.log("✅ Spoonacular API is working!");
            console.log("Found recipes:", data.results.map(r => r.title));
        } else {
            console.log("⚠️ API working but no results found");
        }

    } catch (error) {
        console.error("❌ Fetch error:", error.message);
    }
}

testSpoonacular();