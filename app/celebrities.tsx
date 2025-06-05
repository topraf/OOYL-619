import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, ArrowLeft } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { colors } from "@/constants/colors";
import { useUserStore } from "@/store/user-store";
import { celebrities } from "@/mocks/celebrities";
import { Celebrity } from "@/types";
import PaywallModal from "@/components/PaywallModal";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const categories = [
  { id: "all", name: "All", emoji: "🌟" },
  { id: "actors", name: "Actors", emoji: "🎬" },
  { id: "music", name: "Music", emoji: "🎵" },
  { id: "sports", name: "Sports", emoji: "⚽" },
  { id: "politics", name: "Politics", emoji: "🏛️" },
  { id: "models", name: "Models", emoji: "📸" },
  { id: "influencers", name: "Influencers", emoji: "📱" },
];

export default function CelebritiesScreen() {
  const router = useRouter();
  const { setCurrentTarget, freeComparisonUsed, isPremium } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showPaywall, setShowPaywall] = useState(false);
  
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
  
  const handleCelebritySelect = (celebrity: Celebrity) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (freeComparisonUsed && !isPremium) {
      setShowPaywall(true);
      return;
    }
    
    setCurrentTarget({
      id: celebrity.id,
      name: celebrity.name,
      image: celebrity.image,
      beautyScore: celebrity.beautyScore,
      isCelebrity: true,
    });
    
    router.push("/comparison-loading");
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
  
  const renderCelebrity = ({ item }: { item: Celebrity }) => (
    <Animated.View style={animatedButtonStyle}>
      <TouchableOpacity 
        style={styles.celebrityCard}
        onPress={() => handleCelebritySelect(item)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <LinearGradient
          colors={colors.gradientCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.celebrityGradient}
        >
          <Image
            source={{ uri: item.image }}
            style={styles.celebrityImage}
          />
          <View style={styles.celebrityInfo}>
            <Text style={styles.celebrityName}>{item.name}</Text>
            <Text style={styles.celebrityCategory}>{item.category}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{Math.round(item.beautyScore * 10)}/10</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
  
  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => handleCategorySelect(item.id)}
    >
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          Choose{" "}
          <Text style={styles.titleAccent}>Celebrity</Text>
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search celebrities..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <FlatList
        data={filteredCelebrities}
        renderItem={renderCelebrity}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.celebritiesList}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
      
      <BottomNavigation currentRoute="celebrities" />
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  titleAccent: {
    color: colors.primary,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textLight,
  },
  categoryTextActive: {
    color: colors.background,
  },
  celebritiesList: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  row: {
    justifyContent: "space-between",
  },
  celebrityCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  celebrityGradient: {
    padding: 12,
  },
  celebrityImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  celebrityInfo: {
    alignItems: "center",
  },
  celebrityName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  celebrityCategory: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 6,
    textTransform: "capitalize",
  },
  scoreContainer: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
});