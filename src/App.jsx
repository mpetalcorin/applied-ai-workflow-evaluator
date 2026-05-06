import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Workflow,
  ClipboardCheck,
  Eye,
  Lock,
  Activity,
  RotateCcw,
  Network,
  Gauge,
  Boxes,
  Radar,
  BarChart3,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as ReRadar,
  ScatterChart,
  Scatter,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const demoRecords = [
  {
    id: "TXT-001",
    source: "Open-source briefing note",
    text:
      "Multiple reports mention changes in shipping activity, unusual timing, and conflicting descriptions from regional observers. Some claims are duplicated across secondary sources.",
    label: "Operational pattern discovery",
    confidence: 0.78,
    completeness: 0.62,
    risk: "Medium",
    novelty: 0.66,
    urgency: 0.58,
    governance: 0.74,
    baselineMinutes: 35,
    aiMinutes: 13,
    baseline: "Manual review required, likely 25 to 40 minutes.",
    aiValue:
      "AI can cluster repeated claims, flag uncertainty, and summarise competing explanations for analyst review.",
  },
  {
    id: "TXT-002",
    source: "Technical incident narrative",
    text:
      "A network-facing service showed intermittent failures after a configuration change. Logs include missing timestamps, partial hostnames, and ambiguous references to external dependencies.",
    label: "Cyber workflow support",
    confidence: 0.84,
    completeness: 0.55,
    risk: "High",
    novelty: 0.72,
    urgency: 0.88,
    governance: 0.67,
    baselineMinutes: 55,
    aiMinutes: 18,
    baseline: "Manual log review and incident reconstruction required.",
    aiValue:
      "AI can extract entities, reconstruct a candidate timeline, identify missing evidence, and suggest next checks.",
  },
  {
    id: "TXT-003",
    source: "Policy and compliance memo",
    text:
      "The document describes a proposed analytical workflow using sensitive data. It includes approval requirements, model monitoring expectations, and boundaries on automated decision-making.",
    label: "Responsible AI governance",
    confidence: 0.91,
    completeness: 0.88,
    risk: "Low",
    novelty: 0.44,
    urgency: 0.36,
    governance: 0.95,
    baselineMinutes: 40,
    aiMinutes: 10,
    baseline: "Manual compliance checklist completion.",
    aiValue:
      "AI can map requirements to controls, produce an audit checklist, and identify unresolved governance questions.",
  },
  {
    id: "TXT-004",
    source: "Mixed analyst notes",
    text:
      "Fragmentary notes contain names, dates, document references, possible duplicates, uncertain translations, and one claim that appears unsupported by the available evidence.",
    label: "Noisy evidence synthesis",
    confidence: 0.69,
    completeness: 0.43,
    risk: "High",
    novelty: 0.81,
    urgency: 0.76,
    governance: 0.59,
    baselineMinutes: 70,
    aiMinutes: 26,
    baseline: "Slow manual synthesis with high uncertainty.",
    aiValue:
      "AI can normalise entities, highlight unsupported claims, and route low-confidence outputs to human review.",
  },
  {
    id: "TXT-005",
    source: "Multilingual source summary",
    text:
      "A translated summary contains partial place names, inconsistent dates, entity aliases, and a possible mismatch between the original wording and the interpreted meaning.",
    label: "Cross-language entity resolution",
    confidence: 0.73,
    completeness: 0.49,
    risk: "High",
    novelty: 0.77,
    urgency: 0.61,
    governance: 0.62,
    baselineMinutes: 65,
    aiMinutes: 24,
    baseline: "Manual translation comparison, entity matching, and uncertainty annotation.",
    aiValue:
      "AI can highlight uncertain translations, cluster aliases, and route ambiguous claims to a specialist reviewer.",
  },
  {
    id: "TXT-006",
    source: "Strategic technology scan",
    text:
      "Several emerging AI tools are described with claims about automation, evaluation, deployment speed, and secure use. Evidence quality varies across sources.",
    label: "Technology horizon scanning",
    confidence: 0.82,
    completeness: 0.7,
    risk: "Medium",
    novelty: 0.89,
    urgency: 0.52,
    governance: 0.8,
    baselineMinutes: 45,
    aiMinutes: 15,
    baseline: "Manual technology scan and evidence-quality comparison.",
    aiValue:
      "AI can rank claims by evidence strength, cluster tool categories, and identify candidates for controlled evaluation.",
  },
];

