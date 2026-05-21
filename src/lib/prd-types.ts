export interface FormData {
  // Step 1: Informasi Bisnis
  businessName: string;
  industry: string;
  businessDescription: string;
  contactName: string;
  contactEmail: string;

  // Step 2: Masalah yang Ingin Diselesaikan
  mainProblem: string;
  currentSolution: string;
  businessImpact: string;

  // Step 3: Target Pengguna
  targetUsers: string;
  estimatedUsers: string;
  techFamiliarity: string;
  devices: string[];

  // Step 4: Fitur yang Diinginkan
  features: FeatureItem[];
  priorityFeatures: string;
  specialFeatures: string;
  integrations: string;

  // Step 5: Tujuan & Target
  mainGoal: string;
  targetTimeline: string;
  budget: string;
  kpi: string;
  deadline: string;
}

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
}

export const initialFormData: FormData = {
  businessName: "",
  industry: "",
  businessDescription: "",
  contactName: "",
  contactEmail: "",
  mainProblem: "",
  currentSolution: "",
  businessImpact: "",
  targetUsers: "",
  estimatedUsers: "",
  techFamiliarity: "",
  devices: [],
  features: [{ id: "1", name: "", description: "" }],
  priorityFeatures: "",
  specialFeatures: "",
  integrations: "",
  mainGoal: "",
  targetTimeline: "",
  budget: "",
  kpi: "",
  deadline: "",
};

export const STEPS = [
  { id: 1, title: "Informasi Bisnis", icon: "Building2" },
  { id: 2, title: "Masalah", icon: "AlertTriangle" },
  { id: 3, title: "Target Pengguna", icon: "Users" },
  { id: 4, title: "Fitur", icon: "Puzzle" },
  { id: 5, title: "Tujuan & Target", icon: "Target" },
  { id: 6, title: "Ringkasan", icon: "ClipboardCheck" },
] as const;

export const INDUSTRIES = [
  "Retail",
  "F&B",
  "Jasa",
  "Teknologi",
  "Pendidikan",
  "Kesehatan",
  "Keuangan",
  "Properti",
  "Manufaktur",
  "Logistik",
  "Lainnya",
] as const;

export const USER_ESTIMATES = [
  { value: "<50", label: "Kurang dari 50" },
  { value: "50-200", label: "50 - 200" },
  { value: "200-1000", label: "200 - 1.000" },
  { value: "1000-5000", label: "1.000 - 5.000" },
  { value: ">5000", label: "Lebih dari 5.000" },
] as const;

export const TECH_FAMILIARITY = [
  "Sangat terbiasa",
  "Cukup terbiasa",
  "Kurang terbiasa",
  "Tidak terbiasa sama sekali",
] as const;

export const DEVICE_OPTIONS = [
  "Smartphone",
  "Tablet",
  "Laptop/PC",
  "Semua",
] as const;

export const TIMELINE_OPTIONS = [
  { value: "1-bulan", label: "1 bulan" },
  { value: "3-bulan", label: "3 bulan" },
  { value: "6-bulan", label: "6 bulan" },
  { value: "12-bulan", label: "12 bulan" },
  { value: ">12-bulan", label: "Lebih dari 12 bulan" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "<5-juta", label: "Kurang dari Rp 5 juta" },
  { value: "5-15-juta", label: "Rp 5 - 15 juta" },
  { value: "15-50-juta", label: "Rp 15 - 50 juta" },
  { value: "50-100-juta", label: "Rp 50 - 100 juta" },
  { value: "100-500-juta", label: "Rp 100 - 500 juta" },
  { value: ">500-juta", label: "Lebih dari Rp 500 juta" },
  { value: "belum-tahu", label: "Belum tahu / Butuh konsultasi" },
] as const;
