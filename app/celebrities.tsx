import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Search, X, ArrowLeft, Plus } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { celebrities, celebrityCategories } from "@/mocks/celebrities";
import { useUserStore } from "@/store/user-store";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const numColumns = 2;
const itemWidth = (width - 48) / numColumns;

export default function CelebritiesScreen() {
  const router = useRouter();
  const { setTargetImage } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });
  
  const filteredCelebrities = celebrities.filter(celebrity => {
    const matchesSearch = celebrity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || celebrity.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.title}>
            Choose a{" "}
            <Text style={styles.titleAccent}>Celebrity</Text>
          </Text>
          <Text style={styles.subtitle}>
            Compare yourself with these famous personalities
          </Text>
        </View>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
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
      
      <View style={styles.categoriesContainer}>
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
                    color: selectedCategory === category.id ? colors.text : colors.text,
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
      
      <FlatList
        data={filteredCelebrities}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No celebrities found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
              style={styles.celebrityItem}
              onPress={() => handleSelectCelebrity(item.id, item.image, item.name)}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <View style={styles.plusIconContainer}>
                <Plus size={16} color={colors.text} />
              </View>
              <Image
                source={{ uri: item.image }}
                style={styles.celebrityImage}
                contentFit="cover"
              />
              <View style={styles.celebrityInfo}>
                <Text style={styles.celebrityName}>{item.name}</Text>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>{Math.round(item.beautyScore * 10)}/10</Text>
                  <Text style={styles.scoreLabel}>Beauty Score</Text>
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
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: 16,
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
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
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  celebrityImage: {
    width: "100%",
    height: itemWidth * 1.2,
    backgroundColor: colors.border,
  },
  celebrityInfo: {
    padding: 12,
  },
  celebrityName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginRight: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
});