const frameworkSteps = [
  {
    icon: Search,
    title: "Decision-point analysis",
    detail:
      "Identifies the operational decision that AI is meant to improve before choosing a model.",
  },
  {
    icon: Workflow,
    title: "Data-flow mapping",
    detail:
      "Represents noisy, incomplete, heterogeneous text streams with confidence and completeness indicators.",
  },
  {
    icon: Brain,
    title: "AI triage prototype",
    detail:
      "Classifies text, estimates uncertainty, and proposes whether automation can add value.",
  },
  {
    icon: Gauge,
    title: "Readiness scoring",
    detail:
      "Combines confidence, completeness, governance, urgency, and risk into a readiness score.",
  },
  {
    icon: Network,
    title: "Failure-mode analysis",
    detail:
      "Flags ambiguity, missing evidence, hallucination risk, weak evidence, and escalation needs.",
  },
  {
    icon: ClipboardCheck,
    title: "Human approval gate",
    detail:
      "Keeps analysts in control by requiring approve, reject, or review decisions.",
  },
];

const moduleDescriptions = [
  {
    icon: Boxes,
    title: "Module 1, Text triage",
    text: "Classifies operationally relevant text into workflow categories.",
  },
  {
    icon: Radar,
    title: "Module 2, Readiness radar",
    text: "Shows confidence, completeness, governance, urgency, novelty, and explainability.",
  },
  {
    icon: BarChart3,
    title: "Module 3, Baseline comparison",
    text: "Compares manual effort against AI-assisted review effort.",
  },
  {
    icon: Activity,
    title: "Module 4, 2D risk map",
    text: "Plots records by completeness and confidence, coloured by review risk.",
  },
  {
    icon: Sparkles,
    title: "Module 5, 3D risk landscape",
    text: "Displays confidence, completeness, and urgency in an interactive 3D visual space.",
  },
  {
    icon: ShieldCheck,
    title: "Module 6, Governance layer",
    text: "Captures audit trail, human gate status, and system limitation notes.",
  },
];

function classifyCustomText(text) {
  const lower = text.toLowerCase();

  const signals = {
    cyber: ["network", "log", "host", "server", "malware", "configuration", "incident"],
    governance: ["policy", "approval", "compliance", "audit", "governance", "privacy", "risk"],
    synthesis: ["notes", "uncertain", "duplicate", "unsupported", "fragment", "translation"],
    pattern: ["reports", "activity", "regional", "observer", "shipping", "movement", "pattern"],
    technology: ["model", "tool", "automation", "evaluation", "deployment", "benchmark", "agent"],
  };

  const scores = Object.fromEntries(
    Object.entries(signals).map(([key, words]) => [
      key,
      words.reduce((sum, word) => sum + (lower.includes(word) ? 1 : 0), 0),
    ])
  );

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

  const textLength = text.trim().length;
  const uncertaintyWords = [
    "uncertain",
    "possible",
    "conflicting",
    "missing",
    "unsupported",
    "ambiguous",
    "partial",
    "inconsistent",
  ];

  const uncertainty = uncertaintyWords.reduce(
    (sum, word) => sum + (lower.includes(word) ? 1 : 0),
    0
  );

  const labelMap = {
    cyber: "Cyber workflow support",
    governance: "Responsible AI governance",
    synthesis: "Noisy evidence synthesis",
    pattern: "Operational pattern discovery",
    technology: "Technology horizon scanning",
  };

  const baseConfidence = Math.min(
    0.93,
    0.52 + best[1] * 0.08 + Math.min(textLength, 500) / 3000
  );

  const confidence = Math.max(0.41, baseConfidence - uncertainty * 0.04);
  const completeness = Math.max(0.32, Math.min(0.94, textLength / 520 - uncertainty * 0.03));
  const urgency = Math.min(0.92, 0.42 + uncertainty * 0.08 + (lower.includes("incident") ? 0.22 : 0));
  const novelty = Math.min(0.92, 0.48 + best[1] * 0.07);
  const governance = lower.includes("policy") || lower.includes("approval") ? 0.88 : 0.65;
  const risk = confidence < 0.65 || uncertainty >= 3 ? "High" : confidence < 0.8 ? "Medium" : "Low";

  return {
    id: "CUSTOM",
    source: "User-provided text",
    text,
    label: labelMap[best[0]] || "General analytical triage",
    confidence,
    completeness,
    risk,
    novelty,
    urgency,
    governance,
    baselineMinutes: Math.round(35 + uncertainty * 9 + Math.min(textLength, 600) / 20),
    aiMinutes: Math.round(12 + uncertainty * 3 + Math.min(textLength, 600) / 60),
    baseline: "Manual reading, note extraction, uncertainty marking, and reviewer handover.",
    aiValue:
      "AI can provide first-pass classification, uncertainty flags, evidence extraction, and a structured review queue for human approval.",
  };
}

