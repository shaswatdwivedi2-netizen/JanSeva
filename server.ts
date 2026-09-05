import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3035;
  app.use(express.json({ limit: "10mb" }));

  let aiClient: GoogleGenAI | null = null;
  function getAI(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      try {
        aiClient = new GoogleGenAI();
      } catch (e) {
        console.warn("Failed to initialize GoogleGenAI client:", e);
      }
    }
    return aiClient;
  }

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Server-side Gemini API conversational endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history, context } = req.body;
      const ai = getAI();
      if (!ai) {
        return res.json({
          available: false,
          reply: null,
          note: "Gemini API key not configured, local engine active",
        });
      }

      const systemInstruction = `You are "Samadhan Didi", an empathetic, respectful, and highly intelligent AI government grievance and civic service assistant for JANSEVA (Aapki Samasya, Samadhan ki Ore).
Your goal is to understand any citizen problem naturally in Hindi/Hinglish or English.
Guidelines:
1. Speak in a warm, respectful tone (Namaste, Samajh gayi, etc.)
2. Understand what the issue is without assuming. If critical information (location, specific issue details, individual vs area) is missing, ask 1 concise clarifying question.
3. When you have enough detail, offer to register the complaint and provide a structured classification with:
   - Category (e.g. Water, Electricity, Roads, Sanitation, Health, Education, Scholarship, Pension, PDS / Ration, Agriculture, Public Infrastructure, etc.)
   - Subcategory
   - Severity (Critical, High, Medium, Low)
   - Suggested Department
   - Required information
4. Keep answers concise, clear, and empathetic.`;

      const contents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.sender === "citizen" ? "user" : "model",
            parts: [{ text: item.text }],
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message + (context ? `\n[Context: ${JSON.stringify(context)}]` : "") }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.4,
          maxOutputTokens: 600,
        },
      });

      const text = response.text || "";
      res.json({
        available: true,
        reply: text,
      });
    } catch (err: any) {
      console.error("Gemini API error in /api/ai/chat:", err);
      res.status(500).json({
        available: false,
        error: err.message,
      });
    }
  });

  // Vite middleware for dev or static serving in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JANSEVA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
