// Enhanced AI Analyzer with Advanced Fallback System
// File: src/services/aiAnalyzer.js

let OpenAI, openai;

try {
  if (process.env.OPENAI_API_KEY) {
    OpenAI = require("openai");
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("✅ OpenAI initialized");
  } else {
    console.warn("⚠️ OpenAI API key not found - using enhanced fallback");
  }
} catch (error) {
  console.error("❌ OpenAI initialization error:", error);
}

async function analyzeWithAI(resumeText, jobDescription = "") {
  try {
    if (!openai) {
      console.log("🔄 Using enhanced fallback analysis (OpenAI not available)");
      return createEnhancedFallbackAnalysis(resumeText, jobDescription);
    }

    const prompt = createAnalysisPrompt(resumeText, jobDescription);

    console.log("🚀 Sending request to OpenAI...");

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert HR professional and career coach with 15+ years of experience. Analyze resumes comprehensively and provide actionable insights. Respond only with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    console.log("✅ OpenAI response received");
    return parseAIResponse(response.choices[0].message.content);
  } catch (error) {
    console.log(
      "⚠️ OpenAI error (using fallback):",
      error.code || error.message
    );

    return createEnhancedFallbackAnalysis(resumeText, jobDescription);
  }
}

function createAnalysisPrompt(resumeText, jobDescription) {
  return `As an expert HR professional, analyze this resume comprehensively and provide detailed insights:

RESUME TEXT:
${resumeText.substring(0, 3000)}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription.substring(0, 1000)}` : ""}

Analyze for:
1. Technical and soft skills (be thorough)
2. Experience level and achievements
3. ATS compatibility and structure
4. Industry-specific keywords
5. Missing elements that could improve the resume