function riskClass(risk) {
  if (risk === "High") return "border-red-300 bg-red-500/15 text-red-100";
  if (risk === "Medium") return "border-amber-300 bg-amber-500/15 text-amber-100";
  return "border-emerald-300 bg-emerald-500/15 text-emerald-100";
}

function riskColour(risk) {
  if (risk === "High") return "#ef4444";
  if (risk === "Medium") return "#f59e0b";
  return "#10b981";
}

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function readinessScore(record) {
  const riskPenalty = record.risk === "High" ? 0.22 : record.risk === "Medium" ? 0.1 : 0.02;
  const score =
    record.confidence * 0.28 +
    record.completeness * 0.24 +
    record.governance * 0.2 +
    (1 - Math.abs(record.urgency - 0.55)) * 0.12 +
    record.novelty * 0.08 +
    0.08 -
    riskPenalty;
  return Math.max(0.05, Math.min(0.98, score));
}

function buildAuditTrail(record, decision) {
  return [
    `Input ${record.id} received from: ${record.source}`,
    `Decision point: classify whether AI can support triage, synthesis, governance review, incident reconstruction, or horizon scanning.`,
    `Predicted workflow category: ${record.label}.`,
    `Confidence: ${pct(record.confidence)}. Completeness: ${pct(record.completeness)}. Risk: ${record.risk}.`,
    `Operational readiness score: ${pct(readinessScore(record))}.`,
    `Baseline comparison: ${record.baseline}`,
    `AI value hypothesis: ${record.aiValue}`,
    `Human gate status: ${decision}.`,
  ];
}

