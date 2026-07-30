/**
 * Shape of the data the Developer Dashboard renders. Kept independent of the
 * mock data module so a future Prisma-backed data layer can implement the same
 * contract without touching any component.
 */

export type NavKey =
  | "overview"
  | "projects"
  | "units"
  | "leads"
  | "analytics"
  | "messages"
  | "settings"
  | "listings"
  | "clients"
  | "deals"
  | "commissions";

export interface DashboardNavItem {
  key: NavKey;
  label: string;
  icon: string;
  href: string;
  badge?: string;
}

export type DeltaDirection = "up" | "down";

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaDirection: DeltaDirection;
  icon: string;
}

export interface ViewsChartPoint {
  label: string;
  /** 0–100, drives the bar's height as a percentage of the chart area. */
  heightPct: number;
}

export type ChartRange = "weekly" | "monthly";

export interface LeadItem {
  id: string;
  name: string;
  project: string;
  time: string;
  initials: string;
  tone: "pine" | "clay";
}

export type ProjectStatus = "published" | "review" | "draft";

export interface ProjectRow {
  id: string;
  name: string;
  city: string;
  status: ProjectStatus;
  soldUnits: number;
  totalUnits: number;
  /** Formatted view count label, e.g. "١٨٫٤ ألف" — pre-localized like the source design. */
  viewsLabel: string;
  imageSeed: string;
  imageAlt: string;
  imageUrl: string | null;
}

export interface ProjectFilterTab {
  key: "all" | ProjectStatus;
  label: string;
}

export interface DeveloperAccount {
  companyName: string;
  roleLabel: string;
  avatarSeed: string;
  avatarAlt: string;
}

export interface DeveloperOverviewData {
  account: DeveloperAccount;
  nav: DashboardNavItem[];
  kpis: KpiMetric[];
  chart: Record<ChartRange, ViewsChartPoint[]>;
  leads: LeadItem[];
  filterTabs: ProjectFilterTab[];
  projects: ProjectRow[];
}

// --- Projects page --------------------------------------------------------

export interface DeveloperProjectCard {
  id: string;
  name: string;
  cityLabel: string;
  status: ProjectStatus;
  type: string;
  priceLabel: string;
  soldUnits: number;
  totalUnits: number;
  viewsLabel: string;
  leadsCount: number;
  imageSeed: string;
  imageAlt: string;
  imageUrl: string | null;
  tag: string;
}

export interface DeveloperProjectsData {
  stats: KpiMetric[];
  filterTabs: ProjectFilterTab[];
  projects: DeveloperProjectCard[];
}

// --- Units page -----------------------------------------------------------

export type UnitStatus = "available" | "reserved" | "sold";

export interface UnitRow {
  id: string;
  code: string;
  typeName: string;
  project: string;
  area: string;
  floorLabel: string;
  beds: number;
  priceLabel: string;
  status: UnitStatus;
}

export interface UnitStatusFilter {
  key: "all" | UnitStatus;
  label: string;
}

export interface DeveloperUnitsData {
  stats: KpiMetric[];
  statusFilters: UnitStatusFilter[];
  units: UnitRow[];
}

// --- Leads page -----------------------------------------------------------

export type LeadStage = "new" | "contacted" | "viewing" | "negotiating" | "won";

export interface LeadRecord {
  id: string;
  name: string;
  initials: string;
  tone: "pine" | "clay";
  project: string;
  phone: string;
  source: string;
  stage: LeadStage;
  date: string;
}

export interface LeadStageFilter {
  key: "all" | LeadStage;
  label: string;
}

export interface DeveloperLeadsData {
  stats: KpiMetric[];
  stageFilters: LeadStageFilter[];
  leads: LeadRecord[];
}

// --- Analytics page -------------------------------------------------------

export interface BreakdownBar {
  label: string;
  valueLabel: string;
  /** 0–100 fill width. */
  pct: number;
}

export interface TrafficSource {
  label: string;
  valueLabel: string;
  pct: number;
}

export interface DeveloperAnalyticsData {
  kpis: KpiMetric[];
  chart: Record<ChartRange, ViewsChartPoint[]>;
  viewsByProject: BreakdownBar[];
  leadsByCity: BreakdownBar[];
  trafficSources: TrafficSource[];
}

// --- Messages page --------------------------------------------------------

export interface ChatMessage {
  id: string;
  fromMe: boolean;
  body: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  tone: "pine" | "clay";
  project: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  messages: ChatMessage[];
}

export interface DeveloperMessagesData {
  conversations: Conversation[];
}

// --- Settings page --------------------------------------------------------

export interface SettingsField {
  name: string;
  label: string;
  value: string;
  type?: "text" | "email" | "tel" | "textarea";
  full?: boolean;
}

export interface SettingsToggle {
  name: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface DeveloperSettingsData {
  profileFields: SettingsField[];
  companyFields: SettingsField[];
  notifications: SettingsToggle[];
}

// --- Broker deals (pipeline) page ------------------------------------------

export type DealStage = "new" | "viewing" | "negotiating" | "won";

export interface DealCard {
  id: string;
  name: string;
  project: string;
  time: string;
}

export interface DealColumn {
  key: DealStage;
  title: string;
  count: string;
  cards: DealCard[];
}

export interface BrokerDealsData {
  columns: DealColumn[];
}

// --- Broker overview page --------------------------------------------------

export interface BrokerOverviewData {
  kpis: KpiMetric[];
  pipeline: DealColumn[];
  listings: UnitRow[];
}
