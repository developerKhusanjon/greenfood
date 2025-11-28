import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Flame } from 'lucide-react-native'; // Assuming you have lucide icons installed

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.5;
const STROKE_WIDTH = 38;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CENTER = CHART_SIZE / 2;
const INNER_CIRCLE_RADIUS = RADIUS - (STROKE_WIDTH / 2) + 10; // Radius for the white center circle

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

// --- Helper Functions for SVG Pie (unchanged) ---
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
                // Vibrant Gold
                color: '#FFC107',
                gradientId: 'gradCarbs',
            },
            {
                label: 'Protein',
                grams: nutrition.protein,
                cals: proteinCals,
                // Vibrant Sky Blue
                color: '#2196F3',
                gradientId: 'gradProtein',
            },
            {
                label: 'Fats',
                grams: nutrition.fats,
                cals: fatsCals,
                // Vibrant Pink
                color: '#E91E63',
                gradientId: 'gradFats',
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
        // Added styling for the outer container to apply subtle shadow
        <View style={styles.container}>

            <View style={styles.chartContainer}>
                <Svg width={CHART_SIZE} height={CHART_SIZE}>
                    <Defs>
                        {/* Define Radial Gradients for each segment to give it depth */}
                        {chartData.map((item) => (
                            <RadialGradient
                                key={item.gradientId}
                                id={item.gradientId}
                                cx="50%" cy="50%" r="50%" fx="50%" fy="50%"
                            >
                                {/* Darker color near the center/edge */}
                                <Stop offset="0%" stopColor={item.color} stopOpacity="0.8" />
                                {/* Lighter color in the middle */}
                                <Stop offset="100%" stopColor={item.color} stopOpacity="1" />
                            </RadialGradient>
                        ))}
                    </Defs>

                    {/* The Donut Segments */}
                    <G>
                        {chartData.map((item) => (
                            <Path
                                key={item.label}
                                d={item.path}
                                // Use the defined gradient ID as the stroke
                                stroke={`url(#${item.gradientId})`}
                                strokeWidth={STROKE_WIDTH}
                                fill="none"
                                strokeLinecap="butt"
                                // Optional: Add filter for a stronger shadow effect (may not work in all environments)
                                // filter="url(#drop-shadow)"
                            />
                        ))}

                        {/* White Center Circle */}
                        <Circle
                            cx={CENTER}
                            cy={CENTER}
                            r={INNER_CIRCLE_RADIUS}
                            fill="#FFFFFF"
                            // Apply subtle shadow to the center circle
                            style={{ elevation: 5 }}
                        />

                        {/* Center Flame Icon */}
                        <SvgText
                            x={CENTER}
                            y={CENTER - 20}
                            textAnchor="middle"
                        >
                            <Flame size={24} color="#FF9800" fill="#FF9800" />
                        </SvgText>

                        {/* Calories Value */}
                        <SvgText
                            x={CENTER}
                            y={CENTER - 15}
                            textAnchor="middle"
                            fontWeight="900"
                            fontSize="36"
                            fill="#1c771f"
                        >
                            {nutrition.calories}
                        </SvgText>

                        {/* Calories Value */}
                        <SvgText
                            x={CENTER}
                            y={CENTER + 10}
                            textAnchor="middle"
                            fontWeight="600"
                            fontSize="20"
                            fill="#9CA3AF"
                        >
                            /2000
                        </SvgText>

                        {/* Calories Label */}
                        <SvgText
                            x={CENTER}
                            y={CENTER + 38}
                            textAnchor="middle"
                            fontWeight="700"
                            fontSize="18"
                            fill="#dd3e6e"
                        >
                            Calories
                        </SvgText>
                    </G>
                </Svg>
            </View>

            {/* Right Side: The Legend */}
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
        marginBottom: 24,
        marginTop: 8,
        // Overall component shadow for a floating effect
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
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
        // Subtle shadow on dots to match overall vibe
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    legendLabel: {
        fontSize: 14,
        color: '#4B5563',
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
        color: '#1F2937', // Dark for emphasis
    },
    legendPercentage: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280', // Medium gray for percentage
    }
});