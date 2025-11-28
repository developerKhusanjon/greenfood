import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Scan, User, Beef, Flame, Drumstick, Wheat, Apple, Bone, Pill, EggFried, Croissant, Milk, Banana, SunDim } from "lucide-react-native";
import { useHealth } from "@/contexts/HealthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CalorieDistributionChart from "@/components/CalorieDistributionChart";

// NOTE: The CardWithBubbleBackground component is removed as requested.

export default function TodayScreen() {
    const router = useRouter();
    const { dailyStats } = useHealth();
    const insets = useSafeAreaInsets();

    const healthScoreColor = dailyStats.healthScore >= 70 ? '#10B981' : dailyStats.healthScore >= 40 ? '#F59E0B' : '#EF4444';

    // --- Dynamic Calorie Calculation Function ---
    const calculateKcal = () => {
        const { protein, carbs, fats } = dailyStats.nutrition;

        // Standard Atwater Factors:
        // Protein: 4 kcal/g, Carbs: 4 kcal/g, Fats: 9 kcal/g

        const proteinKcal = protein * 4;
        const carbKcal = carbs * 4;
        const fatKcal = fats * 9;

        const totalKcal = Math.round(proteinKcal + carbKcal + fatKcal);

        return totalKcal;
    };

    // Helper function to format the Calorie display (kcal)
    const renderKcalValue = () => {
        return `${calculateKcal()} kcal`;
    };

    // --- NEW: Component for Bubble Decoration (used in circularProgress) ---
    const BubbleDecoration = ({ isHalf }: { isHalf: boolean }) => (
        <View style={styles.bubbleContainer}>
            <View style={[styles.bubbleDecorator, isHalf ? styles.halfBubble : styles.fullBubble]} />
            {isHalf && <View style={[styles.bubbleDecorator, styles.smallFullBubble]} />}
        </View>
    );
    // ---------------------------------------------

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.background}
            >
                {/* Existing background bubbles */}
                <View style={[styles.bubble1, { top: insets.top + 40 }]} />
                <View style={styles.bubble2} />
                <View style={styles.bubble3} />
                <View style={styles.bubbleDark} />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.header}>Healthy Food</Text>
                    <Text style={styles.subtitle}>Track your healthy journey</Text>

                    <CalorieDistributionChart nutrition={dailyStats.nutrition} />

                    <View style={styles.scanButtonsRow}>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => router.push('/food-scan' as any)}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={['#4CAF50', '#1c771f'] as const}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.scanGradient}
                            >
                                <Scan size={30} color="#FFFFFF" strokeWidth={2.5} />
                                <Text style={styles.scanButtonText}>Scan{"\n"}Food</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => router.push('/face-scan' as any)}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={['#2196F3', '#014f9e'] as const}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.scanGradient}
                            >
                                <User size={30} color="#FFFFFF" strokeWidth={2.5} />
                                <Text style={styles.scanButtonText}>Scan{"\n"}Face</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Calorie/Macro Card - Now a standard View with bubble card styles */}
                    <View style={styles.nutritionCard}>
                        <View style={styles.nutritionItem}>
                            <View style={[styles.nutritionIconCircle, { backgroundColor: '#FFEBE5' }]}>
                                <Flame size={30} color="#FF6B4A" />
                            </View>
                            <View style={styles.nutritionTextContainer}>
                                <Text style={styles.nutritionLabel}>Calories</Text>
                                <Text style={styles.nutritionValue}>{calculateKcal()}</Text>
                                <Text style={styles.nutritionGoal}>/ 2000</Text>
                            </View>
                            <View style={styles.circularProgress}>
                                {/* Bubble decoration for Calories (Full Bubble) */}
                                <BubbleDecoration isHalf={false} />
                                <Text style={styles.kcalPercentageText}>
                                    {renderKcalValue()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.nutritionItem}>
                            <View style={[styles.nutritionIconCircle, { backgroundColor: '#E5F0FF' }]}>
                                <Drumstick size={30} color="#4A90E2" />
                            </View>
                            <View style={styles.nutritionTextContainer}>
                                <Text style={styles.nutritionLabel}>Protein</Text>
                                <Text style={styles.nutritionValue}>{dailyStats.nutrition.protein}g</Text>
                                <Text style={styles.nutritionGoal}>/ 50g</Text>
                            </View>
                            <View style={styles.circularProgress}>
                                {/* Bubble decoration for Protein (Half Bubble) */}
                                <BubbleDecoration isHalf={true} />
                                <Text style={styles.kcalPercentageText}>
                                    {`${Math.round(dailyStats.nutrition.protein * 4)} kcal`}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.nutritionItem}>
                            <View style={[styles.nutritionIconCircle, { backgroundColor: '#fdebf8' }]}>
                                <Croissant size={30} color="#c3419a" />
                            </View>
                            <View style={styles.nutritionTextContainer}>
                                <Text style={styles.nutritionLabel}>Sugar</Text>
                                <Text style={styles.nutritionValue}>{dailyStats.nutrition.sugar}g</Text>
                                <Text style={styles.nutritionGoal}>/ 50g</Text>
                            </View>
                            <View style={styles.circularProgress}>
                                {/* Bubble decoration for Sugar (Full Bubble) */}
                                <BubbleDecoration isHalf={false} />
                                <Text style={styles.kcalPercentageText}>
                                    {`${Math.round(dailyStats.nutrition.sugar * 4)} kcal`}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.nutritionRow}>
                            <View style={styles.macroMini}>
                                <Wheat size={24} color="#EAB308" />
                                <Text style={styles.macroMiniLabel}>Carbs</Text>
                                <Text style={styles.macroMiniValue}>{dailyStats.nutrition.carbs}g</Text>
                            </View>
                            <View style={styles.macroMini}>
                                <Beef size={24} color="#dd3e6e" />
                                <Text style={styles.macroMiniLabel}>Fats</Text>
                                <Text style={styles.macroMiniValue}>{dailyStats.nutrition.fats}g</Text>
                            </View>
                            <View style={styles.macroMini}>
                                <Apple size={24} color="#16A34A" />
                                <Text style={styles.macroMiniLabel}>Fiber</Text>
                                <Text style={styles.macroMiniValue}>{dailyStats.nutrition.fiber}g</Text>
                            </View>
                        </View>
                    </View>
                    {/* End Calorie/Macro Card */}

                    <View style={styles.vitaminsSection}>
                        <Text style={styles.sectionTitle}>Vitamins & Minerals</Text>

                        {/* Vitamins/Minerals Card - Now a standard View with bubble card styles */}
                        <View style={styles.nutritionCard}>
                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionIconCircle, { backgroundColor: '#dfeef1' }]}>
                                    <Bone size={30} color="#849093" />
                                </View>
                                <View style={styles.nutritionTextContainer}>
                                    <Text style={styles.nutritionLabel}>Calcium</Text>
                                    <Text style={styles.nutritionValue}>{dailyStats.nutrition.calories}</Text>
                                    <Text style={styles.nutritionGoal}>/ 1180 mg</Text>
                                </View>
                                {/* Removed Kcal display */}
                                <View style={styles.circularProgress}>
                                    <BubbleDecoration isHalf={true} />
                                    <Text style={styles.mgText}>mg</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionIconCircle, { backgroundColor: '#c4fac8' }]}>
                                    <Pill size={30} color="#5bd664" />
                                </View>
                                <View style={styles.nutritionTextContainer}>
                                    <Text style={styles.nutritionLabel}>Magnesium</Text>
                                    <Text style={styles.nutritionValue}>{dailyStats.nutrition.protein}g</Text>
                                    <Text style={styles.nutritionGoal}>/ 450 mg</Text>
                                </View>
                                {/* Removed Kcal display */}
                                <View style={styles.circularProgress}>
                                    <BubbleDecoration isHalf={false} />
                                    <Text style={styles.mgText}>mg</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.nutritionItem}>
                                <View style={[styles.nutritionIconCircle, { backgroundColor: '#FFF4E5' }]}>
                                    <Banana size={30} color="#FFA726" />
                                </View>
                                <View style={styles.nutritionTextContainer}>
                                    <Text style={styles.nutritionLabel}>Potassium</Text>
                                    <Text style={styles.nutritionValue}>{dailyStats.nutrition.sugar}g</Text>
                                    <Text style={styles.nutritionGoal}>/ 3970 mg</Text>
                                </View>
                                {/* Removed Kcal display */}
                                <View style={styles.circularProgress}>
                                    <BubbleDecoration isHalf={true} />
                                    <Text style={styles.mgText}>mg</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.nutritionRow}>
                                <View style={styles.macroMini}>
                                    <EggFried size={24} color="#EAB308" />
                                    <Text style={styles.macroMiniLabel}>Iron</Text>
                                    <Text style={styles.macroMiniValue}>{dailyStats.nutrition.carbs} mg</Text>
                                </View>
                                <View style={styles.macroMini}>
                                    <Milk size={24} color="#31bfea" />
                                    <Text style={styles.macroMiniLabel}>Zinc</Text>
                                    <Text style={styles.macroMiniValue}>{dailyStats.nutrition.fats} mg</Text>
                                </View>
                                <View style={styles.macroMini}>
                                    <SunDim size={30} color="#f4d58b" />
                                    <Text style={styles.macroMiniLabel}>Vitamin D</Text>
                                    <Text style={styles.macroMiniValue}>{dailyStats.nutrition.fiber} UI</Text>
                                </View>
                            </View>
                        </View>
                        {/* End Vitamins/Minerals Card */}
                    </View>

                    {dailyStats.faceAnalysis && (
                        <TouchableOpacity
                            style={styles.faceAnalysisSection}
                            onPress={() => router.push('/face-results' as any)}
                        >
                            <View style={styles.faceAnalysisHeader}>
                                <View style={styles.faceAnalysisIconWrapper}>
                                    <View style={styles.faceAnalysisIcon}>
                                        <Text style={styles.faceAnalysisIconText}>✨</Text>
                                    </View>
                                    <Text style={styles.faceAnalysisTitle}>Face Analysis</Text>
                                </View>
                                <Text style={styles.viewMore}>›</Text>
                            </View>

                            <View style={styles.moodCard}>
                                <View style={styles.moodEmoji}>
                                    <Text style={styles.moodEmojiText}>😊</Text>
                                </View>
                                <View style={styles.moodInfo}>
                                    <Text style={styles.moodLabel}>{dailyStats.faceAnalysis.mood}</Text>
                                    <Text style={styles.moodConfidence}>
                                        {dailyStats.faceAnalysis.confidence}% confidence
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
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
        backgroundColor: '#E8F5E9',
    },
    background: {
        flex: 1,
        position: 'relative',
    },
    bubble1: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(129, 199, 132, 0.3)',
        right: 30,
    },
    bubble2: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(165, 214, 167, 0.25)',
        left: 40,
        top: 200,
    },
    bubble3: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(200, 230, 201, 0.35)',
        right: 50,
        bottom: 300,
    },
    bubbleDark: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(27, 94, 32, 0.15)',
        left: 20,
        bottom: 150,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        fontSize: 34,
        fontWeight: '800' as const,
        color: '#1B5E20',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#2E7D32',
        marginBottom: 24,
    },
    scanButtonsRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 20,
        gap: 27,
    },
    scanButton: {
        flex: 1,
        borderRadius: 35,
        overflow: 'hidden',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        alignItems: 'flex-start',
    },
    scanGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 12,
        gap: 8,
    },
    scanButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
        marginLeft: 20,
        marginRight: 10,
        fontWeight: '700' as const,
    },
    // --- Card Styles (Re-used for both main cards) ---
    nutritionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 55,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
    },
    // --- Bubble Decoration Styles (NEW) ---
    bubbleContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 28, // Match circularProgress
    },
    bubbleDecorator: {
        position: 'absolute',
        backgroundColor: 'rgba(165, 214, 167, 0.4)', // Light green color
    },
    fullBubble: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        right: -10,
    },
    halfBubble: {
        width: 80,
        height: 80,
        borderRadius: 40,
        right: -40,
    },
    smallFullBubble: {
        width: 30,
        height: 30,
        borderRadius: 15,
        right: 15,
        top: 10,
    },
    // --- End Bubble Decoration Styles ---
    nutritionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
    },
    nutritionIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        marginLeft: 10,
    },
    nutritionTextContainer: {
        flex: 1,
    },
    nutritionLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
        fontWeight: '500' as const,
    },
    nutritionValue: {
        fontSize: 24,
        fontWeight: '800' as const,
        color: '#1F2937',
    },
    nutritionGoal: {
        fontSize: 14,
        color: '#9CA3AF',
        marginTop: -2,
    },
    circularProgress: {
        width: 90, // Increased width slightly to accommodate decorations
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // Needed for absolute positioning of BubbleDecoration
    },
    // Style for the kcal text (z-index ensures it sits above the bubbles)
    kcalPercentageText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: '#1F2937',
        textAlign: 'center',
        zIndex: 2,
    },
    mgText: {
        fontSize: 14,
        fontWeight: '700' as const,
        color: '#6B7280',
        textAlign: 'center',
        zIndex: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    nutritionRow: {
        flexDirection: 'row',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 8,
        gap: 8,
    },
    macroMini: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    macroMiniLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500' as const,
    },
    macroMiniValue: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1F2937',
    },
    vitaminsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1B5E20',
        marginBottom: 16,
    },
    vitaminRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    vitaminLeft: {
        flex: 1,
    },
    vitaminName: {
        fontSize: 15,
        fontWeight: '600' as const,
        color: '#1F2937',
        marginBottom: 4,
    },
    vitaminAmount: {
        fontSize: 13,
        color: '#6B7280',
    },
    vitaminRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    vitaminBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    vitaminBar: {
        height: '100%',
        borderRadius: 4,
    },
    vitaminPercent: {
        fontSize: 14,
        fontWeight: '700' as const,
        minWidth: 45,
        textAlign: 'right',
    },
    vitaminDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    faceAnalysisSection: {
        marginBottom: 24,
    },
    faceAnalysisHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    faceAnalysisIconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    faceAnalysisIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    faceAnalysisIconText: {
        fontSize: 20,
    },
    faceAnalysisTitle: {
        fontSize: 20,
        fontWeight: '700' as const,
        color: '#1F2937',
    },
    viewMore: {
        fontSize: 32,
        color: '#9CA3AF',
        fontWeight: '300' as const,
    },
    moodCard: {
        backgroundColor: '#D1FAE5',
        borderRadius: 50,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    moodEmoji: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    moodEmojiText: {
        fontSize: 36,
    },
    moodInfo: {
        flex: 1,
    },
    moodLabel: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: '#10B981',
        marginBottom: 4,
    },
    moodConfidence: {
        fontSize: 16,
        color: '#065F46',
    },
});