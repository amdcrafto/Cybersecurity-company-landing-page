/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Theme = "dark" | "light";

export interface SecurityMetric {
  timestamp: string;
  blockedAttempts: number;
  unusualRequests: number;
  cpuLoad: number;
}

export interface ThreatCategory {
  name: string;
  value: number;
  color: string;
}

export interface DeploymentStatus {
  id: "vanguard" | "aegis";
  name: string;
  sector: string;
  status: "secure" | "monitoring" | "lockdown" | "breached";
  activeShields: "standard" | "elevated" | "maximum";
  endpointsCount: number;
  mitigatedIncidents: number;
  recentActivity: string;
}

export interface LiveLockLog {
  id: string;
  timestamp: string;
  source: string;
  severity: "info" | "warn" | "critical";
  message: string;
  port: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "analyzer";
  content: string;
  timestamp: string;
}
