const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateMysteryCase() {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Generating mystery case... Attempt ${attempt}`);

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",

        contents: `
          Create a unique detective mystery case.

          Return valid JSON with this exact structure:

          {
            "id": "case-002",
            "title": "Mystery title",
            "difficulty": "Medium",
            "location": "Mystery location",
            "description": "Case description",
            "suspects": [
              {
                "id": 1,
                "name": "Suspect name",
                "role": "Suspect role",
                "statement": "Suspect statement"
              }
            ],
            "clues": [
              {
                "id": 1,
                "title": "Clue title",
                "description": "Clue description"
              }
            ],
            "solution": {
              "suspectId": 1,
              "explanation": "Detailed explanation"
            }
          }

          Requirements:
          - Exactly 4 suspects.
          - Exactly 3 clues.
          - Exactly one culprit.
          - All clues must logically support the culprit.
          - Every suspect must have a believable statement.
          - Make the mystery challenging but solvable.
          - Do not reveal the culprit in the case description.
          - Return JSON only.
        `,

        config: {
          responseMimeType: "application/json",
          temperature: 0.8,
        },
      });

      const text = response.text;

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      const generatedCase = JSON.parse(text);

      if (
        !generatedCase.title ||
        !Array.isArray(generatedCase.suspects) ||
        generatedCase.suspects.length !== 4 ||
        !Array.isArray(generatedCase.clues) ||
        generatedCase.clues.length !== 3 ||
        !generatedCase.solution
      ) {
        throw new Error("Generated mystery case has an invalid structure.");
      }

      const suspectExists = generatedCase.suspects.some(
        (suspect) =>
          Number(suspect.id) === Number(generatedCase.solution.suspectId)
      );

      if (!suspectExists || !generatedCase.solution.explanation) {
        throw new Error("Generated mystery solution is invalid.");
      }

      console.log("AI Mystery Case Generated Successfully!");

      return generatedCase;

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw error;
      }

      // Wait 3 seconds before retrying
      // Wait 25 seconds before retrying
      await new Promise((resolve) => setTimeout(resolve, 25000));
    }
  }
}

module.exports = { generateMysteryCase };