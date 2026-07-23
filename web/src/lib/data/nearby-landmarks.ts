/**
 * Representative city landmarks, not measured from a project's real
 * coordinates — the schema has no lat/lng model yet. Clearly a placeholder
 * until real geo data exists; keyed by city so distances aren't invented per
 * project, only genuinely city-level facts (a given landmark's rough
 * proximity to that city's district).
 */

export interface NearbyLandmark {
  icon: "finance" | "airport" | "boulevard" | "hospital" | "school";
  name: string;
  dist: string;
}

const DEFAULT_LANDMARKS: NearbyLandmark[] = [
  { icon: "finance", name: "مركز الملك عبدالله المالي", dist: "٤ دقائق" },
  { icon: "airport", name: "مطار الملك خالد الدولي", dist: "٢٢ دقيقة" },
  { icon: "boulevard", name: "بوليفارد الرياض", dist: "٩ دقائق" },
  { icon: "hospital", name: "مستشفى المملكة", dist: "٧ دقائق" },
  { icon: "school", name: "مدارس عالمية", dist: "٦ دقائق" },
];

const NEARBY_BY_CITY: Record<string, NearbyLandmark[]> = {
  الرياض: DEFAULT_LANDMARKS,
  جدة: [
    { icon: "finance", name: "مركز جدة المالي", dist: "٦ دقائق" },
    { icon: "airport", name: "مطار الملك عبدالعزيز الدولي", dist: "٢٨ دقيقة" },
    { icon: "boulevard", name: "كورنيش جدة", dist: "٤ دقائق" },
    { icon: "hospital", name: "مستشفى جدة الوطني", dist: "٨ دقائق" },
    { icon: "school", name: "مدارس عالمية", dist: "٧ دقائق" },
  ],
  الخبر: [
    { icon: "finance", name: "مركز الخبر التجاري", dist: "٥ دقائق" },
    { icon: "airport", name: "مطار الملك فهد الدولي", dist: "٣٥ دقيقة" },
    { icon: "boulevard", name: "كورنيش الخبر", dist: "٣ دقائق" },
    { icon: "hospital", name: "مستشفى الخبر العام", dist: "٩ دقائق" },
    { icon: "school", name: "مدارس عالمية", dist: "٨ دقائق" },
  ],
};

export function getNearbyLandmarks(city: string): NearbyLandmark[] {
  return NEARBY_BY_CITY[city] ?? DEFAULT_LANDMARKS;
}
