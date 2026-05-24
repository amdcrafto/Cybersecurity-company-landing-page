/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Activity, 
  Terminal as TerminalIcon, 
  Layers, 
  Globe, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowRight, 
  Sun, 
  Moon, 
  Cpu, 
  Play, 
  Pause, 
  Sparkles, 
  Check, 
  Send,
  Database,
  Zap,
  Server,
  ShieldCheck,
  Radio,
  FileCode,
  LockKeyhole
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  BarChart,
  Bar
} from "recharts";
import { Theme, SecurityMetric, ThreatCategory, DeploymentStatus, LiveLockLog, ChatMessage } from "./types";
import { ASSETS, INITIAL_METRICS, INITIAL_THREATS, INITIAL_DEPLOYMENTS, INITIAL_LOGS, generateLiveLog } from "./data";

export default function App() {
  // Navigation tabs: "marketing" (landing platform), "intelligence" (telemetry dashboard), "solutions" (ai core analyst)
  const [activeTab, setActiveTab] = useState<"platform" | "intelligence" | "solutions">("platform");
  const [theme, setTheme] = useState<Theme>(() => {
    // Attempt standard client-side persistence
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("securelock-theme");
      if (stored === "light" || stored === "dark") return stored;
    }
    return "dark";
  });

  // Security stats ticker
  const [totalBlocked, setTotalBlocked] = useState(142492);
  const [cyberShieldActive, setCyberShieldActive] = useState(true);
  
  // Custom interactive parameters
  const [scrubMultiplier, setScrubMultiplier] = useState<number>(1.5);
  const [selectedNode, setSelectedNode] = useState<string>("US-East core");
  const [activeSimulation, setActiveSimulation] = useState<"syn_flood" | "scada_tamper" | "api_burst" | null>(null);
  const [vanguardLockLevel, setVanguardLockLevel] = useState<"standard" | "elevated" | "maximum">("standard");
  const [aegisLockLevel, setAegisLockLevel] = useState<"standard" | "elevated" | "maximum">("elevated");

  // Controls state for Active Deployments
  const [deployments, setDeployments] = useState<DeploymentStatus[]>(INITIAL_DEPLOYMENTS);
  const [focusedDeployment, setFocusedDeployment] = useState<"vanguard" | "aegis" | null>(null);

  // Live packet log states
  const [logs, setLogs] = useState<LiveLockLog[]>(INITIAL_LOGS);
  const [isLogPaused, setIsLogPaused] = useState(false);
  const [logFilter, setLogFilter] = useState<"all" | "info" | "warn" | "critical">("all");

  // AI Chat Consultant states
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "analyzer",
      content: "SecureLock Threat Assessment Node online. Integrated with Vanguard Financial Hub & Operation Aegis SCADA monitors. Ask me to run safety audits, review active rules, or write security patches.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync theme selection to localStorage and body root styles
  useEffect(() => {
    localStorage.setItem("securelock-theme", theme);
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  // Live total blocks increment animation
  useEffect(() => {
    const timer = setInterval(() => {
      if (cyberShieldActive) {
        // Multiplier from slider scales threat scrubbing speeds
        const scaleFactor = Math.floor(Math.random() * 4 * scrubMultiplier) + 1;
        setTotalBlocked(prev => prev + scaleFactor);
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [cyberShieldActive, scrubMultiplier]);

  // Live cyber log simulation scrolling in
  useEffect(() => {
    if (isLogPaused || !cyberShieldActive) return;
    const logTimer = setInterval(() => {
      const nextLog = generateLiveLog();
      // Inject some custom log modifiers based on interactive strictness slider
      if (scrubMultiplier > 3) {
        nextLog.message = `[DEEP_PACKET_INSPECT] ${nextLog.message} [Strictness ${scrubMultiplier}x Enabled]`;
      }
      setLogs(prev => [nextLog, ...prev].slice(0, 20));
    }, Math.max(1000, 4500 - (scrubMultiplier * 800))); // Speed scales with strictness
    return () => clearInterval(logTimer);
  }, [isLogPaused, cyberShieldActive, scrubMultiplier]);

  // Auto scroll AI chat thread
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const toggleShield = () => {
    setCyberShieldActive(!cyberShieldActive);
    const timeStr = new Date().toLocaleTimeString();
    
    // Inject system alert in terminal logs
    const actionLog: LiveLockLog = {
      id: Math.random().toString(),
      timestamp: timeStr,
      source: "CARBON_HUB_CORE",
      severity: cyberShieldActive ? "critical" : "info",
      message: cyberShieldActive 
        ? "ALERT: ZERO-TRUST SHIELD SUSPENDED. External ports open to testing probes." 
        : "SHIELD LOCKED: Carbon cryptographic filters fully activated. Threat surfaces sealed.",
      port: 0
    };
    setLogs(prev => [actionLog, ...prev]);
  };

  // Switch policy configuration on an active deployment
  const changeDeploymentShield = (id: "vanguard" | "aegis", shields: "standard" | "elevated" | "maximum") => {
    if (id === "vanguard") setVanguardLockLevel(shields);
    if (id === "aegis") setAegisLockLevel(shields);

    setDeployments(prev => prev.map(dep => {
      if (dep.id === id) {
        const prevShields = dep.activeShields;
        
        // Log changes
        const timeStr = new Date().toLocaleTimeString();
        const actionLog: LiveLockLog = {
          id: Math.random().toString(),
          timestamp: timeStr,
          source: dep.name.toUpperCase().replace(" ", "_"),
          severity: shields === "maximum" ? "info" : "warn",
          message: `Zero-trust routing threshold escalated to [${shields.toUpperCase()}]. Blocked all unverified JWT tokens.`,
          port: dep.id === "vanguard" ? 443 : 502
        };
        setLogs(prevLogs => [actionLog, ...prevLogs]);

        return {
          ...dep,
          activeShields: shields,
          status: shields === "maximum" ? "secure" : "monitoring"
        };
      }
      return dep;
    }));
  };

  // Submit AI consultancy question
  const handleSendChatMessage = async (text: string) => {
    if (!text.trim() || isChatLoading) return;
    
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // API request to server.ts backend proxy
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          // Extract last few elements of history
          history: chatHistory.slice(-5).map(m => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      const analyzerMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "analyzer",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory(prev => [...prev, analyzerMsg]);
    } catch (err) {
      console.error("Failed to query analyzer API:", err);
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "analyzer",
        content: "SecureLock Server link bypassed. Initialized emergency client-side heuristic responses for backup mitigation.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // New multi-option interactive attack simulators
  const triggerAttackType = (type: "syn_flood" | "scada_tamper" | "api_burst") => {
    const timeStr = new Date().toLocaleTimeString();
    setActiveSimulation(type);

    let source = "";
    let message = "";
    let port = 80;
    let blockedDelta = 1200;

    if (type === "syn_flood") {
      source = "VAN_GW_DDoS";
      message = "WARNING: Heavy traffic ingress anomaly (5.8 Gbps SYN patterns) on Port 443 Vanguard. Activating real-time scrub diodes.";
      port = 443;
      blockedDelta = 3800;
    } else if (type === "scada_tamper") {
      source = "AEGIS_PLC_04";
      message = "CRITICAL: Unauthorized register write stream detected on Modbus Address 40109. Initiating automatic port-diode air-gapping.";
      port = 502;
      blockedDelta = 820;
    } else {
      source = "API_THROTTLE";
      message = "NOTICE: Volumetric request burst (450 req/sec) from anonymous address block. Activating Token Bucket rate limiters.";
      port = 8080;
      blockedDelta = 1900;
    }

    const attackLog: LiveLockLog = {
      id: Math.random().toString(),
      timestamp: timeStr,
      source,
      severity: "critical",
      message,
      port
    };

    setLogs(prev => [attackLog, ...prev]);
    setTotalBlocked(prev => prev + blockedDelta);

    // Append AI notification
    setChatHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        role: "analyzer",
        content: `### [THREAT DISPATCHER: ENFORCED]\nAn interactive simulation alert **[${type.toUpperCase()}]** has been registered.\nStandard SecureLock protocols deflected **${blockedDelta} attempts** on Port ${port} successfully. Integrity status: SOLID.`,
        timestamp: timeStr
      }
    ]);

    // Automatically transition warning indicator out
    setTimeout(() => {
      setActiveSimulation(null);
    }, 4000);
  };

  // Maintain fallback method
  const triggerSimulatedAttack = () => {
    triggerAttackType("syn_flood");
  };

  // Filter logs list based on user filter tab choice
  const filteredLogs = logs.filter(log => {
    if (logFilter === "all") return true;
    return log.severity === logFilter;
  });

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-x-hidden ${
      theme === "dark" 
        ? "bg-[#06070a] text-zinc-100 bg-[linear-gradient(to_right,#141721_1px,transparent_1px),linear-gradient(to_bottom,#141721_1px,transparent_1px)] bg-[size:44px_44px]" 
        : "bg-[#FAFAFA] text-zinc-800 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:44px_44px]"
    }`}>
      
      {/* GLOBAL SIMULATION WARNING BANNER (Interactive Alert Overlay) */}
      <AnimatePresence>
        {activeSimulation && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="fixed top-20 left-4 right-4 md:left-1/2 md:right-auto md:w-[600px] md:-ml-[300px] z-50 p-4 rounded-md border bg-black/95 text-red-400 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.3)] flex items-center gap-4"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30 animate-pulse">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <span className="font-mono text-xs text-red-500 uppercase font-bold tracking-widest block mb-0.5">ACTIVE INTRUSION THWARTED</span>
              <p className="font-mono text-[11px] leading-relaxed text-zinc-350">
                Type: <span className="text-white font-bold">{activeSimulation.toUpperCase()}</span> // Scrubber isolated anomaly logs instantly. Live total indices updated.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
        theme === "dark" 
          ? "border-[#1F242E] bg-[#06070a]/90" 
          : "border-zinc-200 bg-white/90"
      }`}>
        <div id="navbar-container" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <div>
              <span className="font-sans text-lg font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
                SecureLock
              </span>
            </div>
          </div>

          {/* Central Tabs Navigation - Sleeker sliding background pill style */}
          <nav className="hidden md:flex items-center gap-2 bg-zinc-800/10 dark:bg-zinc-900/45 p-1 rounded-md border border-zinc-200 dark:border-[#1F242E]">
            {(["platform", "intelligence", "solutions"] as const).map((tabId) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`relative px-4 py-2 font-sans text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer ${
                  activeTab === tabId
                    ? (theme === "dark" ? "text-zinc-100" : "text-zinc-900")
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <span className="relative z-10">{tabId === "solutions" ? "AI ANALYST" : tabId}</span>
                {activeTab === tabId && (
                  <motion.div 
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-zinc-200/60 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right Accessories Block */}
          <div className="flex items-center gap-3">
            
            {/* Tone Dark/Light Switcher */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle Theme Mode"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 dark:border-[#1F242E] bg-white dark:bg-[#0D0F14] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Theme modes indicator and toggle control */}
          </div>
        </div>
      </header>

      {/* MOBILE TAB DRAWER */}
      <div className={`md:hidden flex border-b transition-colors ${
        theme === "dark" ? "border-zinc-800 bg-[#0D0F14]" : "border-zinc-200 bg-white"
      }`}>
        <button 
          onClick={() => setActiveTab("platform")}
          className={`flex-1 py-3 text-center text-xs font-mono tracking-wider cursor-pointer ${
            activeTab === "platform" ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 font-bold" : "text-zinc-500"
          }`}
        >
          PLATFORM
        </button>
        <button 
          onClick={() => setActiveTab("intelligence")}
          className={`flex-1 py-3 text-center text-xs font-mono tracking-wider cursor-pointer ${
            activeTab === "intelligence" ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 font-bold" : "text-zinc-500"
          }`}
        >
          INTELLIGENCE
        </button>
        <button 
          onClick={() => setActiveTab("solutions")}
          className={`flex-1 py-3 text-center text-xs font-mono tracking-wider cursor-pointer ${
            activeTab === "solutions" ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 font-bold" : "text-zinc-500"
          }`}
        >
          AI CENTER
        </button>
      </div>

      {/* ACTIVE SCREEN RENDERER */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CORPORATE PLATFORM & CAPABILITIES */}
          {activeTab === "platform" && (
            <motion.div
              key="platform-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              
              {/* HERO SEGMENT */}
              <section className="relative py-12 md:py-20 text-left space-y-8 overflow-hidden rounded-lg">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-zinc-800/15 via-transparent to-transparent dark:from-zinc-500/5" />
                
                {/* Tech Badging */}
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40 px-3.5 py-1 text-xs">
                  <span className={`flex h-2 w-2 rounded-full ${cyberShieldActive ? "bg-zinc-900 dark:bg-zinc-100 animate-pulse" : "bg-red-500 animate-pulse"}`} />
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                    System State: {cyberShieldActive ? "HYPER-SECURED" : "PERIMETER MONITORING ONLY"}
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight md:text-5xl lg:text-7xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-650 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
                  Absolute precision in <br />
                  <span>zero-trust defense</span>
                </h1>

                <p className="max-w-2xl text-base text-zinc-800 dark:text-zinc-300 md:text-lg font-normal leading-relaxed">
                  Engineering flawless technical network boundaries. Providing impenetrable runtime posture defense across high-compliance financial channels and heavy industrial structures.
                </p>

                {/* Simulated Trigger Buttons */}
                <div className="flex flex-col sm:flex-row items-start justify-start gap-4 pt-4">
                  <button
                    onClick={() => setActiveTab("intelligence")}
                    className="group flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black px-8 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    DEPLOY GATEWAY
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>

                  <div className="flex h-12 w-full sm:w-auto items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20 px-6 font-mono text-xs font-medium tracking-wide text-zinc-400 dark:text-zinc-500">
                    ESCROW KEY POSTURE LOCKED
                  </div>
                </div>

                {/* Header Stats Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl pt-16">
                  <div className={`p-4 border rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-sm ${
                    theme === "dark" ? "bg-[#0b0d13] border-[#1F242E] hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                  }`}>
                    <div className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Total Threat Blocks</div>
                    <div className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
                      {totalBlocked.toLocaleString()}
                    </div>
                  </div>
                  <div className={`p-4 border rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-sm ${
                    theme === "dark" ? "bg-[#0b0d13] border-[#1F242E] hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                  }`}>
                    <div className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Secure Core Cells</div>
                    <div className="text-xl font-black tracking-tight text-zinc-800 dark:text-zinc-200 font-mono">2,450 / 2,450</div>
                  </div>
                  <div className={`p-4 border rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-sm ${
                    theme === "dark" ? "bg-[#0b0d13] border-[#1F242E] hover:border-zinc-700" : "bg-white border-zinc-200 hover:border-zinc-400"
                  }`}>
                    <div className="font-mono text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">Telemetry Uptime</div>
                    <div className="text-xl font-black tracking-tight text-zinc-800 dark:text-zinc-200 font-mono">99.9997%</div>
                  </div>
                </div>
              </section>

              {/* CORE INTELLIGENCE SEGMENT - Upgraded with High-Contrast Generated Imagery */}
              <section className="space-y-8">
                <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-800 dark:text-zinc-400 font-bold block">
                    01 // Tactical Core Intelligence
                  </span>
                </div>

                <div className="grid gap-8 lg:grid-cols-12 items-center">
                  
                  {/* Left Imagery Columns */}
                  <div className="lg:col-span-4 relative group rounded-md overflow-hidden border border-zinc-200 dark:border-[#1F242E] shadow-sm">
                    <img
                      src={ASSETS.livestreamFiber}
                      alt="SecureLock Live Fiber Data Optical Pipeline"
                      className="w-full h-[360px] object-cover filter grayscale contrast-125 saturate-[0.1] group-hover:grayscale-0 group-hover:saturate-100 transition-all duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/85 px-3 py-1 font-mono text-[9px] uppercase text-zinc-300 tracking-widest border border-zinc-700">
                      <span className={`h-1.5 w-1.5 rounded-full bg-white ${cyberShieldActive ? "animate-pulse" : "bg-red-500"}`} />
                      COOPERATIVE GATEWAY FEED
                    </div>
                  </div>

                  {/* Middle Copy Columns */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl text-zinc-900 dark:text-white leading-tight">
                      Proactive threat hunting. Absolute enterprise resilience.
                    </h2>
                    
                    <p className={`text-sm leading-relaxed ${
                      theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                    }`}>
                      Our AI-driven sensory network detects anomalies before they escalate. We do not just respond to breaches; we pre-engineer systems where they cannot possibly occur.
                    </p>

                    <p className={`text-xs ${
                      theme === "dark" ? "text-zinc-500" : "text-zinc-500"
                    }`}>
                      By linking telemetry models directly into global cloud networks and SCADA hardware loops, secureLock minimizes operational exposure ratios.
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab("solutions")}
                        className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-700 hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white transition-all underline underline-offset-4 decoration-zinc-400 hover:decoration-white"
                      >
                        EXPLORE AI CVE AUDITOR
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right Analytics Imagery Mockup */}
                  <div className="lg:col-span-3 rounded-md overflow-hidden border border-zinc-200 dark:border-[#1F242E] bg-white dark:bg-[#0b0d13] group">
                    <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0f1116] px-3 py-2 flex items-center justify-between">
                      <span className="font-mono text-[9px] text-zinc-500 dark:text-zinc-400 font-bold uppercase">CONSOLE_TELEMETRY.RAW</span>
                      <Activity className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 animate-pulse" />
                    </div>
                    <img
                      src={ ASSETS.controlMonitor }
                      alt="SecureLock Cyber threat analytics telemetry board"
                      className="w-full h-[290px] object-cover brightness-[0.85] contrast-125 grayscale saturate-0 group-hover:grayscale-0 group-hover:saturate-[0.4] transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                </div>
              </section>

              {/* GLOBAL OPERATIONS SEGMENT */}
              <section className="space-y-8">
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-zinc-700 dark:text-zinc-400 font-bold">
                    02 // Global Security Postures
                  </span>
                  <span className="font-mono text-[9px] text-zinc-700 dark:text-zinc-400 font-bold uppercase tracking-widest">FACILITY SENSORS ACTIVE</span>
                </div>

                <div className="space-y-4 text-left">
                  <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    Sovereign Guard Deployments
                  </h2>
                  <p className="max-w-2xl text-sm text-zinc-800 dark:text-zinc-400 font-normal leading-relaxed">
                    Sovereign zero-trust lattices deployed across strategic physical server facilities. Click on high-priority nodes below to trigger direct overrides in the live workstation console.
                  </p>
                </div>

                {/* Card grids mapped exactly to mockup */}
                <div className="grid gap-8 md:grid-cols-2">
                  
                  {/* Deployment Card 1: Project Vanguard */}
                  <div 
                    onClick={() => {
                      setFocusedDeployment("vanguard");
                      setActiveTab("intelligence");
                    }}
                    className={`group cursor-pointer rounded-md border text-left overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                      theme === "dark" 
                        ? "border-[#1F242E] bg-[#0b0d13] hover:border-zinc-700 hover:shadow-md" 
                        : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md"
                    }`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={ASSETS.vanguardMesh}
                        alt="Project Vanguard Global Financial Mesh Shield"
                        className="w-full h-full object-cover filter grayscale contrast-125 saturate-0 opacity-75 group-hover:grayscale-0 group-hover:saturate-[0.3] group-hover:opacity-100 transition-all duration-750 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="rounded bg-black/85 border border-zinc-800 px-3 py-1 font-mono text-[9px] text-zinc-450 uppercase tracking-widest font-bold">
                          FINANCIAL SECTOR [LATENCY SECURED]
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                          Project Vanguard
                        </h3>
                        <p className="text-[10px] mt-1.5 font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-500 font-bold">
                          LOCK LEVEL: {vanguardLockLevel.toUpperCase()} // CLICK TO MANAGE
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 dark:border-[#1F242E] bg-zinc-50 dark:bg-black/40 transition-all duration-300 group-hover:border-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800">
                        <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Deployment Card 2: Operation Aegis */}
                  <div 
                    onClick={() => {
                      setFocusedDeployment("aegis");
                      setActiveTab("intelligence");
                    }}
                    className={`group cursor-pointer rounded-md border text-left overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                      theme === "dark" 
                        ? "border-[#1F242E] bg-[#0b0d13] hover:border-zinc-700 hover:shadow-md" 
                        : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-md"
                    }`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={ASSETS.aegisServers}
                        alt="Operation Aegis Critical Infrastructure Datacenter"
                        className="w-full h-full object-cover filter grayscale contrast-125 saturate-0 opacity-75 group-hover:grayscale-0 group-hover:saturate-[0.3] group-hover:opacity-100 transition-all duration-750 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className="rounded bg-black/85 border border-zinc-800 px-3 py-1 font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                          CRITICAL INFRASTRUCTURE [SCADA CORE]
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                          Operation Aegis
                        </h3>
                        <p className="text-[10px] mt-1.5 font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-500 font-bold">
                          LOCK LEVEL: {aegisLockLevel.toUpperCase()} // CLICK TO MANAGE
                        </p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 dark:border-[#1F242E] bg-zinc-50 dark:bg-black/40 transition-all duration-300 group-hover:border-zinc-400 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800">
                        <ArrowUpRight className="h-5 w-5 text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-100 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </div>

                </div>
              </section>

            </motion.div>
          )}

          {/* TAB 2: ADVANCED TELEMETRY & COMMAND MONITORING (The "Intelligence" Center) */}
          {activeTab === "intelligence" && (
            <motion.div
              key="intelligence-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-8 text-left"
            >
              
              {/* Telemetry Dashboard Stats Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    Advanced Security Operations
                  </h1>
                  <p className="text-sm text-zinc-800 dark:text-zinc-400 font-normal mt-1">
                    Real-time distributed firewall diagnostics & core SCADA status coordinates.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={triggerSimulatedAttack}
                    className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 px-3 py-1.5 text-xs font-mono font-bold text-red-500 transition-colors uppercase cursor-pointer"
                  >
                    <AlertTriangle className="h-4 w-4 animate-bounce" />
                    Inject Attack Loop
                  </button>

                  <button 
                    onClick={() => {
                      setLogs(INITIAL_LOGS);
                      setTotalBlocked(142492);
                    }}
                    className="flex items-center gap-2 rounded-md border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/45 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-1.5 text-xs font-mono text-zinc-700 dark:text-zinc-400 transition-colors uppercase cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset Data
                  </button>

                  <div className="flex items-center gap-2 rounded-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-300 dark:border-zinc-800 px-3.5 py-1 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-800 dark:bg-zinc-300 animate-pulse" />
                    <span className="font-mono text-[10px] text-zinc-800 dark:text-zinc-300 uppercase tracking-widest font-bold">
                      GATEWAY: SECURED
                    </span>
                  </div>
                </div>
              </div>

              {/* HIGH DENSITY STATS CARDS */}
              <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                
                <div className={`p-5 border rounded-md transition-all duration-300 hover:scale-[1.01] ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-300 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-zinc-800 dark:text-zinc-400 uppercase tracking-wider font-bold">Blocked Incident Pool</span>
                    <Shield className="h-4 w-4 text-zinc-800 dark:text-zinc-400" />
                  </div>
                  <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white font-mono">
                    {totalBlocked.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-700 dark:text-zinc-400 font-mono mt-2.5 flex items-center gap-1 font-bold uppercase">
                    <CheckCircle2 className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" /> Auto-mitigated in context
                  </div>
                </div>

                <div className={`p-5 border rounded-md transition-all duration-300 hover:scale-[1.01] ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-300 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-zinc-800 dark:text-zinc-400 uppercase tracking-wider font-bold">Firewall Diode Posture</span>
                    <Lock className="h-4 w-4 text-zinc-800 dark:text-zinc-400" />
                  </div>
                  <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white font-mono">
                    {cyberShieldActive ? "SECURED" : "VULNERABLE"}
                  </div>
                  <div className="text-[10px] text-zinc-700 dark:text-zinc-400 font-mono mt-2.5 uppercase font-bold">
                    Zero-Trust Gateway Active
                  </div>
                </div>

                <div className={`p-5 border rounded-md transition-all duration-300 hover:scale-[1.01] ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-300 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-zinc-800 dark:text-zinc-400 uppercase tracking-wider font-bold">SCADA Diodes Active</span>
                    <Globe className="h-4 w-4 text-zinc-800 dark:text-zinc-400" />
                  </div>
                  <div className="text-2xl font-black tracking-tight text-zinc-950 dark:text-neutral-50 font-mono">
                    2,450 Channels
                  </div>
                  <div className="text-[10px] text-zinc-700 dark:text-zinc-400 font-mono mt-2.5 uppercase font-bold">
                    Integrated Node Loops
                  </div>
                </div>

                <div className={`p-5 border rounded-md transition-all duration-300 hover:scale-[1.01] ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-300 shadow-sm"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] text-zinc-800 dark:text-zinc-400 uppercase tracking-wider font-bold">Grid Telemetry Jitter</span>
                    <Cpu className="h-4 w-4 text-zinc-800 dark:text-zinc-400" />
                  </div>
                  <div className="text-2xl font-black tracking-tight text-zinc-950 dark:text-neutral-50 font-mono">
                    {cyberShieldActive ? "8ms jitter" : "42ms delay"}
                  </div>
                  <div className={`text-[10px] font-mono mt-2.5 uppercase font-bold ${cyberShieldActive ? "text-zinc-700 dark:text-zinc-400" : "text-red-500 animate-pulse"}`}>
                    System Load: {cyberShieldActive ? "Optimal 4.2%" : "Unshielded payload"}
                  </div>
                </div>

              </div>

              {/* GRAPHS SEGMENT */}
              <div className="grid gap-8 lg:grid-cols-12">
                
                {/* 1. Main Mitigations Timeline Chart (Area) */}
                <div className={`lg:col-span-8 p-6 border rounded-md transition-colors ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                        Intrusion Mitigation Timeline
                      </h3>
                      <p className="text-xs text-zinc-400 font-light">
                        Overview of threat signals and blocked vectors across active secure gateways.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase font-bold">
                      <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                        <span className="h-2 w-2 bg-zinc-700 dark:bg-zinc-300 rounded-full" />
                        Mitigated Signals
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="h-2 w-2 bg-zinc-400 rounded-full" />
                        Unusual Telemetry Spikes
                      </span>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={INITIAL_METRICS}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#71717A" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#71717A" stopOpacity={0.0}/>
                          </linearGradient>
                          <linearGradient id="colorUnusual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#A1A1AA" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#A1A1AA" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="timestamp" 
                          stroke={theme === "dark" ? "#31394B" : "#cbd5e1"} 
                          fontSize={10} 
                          fontFamily="JetBrains Mono" 
                        />
                        <YAxis 
                          stroke={theme === "dark" ? "#31394B" : "#cbd5e1"} 
                          fontSize={10} 
                          fontFamily="JetBrains Mono" 
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: theme === "dark" ? "#0b0d13" : "#FFFFFF",
                            borderColor: theme === "dark" ? "#1F242E" : "#E2E8F0",
                            color: theme === "dark" ? "#FFFFFF" : "#0F172A",
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="blockedAttempts" 
                          stroke="#71717A" 
                          fillOpacity={1} 
                          fill="url(#colorBlocked)" 
                          strokeWidth={2}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="unusualRequests" 
                          stroke="#64748B" 
                          fillOpacity={1} 
                          fill="url(#colorUnusual)" 
                          strokeWidth={1.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Threat Allocation Pie Chart */}
                <div className={`lg:col-span-4 p-6 border rounded-md transition-colors ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-200"
                }`}>
                  <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
                    Threat Vector Burden
                  </h3>
                  <p className="text-xs text-zinc-450 font-light mb-6">
                    Classification distribution of current active perimeter filters.
                  </p>

                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={INITIAL_THREATS}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {INITIAL_THREATS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Compact Custom Legend */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {INITIAL_THREATS.map((ent, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[10px] font-mono leading-none">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: ent.color }} />
                        <span className="text-zinc-500 dark:text-zinc-400 truncate">{ent.name} ({ent.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* INTERACTIVE POLICY WORKSTATION + LIVE ATTACK LOGS */}
              <div className="grid gap-8 lg:grid-cols-12">
                
                {/* Deployment Control list */}
                <div className={`lg:col-span-4 p-6 border rounded-md transition-colors ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-200"
                } space-y-6`}>
                  <div>
                    <h3 className="text-md font-bold tracking-tight text-zinc-900 dark:text-white mb-1">
                      Platform Shield Boundaries
                    </h3>
                    <p className="text-xs text-zinc-450 font-mono uppercase tracking-tight">
                      Adjust Node Diodes Standard/Maximum
                    </p>
                  </div>

                  <div className="space-y-4">
                    {deployments.map((dep) => (
                      <div 
                        key={dep.id} 
                        className={`p-4 border rounded-md transition-all duration-300 ${
                          focusedDeployment === dep.id 
                            ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/40" 
                            : (theme === "dark" ? "border-[#1F242E] bg-black/40" : "border-zinc-200 bg-zinc-50/50")
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-mono text-[9px] text-zinc-500 block uppercase font-bold">{dep.sector}</span>
                            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-50">{dep.name}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded font-mono text-[8px] uppercase font-bold border ${
                            dep.activeShields === "maximum" 
                              ? "bg-red-500/10 text-red-500 border-red-500/30"
                              : dep.activeShields === "elevated"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                : "bg-zinc-900 dark:bg-zinc-100 dark:text-black text-white border-zinc-800 dark:border-zinc-200"
                          }`}>
                            {dep.activeShields}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 truncate font-light">
                          {dep.recentActivity}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                          <span className="font-mono text-[8px] text-zinc-500 uppercase block font-bold">Policy Manual Intervention Override</span>
                          <div className="grid grid-cols-3 gap-1">
                            {(["standard", "elevated", "maximum"] as const).map((lvl) => (
                              <button
                                key={lvl}
                                onClick={() => changeDeploymentShield(dep.id, lvl)}
                                className={`py-1 text-[8px] font-mono rounded uppercase transition-colors font-bold cursor-pointer border ${
                                  dep.activeShields === lvl
                                    ? "bg-zinc-950 dark:bg-white text-white dark:text-black border-zinc-950 dark:border-white"
                                    : "border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-zinc-100 dark:bg-black/35 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1.5 uppercase font-mono">
                      <LockKeyhole className="h-4 w-4 text-zinc-400" /> Secure Key Posture
                    </span>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-450 leading-relaxed font-light">
                      Manual overrides trigger ephemeral cryptographic telemetry. Handled via mock sandbox keys.
                    </p>
                  </div>
                </div>

                {/* Simulated Logs Terminal (High details) */}
                <div className="lg:col-span-8 flex flex-col h-[460px] rounded-sm bg-black border border-zinc-800">
                  
                  {/* Console Header */}
                  <div className="bg-[#0f1116] border-b border-zinc-900 px-4 py-3 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <TerminalIcon className="h-4 w-4 text-zinc-400 animate-pulse" />
                      <span className="text-zinc-450 dark:text-zinc-300 font-bold uppercase tracking-wider">SecureLock DIODE THREAT STREAM</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Interactive Log filtering bar */}
                      <div className="flex items-center gap-1.5 border border-zinc-800 px-1.5 py-0.5 rounded bg-black">
                        {(["all", "info", "warn", "critical"] as const).map(flt => (
                          <button
                            key={flt}
                            onClick={() => setLogFilter(flt)}
                            className={`px-2 py-0.5 text-[8px] font-sans font-bold rounded uppercase transition-colors cursor-pointer ${
                              logFilter === flt ? "bg-zinc-800 text-white dark:bg-white dark:text-black" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {flt}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setIsLogPaused(!isLogPaused)}
                        className="p-1 rounded text-zinc-500 hover:text-white hover:bg-zinc-850 cursor-pointer"
                        title={isLogPaused ? "Resume Live Log Feed" : "Pause Live Log Feed"}
                      >
                        {isLogPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  {/* Logs Scroller body */}
                  <div className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-2 select-text scrollbar-thin scrollbar-thumb-zinc-800">
                    <AnimatePresence initial={false}>
                      {filteredLogs.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-start gap-2 p-1.5 rounded transition-all duration-300 ${
                            log.severity === "critical"
                              ? "bg-red-950/20 text-red-400 border-l-2 border-red-500"
                              : log.severity === "warn"
                                ? "bg-amber-950/20 text-yellow-500 border-l-2 border-amber-500"
                                : "text-zinc-300"
                          }`}
                        >
                          <span className="text-zinc-650 font-medium shrink-0">[{log.timestamp}]</span>
                          <span className="text-zinc-400 shrink-0 uppercase tracking-widest text-[9px] font-semibold border border-zinc-850 rounded px-1.5 py-0.5 bg-neutral-900">
                            {log.source.split(" ")[0]}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-semibold shrink-0">
                            PORT {log.port}
                          </span>
                          <span className="whitespace-pre-line leading-relaxed">{log.message}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {logs.length === 0 && (
                      <div className="text-center text-zinc-650 py-16">
                        No telemetry logs currently matched the dynamic criteria index filter.
                      </div>
                    )}
                  </div>

                  {/* Console Footer Status */}
                  <div className="bg-[#0c0f16] border-t border-zinc-900 px-4 py-2 flex items-center justify-between font-mono text-[9px] text-zinc-500">
                    <div>PACKETS LOG BUFFER: {logs.length}/20 // AUTO SCRUBBING INDEX</div>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-zinc-400 animate-ping" />
                      STREAM ACTIVE
                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* TAB 3: AI INTELLIGENCE CENTER (The "Solutions" console with Interactive Gemini API Chat) */}
          {activeTab === "solutions" && (
            <motion.div
              key="solutions-section"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-8 text-left"
            >
              
              <div className="border-b border-zinc-200 dark:border-zinc-800 pb-5">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                  Sovereign AI Security Core
                </h1>
                <p className="text-sm text-zinc-800 dark:text-zinc-400 font-normal mt-1">
                  Consult the secure, sandboxed AI security analyst regarding mitigation pathways, automatic audits, or specialized threat telemetry.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-12">
                
                {/* User quick presets panel */}
                <div className={`lg:col-span-4 p-6 border rounded-md transition-colors ${
                  theme === "dark" ? "bg-[#0b0d13] border-[#1F242E]" : "bg-white border-zinc-200"
                } space-y-6`}>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white mb-1 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-zinc-650 dark:text-zinc-400" />
                      Analytic Templates
                    </h3>
                    <p className="text-xs text-zinc-700 dark:text-zinc-400 font-normal font-sans">
                      Select standard inputs for immediate AI security posturing and real-time CVE correlation.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleSendChatMessage("Verify Vanguard anomaly logs and current mitigation status.")}
                      className="w-full text-left p-3.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-805 hover:border-zinc-400 rounded text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-905 cursor-pointer duration-200"
                    >
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-0.5 uppercase tracking-wide">Project Vanguard Audit</span>
                      Validate network nodes integrity and transaction safety threshold anomalies.
                    </button>

                    <button
                      onClick={() => handleSendChatMessage("Provide standard mitigation steps for an active volumetric DDoS injection attack.")}
                      className="w-full text-left p-3.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-805 hover:border-zinc-400 rounded text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-905 cursor-pointer duration-200"
                    >
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-0.5 uppercase tracking-wide">DDoS Mitigation Steps</span>
                      Request clear, step-by-step mitigation advice for severe SYN-Flood waves.
                    </button>

                    <button
                      onClick={() => handleSendChatMessage("Analyze the SCADA protection parameters within Operation Aegis. How are the PLC writing lock rules configured?")}
                      className="w-full text-left p-3.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-805 hover:border-zinc-400 rounded text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-905 cursor-pointer duration-200"
                    >
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block mb-0.5 uppercase tracking-wide">Operation Aegis Integrity</span>
                      Review the hardware air-gap status of PLC register locks.
                    </button>
                  </div>

                  <div className="p-4 bg-zinc-100 dark:bg-black/35 border border-zinc-200 dark:border-zinc-800 rounded-md">
                    <span className="text-xs text-zinc-800 dark:text-zinc-300 uppercase tracking-widest font-mono font-bold block mb-2">Capabilities Included</span>
                    <ul className="text-[11px] text-zinc-700 dark:text-zinc-400 space-y-1 font-mono leading-relaxed">
                      <li>• Server-side API Isolation</li>
                      <li>• Telemetry Grounding Node</li>
                      <li>• Threat Payload Parser</li>
                      <li>• Vulnerability Audit Log Matcher</li>
                    </ul>
                  </div>
                </div>

                {/* AI Chat Console Interactor */}
                <div className="lg:col-span-8 flex flex-col h-[525px] rounded-md bg-black border border-zinc-800 dark:border-[#1F242E] overflow-hidden">
                  
                  {/* Console Header */}
                  <div className="bg-zinc-50 dark:bg-[#0f1116] border-b border-zinc-200 dark:border-zinc-900 px-4 py-3 flex items-center justify-between font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-zinc-455 animate-pulse" />
                      <span className="text-zinc-800 dark:text-zinc-300 font-bold uppercase tracking-wider">SecureLock AI Assistant</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full bg-zinc-800 dark:bg-zinc-900/70 border border-zinc-700 px-2.5 py-0.5">
                      <span className="text-[9px] text-zinc-300 dark:text-zinc-400 font-sans uppercase font-bold">MODEL: gemini-3.5-flash</span>
                    </div>
                  </div>

                  {/* Chat logs render body */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text bg-[#030406]">
                    {chatHistory.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex gap-3 max-w-[85%] ${
                          msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        {/* Avatar */}
                        <div className={`h-8 w-8 shrink-0 rounded flex items-center justify-center font-bold text-xs font-mono uppercase ${
                          msg.role === "user" ? "bg-zinc-900 dark:bg-white text-white dark:text-black font-black" : "bg-zinc-850 dark:bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}>
                          {msg.role === "user" ? "U" : "AI"}
                        </div>

                        {/* Content text */}
                        <div className={`p-4 rounded border leading-relaxed text-xs shadow-sm ${
                          msg.role === "user"
                            ? "bg-zinc-900/[0.1] dark:bg-zinc-900/40 border-zinc-800 text-zinc-200 text-left"
                            : "bg-[#0b0d13] border-[#1F242E] text-left text-zinc-300"
                        }`}>
                          <div className="whitespace-pre-line font-medium leading-relaxed font-sans">
                            {msg.content}
                          </div>
                          
                          <div className="text-[9px] text-zinc-500 font-mono mt-2.5 uppercase font-bold">
                            [ {msg.timestamp || "Active"} ]
                          </div>
                        </div>
                      </div>
                    ))}

                    {isChatLoading && (
                      <div className="mr-auto flex gap-3 max-w-[85%]">
                        <div className="h-8 w-8 rounded bg-zinc-900 flex items-center justify-center border border-zinc-800 font-bold text-xs text-zinc-400 font-mono">
                          AI
                        </div>
                        <div className="p-4 rounded bg-[#0b0d13] border border-[#1F242E] text-left text-xs font-mono text-zinc-400">
                          <span className="inline-block animate-pulse">Running analysis on security posture database...</span>
                          <span className="ml-[1px] inline-block animate-ping font-extrabold text-white">_</span>
                        </div>
                      </div>
                    )}

                    <div ref={chatBottomRef} />
                  </div>

                  {/* Input container */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendChatMessage(chatInput);
                    }}
                    className="bg-[#0c0f16] border-t border-zinc-800 p-3 flex gap-2"
                  >
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask the SecureLock Analyst (e.g. 'How do I handle SQL injection attempts?')..."
                      disabled={isChatLoading}
                      className="flex-1 bg-black border border-zinc-800 focus:border-zinc-500 px-4 py-2 font-sans text-xs text-zinc-250 outline-none rounded disabled:opacity-50 transition-colors focus:ring-1 focus:ring-zinc-650"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-black font-mono text-[10px] font-bold px-5 rounded uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer border border-zinc-800 dark:border-zinc-200"
                    >
                      <Send className="h-3 w-3" />
                      ANALYZE
                    </button>
                  </form>

                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className={`border-t py-12 transition-colors ${
        theme === "dark" ? "border-zinc-805 bg-[#08090d]" : "border-zinc-200 bg-zinc-50"
      }`}>
        <div className="mx-auto max-w-7xl px-6 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="h-7 w-7 bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center rounded">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-sans text-lg font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50 leading-none">
              SECURELOCK
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-zinc-700 dark:text-zinc-400 font-bold">
            <a href="#privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors uppercase underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800">PRIVACY POLICY</a>
            <a href="#terms" className="hover:text-zinc-950 dark:hover:text-white transition-colors uppercase underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800">TERMS OF SERVICE</a>
            <a href="#disclosure" className="hover:text-zinc-950 dark:hover:text-white transition-colors uppercase underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800">SECURITY DISCLOSURE</a>
          </div>

          <div className="font-mono text-[10px] text-zinc-700 dark:text-zinc-500 tracking-wider">
            © 2026 SECURELOCK CYBERSECURITY ENTERPRISE solutions. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

    </div>
  );
}
