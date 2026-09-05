import { AIClassification, GovernmentScheme, ProblemCluster, SeverityLevel } from "../types";
import { INITIAL_CATEGORIES } from "../mockData/categories";
import { GOVERNMENT_SCHEMES } from "../mockData/schemes";

export interface ConversationMessage {
  id: string;
  sender: "citizen" | "ai";
  text: string;
  timestamp: string;
  photoUrl?: string;
  location?: { district: string; block?: string; village?: string };
  audioSimulated?: boolean;
  classification?: AIClassification;
  showConfirmationButtons?: boolean;
  options?: string[];
  recommendedSchemes?: GovernmentScheme[];
}

// Function to call server-side Gemini if active
export async function callGeminiIfAvailable(
  message: string,
  history: ConversationMessage[],
  context?: any
): Promise<string | null> {
  try {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, context }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.available && data.reply) {
      return data.reply;
    }
  } catch {
    // Graceful fallback to local engine
  }
  return null;
}

// Semantic keyword matching engine for Hindi, Hinglish, and English
export function classifyComplaint(
  input: string,
  location?: { state?: string; district?: string; block?: string; village?: string },
  photoUrl?: string,
  similarCount: number = 0
): AIClassification {
  const lower = input.toLowerCase();

  // Find matching category
  let matchedCat = INITIAL_CATEGORIES[INITIAL_CATEGORIES.length - 1]; // default 'other'
  let highestScore = 0;

  for (const cat of INITIAL_CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    if (lower.includes(cat.name.toLowerCase()) || lower.includes(cat.hindiName.toLowerCase())) {
      score += 4;
    }
    if (score > highestScore) {
      highestScore = score;
      matchedCat = cat;
    }
  }

  // Find best subcategory
  let matchedSub = matchedCat.subcategories[0]?.name || "General Issue";
  let defaultSev = matchedCat.subcategories[0]?.defaultSeverity || "Medium";

  for (const sub of matchedCat.subcategories) {
    const subWords = sub.name.toLowerCase().split(" ");
    let subMatches = 0;
    for (const w of subWords) {
      if (w.length > 3 && lower.includes(w)) subMatches++;
    }
    if (subMatches > 0) {
      matchedSub = sub.name;
      defaultSev = sub.defaultSeverity;
      break;
    }
  }

  // Determine severity based on contextual indicators
  let severity: SeverityLevel = defaultSev;
  let severityReason = `Standard assessment for ${matchedCat.name}.`;

  const isCriticalWord = lower.includes("danger") || lower.includes("khatra") || lower.includes("spark") || lower.includes("burst") || lower.includes("collapsed") || lower.includes("poison") || lower.includes("death") || lower.includes("accident") || lower.includes("emergency");
  const isWidespread = lower.includes("poore area") || lower.includes("poore gaon") || lower.includes("entire village") || lower.includes("mohalla") || lower.includes("har ghar") || lower.includes("all houses");

  if (isCriticalWord) {
    severity = "Critical";
    severityReason = "Immediate public safety / life hazard detected in citizen report.";
  } else if (isWidespread || similarCount >= 10) {
    severity = "High";
    severityReason = similarCount >= 10
      ? `High priority because ${similarCount} similar complaints were reported from this area.`
      : "High priority because report indicates area-wide disruption impacting multiple households.";
  } else if (lower.includes("minor") || lower.includes("chhota") || lower.includes("individual")) {
    severity = "Low";
    severityReason = "Individual/localized request with standard operational turnaround.";
  }

  // Confidence calculation
  const confidence = Math.min(98, Math.max(72, 70 + highestScore * 4));

  // Required information check
  const requiredInfo: string[] = [];
  if (!location?.district) requiredInfo.push("District & Village / Ward Location");
  if (!photoUrl) requiredInfo.push("Photographic proof of issue (recommended)");
  if (matchedCat.id === "scholarship") requiredInfo.push("College Bonafide / e-Kalyan Application No.");
  if (matchedCat.id === "pension") requiredInfo.push("Pensioner Account / Aadhaar Reference");
  if (matchedCat.id === "pds") requiredInfo.push("Ration Card Number / Dealer Name");

  // Expected resolution date calculation
  const slaDays = matchedCat.defaultSlaDays;
  const expDate = new Date(Date.now() + slaDays * 24 * 3600 * 1000);

  return {
    category: matchedCat.name,
    subcategory: matchedSub,
    problemSummary: generateSummary(input, matchedCat.name, matchedSub),
    severity,
    severityReason,
    location: {
      state: location?.state || "Jharkhand",
      district: location?.district || "Ranchi",
      block: location?.block || "Sadar",
      village: location?.village || "Ward 12",
    },
    department: matchedCat.department,
    slaDays,
    expectedResolutionDate: expDate.toISOString().split("T")[0],
    requiredInformation: requiredInfo,
    suggestedNextStep: `Issue will be routed to ${matchedCat.department} with a formal SLA deadline of ${slaDays} working days.`,
    confidence,
  };
}

// Problem Summary Generator
export function generateSummary(text: string, category: string, subcategory: string): string {
  const clean = text.replace(/[\n\r]+/g, " ").trim();
  if (clean.length > 120) {
    return `${category} [${subcategory}]: "${clean.slice(0, 115)}..."`;
  }
  return `${category} [${subcategory}]: "${clean}"`;
}

