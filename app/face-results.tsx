import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useHealth } from "@/contexts/HealthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "lucide-react-native";

export default function FaceResultsScreen() {
    const router = useRouter();
    const { dailyStats } = useHealth();
    const insets = useSafeAreaInsets();

    if (!dailyStats.faceAnalysis) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>No face analysis available</Text>
            </View>
        );
    }

    const { mood, confidence, skinHealth, deficiencies, concerns, recommendations, ethnicity, additionalNotes } = dailyStats.faceAnalysis;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#E8F5E9', '#F9FAFB', '#F9FAFB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.3 }}
                style={styles.background}
            >
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#1F2937" strokeWidth={2.5} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Face Analysis</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.moodSection}>
                        <View style={styles.moodEmoji}>
                            <Text style={styles.moodEmojiText}>😊</Text>
                        </View>
                        <Text style={styles.moodLabel}>{mood}</Text>
                        <Text style={styles.confidenceText}>{confidence}% confidence</Text>
                    </View>

                    <View style={styles.healthScoreCard}>
                        <Text style={styles.sectionTitle}>Skin Health</Text>
                        <Text style={styles.healthScoreValue}>{skinHealth}</Text>
                    </View>

                    {deficiencies.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Possible Vitamin Deficiencies</Text>
                            <View style={styles.deficienciesContainer}>
                                {deficiencies.map((def, index) => (
                                    <View key={index} style={styles.badge}>
                                        <Text style={styles.badgeText}>{def}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {concerns.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Skin Concerns</Text>
                            <View style={styles.listContainer}>
                                {concerns.map((concern, index) => (
                                    <View key={index} style={styles.listItem}>
                                        <View style={styles.bullet} />
                                        <Text style={styles.listText}>{concern}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {recommendations.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recommendations</Text>
                            <View style={styles.listContainer}>
                                {recommendations.map((rec, index) => (
                                    <View key={index} style={styles.listItem}>
                                        <View style={[styles.bullet, styles.bulletGreen]} />
                                        <Text style={styles.listText}>{rec}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {ethnicity && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Estimated Ethnicity</Text>
                            <View style={styles.ethnicityCard}>
                                <Text style={styles.ethnicityText}>{ethnicity}</Text>
                            </View>
                        </View>
                    )}

                    {additionalNotes.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Additional Notes</Text>
                            <View style={styles.listContainer}>
                                {additionalNotes.map((note, index) => (
                                    <View key={index} style={styles.listItem}>
                                        <View style={[styles.bullet, styles.bulletBlue]} />
                                        <Text style={styles.listText}>{note}</Text>
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
    header: {
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    moodSection: {
        backgroundColor: '#E8F5E9',
        borderRadius: 28,
        padding: 32,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    moodEmoji: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    moodEmojiText: {
        fontSize: 56,
    },
    moodLabel: {
        fontSize: 32,
        fontWeight: '800' as const,
        color: '#2E7D32',
        marginBottom: 6,
    },
    confidenceText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600' as const,
    },
    healthScoreCard: {
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
    healthScoreValue: {
        fontSize: 28,
        fontWeight: '700' as const,
        color: '#1F2937',
        marginTop: 8,
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
        marginBottom: 16,
    },
    deficienciesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    badge: {
        backgroundColor: '#FFF3E0',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#FFB74D',
    },
    badgeText: {
        fontSize: 15,
        fontWeight: '700' as const,
        color: '#F57C00',
    },
    listContainer: {
        gap: 12,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#F59E0B',
        marginTop: 6,
    },
    bulletGreen: {
        backgroundColor: '#10B981',
    },
    bulletBlue: {
        backgroundColor: '#3B82F6',
    },
    listText: {
        flex: 1,
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
    },
    ethnicityCard: {
        backgroundColor: '#F3F4F6',
        padding: 20,
        borderRadius: 16,
    },
    ethnicityText: {
        fontSize: 20,
        fontWeight: '600' as const,
        color: '#1F2937',
    },
    errorText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});
