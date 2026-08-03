import { haversineDistanceKm, type GeoPoint } from "@/lib/geo";
import { toArabicDecimal } from "@/lib/format";

export interface NearbyLandmark {
  icon: "finance" | "airport" | "boulevard" | "hospital" | "school";
  name: string;
  dist: string;
}

interface LandmarkEntry extends NearbyLandmark {
  // Real-world coordinates for this landmark. "مستشفى"/"مدارس عالمية" entries
  // are generic category labels in this app's data (not one canonical place),
  // so their coordinates are a representative point in that area rather than
  // a single official address.
  lat: number;
  lng: number;
}

const RIYADH_LANDMARKS: LandmarkEntry[] = [
  { icon: "finance", name: "مركز الملك عبدالله المالي", dist: "٤ دقائق", lat: 24.7635, lng: 46.6412 },
  { icon: "airport", name: "مطار الملك خالد الدولي", dist: "٢٢ دقيقة", lat: 24.9578, lng: 46.6989 },
  { icon: "boulevard", name: "بوليفارد الرياض", dist: "٩ دقائق", lat: 24.7908, lng: 46.6285 },
  { icon: "hospital", name: "مستشفى المملكة", dist: "٧ دقائق", lat: 24.6877, lng: 46.7219 },
  { icon: "school", name: "مدارس عالمية", dist: "٦ دقائق", lat: 24.7136, lng: 46.6753 },
];

const JEDDAH_LANDMARKS: LandmarkEntry[] = [
  { icon: "finance", name: "مركز جدة المالي", dist: "٦ دقائق", lat: 21.5731, lng: 39.1729 },
  { icon: "airport", name: "مطار الملك عبدالعزيز الدولي", dist: "٢٨ دقيقة", lat: 21.6796, lng: 39.1565 },
  { icon: "boulevard", name: "كورنيش جدة", dist: "٤ دقائق", lat: 21.5769, lng: 39.1044 },
  { icon: "hospital", name: "مستشفى جدة الوطني", dist: "٨ دقائق", lat: 21.5500, lng: 39.1728 },
  { icon: "school", name: "مدارس عالمية", dist: "٧ دقائق", lat: 21.5600, lng: 39.1750 },
];

const KHOBAR_LANDMARKS: LandmarkEntry[] = [
  { icon: "finance", name: "مركز الخبر التجاري", dist: "٥ دقائق", lat: 26.2794, lng: 50.2083 },
  { icon: "airport", name: "مطار الملك فهد الدولي", dist: "٣٥ دقيقة", lat: 26.4712, lng: 49.7979 },
  { icon: "boulevard", name: "كورنيش الخبر", dist: "٣ دقائق", lat: 26.2896, lng: 50.2083 },
  { icon: "hospital", name: "مستشفى الخبر العام", dist: "٩ دقائق", lat: 26.2650, lng: 50.2000 },
  { icon: "school", name: "مدارس عالمية", dist: "٨ دقائق", lat: 26.3000, lng: 50.2100 },
];

const LANDMARKS_BY_CITY: Record<string, LandmarkEntry[]> = {
  الرياض: RIYADH_LANDMARKS,
  جدة: JEDDAH_LANDMARKS,
  الخبر: KHOBAR_LANDMARKS,
};

/**
 * `projectLocation`: the project's real coordinates, when set. If provided,
 * distances are genuinely computed (haversine, straight-line) from the
 * project to each landmark's real coordinates — otherwise falls back to the
 * static per-city placeholder strings (legacy behavior, unchanged).
 */
export function getNearbyLandmarks(
  city: string,
  projectLocation: GeoPoint | null,
): NearbyLandmark[] {
  const landmarks = LANDMARKS_BY_CITY[city] ?? RIYADH_LANDMARKS;

  if (!projectLocation) {
    return landmarks.map(({ icon, name, dist }) => ({ icon, name, dist }));
  }

  return landmarks.map(({ icon, name, lat, lng }) => {
    const km = haversineDistanceKm(projectLocation, { lat, lng });
    return { icon, name, dist: `${toArabicDecimal(km, 1)} كم` };
  });
}
