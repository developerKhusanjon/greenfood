import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G, Text as SvgText, Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CHART_CONTAINER_WIDTH = width * 0.9; // The effective width for the content (chart + legend)
const CHART_SIZE = CHART_CONTAINER_WIDTH * 0.45; // Actual SVG chart size
const STROKE_WIDTH = 30;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const SVG_CENTER_X = CHART_SIZE / 2;
const SVG_CENTER_Y = CHART_SIZE / 2;
const INNER_CIRCLE_RADIUS = RADIUS - (STROKE_WIDTH / 2) + 10;

interface Props {
    nutrition: {
        calories: number;
        protein: number;
        sugar: number;
        carbs: number;
        fats: number;
        fiber: number;
    };
    calorieGoal?: number;
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


export default function CalorieDistributionChart({ nutrition, calorieGoal = 2000 }: Props) {

    const chartData = useMemo(() => {
        // Calculate calories for all 5 components.
        const effectiveCarbs = nutrition.carbs;
        const effectiveFiber = Math.min(nutrition.fiber, effectiveCarbs);
        const effectiveSugar = Math.min(nutrition.sugar, effectiveCarbs - effectiveFiber);
        const netCarbs = effectiveCarbs - effectiveFiber - effectiveSugar;

        const proteinCals = nutrition.protein * 4;
        const fatsCals = nutrition.fats * 9;
        const fiberCals = effectiveFiber * 4;
        const sugarCals = effectiveSugar * 4;
        const netCarbCals = netCarbs * 4;

        const totalMacroCals = proteinCals + fatsCals + fiberCals + sugarCals + netCarbCals;
        const effectiveTotalMacroCals = totalMacroCals === 0 ? 1 : totalMacroCals;

        const allSegments = [
            {
                label: 'Carbs',
                cals: netCarbCals,
                color: '#FBC02D', // Yellow from reference
                gradientId: 'gradCarbs',
                legendDotColor: '#FBC02D',
            },
            {
                label: 'Protein',
                cals: proteinCals,
                color: '#42A5F5', // Blue from reference
                gradientId: 'gradProtein',
                legendDotColor: '#42A5F5',
            },
            {
                label: 'Fats',
                cals: fatsCals,
                color: '#EF5350', // Red from reference
                gradientId: 'gradFats',
                legendDotColor: '#EF5350',
            },
            {
                label: 'Fiber',
                cals: fiberCals,
                color: '#8BC34A', // Green for Fiber (matching ref image)
                gradientId: 'gradFiber',
                legendDotColor: '#8BC34A',
            },
            {
                label: 'Sugar',
                cals: sugarCals,
                color: '#D81B60', // Updated to a distinct pink/magenta for Sugar
                gradientId: 'gradSugar',
                legendDotColor: '#D81B60',
            },
        ];

        let currentAngle = 0;
        return allSegments.map(item => {
            const percentage = (item.cals / effectiveTotalMacroCals) * 100;
            const sweepAngle = (percentage / 100) * 360;
            const path = describeArc(SVG_CENTER_X, SVG_CENTER_Y, RADIUS, currentAngle, currentAngle + sweepAngle);
            currentAngle += sweepAngle;

            return {
                ...item,
                percentage: Math.round(percentage),
                path
            };
        });

    }, [nutrition]);

    if (nutrition.calories === 0 && calorieGoal === 0) return null;

    return (
        <View style={styles.outerContainer}>
            {/* Flame Icon positioned to the top-left of the chart area */}
            <View style={styles.flameIconWrapper}>
                <Flame size={24} color="#FF9800" fill="#FF9800" />
            </View>

            <View style={styles.innerContentWrapper}>
                {/* Left Side: The Donut Chart */}
                <View style={styles.chartWrapper}>
                    <Svg width={CHART_SIZE} height={CHART_SIZE}>
                        <Defs>
                            {/* Radial Gradients for each segment */}
                            {chartData.map((item) => (
                                <RadialGradient
                                    key={item.gradientId}
                                    id={item.gradientId}
                                    cx="50%" cy="50%" r="50%" fx="50%" fy="50%"
                                >
                                    <Stop offset="0%" stopColor={item.color} stopOpacity="0.8" />
                                    <Stop offset="100%" stopColor={item.color} stopOpacity="1" />
                                </RadialGradient>
                            ))}
                        </Defs>

                        <G>
                            {/* The Donut Segments */}
                            {chartData.map((item) => (
                                <Path
                                    key={item.label}
                                    d={item.path}
                                    stroke={`url(#${item.gradientId})`}
                                    strokeWidth={STROKE_WIDTH}
                                    fill="none"
                                    strokeLinecap="butt"
                                />
                            ))}

                            {/* White Center Circle */}
                            <Circle
                                cx={SVG_CENTER_X}
                                cy={SVG_CENTER_Y}
                                r={INNER_CIRCLE_RADIUS}
                                fill="#FFFFFF"
                            />

                            {/* Decorative Bubbles (positioned manually for visual appeal) */}
                            <Circle
                                cx={SVG_CENTER_X - INNER_CIRCLE_RADIUS * 0.6}
                                cy={SVG_CENTER_Y - INNER_CIRCLE_RADIUS * 0.5}
                                r={8}
                                fill="rgba(165, 214, 167, 0.4)" // Light green bubble
                            />
                            <Circle
                                cx={SVG_CENTER_X + INNER_CIRCLE_RADIUS * 0.7}
                                cy={SVG_CENTER_Y + INNER_CIRCLE_RADIUS * 0.4}
                                r={10}
                                fill="rgba(129, 199, 132, 0.4)" // Slightly darker green bubble
                            />
                            <Circle
                                cx={SVG_CENTER_X + INNER_CIRCLE_RADIUS * 0.2}
                                cy={SVG_CENTER_Y - INNER_CIRCLE_RADIUS * 0.7}
                                r={6}
                                fill="rgba(129, 199, 132, 0.3)" // Smaller bubble
                            />


                            {/* Calories Value */}
                            <SvgText
                                x={SVG_CENTER_X}
                                y={SVG_CENTER_Y - 5}
                                textAnchor="middle"
                                fontWeight="900"
                                fontSize="38"
                                fill="#2F662F"
                            >
                                {nutrition.calories}
                            </SvgText>

                            {/* Calories Goal */}
                            <SvgText
                                x={SVG_CENTER_X}
                                y={SVG_CENTER_Y + 18}
                                textAnchor="middle"
                                fontWeight="500"
                                fontSize="18"
                                fill="#9CA3AF"
                            >
                                / 2000
                            </SvgText>

                            {/* Calories Label */}
                            <SvgText
                                x={SVG_CENTER_X}
                                y={SVG_CENTER_Y + 38}
                                textAnchor="middle"
                                fontWeight="700"
                                fontSize="16"
                                fill="#D32F2F"
                            >
                                Calories
                            </SvgText>
                        </G>
                    </Svg>
                </View>

                {/* Right Side: The Simplified Percentage-Only Legend */}
                <View style={styles.legendContainer}>
                    {chartData
                        .filter(item => item.cals > 0 || item.percentage > 0) // Show if calories or percentage > 0
                        .map((item) => (
                            <View key={item.label} style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: item.legendDotColor }]} />
                                <Text style={styles.legendLabel}>
                                    {item.label}
                                </Text>
                                <Text style={styles.legendPercentageOnly}>
                                    {item.percentage}%
                                </Text>
                            </View>
                        ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        width: CHART_CONTAINER_WIDTH,
        // No background or shadow for the outer container, it's transparent.
        // It simply acts as a wrapper for the chart and legend.
        marginBottom: 24,
        marginTop: 8,
        position: 'relative',
        alignSelf: 'center',
        flexDirection: 'row', // Ensure content inside is row-aligned
        alignItems: 'center', // Vertically center content
        justifyContent: 'space-between',
        paddingHorizontal: 20, // Add internal padding to align with outer screen padding
    },
    flameIconWrapper: {
        position: 'absolute',
        top: -12, // Positioned relative to the outerContainer's top
        left: 0, // Positioned relative to the outerContainer's left
        zIndex: 1,
    },
    innerContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    },
    chartWrapper: {
        // No change
    },
    legendContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 12,
        paddingLeft: 20, // More padding to separate from the chart
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 10,
    },
    legendLabel: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '600',
        flex: 1,
    },
    legendPercentageOnly: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
        marginLeft: 'auto',
    },
});