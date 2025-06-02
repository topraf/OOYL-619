import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Platform } from "react-native";
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";
import { Camera, RefreshCw } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";

interface CameraViewProps {
  onCapture: (uri: string) => void;
  onCancel?: () => void;
  cameraType?: "front" | "side";
}

export default function CameraView({ onCapture, onCancel, cameraType = "front" }: CameraViewProps) {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const takePicture = async () => {
    if (!cameraRef) return;
    
    try {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      const photo = await cameraRef.takePictureAsync({ quality: 0.8 });
      onCapture(photo.uri);
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ExpoCameraView
        style={styles.camera}
        facing={facing}
        ref={ref => setCameraRef(ref)}
      >
        <View style={styles.controlsContainer}>
          {onCancel && (
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <RefreshCw color={colors.background} size={24} />
          </TouchableOpacity>
        </View>
      </ExpoCameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  camera: {
    flex: 1,
  },
  message: {
    fontSize: 18,
    textAlign: "center",
    margin: 20,
    color: colors.text,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.background,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.background,
  },
  cancelButton: {
    position: "absolute",
    left: 30,
    bottom: 10,
  },
  cancelText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
});