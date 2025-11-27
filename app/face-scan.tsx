import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { useRouter } from "expo-router";
import { X, Camera as CameraIcon, Image as ImageIcon } from "lucide-react-native";
import { useMutation } from "@tanstack/react-query";
import { generateObject } from "@rork-ai/toolkit-sdk";
import { z } from "zod";
import * as ImagePicker from 'expo-image-picker';
import { useHealth } from "@/contexts/HealthContext";
import { FaceAnalysisData } from "@/types";

const faceAnalysisSchema = z.object({
    mood: z.string().describe("Detected mood (Happy, Sad, Neutral, Stressed, etc.)"),
    confidence: z.number().describe("Confidence level as percentage (0-100)"),
    skinHealth: z.string().describe("Overall skin health assessment"),
    deficiencies: z.array(z.string()).describe("Possible vitamin deficiencies based on skin/facial appearance"),
    concerns: z.array(z.string()).describe("Skin concerns observed"),
    recommendations: z.array(z.string()).describe("Health recommendations"),
    ethnicity: z.string().optional().describe("Estimated ethnicity"),
    additionalNotes: z.array(z.string()).describe("Additional observations"),
});

export default function FaceScanScreen() {
    const router = useRouter();
    const { updateFaceAnalysis } = useHealth();
    const [permission, requestPermission] = useCameraPermissions();
    const [facing] = useState<CameraType>("front");
    const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [capturedBase64, setCapturedBase64] = useState<string | null>(null);

    const analysisMutation = useMutation({
        mutationFn: async (imageBase64: string) => {
            const result = await generateObject({
                schema: faceAnalysisSchema,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: "Analyze this face photo for mood, skin health, possible vitamin deficiencies, and provide health recommendations. Look for signs of hydration, fatigue, skin condition, etc." },
                            { type: "image", image: imageBase64 },
                        ],
                    },
                ],
            });
            return result;
        },
        onSuccess: (data) => {
            const faceAnalysis: FaceAnalysisData = {
                ...data,
                timestamp: new Date(),
            };
            updateFaceAnalysis(faceAnalysis);
            router.back();
            setTimeout(() => {
                router.push("/face-results" as any);
            }, 300);
        },
        onError: (error) => {
            console.error("Face analysis error:", error);
            Alert.alert("Error", "Failed to analyze face. Please try again.");
        },
    });

    const takePicture = async () => {
        if (!cameraRef) return;

        try {
            const photo = await cameraRef.takePictureAsync({ base64: true });
            if (photo?.base64) {
                const imageData = `data:image/jpeg;base64,${photo.base64}`;
                setSelectedImage(imageData);
                setCapturedBase64(imageData);
            }
        } catch (error) {
            console.error("Error taking picture:", error);
            Alert.alert("Error", "Failed to capture photo. Please try again.");
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images' as any,
                allowsEditing: true,
                quality: 1,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                const imageUri = `data:image/jpeg;base64,${result.assets[0].base64}`;
                setSelectedImage(imageUri);
                setCapturedBase64(imageUri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to select image. Please try again.");
        }
    };

    const handleAnalyze = () => {
        if (capturedBase64) {
            analysisMutation.mutate(capturedBase64);
        }
    };

    const handleRetake = () => {
        setSelectedImage(null);
        setCapturedBase64(null);
    };

    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>We need your permission to access the camera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={setCameraRef}
            >
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.back()}
                >
                    <X size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {selectedImage ? (
                    <View style={styles.imagePreview}>
                        <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
                    </View>
                ) : (
                    <View style={styles.overlay}>
                        <View style={styles.faceGuide} />
                    </View>
                )}

                <View style={styles.controls}>
                    {analysisMutation.isPending ? (
                        <View style={styles.analyzingContainer}>
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text style={styles.analyzingText}>Analyzing face...</Text>
                        </View>
                    ) : selectedImage ? (
                        <View style={styles.previewControls}>
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={handleRetake}
                            >
                                <Text style={styles.retakeButtonText}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.analyzeButton}
                                onPress={handleAnalyze}
                            >
                                <Text style={styles.analyzeButtonText}>Analyze</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.instruction}>Position your face in the circle</Text>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.galleryButton}
                                    onPress={pickImage}
                                >
                                    <ImageIcon size={24} color="#FFFFFF" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.captureButton}
                                    onPress={takePicture}
                                >
                                    <CameraIcon size={36} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    faceGuide: {
        width: 280,
        height: 360,
        borderRadius: 140,
        borderWidth: 4,
        borderColor: '#FFFFFF',
        borderStyle: 'dashed',
    },
    imagePreview: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    controls: {
        position: 'absolute',
        bottom: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 20,
    },
    analyzingContainer: {
        alignItems: 'center',
        gap: 12,
    },
    analyzingText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600' as const,
    },
    instruction: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600' as const,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#7C3AED',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    galleryButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    permissionText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 40,
    },
    permissionButton: {
        backgroundColor: '#7C3AED',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
    },
    permissionButtonText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: '#FFFFFF',
    },
    previewControls: {
        flexDirection: 'row',
        gap: 16,
        paddingHorizontal: 20,
    },
    retakeButton: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    retakeButtonText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: '#FFFFFF',
    },
    analyzeButton: {
        flex: 1,
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    analyzeButtonText: {
        fontSize: 16,
        fontWeight: '700' as const,
        color: '#FFFFFF',
    },
});
