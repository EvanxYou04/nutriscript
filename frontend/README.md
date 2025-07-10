Perfect — here’s a clear, detailed **README-style context prompt** you can copy-paste into Microsoft Copilot. It tells Copilot exactly what you’re building, how it should work, and what code to start writing — especially focused on the **backend** with Gemini integration.

---

````markdown
# 🥗 NutriScript Backend – Prompt for Microsoft Copilot

## Overview
This project is part of a healthcare hackathon. The goal is to create a backend service that enables **clinicians** to write dietary recommendations in **natural language**, and return structured, actionable dietary information for **patients**.

The backend will receive free-text dietary input like:

> “Low-sodium Mediterranean-style meals, high in fiber, mostly vegetarian.”

It will parse that into structured JSON using **Google Gemini** (LLM API) or a **mock fallback**, and return:

```json
{
  "diet_type": "low-sodium, Mediterranean",
  "excluded_foods": ["processed foods", "salty snacks"],
  "preferred_foods": ["leafy greens", "legumes", "whole grains"],
  "tags": ["heart healthy", "high fiber", "plant-based"]
}
````

This JSON will power a **patient-facing dashboard** that shows recommended foods and meals.

---

## Stack

* Node.js
* Express.js
* Optional: Google Gemini API (or mocked parser)
* Environment variable for API key: `GEMINI_API_KEY`
* Deployed locally or to Vercel/Render

---

## Functional Requirements

* [ ] Create a REST API `POST /api/diet`
* [ ] Accept a JSON payload with `{ input: string }`
* [ ] Send the input to Gemini using a clear prompt and config (`temperature: 0.2`)
* [ ] Return structured JSON with:

  * `diet_type` (string)
  * `excluded_foods` (array of strings)
  * `preferred_foods` (array of strings)
  * `tags` (array of general descriptors)
* [ ] If Gemini is unavailable, use a mock parser function instead

---

## Prompt to Use with Gemini

Include the following in the API request:

```plaintext
You are a healthcare diet assistant. A doctor will write a natural language description of a dietary recommendation for a patient. Parse this into structured JSON with:

- diet_type: e.g. "low-sodium", "high-protein", "diabetic"
- excluded_foods: array of foods to avoid
- preferred_foods: array of foods to include
- tags: general tags like "plant-based", "heart healthy", "DASH diet"

Example input:
"Recommend a low-sodium Mediterranean-style diet with high fiber, mostly vegetarian meals."

Respond ONLY with a JSON object.
```

---

## Next Task for LLM

Please help me:

1. Scaffold a working Express backend (`index.js`)
2. Create a route at `/api/diet`
3. Implement `parseDietInput()` using:

   * Gemini API (with `.env` key), or
   * A mock function that returns canned output for known phrases
4. Ensure JSON output is returned from the endpoint

Keep code clean, readable, and easy to swap between real and mock logic.