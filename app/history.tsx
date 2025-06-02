import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Trash2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import ComparisonCard from "@/components/ComparisonCard";
import EmptyState from "@/components/EmptyState";

export default function HistoryScreen() {
  const { comparisons, clearHistory } = useUserStore();

  const handleClearHistory = () => {
    // Simple confirmation
    if (comparisons.length > 0) {
      clearHistory();
    }
  };

  if (comparisons.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          title="No History Yet"
          message="Your comparisons will appear here after you complete them."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Comparisons</Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Trash2 size={16} color={colors.error} />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={comparisons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ComparisonCard result={item} compact={true} />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
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
  },
  cardContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
});