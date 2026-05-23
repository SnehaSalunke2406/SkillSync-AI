const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

console.log("ENV STATUS:", process.env.GEMINI_API_KEY ? "LOADED" : "MISSING");

const upload = multer({ dest: "uploads/" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// HOME ROUTE
app.get("/", (req, res) => {
  res.json({ status: "Backend Running 🚀", message: "SkillSync AI Server Active" });
});

// =========================================================================
// FEATURE 1: RESUME ANALYZER (FINAL COMPLETELY COMPATIBLE PARSER)
// =========================================================================
async function getGeminiATSScore(resumeText) {
  const modelOptions = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let textResponse = "";
  let success = false;

  const prompt = `
    Analyze this resume text and calculate an ATS score out of 100 based on standard industry rules. 
    Identify found skills, missing critical skills for full-stack/AI/Data engineering roles, and improvements.

    Return your entire response matching this exact JSON format structural scheme:
    {
      "atsScore": 75,
      "foundSkills": ["React", "Node.js"],
      "missingSkills": ["Docker", "AWS"],
      "suggestions": ["Add a summary section", "Quantify accomplishments"]
    }

    Resume text:
    ${resumeText}
  `;

  for (const modelName of modelOptions) {
    try {
      console.log(`📡 ATTEMPTING LIVE ANALYSIS WITH MODEL: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });

      const response = await result.response;
      textResponse = response.text().trim();
      success = true;
      break;
    } catch (modelError) {
      console.log(`⚠️ ${modelName} failed or quota limit hit: ${modelError.message}`);
    }
  }

  if (success) {
    try {
      // Clean string mutations to protect against unformatted string blocks
      let cleanJsonString = textResponse;
      if (cleanJsonString.includes("```")) {
        cleanJsonString = cleanJsonString.replace(/```json/g, "").replace(/```/g, "").trim();
      }
      return JSON.parse(cleanJsonString);
    } catch (parseError) {
      console.log("🔥 JSON Parsing failed on live response:", parseError.message);
    }
  }

  return generateAlgorithmicScore(resumeText);
}

function generateAlgorithmicScore(text) {
  const cleanText = text.toLowerCase();
  const technicalSkillsList = ["python", "javascript", "react", "node", "express", "sql", "git", "github", "docker", "kubernetes", "aws", "mongodb", "postgresql", "scikit-learn", "pytorch", "tensorflow"];
  const found = [];
  const missing = [];

  technicalSkillsList.forEach(skill => {
    if (cleanText.includes(skill)) { 
      found.push(skill.toUpperCase()); 
    } else { 
      missing.push(skill.toUpperCase()); 
    }
  });

  const structuralBaseScore = Math.min(40 + (text.length / 120), 60);
  const keywordScore = (found.length / technicalSkillsList.length) * 40;
  const finalAtsScore = Math.min(Math.round(structuralBaseScore + keywordScore), 98);

  // PROGRAMMATIC SUGGESTIONS PARSER
  const dynamicSuggestionsList = [];
  
  if (missing.includes("DOCKER") || missing.includes("AWS")) {
    dynamicSuggestionsList.push("Infrastructure Optimization: Expand deployment descriptors by incorporating container orchestration parameters (Docker, Kubernetes) or cloud resource components.");
  }
  if (missing.includes("REACT") || missing.includes("JAVASCRIPT")) {
    dynamicSuggestionsList.push("Frontend Matrix: Supplement presentation layouts experience blocks by explicitly stating familiarity with responsive application rendering states or React architectures.");
  }
  if (text.length < 1200) {
    dynamicSuggestionsList.push("Structural expansion required: Your profile data layout is light. Add descriptive, bulleted result metrics under your listed engineering configurations.");
  } else {
    dynamicSuggestionsList.push("Readability scanning density: Your resume contains comprehensive technical blocks. Ensure text spans maintain strong structural hierarchy guidelines.");
  }

  dynamicSuggestionsList.push("Quantifiable milestones: State project achievements using concrete percentages and baseline metric progressions instead of passive role explanations.");
  dynamicSuggestionsList.push("Technical summary: Add a high-visibility introductory abstract section at the top of your document to consolidate your primary core tech competencies immediately.");

  return {
    atsScore: finalAtsScore,
    foundSkills: found.length > 0 ? found.slice(0, 8) : ["PYTHON", "SQL", "GIT", "GITHUB", "SCIKIT-LEARN", "PYTORCH"],
    missingSkills: missing.length > 0 ? missing.slice(0, 6) : ["JAVASCRIPT", "REACT", "NODE", "EXPRESS", "KUBERNETES", "AWS"],
    suggestions: dynamicSuggestionsList
  };
}

app.post("/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const filePath = req.file.path;
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text || "";
    const result = await getGeminiATSScore(text);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.json(result);
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(500).json({ message: "Internal processing error", error: error.message });
  }
});

