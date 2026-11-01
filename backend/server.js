
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const { generateMysteryCase } = require("./gemini");

app.use(cors());
app.use(express.json());

let mysteryCase = null;

let cachedCase = {
  id: "case-002",
  title: "The Eclipse of Dr. Vance",
  difficulty: "Medium",
  location: "Aethelgard Mountain Astronomical Observatory",

  description:
    "During a total lunar eclipse, Dr. Arthur Vance was found dead in his private office. The coroner confirmed that potassium cyanide was mixed into his tea thermos.",

  suspects: [
    {
      id: 1,
      name: "Dr. Elena Rostova",
      role: "Chief Spectroscopist",
      statement:
        "I spent the entire eclipse in the basement optical laboratory."
    },
    {
      id: 2,
      name: "Marcus Sterling",
      role: "Head Facility Engineer",
      statement:
        "I was monitoring the power systems in the transformer room."
    },
    {
      id: 3,
      name: "Nadia Trent",
      role: "Doctoral Research Assistant",
      statement:
        "I prepared Dr. Vance's tea and monitored the public livestream."
    },
    {
      id: 4,
      name: "Julian Cole",
      role: "Observatory Trustee",
      statement:
        "I remained outside on the rooftop observation deck."
    }
  ],

  clues: [
    {
      id: 1,
      title: "Chemical Swab from Thermos",
      description:
        "Potassium cyanide and specialized optical primer paste were found on the thermos."
    },
    {
      id: 2,
      title: "Spectrograph Console Audit Log",
      description:
        "The spectrograph ran automatically without any manual inputs."
    },
    {
      id: 3,
      title: "East Stairwell Glass Reflection",
      description:
        "A person wearing a yellow cleanroom smock was seen moving toward the director's corridor."
    }
  ]
};

let solution = {
  suspectId: 1,
  explanation:
    "Dr. Elena Rostova is the culprit. The spectrograph operated automatically, disproving her claim that she remained at the workstation. The chemical primer paste connects the crime to the prism preparation suite, and the cleanroom smock reflection places someone from that area near the director's corridor."
};


app.get("/", (req, res) => {
  res.json({ message: "AI Mystery Room backend is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Mystery Room API is ready!",
  });
});



app.get("/api/cases", async (req, res) => {
  try {
    if (cachedCase) {
      return res.json(cachedCase);
    }

    const generatedCase = await generateMysteryCase();

    cachedCase = {
      id: generatedCase.id,
      title: generatedCase.title,
      difficulty: generatedCase.difficulty,
      location: generatedCase.location,
      description: generatedCase.description,
      suspects: generatedCase.suspects,
      clues: generatedCase.clues,
    };

    solution = generatedCase.solution;

    res.json(cachedCase);

  } catch (error) {
    console.error("CASE GENERATION ERROR:", error.message);

    res.status(500).json({
      message: "Unable to generate mystery case using AI.",
      error: error.message
    });
  }
});

// Generate a new mystery case
app.post("/api/new-case", (req, res) => {

  cachedCase = {
    id: "case-003",
    title: "The Midnight Museum Heist",
    difficulty: "Hard",
    location: "Royal Heritage Museum",

    description:
      "A priceless golden crown disappeared from a locked museum gallery at midnight. Four people had access to the building. Investigate the clues and identify the thief.",

    suspects: [
      {
        id: 1,
        name: "Oliver Grant",
        role: "Museum Security Officer",
        statement: "I was monitoring the main entrance cameras."
      },
      {
        id: 2,
        name: "Sophia Miller",
        role: "Art Conservator",
        statement: "I was working in the restoration room."
      },
      {
        id: 3,
        name: "Henry Wilson",
        role: "Museum Curator",
        statement: "I was checking the historical archives."
      },
      {
        id: 4,
        name: "Emma Carter",
        role: "Cleaning Supervisor",
        statement: "I was cleaning the east corridor."
      }
    ],

    clues: [
      {
        id: 1,
        title: "Broken Glass",
        description:
          "Tiny glass fragments were found near the east gallery."
      },
      {
        id: 2,
        title: "Security Camera Record",
        description:
          "The east corridor camera was manually disabled at 11:52 PM."
      },
      {
        id: 3,
        title: "Cleaning Schedule",
        description:
          "The cleaning cart was recorded near the gallery at midnight."
      }
    ]
  };

  solution = {
    suspectId: 4,
    explanation:
      "Emma Carter was responsible. Her cleaning cart gave her an opportunity to approach the gallery unnoticed. The investigation points to the east corridor and the camera interruption."
  };

  res.json({
    message: "New mystery case created successfully!",
    mysteryCase: cachedCase
  });

});

app.post("/api/submit-answer", (req, res) => {
  const { suspectId } = req.body;

  if (!suspectId) {
    return res.status(400).json({
      message: "Please select a suspect."
    });
  }

  if (!solution) {
    return res.status(400).json({
      message: "Please generate a mystery case first."
    });
  }

  const isCorrect = Number(suspectId) === solution.suspectId;

  res.json({
    correct: isCorrect,
    message: isCorrect
      ? "Excellent detective work! You identified the culprit."
      : "Incorrect suspect! The evidence does not support your choice.",
    explanation: solution.explanation
  });
});

app.listen(PORT, () => {
  console.log(`Mystery Room backend running at http://localhost:${PORT}`);
});
