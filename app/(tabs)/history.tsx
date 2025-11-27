import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useHealth } from "@/contexts/HealthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Clock, ChevronRight, Utensils, Salad } from "lucide-react-native";

export default function HistoryScreen() {
    const router = useRouter();
    const { allFoods } = useHealth();
    const insets = useSafeAreaInsets();

    const groupedByDate = allFoods.reduce((acc, food) => {
        const dateKey = food.timestamp.toLocaleDateString();
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(food);
        return acc;
    }, {} as Record<string, typeof allFoods>);

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
    });

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'Very Healthy':
                return '#10B981';
            case 'Healthy':
                return '#3B82F6';
            case 'Moderate':
                return '#F59E0B';
            default:
                return '#EF4444';
        }
    };

    const isToday = (dateStr: string) => {
        return dateStr === new Date().toLocaleDateString();
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E0F2FE', '#BAE6FD', '#7DD3FC']}
                style={[styles.gradient, { paddingTop: insets.top }]}
            >
                <View style={styles.decorativeShapes}>
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.header}>History</Text>

                    {sortedDates.map((dateStr) => {
                        const foods = groupedByDate[dateStr];
                        const today = isToday(dateStr);

                        return (
                            <View key={dateStr} style={styles.dateSection}>
                                {today ? (
                                    <View style={styles.todayHeader}>
                                        <View style={styles.todayBadge}>
                                            <Clock size={18} color="#FFFFFF" />
                                            <Text style={styles.todayHeaderText}>Today&apos;s Foods</Text>
                                        </View>
                                        <Text style={styles.itemCount}>{foods.length} items logged</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.dateHeader}>{dateStr}</Text>
                                )}

                                <View style={styles.foodsList}>
                                    {foods.map((food) => (
                                        <TouchableOpacity
                                            key={food.id}
                                            style={styles.foodCard}
                                            onPress={() => router.push({ pathname: '/food-details' as any, params: { id: food.id } })}
                                        >
                                            <View style={[styles.foodIcon, { backgroundColor: food.healthStatus === 'Very Healthy' || food.healthStatus === 'Healthy' ? '#D1FAE5' : '#FEE2E2' }]}>
                                                {food.healthStatus === 'Very Healthy' || food.healthStatus === 'Healthy' ? (
                                                    <Salad size={24} color="#10B981" />
                                                ) : (
                                                    <Utensils size={24} color="#EF4444" />
                                                )}
                                            </View>

                                            <View style={styles.foodInfo}>
                                                <Text style={styles.foodName}>{food.name}</Text>
                                                <Text style={styles.foodTime}>
                                                    {food.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Text>
                                            </View>

                                            <ChevronRight size={20} color="#9CA3AF" />
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.statsCard}>
                                    <View style={[styles.healthBadge, { backgroundColor: getHealthColor(foods[0]?.healthStatus || 'Moderate') + '20' }]}>
                                        <Text style={[styles.healthBadgeText, { color: getHealthColor(foods[0]?.healthStatus || 'Moderate') }]}>
                                            {foods[0]?.healthStatus || 'Moderate'}
                                        </Text>
                                    </View>

                                    <View style={styles.statsRow}>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>
                                                {foods.reduce((sum, f) => sum + f.nutrition.calories, 0)}
                                            </Text>
                                            <Text style={styles.statLabel}>cal</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>
                                                {foods.reduce((sum, f) => sum + f.nutrition.protein, 0)}g
                                            </Text>
                                            <Text style={styles.statLabel}>protein</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>
                                                {foods.reduce((sum, f) => sum + f.nutrition.sugar, 0)}g
                                            </Text>
                                            <Text style={styles.statLabel}>sugar</Text>
                                        </View>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>
                                                {Math.round(foods.reduce((sum, f) => sum + f.healthScore, 0) / foods.length)}
                                            </Text>
                                            <Text style={styles.statLabel}>score</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2FE',
    },
    gradient: {
        flex: 1,
    },
    decorativeShapes: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.1,
    },
    circle1: {
        width: 220,
        height: 220,
        backgroundColor: '#3B82F6',
        top: -70,
        right: -55,
    },
    circle2: {
        width: 170,
        height: 170,
        backgroundColor: '#0EA5E9',
        bottom: 180,
        left: -45,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        fontSize: 36,
        fontWeight: '800' as const,
        color: '#1F2937',
        marginBottom: 24,
    },
    dateSection: {
        marginBottom: 32,
    },
    todayHeader: {
        marginBottom: 16,
    },
    todayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#10B981',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 8,
    },
    todayHeaderText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: '#FFFFFF',
    },
    itemCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: '700' as const,
        color: '#1F2937',
        marginBottom: 16,
    },
    foodsList: {
        gap: 12,
        marginBottom: 16,
    },
    foodCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 35,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    foodIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    foodInfo: {
        flex: 1,
        marginLeft: 16,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '600' as const,
        color: '#1F2937',
        marginBottom: 4,
    },
    foodTime: {
        fontSize: 14,
        color: '#6B7280',
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    healthBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 22,
        marginBottom: 16,
    },
    healthBadgeText: {
        fontSize: 14,
        fontWeight: '700' as const,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: '#1F2937',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
});
