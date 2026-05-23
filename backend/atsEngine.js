// REAL ATS SCORING ENGINE

function calculateATSScore(text) {
  const lower = text.toLowerCase();

  let score = 0;

  // ---------------- SKILLS (30 marks) ----------------
  const skills = [
    "react", "node", "express", "mongodb",
    "javascript", "python", "java", "sql",
    "html", "css", "git", "api"
  ];

  let foundSkills = [];

  skills.forEach(skill => {
    if (lower.includes(skill)) {
      foundSkills.push(skill);
    }
  });

  score += (foundSkills.length / skills.length) * 30;

  // ---------------- PROJECTS (15 marks) ----------------
  if (lower.includes("project")) score += 5;
  if (lower.includes("built")) score += 5;
  if (lower.includes("developed")) score += 5;

  // ---------------- EXPERIENCE (15 marks) ----------------
  if (lower.includes("intern")) score += 10;
  if (lower.includes("experience")) score += 5;

  // ---------------- EDUCATION (10 marks) ----------------
  if (lower.includes("b.tech") || lower.includes("btech")) score += 5;
  if (lower.includes("bachelor") || lower.includes("degree")) score += 5;

  // ---------------- GITHUB / LINKEDIN (10 marks) ----------------
  if (lower.includes("github")) score += 5;
  if (lower.includes("linkedin")) score += 5;

  // ---------------- FORMATTING QUALITY (10 marks) ----------------
  if (text.length > 1000) score += 5;
  if (text.length > 2000) score += 5;

  // cap score
  if (score > 100) score = 100;

  return {
    atsScore: Math.round(score),
    foundSkills
  };
}

function generateSuggestions(score) {
  if (score >= 80) {
    return [
      "Excellent resume",
      "Strong ATS optimization",
      "Well structured profile"
    ];
  }

  if (score >= 60) {
    return [
      "Add more projects",
      "Improve keyword optimization",
      "Add measurable achievements"
    ];
  }

  if (score >= 40) {
    return [
      "Add GitHub profile",
      "Add internship experience",
      "Improve technical skills section"
    ];
  }

  return [
    "Resume needs major improvement",
    "Add skills section",
    "Add projects and experience"
  ];
}

module.exports = {
  calculateATSScore,
  generateSuggestions
};