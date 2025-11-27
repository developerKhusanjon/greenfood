import { DailyStats, FoodScanData, VitaminMineralData, FaceAnalysisData } from '@/types';

export const VITAMIN_COLORS = {
    'Vitamin D': '#FF9B71',
    'Vitamin C': '#FFA94D',
    'Vitamin A': '#FFB347',
    'Vitamin B': '#F59E0B',
    'Vitamin E': '#FB923C',
    'Iron': '#EF4444',
    'Calcium': '#10B981',
    'Magnesium': '#8B5CF6',
    'Zinc': '#3B82F6',
    'Potassium': '#EC4899',
};

export const DAILY_VITAMIN_GOALS: Record<string, { value: number; unit: string }> = {
    'Vitamin D': { value: 800, unit: 'IU' },
    'Vitamin C': { value: 115, unit: 'mg' },
    'Vitamin A': { value: 900, unit: 'mcg' },
    'Vitamin B': { value: 69, unit: 'mg' },
    'Vitamin E': { value: 65, unit: 'mg' },
    'Iron': { value: 18, unit: 'mg' },
    'Calcium': { value: 1000, unit: 'mg' },
    'Magnesium': { value: 400, unit: 'mg' },
    'Zinc': { value: 11, unit: 'mg' },
    'Potassium': { value: 3400, unit: 'mg' },
};

export const mockVitaminsWeekly: VitaminMineralData[] = [
    { name: 'Vitamin D', value: 16.0, unit: 'IU', percentage: 2, color: VITAMIN_COLORS['Vitamin D'] },
    { name: 'Vitamin C', value: 115.0, unit: 'mg', percentage: 100, color: VITAMIN_COLORS['Vitamin C'] },
    { name: 'Vitamin A', value: 120.0, unit: 'mcg', percentage: 13, color: VITAMIN_COLORS['Vitamin A'] },
    { name: 'Vitamin B', value: 69.0, unit: 'mg', percentage: 100, color: VITAMIN_COLORS['Vitamin B'] },
    { name: 'Vitamin E', value: 65.0, unit: 'mg', percentage: 100, color: VITAMIN_COLORS['Vitamin E'] },
    { name: 'Iron', value: 14.5, unit: 'mg', percentage: 81, color: VITAMIN_COLORS['Iron'] },
    { name: 'Calcium', value: 850.0, unit: 'mg', percentage: 85, color: VITAMIN_COLORS['Calcium'] },
    { name: 'Magnesium', value: 320.0, unit: 'mg', percentage: 80, color: VITAMIN_COLORS['Magnesium'] },
    { name: 'Zinc', value: 9.5, unit: 'mg', percentage: 86, color: VITAMIN_COLORS['Zinc'] },
    { name: 'Potassium', value: 2800.0, unit: 'mg', percentage: 82, color: VITAMIN_COLORS['Potassium'] },
];

export const mockFaceAnalysis: FaceAnalysisData = {
    mood: 'Happy',
    confidence: 87,
    skinHealth: 'Good',
    deficiencies: ['Possible Vitamin D deficiency (due to dullness) and maybe staying indoor much of the time', 'Possible Vitamin B complex deficiency (if fatigue persi....).... possible inactivity and lack of calory burn'],
    concerns: ['mild dehydration signs', 'slight dark circles'],
    recommendations: [
        'Increase water intake to 8-10 glasses daily',
        'Get 7-8 hours of quality sleep',
        'Consider vitamin D supplementation',
    ],
    ethnicity: 'Asian',
    additionalNotes: ['Good overall skin tone', 'Healthy facial structure'],
    timestamp: new Date(),
};

export const mockFoodScans: FoodScanData[] = [
    {
        id: '1',
        name: 'Greek Salad with Grilled Chicken',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        healthScore: 92,
        healthStatus: 'Very Healthy',
        nutrition: {
            calories: 385,
            protein: 42,
            sugar: 8,
            carbs: 28,
            fats: 15,
            fiber: 6,
        },
        vitamins: [
            { name: 'Vitamin A', value: 85, unit: 'mcg', percentage: 9, color: VITAMIN_COLORS['Vitamin A'] },
            { name: 'Vitamin C', value: 45, unit: 'mg', percentage: 39, color: VITAMIN_COLORS['Vitamin C'] },
            { name: 'Iron', value: 3.2, unit: 'mg', percentage: 18, color: VITAMIN_COLORS['Iron'] },
            { name: 'Calcium', value: 180, unit: 'mg', percentage: 18, color: VITAMIN_COLORS['Calcium'] },
        ],
        ingredients: ['Chicken breast', 'Romaine lettuce', 'Tomatoes', 'Cucumbers', 'Feta cheese', 'Olive oil', 'Lemon juice'],
    },
    {
        id: '2',
        name: 'Sugar Cookies',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        healthScore: 2,
        healthStatus: 'Unhealthy',
        nutrition: {
            calories: 200,
            protein: 2,
            sugar: 18,
            carbs: 28,
            fats: 9,
            fiber: 0,
        },
        vitamins: [
            { name: 'Iron', value: 0.8, unit: 'mg', percentage: 4, color: VITAMIN_COLORS['Iron'] },
        ],
        ingredients: ['Flour', 'Sugar', 'Butter', 'Eggs', 'Vanilla extract'],
    },
    {
        id: '3',
        name: 'Salmon with Quinoa',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        healthScore: 95,
        healthStatus: 'Very Healthy',
        nutrition: {
            calories: 450,
            protein: 38,
            sugar: 3,
            carbs: 35,
            fats: 18,
            fiber: 5,
        },
        vitamins: [
            { name: 'Vitamin D', value: 12, unit: 'IU', percentage: 2, color: VITAMIN_COLORS['Vitamin D'] },
            { name: 'Vitamin B', value: 25, unit: 'mg', percentage: 36, color: VITAMIN_COLORS['Vitamin B'] },
            { name: 'Iron', value: 2.8, unit: 'mg', percentage: 16, color: VITAMIN_COLORS['Iron'] },
            { name: 'Magnesium', value: 95, unit: 'mg', percentage: 24, color: VITAMIN_COLORS['Magnesium'] },
        ],
    },
    {
        id: '4',
        name: 'Berry Smoothie Bowl',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000),
        healthScore: 88,
        healthStatus: 'Very Healthy',
        nutrition: {
            calories: 320,
            protein: 12,
            sugar: 24,
            carbs: 52,
            fats: 8,
            fiber: 9,
        },
        vitamins: [
            { name: 'Vitamin C', value: 70, unit: 'mg', percentage: 61, color: VITAMIN_COLORS['Vitamin C'] },
            { name: 'Vitamin E', value: 18, unit: 'mg', percentage: 28, color: VITAMIN_COLORS['Vitamin E'] },
            { name: 'Calcium', value: 220, unit: 'mg', percentage: 22, color: VITAMIN_COLORS['Calcium'] },
        ],
    },
];

export const mockDailyStats: DailyStats = {
    date: new Date(),
    healthScore: 50,
    nutrition: {
        calories: 2025,
        protein: 104,
        sugar: 59,
        carbs: 224,
        fats: 79,
        fiber: 22,
    },
    vitamins: mockVitaminsWeekly,
    faceAnalysis: mockFaceAnalysis,
    foods: mockFoodScans.filter(f => {
        const diff = Date.now() - f.timestamp.getTime();
        return diff < 24 * 60 * 60 * 1000;
    }),
};
