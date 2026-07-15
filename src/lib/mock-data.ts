export type ReportStatus =
  | "Submitted"
  | "Under Review"
  | "Assigned"
  | "In Progress"
  | "Resolved"
  | "Closed";

export type Report = {
  id: string;
  title: string;
  category: string;
  status: ReportStatus;
  ward: string;
  location: string;
  submittedAt: string;
  urgency: "Low" | "Medium" | "High" | "Critical";
  votes: number;
};

export const CATEGORIES = [
  "Water Outage",
  "Burst Pipe",
  "Electricity Failure",
  "Broken Streetlight",
  "Pothole",
  "Damaged Road",
  "Sewer Blockage",
  "Illegal Dumping",
  "Missed Waste Collection",
  "Flood Damage",
  "Fallen Tree",
  "Damaged Public Facility",
  "Vandalism",
  "Other",
];

export const REPORTS: Report[] = [
  { id: "CC-1042", title: "No water for 3 days on Mvutshini Rd", category: "Water Outage", status: "In Progress", ward: "Ward 6", location: "Mvutshini Main Rd", submittedAt: "2h ago", urgency: "High", votes: 42 },
  { id: "CC-1041", title: "Large pothole near primary school", category: "Pothole", status: "Assigned", ward: "Ward 6", location: "School St", submittedAt: "5h ago", urgency: "Medium", votes: 18 },
  { id: "CC-1040", title: "Streetlight out — dark corner", category: "Broken Streetlight", status: "Under Review", ward: "Ward 5", location: "Beach Rd", submittedAt: "9h ago", urgency: "Medium", votes: 11 },
  { id: "CC-1039", title: "Sewer overflowing into stream", category: "Sewer Blockage", status: "In Progress", ward: "Ward 6", location: "Lower Mvutshini", submittedAt: "1d ago", urgency: "Critical", votes: 87 },
  { id: "CC-1038", title: "Illegal dumping behind clinic", category: "Illegal Dumping", status: "Resolved", ward: "Ward 7", location: "Clinic Rd", submittedAt: "2d ago", urgency: "Low", votes: 6 },
  { id: "CC-1037", title: "Missed refuse collection this week", category: "Missed Waste Collection", status: "Submitted", ward: "Ward 6", location: "Hillside", submittedAt: "3d ago", urgency: "Low", votes: 24 },
  { id: "CC-1036", title: "Flood damage to bridge", category: "Flood Damage", status: "Assigned", ward: "Ward 8", location: "River Bridge", submittedAt: "4d ago", urgency: "High", votes: 55 },
  { id: "CC-1035", title: "Burst pipe flooding road", category: "Burst Pipe", status: "Resolved", ward: "Ward 5", location: "Market St", submittedAt: "5d ago", urgency: "High", votes: 33 },
];

export const ALERTS = [
  { id: 1, type: "Water", severity: "high", title: "Planned water interruption — Mvutshini & Oslo Beach", body: "Ugu District Municipality will conduct pipe maintenance. Water off 08:00–17:00.", when: "Tomorrow" },
  { id: 2, type: "Electricity", severity: "medium", title: "Load shedding Stage 3 tonight", body: "Ward 6 affected 18:00–20:30 per Eskom schedule.", when: "Today" },
  { id: 3, type: "Weather", severity: "high", title: "Severe thunderstorm warning — KZN South Coast", body: "SAWS: heavy rainfall & possible flooding in low-lying areas.", when: "Today" },
  { id: 4, type: "Roads", severity: "low", title: "R61 lane closure for pothole repairs", body: "Expect delays between Port Shepstone and Margate 09:00–15:00.", when: "Thu" },
];

export const DIRECTORY = [
  { name: "Ward 6 Councillor — S. Mkhize", category: "Ward Councillor", phone: "039 682 5555", email: "ward6@rsm.gov.za", hours: "Mon–Fri 08:00–16:00", ward: "Ward 6" },
  { name: "Ugu District Water Services", category: "Water", phone: "039 688 5700", email: "water@ugu.gov.za", hours: "24/7 emergency", ward: "All" },
  { name: "Eskom Fault Reporting", category: "Electricity", phone: "08600 37566", email: "customerservices@eskom.co.za", hours: "24/7", ward: "All" },
  { name: "Roads & Infrastructure — RSM", category: "Roads", phone: "039 688 2000", email: "roads@rsm.gov.za", hours: "Mon–Fri 07:30–16:00", ward: "All" },
  { name: "Waste Management Office", category: "Waste", phone: "039 688 2100", email: "waste@rsm.gov.za", hours: "Mon–Fri 08:00–16:00", ward: "All" },
  { name: "Port Shepstone SAPS", category: "SAPS", phone: "039 688 5000", email: "-", hours: "24/7", ward: "All" },
  { name: "Port Shepstone Regional Hospital", category: "Health", phone: "039 688 6000", email: "-", hours: "24/7", ward: "All" },
  { name: "KZN Disaster Management", category: "Disaster", phone: "033 260 5000", email: "disaster@kzncogta.gov.za", hours: "24/7", ward: "All" },
];

export const PETITIONS = [
  { id: 1, title: "Fix Mvutshini Main Road potholes urgently", signatures: 428, target: 500, ward: "Ward 6", status: "Open" },
  { id: 2, title: "Restore reliable water supply to Lower Mvutshini", signatures: 1120, target: 1000, ward: "Ward 6", status: "Submitted to Municipality" },
  { id: 3, title: "Install streetlights on Beach Rd corridor", signatures: 214, target: 400, ward: "Ward 5", status: "Open" },
];

export const FORUM = [
  { id: 1, author: "Nomsa D.", topic: "Water tanker schedule this week?", replies: 12, upvotes: 34, ward: "Ward 6", time: "1h ago" },
  { id: 2, author: "Sipho M.", topic: "Confirming sewer leak near stream — added photos", replies: 8, upvotes: 21, ward: "Ward 6", time: "3h ago" },
  { id: 3, author: "Anonymous", topic: "Who to contact about illegal dumping behind clinic?", replies: 5, upvotes: 14, ward: "Ward 7", time: "5h ago" },
  { id: 4, author: "Thabo K.", topic: "Load shedding schedule discussion", replies: 22, upvotes: 41, ward: "All", time: "1d ago" },
];

export const statusColor = (s: ReportStatus): string => {
  switch (s) {
    case "Submitted": return "bg-muted text-muted-foreground";
    case "Under Review": return "bg-info/15 text-info";
    case "Assigned": return "bg-warning/20 text-warning-foreground";
    case "In Progress": return "bg-warning/25 text-warning-foreground";
    case "Resolved": return "bg-success/15 text-success";
    case "Closed": return "bg-muted text-muted-foreground";
  }
};

export const urgencyColor = (u: Report["urgency"]) => {
  switch (u) {
    case "Critical": return "bg-destructive text-destructive-foreground";
    case "High": return "bg-warning text-warning-foreground";
    case "Medium": return "bg-info/20 text-info";
    case "Low": return "bg-muted text-muted-foreground";
  }
};
