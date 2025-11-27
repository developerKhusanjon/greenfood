import { StyleSheet, Text, View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useHealth } from "@/contexts/HealthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TrendingUp, Flame, Drumstick } from "lucide-react-native";

const weeklyData = [
    { day: 'Mon', calories: 1850, protein: 95, healthScore: 85, label: 'M' },
    { day: 'Tue', calories: 2100, protein: 88, healthScore: 72, label: 'T' },
    { day: 'Wed', calories: 1920, protein: 102, healthScore: 90, label: 'W' },
    { day: 'Thu', calories: 2050, protein: 79, healthScore: 78, label: 'T' },
    { day: 'Fri', calories: 1980, protein: 98, healthScore: 88, label: 'F' },
    { day: 'Sat', calories: 2200, protein: 105, healthScore: 95, label: 'S' },
    { day: 'Sun', calories: 1900, protein: 92, healthScore: 82, label: 'S' },
];

export default function WeeklyStatsScreen() {
    const { weeklyVitamins } = useHealth();
    const insets = useSafeAreaInsets();

    const avgHealthScore = Math.round(
        weeklyData.reduce((acc, d) => acc + d.healthScore, 0) / weeklyData.length
    );

    const avgCalories = Math.round(
        weeklyData.reduce((acc, d) => acc + d.calories, 0) / weeklyData.length
    );

    const avgProtein = Math.round(
        weeklyData.reduce((acc, d) => acc + d.protein, 0) / weeklyData.length
    );

    const maxHealthScore = Math.max(...weeklyData.map(d => d.healthScore));
    const maxCalories = Math.max(...weeklyData.map(d => d.calories));
    const maxProtein = Math.max(...weeklyData.map(d => d.protein));

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E8F5E9', '#C8E6C9', '#A5D6A7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.background}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: 100 }]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.header}>Weekly Stats</Text>
                    <Text style={styles.subtitle}>Your nutrition insights</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
                                <TrendingUp size={20} color="#16A34A" />
                            </View>
                            <Text style={styles.statLabel}>Avg Score</Text>
                            <Text style={styles.statValue}>{avgHealthScore}</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#FEE2E2' }]}>
                                <Flame size={20} color="#DC2626" />
                            </View>
                            <Text style={styles.statLabel}>Avg Cal</Text>
                            <Text style={styles.statValue}>{avgCalories}</Text>
                        </View>

                        <View style={styles.statCard}>
                            <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Drumstick size={20} color="#2563EB" />
                            </View>
                            <Text style={styles.statLabel}>Avg Pro</Text>
                            <Text style={styles.statValue}>{avgProtein}g</Text>
                        </View>
                    </View>

                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Health Score Trend</Text>
                            <View style={styles.chartLegend}>
                                <View style={styles.legendDot} />
                                <Text style={styles.legendText}>Daily Score</Text>
                            </View>
                        </View>

                        <View style={styles.chart}>
                            <View style={styles.yAxis}>
                                <Text style={styles.yAxisLabel}>100</Text>
                                <Text style={styles.yAxisLabel}>75</Text>
                                <Text style={styles.yAxisLabel}>50</Text>
                                <Text style={styles.yAxisLabel}>25</Text>
                                <Text style={styles.yAxisLabel}>0</Text>
                            </View>

                            <View style={styles.chartContent}>
                                <View style={styles.gridLines}>
                                    <View style={styles.gridLine} />
                                    <View style={styles.gridLine} />
                                    <View style={styles.gridLine} />
                                    <View style={styles.gridLine} />
                                    <View style={styles.gridLine} />
                                </View>

                                <View style={styles.bars}>
                                    {weeklyData.map((item, index) => {
                                        const height = (item.healthScore / maxHealthScore) * 180;
                                        return (
                                            <View key={index} style={styles.barContainer}>
                                                <View style={styles.barWrapper}>
                                                    <LinearGradient
                                                        colors={['#4ADE80', '#22C55E']}
                                                        style={[styles.bar, { height }]}
                                                    />
                                                </View>
                                                <Text style={styles.barValue}>{item.healthScore}</Text>
                                                <Text style={styles.dayLabel}>{item.label}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.chartCard}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Calories & Protein</Text>
                            <View style={styles.chartLegendRow}>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
                                    <Text style={styles.legendText}>Calories</Text>
                                </View>
                                <View style={styles.legendItem}>
                                    <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
                                    <Text style={styles.legendText}>Protein</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.dualChart}>
                            <View style={styles.dualChartContent}>
                                <View style={styles.gridLines}>
                                    <View style={styles.gridLine} />
                                    <View style={styles.gridLine} />
                                    <View style={styles.gridLine} />
                                    <View style={styles.gridLine} />
                                </View>

                                <View style={styles.dualBars}>
                                    {weeklyData.map((item, index) => {
                                        const caloriesHeight = (item.calories / maxCalories) * 150;
                                        const proteinHeight = (item.protein / maxProtein) * 150;
                                        return (
                                            <View key={index} style={styles.dualBarGroup}>
                                                <View style={styles.dualBarPair}>
                                                    <View style={[styles.dualBar, {
                                                        height: caloriesHeight,
                                                        backgroundColor: '#FF6B6B'
                                                    }]} />
                                                    <View style={[styles.dualBar, {
                                                        height: proteinHeight,
                                                        backgroundColor: '#4A90E2'
                                                    }]} />
                                                </View>
                                                <Text style={styles.dayLabelSmall}>{item.label}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.nutrientsCard}>
                        <Text style={styles.chartTitle}>Top Vitamins & Minerals</Text>
                        <View style={styles.nutrientsList}>
                            {weeklyVitamins.slice(0, 8).map((vitamin, index) => (
                                <View key={index} style={styles.nutrientItem}>
                                    <View style={styles.nutrientInfo}>
                                        <Text style={styles.nutrientName}>{vitamin.name}</Text>
                                        <Text style={styles.nutrientValue}>
                                            {vitamin.value.toFixed(0)} {vitamin.unit}
                                        </Text>
                                    </View>
                                    <View style={styles.nutrientBarWrapper}>
                                        <View style={styles.nutrientBar}>
                                            <View style={[styles.nutrientBarFill, {
                                                width: `${Math.min(vitamin.percentage, 100)}%`,
                                                backgroundColor: vitamin.color,
                                            }]} />
                                        </View>
                                        <Text style={[styles.nutrientPercent, { color: vitamin.color }]}>
                                            {vitamin.percentage}%
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

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
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
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
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
        marginBottom: 4,
        fontWeight: '500' as const,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800' as const,
        color: '#1F2937',
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: '#1F2937',
    },
    chartLegend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    chartLegendRow: {
        flexDirection: 'row',
        gap: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4ADE80',
    },
    legendText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500' as const,
    },
    chart: {
        flexDirection: 'row',
        height: 240,
    },
    yAxis: {
        width: 35,
        justifyContent: 'space-between',
        paddingRight: 8,
    },
    yAxisLabel: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '500' as const,
    },
    chartContent: {
        flex: 1,
        position: 'relative',
    },
    gridLines: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 40,
        justifyContent: 'space-between',
    },
    gridLine: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    bars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 200,
        paddingTop: 20,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    barWrapper: {
        width: '100%',
        height: 180,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '75%',
        borderRadius: 6,
        minHeight: 20,
    },
    barValue: {
        fontSize: 11,
        fontWeight: '700' as const,
        color: '#16A34A',
    },
    dayLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '600' as const,
    },
    dualChart: {
        height: 200,
    },
    dualChartContent: {
        flex: 1,
        position: 'relative',
    },
    dualBars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 170,
        paddingTop: 20,
    },
    dualBarGroup: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    dualBarPair: {
        width: '100%',
        height: 150,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 2,
    },
    dualBar: {
        width: '40%',
        borderRadius: 4,
        minHeight: 10,
    },
    dayLabelSmall: {
        fontSize: 10,
        color: '#9CA3AF',
        fontWeight: '600' as const,
    },
    nutrientsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    nutrientsList: {
        marginTop: 16,
        gap: 16,
    },
    nutrientItem: {
        gap: 8,
    },
    nutrientInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nutrientName: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: '#1F2937',
    },
    nutrientValue: {
        fontSize: 13,
        color: '#6B7280',
    },
    nutrientBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    nutrientBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    nutrientBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    nutrientPercent: {
        fontSize: 13,
        fontWeight: '700' as const,
        minWidth: 45,
        textAlign: 'right',
    },
});
