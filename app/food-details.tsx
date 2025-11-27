import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useHealth } from "@/contexts/HealthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Trash2, Flame, Drumstick, Candy, Apple, ChevronLeft } from "lucide-react-native";

export default function FoodDetailsScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { allFoods, deleteFoodScan } = useHealth();
    const insets = useSafeAreaInsets();
    const foodId = params.id as string;

    const food = allFoods.find(f => f.id === foodId);

    if (!food) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Food item not found</Text>
            </View>
        );
    }

    const handleDelete = () => {
        Alert.alert(
            "Delete Food",
            "Are you sure you want to delete this food scan?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteFoodScan(foodId);
                        router.back();
                    },
                },
            ]
        );
    };

    const healthColor = food.healthStatus === 'Very Healthy' || food.healthStatus === 'Healthy'
        ? '#10B981'
        : food.healthStatus === 'Moderate'
            ? '#F59E0B'
            : '#EF4444';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E8F5E9', '#F9FAFB', '#F9FAFB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.3 }}
                style={styles.background}
            >
                <View style={[styles.headerBar, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Food Details</Text>
                    <TouchableOpacity style={styles.deleteButtonHeader} onPress={handleDelete}>
                        <Trash2 size={20} color="#EF4444" />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>{food.name}</Text>
                        <Text style={styles.timestamp}>
                            {food.timestamp.toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </View>

                    <View style={[styles.healthScoreCard, { backgroundColor: `${healthColor}15` }]}>
                        <View style={styles.scoreContainer}>
                            <Text style={[styles.scoreNumber, { color: healthColor }]}>{food.healthScore}</Text>
                            <Text style={styles.scoreLabel}>Health Score</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: healthColor }]}>
                            <Text style={styles.statusText}>{food.healthStatus}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
                        <View style={styles.nutritionGrid}>
                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionIcon, { backgroundColor: '#FEE2E2' }]}>
                                    <Flame size={24} color="#EF4444" />
                                </View>
                                <Text style={styles.nutritionLabel}>Calories</Text>
                                <Text style={styles.nutritionValue}>{food.nutrition.calories}</Text>
                            </View>

                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionIcon, { backgroundColor: '#DBEAFE' }]}>
                                    <Drumstick size={24} color="#3B82F6" />
                                </View>
                                <Text style={styles.nutritionLabel}>Protein</Text>
                                <Text style={styles.nutritionValue}>{food.nutrition.protein}g</Text>
                            </View>

                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <Candy size={24} color="#F59E0B" />
                                </View>
                                <Text style={styles.nutritionLabel}>Sugar</Text>
                                <Text style={styles.nutritionValue}>{food.nutrition.sugar}g</Text>
                            </View>

                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionIcon, { backgroundColor: '#DCFCE7' }]}>
                                    <Apple size={24} color="#10B981" />
                                </View>
                                <Text style={styles.nutritionLabel}>Fiber</Text>
                                <Text style={styles.nutritionValue}>{food.nutrition.fiber}g</Text>
                            </View>
                        </View>

                        <View style={styles.macrosRow}>
                            <View style={styles.macroBox}>
                                <Text style={styles.macroLabel}>Carbs</Text>
                                <Text style={styles.macroValue}>{food.nutrition.carbs}g</Text>
                            </View>
                            <View style={styles.macroBox}>
                                <Text style={styles.macroLabel}>Fats</Text>
                                <Text style={styles.macroValue}>{food.nutrition.fats}g</Text>
                            </View>
                        </View>
                    </View>

                    {food.vitamins && food.vitamins.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Vitamins & Minerals</Text>
                            <View style={styles.vitaminsContainer}>
                                {food.vitamins.map((vitamin, index) => (
                                    <View key={index} style={[styles.vitaminCard, { backgroundColor: `${vitamin.color}15` }]}>
                                        <View style={styles.vitaminHeader}>
                                            <View style={[styles.vitaminDot, { backgroundColor: vitamin.color }]} />
                                            <Text style={styles.vitaminName}>{vitamin.name}</Text>
                                        </View>
                                        <Text style={styles.vitaminValue}>
                                            {vitamin.value.toFixed(1)} <Text style={styles.vitaminUnit}>{vitamin.unit}</Text>
                                        </Text>
                                        <View style={styles.vitaminProgress}>
                                            <View style={styles.vitaminProgressBg}>
                                                <View
                                                    style={[
                                                        styles.vitaminProgressFill,
                                                        {
                                                            width: `${Math.min(vitamin.percentage, 100)}%`,
                                                            backgroundColor: vitamin.color,
                                                        },
                                                    ]}
                                                />
                                            </View>
                                            <Text style={[styles.vitaminPercentage, { color: vitamin.color }]}>
                                                {vitamin.percentage}%
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {food.ingredients && food.ingredients.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            <View style={styles.ingredientsList}>
                                {food.ingredients.map((ingredient, index) => (
                                    <View key={index} style={styles.ingredientItem}>
                                        <View style={styles.ingredientBullet} />
                                        <Text style={styles.ingredientText}>{ingredient}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    background: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1F2937',
    },
    deleteButtonHeader: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    titleSection: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '800' as const,
        color: '#1F2937',
        marginBottom: 6,
    },
    timestamp: {
        fontSize: 15,
        color: '#6B7280',
    },
    healthScoreCard: {
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    scoreContainer: {
        alignItems: 'flex-start',
    },
    scoreNumber: {
        fontSize: 56,
        fontWeight: '800' as const,
    },
    scoreLabel: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    statusBadge: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: '#FFFFFF',
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1F2937',
        marginBottom: 20,
    },
    nutritionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 16,
    },
    nutritionItem: {
        width: '47%',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
    },
    nutritionIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    nutritionLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    nutritionValue: {
        fontSize: 24,
        fontWeight: '700' as const,
        color: '#1F2937',
    },
    macrosRow: {
        flexDirection: 'row',
        gap: 16,
    },
    macroBox: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        alignItems: 'center',
    },
    macroLabel: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 4,
    },
    macroValue: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: '#1F2937',
    },
    vitaminsContainer: {
        gap: 12,
    },
    vitaminCard: {
        padding: 16,
        borderRadius: 16,
    },
    vitaminHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    vitaminDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    vitaminName: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: '#1F2937',
    },
    vitaminValue: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1F2937',
        marginBottom: 8,
    },
    vitaminUnit: {
        fontSize: 14,
        fontWeight: '500' as const,
        color: '#6B7280',
    },
    vitaminProgress: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    vitaminProgressBg: {
        flex: 1,
        height: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        overflow: 'hidden',
    },
    vitaminProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    vitaminPercentage: {
        fontSize: 14,
        fontWeight: '700' as const,
        minWidth: 40,
        textAlign: 'right',
    },
    ingredientsList: {
        gap: 10,
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ingredientBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#7C3AED',
    },
    ingredientText: {
        flex: 1,
        fontSize: 15,
        color: '#4B5563',
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});
