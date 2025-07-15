import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Search, X, ArrowLeft, Plus, ArrowUpDown } from "lucide-react-native";
import { useUserStore } from "@/store/user-store";
import { celebrities, celebrityCategories } from "@/mocks/celebrities";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const numColumns = 2;
const itemWidth = (width - 48) / numColumns;

export default function CelebritiesScreen() {
  const router = useRouter();
  const { setTargetImage, getColors } = useUserStore();
  const colors = getColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "score" | "category">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const filteredAndSortedCelebrities = celebrities
    .filter(celebrity => {
      const matchesSearch = celebrity.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || celebrity.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "score":
          comparison = a.beautyScore - b.beautyScore;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });
  
  const handleSelectCelebrity = (id: string, image: string, name: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setTargetImage(image, name, true);
    router.push("/user-photo");
  };

  const handleCategorySelect = (categoryId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCategory(categoryId);
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1);
  };
  
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  const handleSort = (newSortBy: "name" | "score" | "category") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setShowSortMenu(false);
  };
  
  const getSortLabel = () => {
    const labels = {
      name: "Name",
      score: "Beauty Score",
      category: "Category"
    };
    return `${labels[sortBy]} ${sortOrder === "asc" ? "↑" : "↓"}`;
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            Choose a{" "}
            <Text style={[styles.titleAccent, { color: colors.primary }]}>Celebrity</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Compare yourself with these famous personalities
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.sortButton, { backgroundColor: colors.card }]} 
          onPress={() => setShowSortMenu(!showSortMenu)}
        >
          <ArrowUpDown size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search celebrities..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={[styles.categoriesContainer, { borderBottomColor: colors.border }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {celebrityCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: selectedCategory === category.id ? colors.primary : colors.card,
                }
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category.id ? colors.background : colors.text,
                    fontWeight: selectedCategory === category.id ? "700" : "500",
                  }
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {showSortMenu && (
        <View style={[styles.sortMenu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sortMenuTitle, { color: colors.text }]}>Sort by:</Text>
          <TouchableOpacity 
            style={[styles.sortMenuItem, sortBy === "name" && { backgroundColor: colors.primary + "20" }]} 
            onPress={() => handleSort("name")}
          >
            <Text style={[styles.sortMenuText, { color: sortBy === "name" ? colors.primary : colors.text }]}>
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortMenuItem, sortBy === "score" && { backgroundColor: colors.primary + "20" }]} 
            onPress={() => handleSort("score")}
          >
            <Text style={[styles.sortMenuText, { color: sortBy === "score" ? colors.primary : colors.text }]}>
              Beauty Score {sortBy === "score" && (sortOrder === "asc" ? "↑" : "↓")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortMenuItem, sortBy === "category" && { backgroundColor: colors.primary + "20" }]} 
            onPress={() => handleSort("category")}
          >
            <Text style={[styles.sortMenuText, { color: sortBy === "category" ? colors.primary : colors.text }]}>
              Category {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={filteredAndSortedCelebrities}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>No celebrities found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
              style={[styles.celebrityItem, { backgroundColor: colors.card, shadowColor: colors.shadow }]}
              onPress={() => handleSelectCelebrity(item.id, item.image, item.name)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <View style={[styles.plusIconContainer, { backgroundColor: colors.primary }]}>
                <Plus size={16} color={colors.background} />
              </View>
              <Image
                source={{ uri: item.image }}
                style={[styles.celebrityImage, { backgroundColor: colors.border }]}
                contentFit="cover"
              />
              <View style={styles.celebrityInfo}>
                <Text style={[styles.celebrityName, { color: colors.text }]}>{item.name}</Text>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.scoreText, { color: colors.primary }]}>{Math.round(item.beautyScore * 10)}/10</Text>
                  <Text style={[styles.scoreLabel, { color: colors.textLight }]}>Beauty Score</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      />
      
      <BottomNavigation currentRoute="celebrities" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  titleAccent: {
    // Color applied dynamically
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for bottom navigation
  },
  celebrityItem: {
    width: itemWidth,
    marginBottom: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
  },
  plusIconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  celebrityImage: {
    width: "100%",
    height: itemWidth * 1.2,
  },
  celebrityInfo: {
    padding: 12,
  },
  celebrityName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 4,
  },
  scoreLabel: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
  },
  sortButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sortMenu: {
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sortMenuTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  sortMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  sortMenuText: {
    fontSize: 14,
    fontWeight: "500",
  },
});