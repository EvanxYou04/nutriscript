const tagToQuery = {
    "low-glycemic": "low glycemic",
    "anti-inflammatory": "anti inflammatory",
    "heart healthy": "heart healthy",
    "plant-based": "vegan",
    "diabetic": "diabetes",
    "low sodium": "low sodium"
};

async function fetchRecipes(tags, count = 3) {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) throw new Error("Missing Spoonacular API Key");

    const queries = tags
        .map(tag => tagToQuery[tag.toLowerCase()])
        .filter(Boolean);

    if (queries.length === 0) return [];

    const query = encodeURIComponent(queries.join(","));
    const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=${count}&query=${query}&addRecipeInformation=true`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log("Spoonacular response:", data.results);

        return (data.results || []).map(recipe => ({
            title: recipe.title,
            image: recipe.image,
            url: recipe.sourceUrl,
            readyInMinutes: recipe.readyInMinutes,
            summary: recipe.summary?.replace(/<[^>]*>/g, "") || ""
        }));
    } catch (err) {
        console.error("Spoonacular fetch failed:", err.message);
        return [];
    }
}

module.exports = { fetchRecipes };