// =========================================================================
// FEATURE 2: AI ROADMAP GENERATOR ENDPOINT (COMPLETELY PRESERVED)
// =========================================================================
app.post("/roadmap", async (req, res) => {
  console.log("🚀 ROADMAP REQUEST RECEIVED FOR:", req.body.skill, "->", req.body.targetGoal);
  
  const skill = String(req.body.skill || "").trim();
  const targetGoal = String(req.body.targetGoal || "").trim();

  if (!skill || !targetGoal) {
    return res.status(400).json({ message: "Missing skill or career goal parameters" });
  }

  const modelOptions = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let parsedData = null;
  let success = false;

  const prompt = `
    Create an incredibly thorough roadmap starting from absolute beginner level up to expert level tracing from "${skill}" to "${targetGoal}".
    First, populate an array called "requiredSkills" containing 6 specific core required skills or prerequisite tools for this track.
    Second, provide exactly 3 sequentially progressive phases where Phase 1 covers absolute basics, setup, and core syntax mechanics.
    Return your response matching this exact schema:
    {"title": "Roadmap Title", "requiredSkills": ["Skill"], "phases": [{"phaseName": "Phase 1", "duration": "4 Weeks", "topics": ["Topic"], "projectIdea": "Project"}]}
  `;

  const responseSchema = {
    type: "object",
    properties: {
      title: { type: "string" },
      requiredSkills: { type: "array", items: { type: "string" } },
      phases: {
        type: "array",
        items: {
          type: "object",
          properties: {
            phaseName: { type: "string" },
            duration: { type: "string" },
            topics: { type: "array", items: { type: "string" } },
            projectIdea: { type: "string" }
          },
          required: ["phaseName", "duration", "topics", "projectIdea"]
        }
      }
    },
    required: ["title", "requiredSkills", "phases"]
  };

  for (const modelName of modelOptions) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: responseSchema }
      });
      parsedData = JSON.parse(result.response.text().trim());
      success = true;
      break;
    } catch (err) {
      console.log(`⚠️ Roadmap rotation fallback tracking...`);
    }
  }

  if (success && parsedData) return res.json(parsedData);

  const inputSkillKey = skill.toLowerCase();
  const inputGoalKey = targetGoal.toLowerCase();

  let targetResponseObject = {
    title: `Beginner-to-Advanced Roadmap: ${skill} to ${targetGoal}`,
    requiredSkills: [`Basic ${skill} Syntax`, "IDE Setup", "Logic Flow Design", "Git Control"],
    phases: [
      {
        phaseName: `Phase 1: Absolute Foundational ${skill.toUpperCase()} Basic Constructs & Syntax Setup`,
        duration: "4 Weeks",
        topics: [`Introduction to basic expressions, input/output controls, and primitive variables structure of ${skill}.`, "Writing initial control tasks and logic expressions configurations."],
        projectIdea: `Design and compile a structural application file tracking simple console arrays inside your pure ${skill} layer.`
      },
      {
        phaseName: "Phase 2: Intermediate Implementation Patterns & Framework Ecosystems",
        duration: "5 Weeks",
        topics: ["Importing package components, design abstractions, and concurrent processing pipelines.", "Structuring persistent storage layers, schema models, and data interceptors."],
        projectIdea: "Architect a clean system controller module handling operations records persistence hooks."
      },
      {
        phaseName: `Phase 3: Advanced Production Scaling & Continuous ${targetGoal} Architectures`,
        duration: "4 Weeks",
        topics: ["Isolating runtime codebases environments inside independent app application containers.", "Deploying scaled instances to cloud server clusters with attached error telemetry monitors."],
        projectIdea: "Construct an automated deployment workflow pipeline verifying system state metrics parameters."
      }
    ]
  };

  if (inputSkillKey.includes("c++") || inputGoalKey.includes("dsa")) {
    targetResponseObject = {
      title: "Masterclass: Mastering C++ and Data Structures & Algorithms",
      requiredSkills: ["C++ Core Syntax", "Pointers & Memory Management", "Time & Space Complexity Analysis", "Standard Template Library (STL)", "Recursion & Backtracking Rules", "GDB Console Debugging"],
      phases: [
        {
          phaseName: "Phase 1: Absolute C++ Basic Constructs & Object-Oriented Principles",
          duration: "4 Weeks",
          topics: ["Programming primitive variables types, conditional checks expressions, scope tracking, and matrix sorting loop runs.", "Deep dive into pointer layouts: memory referencing, stack vs heap tracking, and dynamic raw array allocations.", "Object-Oriented Programming: classes design abstractions, constructor parameters, inheritance structures, and polymorphism hooks."],
          projectIdea: "Build an interactive, terminal-driven Inventory Management Architecture utilizing raw object data arrays and manual text configuration persistence layers."
        },
        {
          phaseName: "Phase 2: Linear Data Structures & Algorithmic Foundations Analysis",
          duration: "5 Weeks",
          topics: ["Calculating process performance capabilities using official mathematical asymptotic Big O complexity rules.", "Constructing Linear Data Structures from scratch: custom Singly/Doubly Linked Lists, stack vectors, and array queues tracking loops.", "Mastering sorting and search processing patterns: executing Binary Search workflows and sliding window optimizations."],
          projectIdea: "Architect a custom Task Request Buffer Queue execution module running raw list pointers and memory release structures."
        },
        {
          phaseName: "Phase 3: Complex Non-Linear Data Structures & Dynamic Optimization",
          duration: "4 Weeks",
          topics: [
            "Advanced Non-Linear Collections: Hierarchical Binary Search Trees (BST), Heaps management, and key hash indexing loops.",
            "Graph Modeling: designing node matrix networks and programming graph traversal tracks using standard BFS and DFS scripts.",
            "Dynamic Programming (DP): resolving optimization equations using background memoization tables and backtracking logic loops."
          ],
          projectIdea: "Design and implement a complex Route-Network Graph Pathfinder executing Dijkstra's short-distance calculation parameters."
        }
      ]
    };
  } else if (inputSkillKey.includes("py") || inputGoalKey.includes("ai") || inputGoalKey.includes("ml")) {
    targetResponseObject = {
      title: "Production Track: From Pure Python Basics to AI/ML Professional Practitioner",
      requiredSkills: ["Python Variables & Loops", "Linear Algebra & Matrix Operations", "Pandas and NumPy Arrays", "Data Visualizations (Matplotlib)", "Scikit-Learn Frameworks", "Neural Networks Fundamentals"],
      phases: [
        {
          phaseName: "Phase 1: Foundational Python Syntax & Core Logic Constructs",
          duration: "4 Weeks",
          topics: [
            "Mastering absolute beginner variables, conditional logic block rules, while loops, and list comprehensions.",
            "Handling data structures manually: sorting raw arrays, dictionary indexing, and text string parsing operations.",
            "Structuring functions, setting up local virtual environments, and importing initial mathematical modules."
          ],
          projectIdea: "Build a command-line Calculator and basic dataset Summary Profiler that extracts numbers from an unformatted tracking file and computes variance arrays cleanly."
        },
        {
          phaseName: "Phase 2: Data Engineering Manipulation & Classical Machine Learning Models",
          duration: "5 Weeks",
          topics: [
            "Deep dive into multi-dimensional matrix slicing and mathematical vector profiling with NumPy and Pandas dataframes.",
            "Supervised training implementations: building Linear Regression models, Random Forests classifiers, and Support Vector Machines.",
            "Evaluating data metrics: plotting confusion errors matrices, processing precision ratios, and tracking overall system tuning metrics."
          ],
          projectIdea: "Program a dynamic Real Estate Market Valuation Engine using Scikit-Learn to estimate house valuations from multivariable inputs."
        },
        {
          phaseName: "Phase 3: Advanced Neural Networks, Deep Learning, and Production AI MLOps",
          duration: "4 Weeks",
          topics: [
            "Introduction to Neural Network parameters: node layers, multi-layer activation paths (ReLU/Sigmoid), and backpropagation rules.",
            "Computer Vision & NLP foundations: building custom text classification handlers and tracking object matching matrices.",
            "Serving model inference interfaces securely behind optimized FastAPI endpoints and containerizing deployment files via Docker templates."
          ],
          projectIdea: "Assemble and deploy a fully scalable Image Object Recognition API backend running automated model prediction evaluations."
        }
      ]
    };
  }

  return res.json(targetResponseObject);
});

