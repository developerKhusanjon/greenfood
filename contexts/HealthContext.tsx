import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyStats, FoodScanData, FaceAnalysisData } from '@/types';
import { mockDailyStats, mockFoodScans, mockVitaminsWeekly } from '@/mocks/healthData';

const STORAGE_KEY = 'health_data';

export const [HealthProvider, useHealth] = createContextHook(() => {
    const [dailyStats, setDailyStats] = useState<DailyStats>(mockDailyStats);
    const [allFoods, setAllFoods] = useState<FoodScanData[]>(mockFoodScans);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setAllFoods(parsed.allFoods || mockFoodScans);
                setDailyStats(parsed.dailyStats || mockDailyStats);
            }
        } catch (error) {
            console.log('Error loading health data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveData = async (foods: FoodScanData[], stats: DailyStats) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({
                allFoods: foods,
                dailyStats: stats,
            }));
        } catch (error) {
            console.log('Error saving health data:', error);
        }
    };

    const addFoodScan = (food: FoodScanData) => {
        const updatedFoods = [food, ...allFoods];
        setAllFoods(updatedFoods);

        const todayFoods = updatedFoods.filter(f => {
            const diff = Date.now() - f.timestamp.getTime();
            return diff < 24 * 60 * 60 * 1000;
        });

        const totalNutrition = todayFoods.reduce((acc, f) => ({
            calories: acc.calories + f.nutrition.calories,
            protein: acc.protein + f.nutrition.protein,
            sugar: acc.sugar + f.nutrition.sugar,
            carbs: acc.carbs + f.nutrition.carbs,
            fats: acc.fats + f.nutrition.fats,
            fiber: acc.fiber + f.nutrition.fiber,
        }), { calories: 0, protein: 0, sugar: 0, carbs: 0, fats: 0, fiber: 0 });

        const avgHealthScore = todayFoods.length > 0
            ? Math.round(todayFoods.reduce((acc, f) => acc + f.healthScore, 0) / todayFoods.length)
            : 50;

        const updatedStats: DailyStats = {
            ...dailyStats,
            healthScore: avgHealthScore,
            nutrition: totalNutrition,
            foods: todayFoods,
        };

        setDailyStats(updatedStats);
        saveData(updatedFoods, updatedStats);
    };

    const updateFaceAnalysis = (analysis: FaceAnalysisData) => {
        const updatedStats: DailyStats = {
            ...dailyStats,
            faceAnalysis: analysis,
        };
        setDailyStats(updatedStats);
        saveData(allFoods, updatedStats);
    };

    const deleteFoodScan = (id: string) => {
        const updatedFoods = allFoods.filter(f => f.id !== id);
        setAllFoods(updatedFoods);

        const todayFoods = updatedFoods.filter(f => {
            const diff = Date.now() - f.timestamp.getTime();
            return diff < 24 * 60 * 60 * 1000;
        });

        const totalNutrition = todayFoods.reduce((acc, f) => ({
            calories: acc.calories + f.nutrition.calories,
            protein: acc.protein + f.nutrition.protein,
            sugar: acc.sugar + f.nutrition.sugar,
            carbs: acc.carbs + f.nutrition.carbs,
            fats: acc.fats + f.nutrition.fats,
            fiber: acc.fiber + f.nutrition.fiber,
        }), { calories: 0, protein: 0, sugar: 0, carbs: 0, fats: 0, fiber: 0 });

        const avgHealthScore = todayFoods.length > 0
            ? Math.round(todayFoods.reduce((acc, f) => acc + f.healthScore, 0) / todayFoods.length)
            : 50;

        const updatedStats: DailyStats = {
            ...dailyStats,
            healthScore: avgHealthScore,
            nutrition: totalNutrition,
            foods: todayFoods,
        };

        setDailyStats(updatedStats);
        saveData(updatedFoods, updatedStats);
    };

    const weeklyVitamins = useMemo(() => {
        return mockVitaminsWeekly;
    }, []);

    const todayFoods = useMemo(() => {
        return allFoods.filter(f => {
            const diff = Date.now() - f.timestamp.getTime();
            return diff < 24 * 60 * 60 * 1000;
        });
    }, [allFoods]);

    return {
        dailyStats,
        allFoods,
        todayFoods,
        weeklyVitamins,
        isLoading,
        addFoodScan,
        updateFaceAnalysis,
        deleteFoodScan,
    };
});
