import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import ComparisonCard from "@/components/ComparisonCard";
import EmptyState from "@/components/EmptyState";
import BottomNavigation from "@/components/BottomNavigation";

export default function HistoryScreen() {
  const router = useRouter();
  const { comparisons, clearHistory } = useUserStore();

  const handleClearHistory = () => {
    // Simple confirmation
    if (comparisons.length > 0) {
      clearHistory();
    }
  };

  const handleComparisonPress = (comparisonId: string) => {
    // Navigate to results page - in a real app, you'd pass the comparison ID
    router.push("/results");
  };

  if (comparisons.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No History Yet"
          message="Your comparisons will appear here after you complete them."
        />
        <BottomNavigation currentRoute="history" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Your{" "}
          <Text style={styles.headerTitleAccent}>Comparisons</Text>
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Trash2 size={16} color={colors.error} />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={comparisons}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: colors.text,
  },
  headerTitleAccent: {
    color: colors.primary,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  clearButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.error,
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