// Clarifying questions detector
export function askClarifyingQuestion(
  input: string,
  turnCount: number,
  currentLocation?: { district: string; block?: string; village?: string }
): { needsQuestion: boolean; questionHindi: string; questionEnglish: string; options?: string[] } {
  const lower = input.toLowerCase();

  // Street light scenario
  if ((lower.includes("street light") || lower.includes("light")) && turnCount === 1) {
    return {
      needsQuestion: true,
      questionHindi: "Samajh gayi. Ye public lighting se related problem lag rahi hai. Kya ye ek street light ki problem hai ya poore area ki?",
      questionEnglish: "Understood. This seems to be related to public lighting. Is this an issue with a single street light or the entire area?",
      options: ["Poore area ki (Entire area)", "Sirf ek khamba / single light", "Transformer se problem hai"],
    };
  }

  // Water scenario
  if ((lower.includes("paani") || lower.includes("water") || lower.includes("nal")) && turnCount === 1) {
    return {
      needsQuestion: true,
      questionHindi: "Samajh gayi. Paani ki samasya kafi gambhir hoti hai. Kya pipeline toot gayi hai, handpump kharab hai, ya paani ki supply hi band hai?",
      questionEnglish: "Understood. Water issues are critical. Is there a broken pipeline, broken handpump, or complete supply stoppage?",
      options: ["Supply poori tarah band hai", "Handpump kharab hai", "Pipeline phoot gayi hai / leak", "Paani ganda aa raha hai"],
    };
  }

  // Scholarship scenario
  if ((lower.includes("scholarship") || lower.includes("ekalyan") || lower.includes("chhatravriti")) && turnCount === 1) {
    return {
      needsQuestion: true,
      questionHindi: "Maine note kar liya hai. Kya aap bata sakte hain ki aapne kaunsi scholarship (e-Kalyan / NSP / Pragati) apply ki thi aur portal par kya status dikh raha hai?",
      questionEnglish: "Noted. Could you tell me which scholarship (e-Kalyan / NSP / Pragati) you applied for and what status you see on the portal?",
      options: ["e-Kalyan Post-Matric (Approved par paisa nahi aaya)", "NSP Central Sector", "Institute verification stuck", "Bank DBT / Aadhaar link error"],
    };
  }

  // Pension scenario
  if ((lower.includes("pension") || lower.includes("vridha") || lower.includes("vidhwa")) && turnCount === 1) {
    return {
      needsQuestion: true,
      questionHindi: "Pashchimi aur samajik suraksha pension ke liye: Kya pichle mahinon ki pension ruki hai ya naya aavedan approve nahi hua?",
      questionEnglish: "For social security pension: Has an ongoing monthly pension stopped, or is a new application pending approval?",
      options: ["Pehle aati thi, ab ruk gayi", "Biometric / Life certificate issue", "Naya aavedan 3 mahine se pending", "Bank account issue"],
    };
  }

  // Missing location
  if (!currentLocation?.district && turnCount >= 2) {
    return {
      needsQuestion: true,
      questionHindi: "Theek hai. Aap Jharkhand ke kis jile (district) aur gaon/ward ki baat kar rahe hain?",
      questionEnglish: "Understood. Which district and village/ward in Jharkhand are you referring to?",
      options: ["Bokaro", "Ranchi", "Dhanbad", "East Singhbhum", "Hazaribagh", "Latehar"],
    };
  }

  return {
    needsQuestion: false,
    questionHindi: "",
    questionEnglish: "",
  };
}

// Scheme Recommendation Engine
export function recommendSchemes(profile: {
  isStudent?: boolean;
  isFarmer?: boolean;
  isWoman?: boolean;
  isSenior?: boolean;
  isTribal?: boolean;
  course?: string;
  category?: string;
  query?: string;
}): { scheme: GovernmentScheme; matchReason: string }[] {
  const results: { scheme: GovernmentScheme; matchReason: string }[] = [];
  const q = (profile.query || "").toLowerCase();

  for (const sch of GOVERNMENT_SCHEMES) {
    let matches = false;
    let reason = "General public eligibility match.";

    if (profile.isStudent || q.includes("student") || q.includes("scholarship") || q.includes("b.tech") || q.includes("college")) {
      if (sch.targetAudience.includes("Students") || sch.isScholarship) {
        matches = true;
        reason = "Matched your student profile & higher education enrollment.";
      }
    }

    if (profile.isFarmer || q.includes("kisan") || q.includes("farmer") || q.includes("kheti")) {
      if (sch.targetAudience.includes("Farmers") || sch.category === "Agriculture") {
        matches = true;
        reason = "Matched your agricultural & land cultivation profile.";
      }
    }

    if (profile.isSenior || q.includes("vridha") || q.includes("senior") || q.includes("pension") || q.includes("old age")) {
      if (sch.targetAudience.includes("Senior Citizens") || sch.category === "Pension") {
        matches = true;
        reason = "Matched your senior citizen & social security profile.";
      }
    }

    if (profile.isWoman || q.includes("mahila") || q.includes("girl") || q.includes("women") || q.includes("kanya")) {
      if (sch.targetAudience.includes("Women")) {
        matches = true;
        reason = "Matched women empowerment & financial inclusion initiative.";
      }
    }

    if (matches) {
      results.push({ scheme: sch, matchReason: reason });
    }
  }

  // If no direct filters matched, return top 3 general schemes
  if (results.length === 0) {
    return GOVERNMENT_SCHEMES.slice(0, 3).map((s) => ({
      scheme: s,
      matchReason: "Broad civic benefit scheme for Jharkhand residents.",
    }));
  }

  return results;
}

// Problem Clustering Detector
export function detectCluster(
  category: string,
  district: string,
  existingComplaints: { id: string; category: string; district: string; title: string }[]
): { isCluster: boolean; count: number; clusterTitle?: string } {
  const matches = existingComplaints.filter(
    (c) => c.category.toLowerCase() === category.toLowerCase() && c.district.toLowerCase() === district.toLowerCase()
  );

  return {
    isCluster: matches.length >= 3,
    count: matches.length + 1,
    clusterTitle: `${category} cluster in ${district}`,
  };
}
