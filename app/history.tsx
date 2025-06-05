import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Trash2, ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import { useComparisonStore } from "@/store/comparison-store";
import ComparisonCard from "@/components/ComparisonCard";
import EmptyState from "@/components/EmptyState";
import BottomNavigation from "@/components/BottomNavigation";

export default function HistoryScreen() {
  const router = useRouter();
  const { comparisons, clearHistory } = useUserStore();
  const { history, clearHistory: clearComparisonHistory } = useComparisonStore();
  
  // Use comparison store history if available, otherwise fall back to user store
  const displayComparisons = history.length > 0 ? history : comparisons;

  const handleClearHistory = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    
    // Clear both stores
    if (displayComparisons.length > 0) {
      clearHistory();
      clearComparisonHistory();
    }
  };

  const handleComparisonPress = (comparisonId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to results page
    router.push("/results");
  };

  if (displayComparisons.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Your{" "}
            <Text style={styles.headerTitleAccent}>History</Text>
          </Text>
          <View style={styles.placeholder} />
        </View>
        
        <EmptyState
          title="No History Yet"
          message="Your comparisons will appear here after you complete them."
        />
        <BottomNavigation currentRoute="history" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Your{" "}
          <Text style={styles.headerTitleAccent}>History</Text>
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Trash2 size={16} color={colors.error} />
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={displayComparisons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.cardContainer}
            onPress={() => handleComparisonPress(item.id)}
          >
            <ComparisonCard result={item} compact={true} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      
      <BottomNavigation currentRoute="history" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
  },
  headerTitleAccent: {
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingBottom: 120, // Space for bottom navigation
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
});