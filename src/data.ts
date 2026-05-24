/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SecurityMetric, ThreatCategory, DeploymentStatus, LiveLockLog } from "./types";

// Dynamic generated asset paths mapped from image generation outputs
export const ASSETS = {
  livestreamFiber: "/src/assets/images/livestream_fiber_1779599866323.png",
  vanguardMesh: "/src/assets/images/vanguard_mesh_1779599888153.png",
  aegisServers: "/src/assets/images/aegis_servers_1779599907406.png",
  controlMonitor: "/src/assets/images/control_monitor_1779599924717.png",
};

// Historical metric ticks representing the last 24H cycles for Recharts
export const INITIAL_METRICS: SecurityMetric[] = [
  { timestamp: "06:00", blockedAttempts: 120, unusualRequests: 14, cpuLoad: 31 },
  { timestamp: "08:00", blockedAttempts: 185, unusualRequests: 22, cpuLoad: 42 },
  { timestamp: "10:00", blockedAttempts: 340, unusualRequests: 45, cpuLoad: 58 },
  { timestamp: "12:00", blockedAttempts: 520, unusualRequests: 80, cpuLoad: 72 },
  { timestamp: "14:00", blockedAttempts: 710, unusualRequests: 95, cpuLoad: 80 },
  { timestamp: "16:00", blockedAttempts: 605, unusualRequests: 58, cpuLoad: 64 },
  { timestamp: "18:00", blockedAttempts: 410, unusualRequests: 32, cpuLoad: 48 },
  { timestamp: "20:00", blockedAttempts: 380, unusualRequests: 25, cpuLoad: 40 },
  { timestamp: "22:00", blockedAttempts: 512, unusualRequests: 62, cpuLoad: 55 },
  { timestamp: "00:00", blockedAttempts: 690, unusualRequests: 110, cpuLoad: 82 },
  { timestamp: "02:00", blockedAttempts: 430, unusualRequests: 48, cpuLoad: 50 },
  { timestamp: "04:00", blockedAttempts: 290, unusualRequests: 19, cpuLoad: 36 },
];

export const INITIAL_THREATS: ThreatCategory[] = [
  { name: "DDoS Mitigation", value: 45, color: "#18181B" }, // Jet Carbon
  { name: "Phishing Filters", value: 20, color: "#52525B" }, // Steel Gray
  { name: "SQL Injection Shields", value: 18, color: "#3F3F46" }, // Dark Charcoal
  { name: "API Rate Overrides", value: 12, color: "#71717A" }, // Titanium Zinc
  { name: "Zero-Day Exploits", value: 5, color: "#A1A1AA" }, // Platinum Silver
];

export const INITIAL_DEPLOYMENTS: DeploymentStatus[] = [
  {
    id: "vanguard",
    name: "Project Vanguard",
    sector: "FINANCIAL SECTOR",
    status: "secure",
    activeShields: "standard",
    endpointsCount: 2450,
    mitigatedIncidents: 1421,
    recentActivity: "Re-routed transaction validation node payload over redundant secure channels.",
  },
  {
    id: "aegis",
    name: "Operation Aegis",
    sector: "CRITICAL INFRASTRUCTURE",
    status: "monitoring",
    activeShields: "elevated",
    endpointsCount: 840,
    mitigatedIncidents: 904,
    recentActivity: "Isolated potential SCADA payload anomaly inside sub-station 14 firewall diode.",
  },
];

// Helper to generate a brand new live alert log in monospace style
const IP_ADDRESSES = [
  "185.220.101.44",
  "89.163.242.12",
  "104.244.75.14",
  "5.255.99.102",
  "172.56.21.3",
  "192.168.12.82",
  "10.0.4.115",
];

const SOURCES = [
  "VAN_GW_02",
  "AEGIS_DIODE_PRIMARY",
  "HTTPS_LB_WEST",
  "KERBEROS_AUTH",
  "CLOUD_DNS_SCRUBBER",
  "SECURELOCK_CORE",
];

const ACTIONS = [
  {
    severity: "info" as const,
    message: "Ingress packet filter approved matching TCP handshake on security tunnel.",
    port: 443,
  },
  {
    severity: "warn" as const,
    message: "Detecting concurrent scan attempts across standard debugging parameters; address temporary blacklisted.",
    port: 5060,
  },
  {
    severity: "critical" as const,
    message: "Blocked potential SQL-bypass string inside authentication URL parameters.",
    port: 80,
  },
  {
    severity: "info" as const,
    message: "Active SSL cipher keys successfully cycled.",
    port: 443,
  },
  {
    severity: "warn" as const,
    message: "Rate limit threshold breached for external client endpoint footprint.",
    port: 8080,
  },
  {
    severity: "critical" as const,
    message: "Intrusion attempt rejected: payload matches active buffer overflow signature.",
    port: 22,
  },
];

export function generateLiveLog(): LiveLockLog {
  const ip = IP_ADDRESSES[Math.floor(Math.random() * IP_ADDRESSES.length)];
  const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const now = new Date();
  const timestamp = now.toISOString().split("T")[1].substring(0, 8);

  return {
    id: Math.random().toString(36).substring(2, 9),
    timestamp,
    source: `${source} [${ip}]`,
    severity: action.severity,
    message: action.message,
    port: action.port,
  };
}

export const INITIAL_LOGS: LiveLockLog[] = [
  {
    id: "l1",
    timestamp: "05:16:45",
    source: "SECURELOCK_CORE [127.0.0.1]",
    severity: "info",
    message: "SecureLock threat monitoring initial systems online. Absolute precision shield established.",
    port: 443,
  },
  {
    id: "l2",
    timestamp: "05:16:47",
    source: "VAN_GW_02 [185.220.101.44]",
    severity: "warn",
    message: "Rejecting potential SYN scan request across local port index ranges.",
    port: 3389,
  },
  {
    id: "l3",
    timestamp: "05:16:51",
    source: "AEGIS_DIODE_PRIMARY [89.163.242.12]",
    severity: "info",
    message: "PLC write locks fully checked. Hardware isolated loop reporting standard optimal grid load.",
    port: 502,
  },
];