// =========================================================================
// FEATURE 3: GITHUB ANALYZER (COMPLETELY PRESERVED)
// =========================================================================
app.post("/github", async (req, res) => {
  const username = String(req.body.username || "").trim();
  console.log(`🐙 GITHUB ANALYSIS REQUEST RECEIVED FOR USERNAME: ${username}`);

  if (!username) {
    return res.status(400).json({ message: "GitHub username parameter is required" });
  }

  const modelOptions = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  let parsedData = null;
  let success = false;
  let repos = [];

  try {
    const githubUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
    const gitResponse = await fetch(githubUrl, { headers: { "User-Agent": "SkillSync-AI-App" } });
    if (gitResponse.ok) repos = await gitResponse.json();

    const totalCalculatedStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalRepositoryCount = repos.length;

    const languagesDetected = [...new Set(repos.map(r => r.language).filter(Boolean))].slice(0, 5);
    if (languagesDetected.length === 0) languagesDetected.push("JavaScript", "HTML");

    let consistencyMetric = "Less than 4 Weeks";
    if (totalRepositoryCount > 2) consistencyMetric = "8+ Weeks";
    if (totalRepositoryCount > 4) consistencyMetric = "12+ Weeks";

    const repoSummaryData = repos.map(repo => ({
      name: repo.name,
      language: repo.language || "Unknown",
      stars: repo.stargazers_count,
      description: repo.description || ""
    })).slice(0, 30);

    const prompt = `
      Analyze this developer's public GitHub repository footprint data:
      ${JSON.stringify(repoSummaryData)}

      Calculate metrics and return your analysis matching this exact structured JSON layout schema:
      {
        "username": "${username}",
        "summary": "Write a thorough 3-sentence professional summary identifying their primary focus and domain expertise based on their repos.",
        "languages": ${JSON.stringify(languagesDetected)}, 
        "metrics": {
          "totalRepos": ${totalRepositoryCount},
          "totalStars": ${totalCalculatedStars},
          "activeWeeksEstimation": "${consistencyMetric}"
        },
        "recommendations": [
          "Suggestion 1 to improve project presentation (e.g., add missing README files)",
          "Suggestion 2 to balance technical diversity"
        ]
      }
    `;

    const responseSchema = {
      type: "object",
      properties: {
        username: { type: "string" },
        summary: { type: "string" },
        languages: { type: "array", items: { type: "string" } },
        metrics: {
          type: "object",
          properties: {
            totalRepos: { type: "number" },
            totalStars: { type: "number" },
            activeWeeksEstimation: { type: "string" }
          },
          required: ["totalRepos", "totalStars", "activeWeeksEstimation"]
        },
        recommendations: { type: "array", items: { type: "string" } }
      },
      required: ["username", "summary", "languages", "metrics", "recommendations"]
    };

    for (const modelName of modelOptions) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", responseSchema: responseSchema }
        });
        parsedData = JSON.parse(result.response.text().trim());
        success = true;
        break;
      } catch (err) {
        console.log(`⚠️ GitHub fallback skipping model ${modelName}`);
      }
    }

    if (success && parsedData) return res.json(parsedData);
    throw new Error("AI engine limit triggered.");

  } catch (error) {
    const totalCalculatedStars = repos ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0) : 0;
    const totalRepositoryCount = repos ? repos.length : 0;
    const fallbackLangs = repos ? [...new Set(repos.map(r => r.language).filter(Boolean))].slice(0, 4) : ["JavaScript", "HTML"];
    if (fallbackLangs.length === 0) fallbackLangs.push("JavaScript", "HTML");

    let consistencyMetric = "Less than 4 Weeks";
    if (totalRepositoryCount > 2) consistencyMetric = "8+ Weeks";
    if (totalRepositoryCount > 4) consistencyMetric = "12+ Weeks";

    let dynamicSummary = `@${username} highlights an active engagement in software development workflows. With a collection of ${totalRepositoryCount} public repositories, their codebase layout showcases a focused approach to building engineering projects and exploring core concepts.`;
    
    if (totalRepositoryCount <= 2 && totalRepositoryCount > 0) {
      dynamicSummary = `@${username} appears to be an early-stage programmer focusing on foundational web development and academic programming projects. Their work includes structured codebase building and initial exposure to various programming paradigms and web technologies.`;
    } else if (totalRepositoryCount === 0) {
      dynamicSummary = `No public repository tracks are currently active for @${username}. The user workspace profile is established and ready to host modular software packages or open-source deployments.`;
    }

    return res.status(200).json({
      username: username,
      summary: dynamicSummary,
      languages: fallbackLangs,
      metrics: {
        totalRepos: totalRepositoryCount,
        totalStars: totalCalculatedStars,
        activeWeeksEstimation: consistencyMetric
      },
      recommendations: [
        "Ensure all public repositories contain explicit and detailed README.md files.",
        "Organize old repository forks to highlight core, original coding assets."
      ]
    });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));