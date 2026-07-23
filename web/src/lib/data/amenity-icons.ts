import {
  Waves,
  ShieldCheck,
  Car,
  MoveVertical,
  Trees,
  Dumbbell,
  Users,
  Sofa,
  Home,
  Sailboat,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const RULES: [RegExp, LucideIcon][] = [
  [/مسبح/, Waves],
  [/يخت|مظلة/, Sailboat],
  [/أمن/, ShieldCheck],
  [/موقف/, Car],
  [/مصعد/, MoveVertical],
  [/حديقة|فناء|شاطئ/, Trees],
  [/رياض/, Dumbbell],
  [/فندق|كونسيرج|استقبال/, Users],
  [/خادمة/, Sofa],
  [/إطلالة/, Building2],
];

export function amenityIcon(label: string): LucideIcon {
  return RULES.find(([re]) => re.test(label))?.[1] ?? Home;
}
