
import React from 'react';
import { RoadmapPhase } from '@/types/types';
import { Clock, Calendar, LayoutPanelTop } from 'lucide-react';

export const timelinePhases = [
  { id: 'short-term' as RoadmapPhase, label: 'Short-Term (1-3 months)', icon: React.createElement(Clock, { className: "h-4 w-4" }) },
  { id: 'mid-term' as RoadmapPhase, label: 'Mid-Term (3-6 months)', icon: React.createElement(Calendar, { className: "h-4 w-4" }) },
  { id: 'long-term' as RoadmapPhase, label: 'Long-Term (6+ months)', icon: React.createElement(LayoutPanelTop, { className: "h-4 w-4" }) },
];

export const quarterlyPhases = [
  { id: 'quarterly-q1' as RoadmapPhase, label: 'Q1', icon: React.createElement("span", { className: "text-xs font-bold mr-1" }, "Q1") },
  { id: 'quarterly-q2' as RoadmapPhase, label: 'Q2', icon: React.createElement("span", { className: "text-xs font-bold mr-1" }, "Q2") },
  { id: 'quarterly-q3' as RoadmapPhase, label: 'Q3', icon: React.createElement("span", { className: "text-xs font-bold mr-1" }, "Q3") },
  { id: 'quarterly-q4' as RoadmapPhase, label: 'Q4', icon: React.createElement("span", { className: "text-xs font-bold mr-1" }, "Q4") },
];
