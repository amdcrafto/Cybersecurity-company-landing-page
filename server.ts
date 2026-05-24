import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing middleware
  app.use(express.json());

  // Safe lazy-initialization of GoogleGenAI
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("SECURELOCK: Gemini API client successfully initialized.");
    } catch (e) {
      console.error("SECURELOCK: Failed to initialize Gemini API client:", e);
    }
  } else {
    console.warn("SECURELOCK: GEMINI_API_KEY is not defined. Falling back to simulated offline security advisory mode.");
  }

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, history } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // If AI Client is not initialized, generate high-quality security analyst responses locally
      if (!ai) {
        const offlineResponse = generateOfflineResponse(prompt);
        return res.json({
          text: offlineResponse,
          isOffline: true
        });
      }

      // Convert history to format appropriate for contents or use simple prompt
      // Let's build a contextualized prompt including recent conversation logs
      let contextualPrompt = "System Instruction: You are the Lead AI Threat Analyst at SECURELOCK Digital Defense. You provide high-precision, technical, and protective advice on cyber security. Keep explanations professional, sleek, objective, list clear actionable mitigation steps, and avoid conversational fluff.\n\n";
      
      if (history && history.length > 0) {
        contextualPrompt += "Previous conversation history:\n";
        history.forEach((msg: any) => {
          contextualPrompt += `${msg.role === "user" ? "Client" : "Analyst"}: ${msg.content}\n`;
        });
        contextualPrompt += "\n";
      }
      
      contextualPrompt += `Current Client Query: ${prompt}\n\nSECURELOCK Analyst response:`;

      const result = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contextualPrompt,
      });

      res.json({
        text: result.text || "Analyzed query. Action thresholds stable.",
        isOffline: false
      });
    } catch (error: any) {
      console.error("Error invoking Gemini:", error);
      res.json({
        text: `SecureLock threat analysis service encountered an API constraint. Actionable advice: Verify ports are shielded (TCP 443/80 active) and ensure credentials are correct.\n\nError details: ${error.message || error}`,
        isOffline: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Support SPA router fallback on Catch All
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SECURELOCK Full-Stack server booted at http://0.0.0.0:${PORT} [Vite proxy configured]`);
  });
}

// Simulated local intelligence engine for Offline Mode
function generateOfflineResponse(prompt: string): string {
  const query = prompt.toLowerCase();
  
  if (query.includes("vanguard") || query.includes("financial")) {
    return `### [SECURELOCK INTELLIGENCE ADVISORY]
**Subject:** Status Report on Project Vanguard (Financial Sector Coverage)

**Current Integrity Status:** 100% SECURE (Shields Level Alpha)
- **Active Endpoints:** 2,450 / 2,450 matched in cluster
- **Recent Threats Prevented:** 4 intrusion attempts (DDoS payload rejected, port scan blocked on target gateway SQL range)
- **Mitigation Action Protocol:** Standard threshold triggers automatic zero-trust network segregation if anomaly exceeds 4.2% deviation threshold.

**Recommendations:**
1. Ensure all TLS sessions require TLS 1.3 matching modern banking criteria.
2. Conduct key rotation on HSM credentials within 48 hours.`;
  }
  
  if (query.includes("aegis") || query.includes("infrastructure") || query.includes("critical")) {
    return `### [SECURELOCK TECHNICAL DIRECTIVE]
**Subject:** Status Report on Operation Aegis (Critical Infrastructure Grid)

**Grid Isolation Matrix:** 98.7% SECURE (Shields Level Beta)
- **Supervisory Control (SCADA) Integrity:** Monitored via absolute hardware diodes.
- **Recent Mitigation:** Rejected unauthorized PLC packet write request at 03:14:02 UTC.
- **Incident Response Priority:** Level 1 (Severe) protocol defined for state-sponsored telemetry warnings.

**Immediate Guidance:**
1. Maintain unilateral strict air-gapped routing for non-operational management nodes.
2. Filter ingress boundaries to allow only verified SCADA IP ranges.`;
  }

  if (query.includes("ddos") || query.includes("traffic") || query.includes("mitigate")) {
    return `### [THREAT VECTOR MITIGATION REPORT]
**Incident Vector Detected:** Distributed Denial of Service (Payload analysis matches HTTP Flood / Syn-Flood mixture)

**Actionable Defensive Sequence:**
1. **Dynamic BGP Anycast Routing:** Shifts volume load outward across international threat absorption scrubs.
2. **Rate Limiting Configuration:** Bind threshold values of 1,000 req/sec per Client IP footprint at the proxy level.
3. **Deep Packet Inspection (DPI):** Verify User-Agent headers and enforce client challenge verification (JS challenge).

*Advice generated by SecureLock Offline Policy database Engine.*`;
  }

  return `### SECURELOCK Digital Defense Analyst Response

Thank you for contacting SecureLock operations center. I am running in **Secure Offline Mode** inside this environment.

Here is a quick cybersecurity assessment based on your query:
1. **Perimeter Audit:** We recommend a perimeter audit to review all public-facing HTTP/HTTPS endpoints.
2. **Zero Trust Principles:** Implement minimum-privilege access criteria across cloud resource roles.
3. **Continuous Logs Analysis:** Inspect login events on critical active firewalls for anomalous spikes after hours.

*To activate full real-time Gemini Threat Scanning and personalized advice, please configure your \`GEMINI_API_KEY\` under the **Settings > Secrets** panel in AI Studio.*`;
}

startServer();