Respond with this exact JSON format:
{
  "score": 75,
  "scoreExplanation": "Detailed explanation of the score with specific strengths and weaknesses",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "recommendations": ["specific actionable recommendation 1", "specific actionable recommendation 2", "specific actionable recommendation 3"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "atsScore": 85,
  "experienceLevel": "Mid-level",
  "industryMatch": "Technology"
}`;
}

function parseAIResponse(responseText) {
  try {
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return validateAndCleanResponse(parsed);
    }
  } catch (error) {
    console.error("❌ Error parsing AI response:", error);
  }

  return createEnhancedFallbackAnalysis("", "");
}

function validateAndCleanResponse(parsed) {
  return {
    score: Math.min(100, Math.max(0, parseInt(parsed.score) || 50)),
    scoreExplanation: String(parsed.scoreExplanation || "Analysis completed").substring(0, 300),
    skills: Array.isArray(parsed.skills) ? parsed.skills.slice(0, 20) : [],
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.slice(0, 15) : [],
    recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 8) : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 5) : [],
    atsScore: Math.min(100, Math.max(0, parseInt(parsed.atsScore) || 70)),
    experienceLevel: parsed.experienceLevel || "Entry-level",
    industryMatch: parsed.industryMatch || "General",
  };
}

// ============================================================================
// ENHANCED FALLBACK ANALYSIS SYSTEM
// ============================================================================

function createEnhancedFallbackAnalysis(resumeText, jobDescription) {
  console.log("🤖 Running enhanced fallback analysis...");

  const analysis = {
    extractedText: resumeText,
    skills: extractAdvancedSkills(resumeText),
    experience: analyzeExperience(resumeText),
    education: analyzeEducation(resumeText),
    keywords: extractKeywords(resumeText),
    structure: analyzeStructure(resumeText),
    achievements: extractAchievements(resumeText),
    contact: analyzeContactInfo(resumeText),
  };

  // Calculate comprehensive score
  const score = calculateAdvancedScore(analysis, resumeText);

  // Job matching if description provided
  const jobAnalysis = jobDescription
    ? analyzeJobMatch(analysis, jobDescription)
    : null;

  return {
    score: score,
    scoreExplanation: generateDetailedScoreExplanation(score, analysis),
    skills: analysis.skills.technical.concat(analysis.skills.soft).slice(0, 15),
    missingKeywords: jobAnalysis ? jobAnalysis.missingKeywords : [],
    recommendations: generateAdvancedRecommendations(analysis, jobAnalysis, score),
    strengths: identifyStrengths(analysis),
    weaknesses: identifyWeaknesses(analysis),
    atsScore: calculateATSScore(analysis),
    experienceLevel: determineExperienceLevel(analysis),
    industryMatch: identifyIndustry(analysis),
  };
}

function extractAdvancedSkills(text) {
  const textLower = text.toLowerCase();

  // Comprehensive technical skills database with variations
  const technicalSkills = {
    frontend: [
      "react", "reactjs", "react.js", "angular", "vue", "vuejs", "vue.js",
      "javascript", "typescript", "html", "css", "sass", "scss", "bootstrap",
      "tailwind", "material-ui", "chakra", "styled-components", "webpack",
      "vite", "babel", "jquery", "d3", "chart.js", "three.js"
    ],
    backend: [
      "nodejs", "node.js", "express", "nestjs", "fastify", "koa",
      "python", "django", "flask", "fastapi", "java", "spring", "spring boot",
      "c#", "asp.net", ".net", "php", "laravel", "symfony", "ruby", "rails",
      "go", "golang", "rust", "scala", "kotlin"
    ],
    databases: [
      "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite",
      "oracle", "sql server", "dynamodb", "cassandra", "elasticsearch",
      "firebase", "firestore", "supabase", "prisma", "sequelize", "mongoose"
    ],
    cloud: [
      "aws", "amazon web services", "azure", "gcp", "google cloud",
      "docker", "kubernetes", "k8s", "jenkins", "terraform", "ansible",
      "heroku", "vercel", "netlify", "digitalocean", "cloudflare"
    ],
    mobile: [
      "react native", "flutter", "swift", "kotlin", "ionic", "xamarin",
      "android", "ios", "mobile development", "app development"
    ],
    data: [
      "python", "r", "sql", "pandas", "numpy", "matplotlib", "seaborn",
      "scikit-learn", "tensorflow", "pytorch", "jupyter", "tableau",
      "power bi", "excel", "data analysis", "machine learning", "ai"
    ],
    devops: [
      "docker", "kubernetes", "jenkins", "gitlab ci", "github actions",
      "terraform", "ansible", "chef", "puppet", "monitoring", "logging",
      "prometheus", "grafana", "elk stack", "ci/cd", "devops"
    ],
    tools: [
      "git", "github", "gitlab", "bitbucket", "jira", "confluence",
      "slack", "teams", "figma", "sketch", "adobe", "photoshop",
      "illustrator", "indesign", "after effects", "premiere"
    ]
  };

  // Enhanced soft skills with variations
  const softSkills = [
    "leadership", "team leadership", "project management", "agile", "scrum",
    "communication", "verbal communication", "written communication",
    "teamwork", "collaboration", "cross-functional collaboration",
    "problem solving", "critical thinking", "analytical thinking",
    "strategic thinking", "creative thinking", "innovation",
    "time management", "organizational skills", "attention to detail",
    "adaptability", "flexibility", "learning agility", "growth mindset",
    "mentoring", "coaching", "training", "presentation", "public speaking",
    "client relations", "customer service", "stakeholder management",
    "conflict resolution", "negotiation", "decision making"
  ];

  const technical = [];
  const soft = [];

  // Extract technical skills with better matching
  Object.values(technicalSkills).flat().forEach((skill) => {
    const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (skillPattern.test(text)) {
      const formattedSkill = skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      technical.push(formattedSkill);
    }
  });

  // Extract soft skills with context awareness
  softSkills.forEach((skill) => {
    const skillPattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (skillPattern.test(text)) {
      const formattedSkill = skill.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      soft.push(formattedSkill);
    }
  });

  // Remove duplicates and similar skills
  const uniqueTechnical = [...new Set(technical)];
  const uniqueSoft = [...new Set(soft)];

  return { 
    technical: uniqueTechnical.slice(0, 12), 
    soft: uniqueSoft.slice(0, 8) 
  };
}

function extractAchievements(text) {
  const achievementPatterns = [
    /(?:increased|improved|reduced|achieved|delivered|managed|led|built|developed|created|designed|implemented)\s+[^.!?]*?(?:\d+%|\$[\d,]+|\d+\s*(?:million|thousand|users|customers|projects|teams))/gi,
    /\d+%\s*(?:increase|improvement|reduction|growth)/gi,
    /\$[\d,]+(?:\s*(?:million|thousand|k|m))?/gi,
    /(?:managed|led)\s+(?:team of\s+)?\d+/gi,
  ];

  const achievements = [];
  achievementPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      achievements.push(...matches.slice(0, 3));
    }
  });

  return [...new Set(achievements)].slice(0, 5);
}

function analyzeContactInfo(text) {
  const hasEmail = /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//.test(text);
  const hasGitHub = /github\.com\//.test(text);
  const hasPortfolio = /(?:portfolio|website|blog).*?(?:https?:\/\/|www\.)/.test(text);

  return {
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasGitHub,
    hasPortfolio,
    completeness: [hasEmail, hasPhone, hasLinkedIn].filter(Boolean).length
  };
}

function calculateAdvancedScore(analysis, resumeText) {
  let score = 0;
  const textLength = resumeText.length;

  // Skills scoring (40 points max) - More weight on skills
  const totalSkills = analysis.skills.technical.length + analysis.skills.soft.length;
  score += Math.min(35, totalSkills * 2);
  
  // Bonus for skill diversity
  if (analysis.skills.technical.length >= 8) score += 5;
  if (analysis.skills.soft.length >= 5) score += 5;

  // Experience scoring (25 points max)
  if (analysis.experience.years > 0) {
    score += Math.min(15, analysis.experience.years * 2);
  }
  if (analysis.experience.hasQuantifiableAchievements) score += 10;
  if (analysis.achievements.length > 0) score += 5;

  // Education scoring (15 points max)
  if (analysis.education.hasEducationSection) score += 8;
  if (analysis.education.hasAdvancedDegree) score += 5;
  if (analysis.education.hasCertifications) score += 3;

  // Structure and ATS scoring (15 points max)
  if (analysis.structure.hasContactInfo) score += 3;
  if (analysis.structure.hasSections) score += 4;
  if (analysis.structure.hasMetrics) score += 3;
  if (analysis.contact.completeness >= 2) score += 3;
  if (textLength > 800 && textLength < 3000) score += 2; // Optimal length

  // Content quality (10 points max)
  const keywordDensity = Object.keys(analysis.keywords).length;
  score += Math.min(5, keywordDensity);
  
  // Professional formatting bonus
  if (analysis.structure.avgLineLength > 30 && analysis.structure.avgLineLength < 120) score += 3;
  if (analysis.contact.hasLinkedIn || analysis.contact.hasGitHub) score += 2;

  return Math.min(100, Math.round(score));
}

function calculateATSScore(analysis) {
  let atsScore = 100;

  // Deduct points for ATS issues
  if (!analysis.structure.hasContactInfo) atsScore -= 20;
  if (!analysis.structure.hasSections) atsScore -= 15;
  if (analysis.structure.avgLineLength > 150) atsScore -= 10;
  if (analysis.skills.technical.length < 3) atsScore -= 15;
  if (!analysis.contact.hasEmail) atsScore -= 10;
  
  // Bonus for ATS-friendly elements
  if (analysis.contact.hasLinkedIn) atsScore += 5;
  if (analysis.structure.hasMetrics) atsScore += 5;

  return Math.max(0, Math.min(100, atsScore));
}

function determineExperienceLevel(analysis) {
  const years = analysis.experience.years;
  const skillCount = analysis.skills.technical.length + analysis.skills.soft.length;
  const hasLeadershipSkills = analysis.skills.soft.some(skill => 
    ['Leadership', 'Management', 'Mentoring'].includes(skill)
  );

  if (years >= 8 || (years >= 5 && hasLeadershipSkills)) return "Senior-level";
  if (years >= 3 || (years >= 2 && skillCount >= 10)) return "Mid-level";
  if (years >= 1 || skillCount >= 6) return "Junior-level";
  return "Entry-level";
}

function identifyIndustry(analysis) {
  const technicalSkills = analysis.skills.technical.map(s => s.toLowerCase());
  
  if (technicalSkills.some(s => ['react', 'javascript', 'nodejs', 'frontend', 'backend'].includes(s))) {
    return "Software Development";
  }
  if (technicalSkills.some(s => ['python', 'machine learning', 'tensorflow', 'pandas'].includes(s))) {
    return "Data Science";
  }
  if (technicalSkills.some(s => ['aws', 'docker', 'kubernetes', 'devops'].includes(s))) {
    return "DevOps/Cloud";
  }
  if (technicalSkills.some(s => ['photoshop', 'illustrator', 'figma', 'design'].includes(s))) {
    return "Design";
  }
  return "Technology";
}

function identifyStrengths(analysis) {
  const strengths = [];
  
  if (analysis.skills.technical.length >= 8) {
    strengths.push("Strong technical skill set with diverse expertise");
  }
  if (analysis.experience.hasQuantifiableAchievements) {
    strengths.push("Includes quantifiable achievements and metrics");
  }
  if (analysis.contact.completeness >= 3) {
    strengths.push("Complete professional contact information");
  }
  if (analysis.skills.soft.length >= 5) {
    strengths.push("Well-rounded soft skills profile");
  }
  if (analysis.education.hasAdvancedDegree) {
    strengths.push("Advanced educational background");
  }
  if (analysis.structure.hasSections) {
    strengths.push("Well-organized resume structure");
  }

  return strengths.slice(0, 4);
}

function identifyWeaknesses(analysis) {
  const weaknesses = [];
  
  if (analysis.skills.technical.length < 5) {
    weaknesses.push("Limited technical skills mentioned");
  }
  if (!analysis.experience.hasQuantifiableAchievements) {
    weaknesses.push("Lacks quantifiable achievements and metrics");
  }
  if (analysis.skills.soft.length < 3) {
    weaknesses.push("Few soft skills highlighted");
  }
  if (!analysis.structure.hasContactInfo) {
    weaknesses.push("Missing or incomplete contact information");
  }
  if (analysis.experience.years === 0) {
    weaknesses.push("No clear experience timeline mentioned");
  }
  if (!analysis.education.hasEducationSection) {
    weaknesses.push("Education section could be more detailed");
  }

  return weaknesses.slice(0, 3);
}

function generateAdvancedRecommendations(analysis, jobAnalysis, score) {
  const recommendations = [];

  // Priority recommendations based on biggest gaps
  if (analysis.skills.technical.length < 6) {
    recommendations.push("Expand technical skills section - aim for 8-12 relevant technologies");
  }

  if (!analysis.experience.hasQuantifiableAchievements) {
    recommendations.push("Add quantifiable achievements (e.g., 'Improved load times by 40%', 'Managed team of 5 developers')");
  }

  if (analysis.skills.soft.length < 4) {
    recommendations.push("Include more soft skills like leadership, communication, problem-solving, and teamwork");
  }

  // Job-specific recommendations
  if (jobAnalysis && jobAnalysis.missingKeywords.length > 0) {
    recommendations.push(`Include these job-relevant keywords: ${jobAnalysis.missingKeywords.slice(0, 4).join(", ")}`);
  }

  // Structure improvements
  if (!analysis.contact.hasLinkedIn && !analysis.contact.hasGitHub) {
    recommendations.push("Add LinkedIn profile and/or GitHub portfolio links");
  }

  if (analysis.structure.avgLineLength > 120) {
    recommendations.push("Use shorter, more concise bullet points for better readability");
  }

  // Experience-specific recommendations
  if (analysis.experience.years === 0) {
    recommendations.push("Highlight internships, projects, volunteer work, or freelance experience");
  }

  // Score-specific recommendations
  if (score < 60) {
    recommendations.push("Reorganize content to highlight most impressive achievements first");
    recommendations.push("Consider using action verbs like 'developed', 'implemented', 'optimized', 'led'");
  }

  if (!analysis.education.hasCertifications && analysis.skills.technical.length > 5) {
    recommendations.push("Consider adding industry certifications to validate your technical skills");
  }

  // ATS optimization
  if (calculateATSScore(analysis) < 80) {
    recommendations.push("Optimize for ATS by using standard section headers and avoiding complex formatting");
  }

  return recommendations.slice(0, 6);
}

function generateDetailedScoreExplanation(score, analysis) {
  const skillCount = analysis.skills.technical.length + analysis.skills.soft.length;
  const strengths = identifyStrengths(analysis);
  const weaknesses = identifyWeaknesses(analysis);

  if (score >= 85) {
    return `Outstanding resume with ${skillCount} skills detected. ${strengths.length > 0 ? strengths[0] : 'Strong professional profile'} with excellent structure and content quality.`;
  } else if (score >= 70) {
    return `Strong resume with ${skillCount} skills identified. ${strengths.length > 0 ? strengths[0] : 'Good foundation'} but ${weaknesses.length > 0 ? weaknesses[0].toLowerCase() : 'some improvements possible'}.`;
  } else if (score >= 55) {
    return `Good resume foundation with ${skillCount} skills found. ${weaknesses.length > 0 ? weaknesses[0] : 'Several areas for improvement identified'} - focus on the recommendations below.`;
  } else if (score >= 40) {
    return `Resume shows potential with ${skillCount} skills detected. ${weaknesses.length > 0 ? weaknesses[0] : 'Significant improvements needed'} to compete effectively in the job market.`;
  } else {
    return `Resume needs substantial improvement. Only ${skillCount} skills identified. Focus on adding technical skills, quantifiable achievements, and better structure.`;
  }
}

function analyzeExperience(text) {
  const textLower = text.toLowerCase();

  // Enhanced experience pattern matching
  const experiencePatterns = [
    /(\d+)(?:\+)?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/gi,
    /experience.*?(\d+)\s*(?:years?|yrs?)/gi,
    /(\d+)\s*(?:years?|yrs?).*?(?:experience|working|developing)/gi,
  ];

  const years = [];
  experiencePatterns.forEach((pattern) => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const yearMatch = match.match(/\d+/);
        if (yearMatch) years.push(parseInt(yearMatch[0]));
      });
    }
  });

  // Also try to infer from job dates
  const datePattern = /(?:20\d{2}|19\d{2})/g;
  const dates = text.match(datePattern);
  if (dates && dates.length >= 2) {
    const sortedDates = dates.map(d => parseInt(d)).sort((a, b) => b - a);
    const experienceFromDates = sortedDates[0] - sortedDates[sortedDates.length - 1];
    if (experienceFromDates > 0) years.push(experienceFromDates);
  }

  const maxYears = Math.max(...years, 0);

  // Enhanced seniority detection
  const seniorityKeywords = {
    "Senior": ["senior", "sr.", "lead", "principal", "staff", "chief", "head of", "director", "vp", "architect"],
    "Mid": ["developer", "engineer", "analyst", "specialist", "consultant", "coordinator"],
    "Junior": ["junior", "jr.", "intern", "trainee", "associate", "entry", "assistant", "graduate"]
  };

  let detectedLevel = "Entry";
  for (const [level, keywords] of Object.entries(seniorityKeywords)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      detectedLevel = level;
      break;
    }
  }

  return {
    years: maxYears,
    level: detectedLevel,
    hasQuantifiableAchievements: /\d+%|\$[\d,]+|\d+\s*(?:million|thousand|users|customers|projects|clients)/i.test(text),
  };
}

function analyzeEducation(text) {
  const textLower = text.toLowerCase();

  const degrees = [
    "phd", "ph.d", "doctorate", "doctoral",
    "masters", "master's", "mba", "ms", "ma", "msc",
    "bachelor", "bachelor's", "bs", "ba", "bsc", "btech", "be",
    "associate", "associates", "diploma", "certificate"
  ];

  const institutions = [
    "university", "college", "institute", "school", "academy",
    "mit", "stanford", "harvard", "berkeley", "caltech"
  ];

  const hasAdvancedDegree = ["phd", "ph.d", "doctorate", "masters", "master's", "mba"].some(degree =>
    textLower.includes(degree)
  );

  const hasEducationSection = institutions.some(inst => textLower.includes(inst)) ||
    degrees.some(degree => textLower.includes(degree));

  return {
    hasAdvancedDegree,
    hasEducationSection,
    hasCertifications: /certified|certification|license|credential|coursera|udemy|pluralsight/i.test(text),
  };
}

function extractKeywords(text) {
  // Industry-specific important keywords
  const importantKeywords = [
    "project", "team", "development", "design", "implementation",
    "management", "analysis", "optimization", "performance", "scalability",
    "security", "collaboration", "innovation", "solution", "strategy",
    "agile", "scrum", "deployment", "testing", "debugging", "architecture",
    "api", "database", "frontend", "backend", "fullstack", "responsive",
    "mobile", "web", "application", "software", "system", "platform"
  ];

  const keywordCounts = {};
  const textLower = text.toLowerCase();

  importantKeywords.forEach((keyword) => {
    const count = (textLower.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []).length;
    if (count > 0) keywordCounts[keyword] = count;
  });

  return keywordCounts;
}

function analyzeStructure(text) {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);

  // Better section detection
  const sections = [
    "experience", "work experience", "employment", "career",
    "education", "academic", "learning",
    "skills", "technical skills", "competencies",
    "projects", "portfolio", "accomplishments",
    "certifications", "licenses", "awards"
  ];

  const hasGoodSections = sections.filter(section => 
    text.toLowerCase().includes(section)
  ).length >= 3;

  return {
    totalLength: text.length,
    lineCount: lines.length,
    hasContactInfo: /email|phone|linkedin|github/i.test(text),
    hasSections: hasGoodSections,
    hasMetrics: /\d+%|\$\d+|\d+\s*(?:million|thousand|users)/i.test(text),
    avgLineLength: lines.length > 0 ? lines.reduce((sum, line) => sum + line.length, 0) / lines.length : 0,
    hasActionVerbs: /\b(?:developed|implemented|managed|led|created|designed|optimized|improved|increased|reduced|achieved|delivered|built)\b/i.test(text)
  };
}

function analyzeJobMatch(resumeAnalysis, jobDescription) {
  const jobLower = jobDescription.toLowerCase();
  const resumeSkills = resumeAnalysis.skills.technical.concat(resumeAnalysis.skills.soft);

  // Extract required skills from job description with better patterns
  const jobSkills = extractAdvancedSkills(jobDescription);
  const allJobSkills = jobSkills.technical.concat(jobSkills.soft);

  // Extract specific keywords from job description
  const jobKeywords = extractJobRequirements(jobDescription);

  // Find missing skills
  const missingSkills = allJobSkills.filter(
    (jobSkill) =>
      !resumeSkills.some(
        (resumeSkill) => resumeSkill.toLowerCase() === jobSkill.toLowerCase()
      )
  );

  // Find missing keywords
  const missingKeywords = jobKeywords.filter(keyword =>
    !resumeAnalysis.extractedText.toLowerCase().includes(keyword.toLowerCase())
  );

  const allMissing = [...missingSkills, ...missingKeywords];

  return {
    missingKeywords: [...new Set(allMissing)].slice(0, 10),
    matchPercentage: Math.round(
      ((resumeSkills.length + Object.keys(resumeAnalysis.keywords).length) / 
       Math.max(allJobSkills.length + jobKeywords.length, 1)) * 100
    ),
  };
}

function extractJobRequirements(jobDescription) {
  const text = jobDescription.toLowerCase();
  
  // Common requirement patterns
  const requirementPatterns = [
    /(?:required|must have|essential)[\s\S]*?(?=(?:preferred|nice|bonus|\.|\n\n))/gi,
    /(?:experience with|proficiency in|knowledge of)\s+([^.\n]+)/gi,
    /\b(?:minimum|at least)\s+(\d+)\s+years?\s+(?:of\s+)?experience/gi,
  ];

  const requirements = [];
  requirementPatterns.forEach(pattern => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Extract key terms from requirements
        const words = match.toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(word => word.length > 3);
        requirements.push(...words);
      });
    }
  });

  return [...new Set(requirements)].slice(0, 15);
}

// Alternative analysis for when everything fails
function createBasicFallbackAnalysis(resumeText, jobDescription) {
  console.log("🔧 Running basic fallback analysis...");
  
  const basicSkills = [
    "JavaScript", "Python", "React", "Node.js", "SQL", "Git",
    "HTML", "CSS", "Communication", "Teamwork", "Problem Solving"
  ];
  
  const detected = basicSkills.filter((skill) =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );

  // Generate a more realistic score based on content length and detected skills
  const contentScore = Math.min(40, resumeText.length / 50);
  const skillScore = detected.length * 8;
  const baseScore = Math.min(85, contentScore + skillScore);

  return {
    score: Math.max(25, baseScore),
    scoreExplanation: `Analysis completed with ${detected.length} skills detected. ${
      baseScore < 50 ? 'Consider adding more technical details and quantifiable achievements.' : 
      baseScore < 70 ? 'Good foundation - focus on highlighting key accomplishments.' :
      'Strong profile with room for minor improvements.'
    }`,
    skills: detected.length > 0 ? detected : ["Communication", "Teamwork", "Problem Solving"],
    missingKeywords: jobDescription ? 
      ["Project Management", "Leadership", "Technical Documentation"] : [],
    recommendations: [
      "Add specific technical skills and tools you've used",
      "Include quantifiable achievements with numbers and percentages", 
      "Highlight leadership and collaboration experiences",
      "Use action verbs to describe your accomplishments",
      "Ensure contact information is complete and professional"
    ],
    strengths: detected.length > 3 ? 
      ["Diverse skill set identified", "Clear technical background"] : 
      ["Professional presentation", "Clear structure"],
    weaknesses: detected.length < 3 ? 
      ["Limited technical skills shown", "Needs more specific details"] : 
      ["Could benefit from more quantifiable metrics"],
    atsScore: resumeText.length > 500 ? 75 : 60,
    experienceLevel: resumeText.length > 1000 ? "Mid-level" : "Entry-level",
    industryMatch: detected.some(s => ['JavaScript', 'React', 'Python'].includes(s)) ? 
      "Technology" : "General"
  };
}

module.exports = { analyzeWithAI };
    