function MetricBar({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-300">
        <span>{label}</span>
        <span>{pct(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
    </div>
  );
}

function Native3DRiskLandscape({ records }) {
  return (
    <div className="relative h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
      <div className="absolute left-4 top-4 z-10 rounded-2xl border border-white/10 bg-slate-900/90 p-3 text-xs text-slate-300">
        <p className="font-semibold text-slate-100">Native 3D risk landscape</p>
        <p>X axis, confidence</p>
        <p>Y axis, completeness</p>
        <p>Depth, urgency</p>
        <p>Colour, review risk</p>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_45%)]" />

      <div
        className="absolute left-1/2 top-1/2 h-[330px] w-[520px] -translate-x-1/2 -translate-y-1/2 border border-cyan-300/20 bg-cyan-300/5"
        style={{
          transform:
            "translate(-50%, -50%) rotateX(58deg) rotateZ(-35deg)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
          {Array.from({ length: 25 }).map((_, index) => (
            <div key={index} className="border border-cyan-300/10" />
          ))}
        </div>

        {records.map((record) => {
          const x = Math.round(record.confidence * 100);
          const y = Math.round(record.completeness * 100);
          const z = Math.round(record.urgency * 100);

          const left = `${Math.max(6, Math.min(94, x))}%`;
          const top = `${100 - Math.max(6, Math.min(94, y))}%`;
          const lift = Math.round(z * 1.6);

          return (
            <div
              key={record.id}
              className="group absolute"
              style={{
                left,
                top,
                transform: `translate(-50%, -50%) translateZ(${lift}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="h-5 w-5 rounded-full border-2 border-white shadow-[0_0_24px_rgba(255,255,255,0.45)]"
                style={{ backgroundColor: riskColour(record.risk) }}
              />

              <div
                className="absolute left-1/2 top-6 hidden w-48 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-900/95 p-3 text-xs text-slate-100 shadow-xl group-hover:block"
                style={{
                  transform:
                    "translateX(-50%) rotateZ(35deg) rotateX(-58deg)",
                }}
              >
                <p className="font-semibold text-cyan-100">{record.id}</p>
                <p>{record.label}</p>
                <p>Risk: {record.risk}</p>
                <p>Readiness: {pct(readinessScore(record))}</p>
                <p>Confidence: {pct(record.confidence)}</p>
                <p>Completeness: {pct(record.completeness)}</p>
                <p>Urgency: {pct(record.urgency)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-4 right-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
          <span className="text-cyan-200">Confidence</span> increases left to right.
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
          <span className="text-cyan-200">Completeness</span> increases bottom to top.
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3">
          <span className="text-cyan-200">Urgency</span> lifts the point upward in 3D space.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedId, setSelectedId] = useState("TXT-001");
  const [customText, setCustomText] = useState("");
  const [decision, setDecision] = useState("Pending human review");
  const [showAudit, setShowAudit] = useState(true);

  const selectedRecord = useMemo(() => {
    if (selectedId === "CUSTOM" && customText.trim()) {
      return classifyCustomText(customText);
    }

    return demoRecords.find((record) => record.id === selectedId) || demoRecords[0];
  }, [selectedId, customText]);

  const recordsForAnalysis = useMemo(() => {
    if (selectedId === "CUSTOM" && customText.trim()) {
      return [...demoRecords, selectedRecord];
    }

    return demoRecords;
  }, [selectedId, customText, selectedRecord]);

  const failureModes = useMemo(() => {
    const modes = [];

    if (selectedRecord.completeness < 0.6) modes.push("Incomplete source material");
    if (selectedRecord.confidence < 0.75) modes.push("Low model confidence");

    if (/unsupported|conflicting|ambiguous|missing|uncertain|partial|inconsistent/i.test(selectedRecord.text)) {
      modes.push("Evidence conflict or ambiguity");
    }

    if (selectedRecord.risk === "High") modes.push("Requires senior or specialist review");
    if (selectedRecord.governance < 0.7) modes.push("Governance controls need strengthening");
    if (readinessScore(selectedRecord) < 0.6) modes.push("Not ready for unsupervised use");

    if (!modes.length) modes.push("No major failure mode detected, continue monitoring");

    return modes;
  }, [selectedRecord]);

  const auditTrail = useMemo(
    () => buildAuditTrail(selectedRecord, decision),
    [selectedRecord, decision]
  );

  const radarData = [
    { metric: "Confidence", value: Math.round(selectedRecord.confidence * 100) },
    { metric: "Completeness", value: Math.round(selectedRecord.completeness * 100) },
    { metric: "Governance", value: Math.round(selectedRecord.governance * 100) },
    { metric: "Urgency", value: Math.round(selectedRecord.urgency * 100) },
    { metric: "Novelty", value: Math.round(selectedRecord.novelty * 100) },
    { metric: "Readiness", value: Math.round(readinessScore(selectedRecord) * 100) },
  ];

  const effortData = recordsForAnalysis.map((record) => ({
    id: record.id,
    Manual: record.baselineMinutes,
    "AI-assisted": record.aiMinutes,
    risk: record.risk,
  }));

  const scatterData = recordsForAnalysis.map((record) => ({
    id: record.id,
    confidence: Math.round(record.confidence * 100),
    completeness: Math.round(record.completeness * 100),
    readiness: Math.round(readinessScore(record) * 100),
    risk: record.risk,
  }));

  const readinessAverage =
    recordsForAnalysis.reduce((sum, record) => sum + readinessScore(record), 0) /
    recordsForAnalysis.length;

  const highRiskCount = recordsForAnalysis.filter((record) => record.risk === "High").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_30%)]" />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                Advanced portfolio evidence app for Applied AI Scientist roles
              </div>

              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight sm:text-5xl">
                Human-in-the-loop AI workflow evaluator
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                A non-sensitive demonstration of transferable applied AI capability: noisy text triage,
                readiness scoring, model-risk analysis, 2D and 3D visualisation, baseline comparison,
                failure-mode testing, governance controls, and human approval gates.
              </p>
            </div>

            <Card className="border-white/10 bg-slate-900/80 text-slate-100 shadow-xl lg:w-80">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Lock className="h-9 w-9 rounded-2xl bg-emerald-400/10 p-2 text-emerald-300" />
                  <div>
                    <p className="text-sm text-slate-400">Design principle</p>
                    <p className="font-semibold">AI supports judgement, never replaces it.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.header>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {moduleDescriptions.map((module, index) => {
            const Icon = module.icon;

            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="h-full border-white/10 bg-white/10 text-slate-100 backdrop-blur">
                  <CardContent className="p-5">
                    <Icon className="mb-4 h-8 w-8 text-cyan-200" />
                    <h3 className="text-lg font-semibold">{module.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{module.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="border-cyan-300/20 bg-cyan-400/10 text-cyan-50 backdrop-blur">
            <CardContent className="p-5">
              <p className="text-sm text-cyan-200">Current readiness</p>
              <p className="mt-2 text-4xl font-semibold">{pct(readinessScore(selectedRecord))}</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-300/20 bg-emerald-400/10 text-emerald-50 backdrop-blur">
            <CardContent className="p-5">
              <p className="text-sm text-emerald-200">Average readiness</p>
              <p className="mt-2 text-4xl font-semibold">{pct(readinessAverage)}</p>
            </CardContent>
          </Card>

          <Card className="border-red-300/20 bg-red-400/10 text-red-50 backdrop-blur">
            <CardContent className="p-5">
              <p className="text-sm text-red-200">High-risk records</p>
              <p className="mt-2 text-4xl font-semibold">{highRiskCount}</p>
            </CardContent>
          </Card>

          <Card className="border-amber-300/20 bg-amber-400/10 text-amber-50 backdrop-blur">
            <CardContent className="p-5">
              <p className="text-sm text-amber-200">Estimated time saved</p>
              <p className="mt-2 text-4xl font-semibold">
                {Math.max(0, selectedRecord.baselineMinutes - selectedRecord.aiMinutes)}m
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {frameworkSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="h-full border-white/10 bg-white/10 text-slate-100 backdrop-blur">
                  <CardContent className="p-5">
                    <Icon className="mb-4 h-8 w-8 text-cyan-200" />
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.detail}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
          <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Input stream</h2>
                  <p className="text-sm text-slate-400">Choose a noisy text sample or paste your own.</p>
                </div>

                <FileText className="h-7 w-7 text-cyan-200" />
              </div>

              <div className="space-y-3">
                {demoRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => {
                      setSelectedId(record.id);
                      setDecision("Pending human review");
                    }}
                    className={`w-full rounded-2xl border p-4 text-left transition hover:bg-white/10 ${selectedId === record.id
                      ? "border-cyan-300 bg-cyan-300/10"
                      : "border-white/10 bg-slate-950/40"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{record.id}</span>
                      <span className={`rounded-full border px-2 py-1 text-xs ${riskClass(record.risk)}`}>
                        {record.risk} risk
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{record.source}</p>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <label className="text-sm font-medium text-slate-200">Custom text demo</label>

                <textarea
                  value={customText}
                  onChange={(event) => {
                    setCustomText(event.target.value);
                    if (event.target.value.trim()) setSelectedId("CUSTOM");
                    setDecision("Pending human review");
                  }}
                  placeholder="Paste a short non-sensitive text sample."
                  className="mt-3 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-900 p-3 text-sm text-slate-100 outline-none ring-cyan-300/30 focus:ring-4"
                />

                <Button
                  variant="secondary"
                  className="mt-3 w-full rounded-2xl"
                  onClick={() => {
                    setCustomText("");
                    setSelectedId("TXT-001");
                    setDecision("Pending human review");
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
              <CardContent className="p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">AI-assisted triage output</h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Transparent classification, confidence, completeness, readiness, and review risk.
                    </p>
                  </div>

                  <span className={`w-fit rounded-full border px-3 py-1 text-sm ${riskClass(selectedRecord.risk)}`}>
                    {selectedRecord.risk} review risk
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-sm uppercase tracking-wide text-slate-500">Selected input</p>
                  <p className="mt-2 leading-7 text-slate-200">{selectedRecord.text}</p>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-400">Predicted class</p>
                    <p className="mt-2 font-semibold text-cyan-100">{selectedRecord.label}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-400">Confidence</p>
                    <p className="mt-2 text-2xl font-semibold">{pct(selectedRecord.confidence)}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-400">Readiness</p>
                    <p className="mt-2 text-2xl font-semibold">{pct(readinessScore(selectedRecord))}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                  <MetricBar label="Confidence" value={selectedRecord.confidence} />
                  <MetricBar label="Completeness" value={selectedRecord.completeness} />
                  <MetricBar label="Governance strength" value={selectedRecord.governance} />
                  <MetricBar label="Novelty" value={selectedRecord.novelty} />
                  <MetricBar label="Urgency" value={selectedRecord.urgency} />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Eye className="h-5 w-5 text-cyan-200" />
                      Baseline comparison
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{selectedRecord.baseline}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Brain className="h-5 w-5 text-cyan-200" />
                      AI value hypothesis
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{selectedRecord.aiValue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <section className="grid gap-6 xl:grid-cols-2">
              <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold">2D readiness radar</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Multi-factor operational-readiness profile for the selected record.
                  </p>

                  <div className="mt-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: "#cbd5e1", fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                        <ReRadar
                          name="Score"
                          dataKey="value"
                          stroke="#22d3ee"
                          fill="#22d3ee"
                          fillOpacity={0.35}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#020617",
                            border: "1px solid #334155",
                            color: "#e2e8f0",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
                <CardContent className="p-5">
                  <h2 className="text-xl font-semibold">2D confidence-completeness map</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Coloured scatter plot showing risk and readiness across records.
                  </p>

                  <div className="mt-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                        <CartesianGrid stroke="#334155" />
                        <XAxis
                          type="number"
                          dataKey="completeness"
                          name="Completeness"
                          domain={[30, 100]}
                          tick={{ fill: "#cbd5e1" }}
                          label={{ value: "Completeness", position: "insideBottom", fill: "#cbd5e1" }}
                        />
                        <YAxis
                          type="number"
                          dataKey="confidence"
                          name="Confidence"
                          domain={[40, 100]}
                          tick={{ fill: "#cbd5e1" }}
                          label={{ value: "Confidence", angle: -90, position: "insideLeft", fill: "#cbd5e1" }}
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          contentStyle={{
                            background: "#020617",
                            border: "1px solid #334155",
                            color: "#e2e8f0",
                          }}
                        />
                        <Scatter name="Records" data={scatterData}>
                          {scatterData.map((entry) => (
                            <Cell key={entry.id} fill={riskColour(entry.risk)} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold">Manual baseline versus AI-assisted effort</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Estimated review minutes before and after AI-assisted triage.
                </p>

                <div className="mt-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={effortData}>
                      <CartesianGrid stroke="#334155" />
                      <XAxis dataKey="id" tick={{ fill: "#cbd5e1" }} />
                      <YAxis tick={{ fill: "#cbd5e1" }} />
                      <Tooltip
                        contentStyle={{
                          background: "#020617",
                          border: "1px solid #334155",
                          color: "#e2e8f0",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="Manual" fill="#f97316" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="AI-assisted" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
              <CardContent className="p-5">
                <h2 className="text-xl font-semibold">Interactive 3D operational-risk landscape</h2>
                <p className="mt-1 text-sm text-slate-400">
                  X = confidence, Y = completeness, Z = urgency, colour = risk class.
                </p>

                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                  <Native3DRiskLandscape records={recordsForAnalysis} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Failure-mode and human review layer</h2>
                    <p className="text-sm text-slate-400">
                      The system is bounded, auditable, and routed through a human approval gate.
                    </p>
                  </div>

                  <AlertTriangle className="h-7 w-7 text-amber-200" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {failureModes.map((mode) => (
                    <div
                      key={mode}
                      className="rounded-2xl border border-amber-200/20 bg-amber-200/10 p-3 text-sm text-amber-50"
                    >
                      {mode}
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="rounded-2xl bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setDecision("Approved for limited pilot with human oversight")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve limited pilot
                  </Button>

                  <Button
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={() => setDecision("Escalated for deeper review before use")}
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Request review
                  </Button>

                  <Button
                    variant="destructive"
                    className="rounded-2xl"
                    onClick={() => setDecision("Rejected for operational use")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject output
                  </Button>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-400">Current human gate status</p>
                  <p className="mt-2 font-semibold text-cyan-100">{decision}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/10 text-slate-100 backdrop-blur">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Audit trail</h2>
                    <p className="text-sm text-slate-400">
                      Every decision is documented for review, governance, and reproducibility.
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={() => setShowAudit((value) => !value)}
                  >
                    {showAudit ? "Hide" : "Show"} audit
                  </Button>
                </div>

                {showAudit && (
                  <ol className="mt-5 space-y-3">
                    {auditTrail.map((item, index) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm leading-6 text-slate-300"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100">
                          {index + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
