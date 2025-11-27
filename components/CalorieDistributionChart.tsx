import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
// Slightly larger chart area
const CHART_SIZE = width * 0.5;
// Much thicker stroke for the "beautiful shape"
const STROKE_WIDTH = 38;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CENTER = CHART_SIZE / 2;

interface Props {
    nutrition: {
        calories: number;
        protein: number;
        sugar: number;
        carbs: number;
        fats: number;
        fiber: number;
    };
}

// --- Helper Functions for SVG Pie ---
const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    if (endAngle - startAngle >= 360) {
        return [
            "M", x - radius, y,
            "A", radius, radius, 0, 1, 1, x + radius, y,
            "A", radius, radius, 0, 1, 1, x - radius, y,
        ].join(" ");
    }

    return [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
};
// ------------------------------------


export default function CalorieDistributionChart({ nutrition }: Props) {

    const chartData = useMemo(() => {
        const carbCals = nutrition.carbs * 4;
        const proteinCals = nutrition.protein * 4;
        const fatsCals = nutrition.fats * 9;
        const totalMacroCals = carbCals + proteinCals + fatsCals || 1;

        const data = [
            {
                label: 'Carbs',
                grams: nutrition.carbs,
                cals: carbCals,
                // Lighter, more vibrant Gold
                color: '#FCD34D',
            },
            {
                label: 'Protein',
                grams: nutrition.protein,
                cals: proteinCals,
                // Lighter, vibrant Sky Blue
                color: '#60A5FA',
            },
            {
                label: 'Fats',
                grams: nutrition.fats,
                cals: fatsCals,
                // Vibrant Pink/Magenta
                color: '#F472B6',
            },
        ];

        let currentAngle = 0;
        return data.map(item => {
            const percentage = (item.cals / totalMacroCals) * 100;
            const sweepAngle = (percentage / 100) * 360;
            const path = describeArc(CENTER, CENTER, RADIUS, currentAngle, currentAngle + sweepAngle);
            currentAngle += sweepAngle;

            return {
                ...item,
                percentage: Math.round(percentage),
                path
            };
        });

    }, [nutrition]);

    if (nutrition.calories === 0) return null;

    return (
        // Container is now transparent (no bg, shadow, padding)
        <View style={styles.container}>

            <View style={styles.chartContainer}>
                <Svg width={CHART_SIZE} height={CHART_SIZE}>
                    <G>
                        {chartData.map((item, index) => (
                            <Path
                                key={item.label}
                                d={item.path}
                                stroke={item.color}
                                strokeWidth={STROKE_WIDTH}
                                fill="none"
                                // Butt caps for clean meeting points without white separators
                                strokeLinecap="butt"
                            />
                        ))}

                        {/* Center Text - Darker for contrast on light background */}
                        <SvgText
                            x={CENTER}
                            y={CENTER - 12}
                            textAnchor="middle"
                            fontWeight="800"
                            fontSize="32"
                            fill="#1B5E20" // Dark Green to match header vibe
                        >
                            {nutrition.calories}
                        </SvgText>
                        <SvgText
                            x={CENTER}
                            y={CENTER + 18}
                            textAnchor="middle"
                            fontWeight="600"
                            fontSize="15"
                            fill="#2E7D32" // Medium Green
                        >
                            Calories
                        </SvgText>
                    </G>
                </Svg>
            </View>

            <View style={styles.legendContainer}>
                {chartData.map((item) => (
                    <View key={item.label} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <View>
                            <Text style={styles.legendLabel}>{item.label}</Text>
                            <Text style={styles.legendDetails}>
                                <Text style={styles.legendGrams}>{item.grams}g</Text>
                                <Text style={styles.legendPercentage}> / {item.percentage}%</Text>
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // Removed background, padding, shadow, borderRadius
        marginBottom: 24,
        marginTop: 8,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    legendContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
        paddingLeft: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 5,
        marginRight: 12,
    },
    legendLabel: {
        fontSize: 14,
        color: '#4B5563', // Slightly darker gray for better contrast against green bg
        fontWeight: '600',
        marginBottom: 2,
    },
    legendDetails: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    legendGrams: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1B5E20', // Dark green for values
    },
    legendPercentage: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2E7D32', // Medium green for percentage
    }
});