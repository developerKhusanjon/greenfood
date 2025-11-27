export interface NutritionData {
    calories: number;
    protein: number;
    sugar: number;
    carbs: number;
    fats: number;
    fiber: number;
}

export interface VitaminMineralData {
    name: string;
    value: number;
    unit: string;
    percentage: number;
    color: string;
}

export interface FaceAnalysisData {
    mood: string;
    confidence: number;
    skinHealth: string;
    deficiencies: string[];
    concerns: string[];
    recommendations: string[];
    ethnicity?: string;
    additionalNotes: string[];
    timestamp: Date;
}

export interface FoodScanData {
    id: string;
    name: string;
    timestamp: Date;
    healthScore: number;
    healthStatus: 'Very Healthy' | 'Healthy' | 'Moderate' | 'Unhealthy';
    nutrition: NutritionData;
    vitamins: VitaminMineralData[];
    ingredients?: string[];
}

export interface DailyStats {
    date: Date;
    healthScore: number;
    nutrition: NutritionData;
    vitamins: VitaminMineralData[];
    faceAnalysis?: FaceAnalysisData;
    foods: FoodScanData[];
}
