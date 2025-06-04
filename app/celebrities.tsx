import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, TextInput, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, ArrowLeft, Star } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform as RNPlatform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { useUserStore } from "@/store/user-store";
import { celebrities, categoryLabels } from "@/mocks/celebrities";
import { Celebrity } from "@/types";
import BottomNavigation from "@/components/BottomNavigation";
import PaywallModal from "@/components/PaywallModal";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function CelebritiesScreen() {
  const router = useRouter();
  const { isPremium, getColors } = useUserStore();
  const colors = getColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const fadeIn = useSharedValue(0);
  const slideUp = useSharedValue(50);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: slideUp.value }],
      opacity: fadeIn.value,
    };
  });

  useEffect(() => {
    if (!isPremium) {
      setShowPaywall(true);
    }
    
    // Entrance animation
    fadeIn.value = withTiming(1, { duration: 800 });
    slideUp.value = withTiming(0, { duration: 800 });
  }, [isPremium]);

  const filteredCelebrities = celebrities.filter(celebrity => {
    const matchesSearch = celebrity.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || celebrity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>;

  const handleCelebritySelect = (celebrity: Celebrity) => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    
    // Navigate to comparison with selected celebrity
    router.push({
      pathname: "/target-photo",
      params: { 
        celebrityId: celebrity.id,
        celebrityName: celebrity.name,
        celebrityImage: celebrity.image
      }
    });
  };

  const handleCategorySelect = (category: string) => {
    if (RNPlatform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const renderCelebrity = ({ item }: { item: Celebrity }) => (
    <Animated.View style={[styles.celebrityCard, animatedStyle]}>
      <TouchableOpacity 
        style={[styles.celebrityButton, { backgroundColor: colors.card }]}
        onPress={() => handleCelebritySelect(item)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.celebrityImage}
        />
        <View style={styles.celebrityInfo}>
          <Text style={[styles.celebrityName, { color: colors.text }]}>{item.name}</Text>
          <View style={styles.scoreContainer}>
            <Star size={14} color={colors.primary} fill={colors.primary} />
            <Text style={[styles.celebrityScore, { color: colors.textLight }]}>
              {Math.round(item.beautyScore * 10)}/10
            </Text>
          </View>
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "20" }]}>
          <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>
            {categoryLabels[item.category as keyof typeof categoryLabels]}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Celebrity{" "}
          <Text style={[styles.headerTitleAccent, { color: colors.primary }]}>Match</Text>
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search celebrities..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category 
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.card }
            ]}
            onPress={() => handleCategorySelect(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category 
                  ? { color: colors.text }
                  : { color: colors.textLight }
              ]}
            >
              {categoryLabels[category]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredCelebrities}
        keyExtractor={(item) => item.id}
        renderItem={renderCelebrity}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      <BottomNavigation currentRoute="celebrities" />
      
      <PaywallModal
        visible={showPaywall}
        onClose={() => {
          setShowPaywall(false);
          if (!isPremium) {
            router.back();
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
  },
  headerTitleAccent: {
    // Color applied dynamically
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  row: {
    justifyContent: "space-between",
  },
  celebrityCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  celebrityButton: {
    borderRadius: 16,
    padding: 12,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
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
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  celebrityScore: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoryBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
});