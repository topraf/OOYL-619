/**
 * Celebrity Self-Comparison Screen
 * 
 * This screen allows users to compare themselves with celebrities.
 * Users can:
 * 1. Browse and filter celebrities by category, gender, and age
 * 2. Select a celebrity to compare with
 * 3. Upload their photo for comparison
 * 4. View detailed comparison results
 * 
 * The screen includes:
 * - Search functionality for finding specific celebrities
 * - Category filters for narrowing down options
 * - Celebrity grid with images and names
 * - Premium features with appropriate paywalls
 */

import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, X, Filter, Camera } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Image } from "expo-image";
import { useUserStore } from "@/store/user-store";
import { celebrities } from "@/mocks/celebrities";
import PaywallModal from "@/components/PaywallModal";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

// Categories for filtering
const categories = [
  { id: "all", name: "All" },
  { id: "actors", name: "Actors" },
  { id: "musicians", name: "Musicians" },
  { id: "athletes", name: "Athletes" },
  { id: "models", name: "Models" },
  { id: "influencers", name: "Influencers" },
];

// Gender filters
const genderFilters = [
  { id: "all", name: "All" },
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];

export default function CelebrityCompareSelfScreen() {
  const router = useRouter();
  const { isPremium, freeComparisonUsed, getColors } = useUserStore();
  const colors = getColors();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [showPaywall, setShowPaywall] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchBarWidth = useSharedValue("90%");
  const fadeAnim = useSharedValue(0);
  const slideUpAnim = useSharedValue(20);
  
  const animatedSearchBarStyle = useAnimatedStyle(() => {
    return {
      width: searchBarWidth.value,
    };
  });
  
  const animatedFadeStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideUpAnim.value }],
    };
  });
  
  useEffect(() => {
    // Entrance animations
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideUpAnim.value = withTiming(0, { duration: 600 });
  }, []);
  
  // Filter celebrities based on search query, category, and gender
  const filteredCelebrities = celebrities.filter(celebrity => {
    const matchesSearch = searchQuery === "" || 
      celebrity.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      celebrity.category === selectedCategory;
    
    const matchesGender = selectedGender === "all" || 
      celebrity.gender === selectedGender;
    
    return matchesSearch && matchesCategory && matchesGender;
  });
  
  const handleCelebritySelect = (celebrity) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Check if user can access this feature
    if (!isPremium && freeComparisonUsed) {
      setShowPaywall(true);
      return;
    }
    
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to photo upload screen with selected celebrity
      router.push({
        pathname: "/user-photo",
        params: { 
          celebrityId: celebrity.id,
          celebrityName: celebrity.name,
          celebrityImage: celebrity.image
        }
      });
    }, 500);
  };
  
  const handleSearchFocus = () => {
    searchBarWidth.value = withSpring("100%");
  };
  
  const handleSearchBlur = () => {
    if (searchQuery === "") {
      searchBarWidth.value = withSpring("90%");
    }
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  
  const renderCelebrityItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.celebrityCard, { backgroundColor: colors.card }]}
      onPress={() => handleCelebritySelect(item)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.celebrityImage}
        contentFit="cover"
      />
      <View style={styles.celebrityInfo}>
        <Text style={[styles.celebrityName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.celebrityCategory, { color: colors.textLight }]}>
          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
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
          Compare{" "}
          <Text style={[styles.headerTitleAccent, { color: colors.primary }]}>Yourself</Text>
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.searchContainer}>
        <Animated.View style={[styles.searchBar, { backgroundColor: colors.card }, animatedSearchBarStyle]}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search celebrities..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </Animated.View>
        
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.card }]}>
          <Filter size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <Animated.View style={[styles.categoriesContainer, animatedFadeStyle]}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: selectedCategory === item.id ? colors.primary : colors.card }
              ]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSelectedCategory(item.id);
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCategory === item.id ? colors.background : colors.text }
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
      
      <Animated.View style={[styles.genderFiltersContainer, animatedFadeStyle]}>
        <FlatList
          data={genderFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.genderFiltersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.genderFilterButton,
                { backgroundColor: selectedGender === item.id ? colors.primary + "20" : "transparent" }
              ]}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSelectedGender(item.id);
              }}
            >
              <Text
                style={[
                  styles.genderFilterText,
                  { color: selectedGender === item.id ? colors.primary : colors.textLight }
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading celebrities...</Text>
        </View>
      ) : (
        <Animated.View style={[styles.celebritiesContainer, animatedFadeStyle]}>
          {filteredCelebrities.length > 0 ? (
            <FlatList
              data={filteredCelebrities}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.celebritiesList}
              renderItem={renderCelebrityItem}
              columnWrapperStyle={styles.celebrityRow}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No celebrities found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textLight }]}>
                Try adjusting your filters or search
              </Text>
            </View>
          )}
        </Animated.View>
      )}
      
      <TouchableOpacity 
        style={[styles.cameraButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/user-photo")}
      >
        <Camera size={24} color={colors.background} />
      </TouchableOpacity>
      
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
  },
  headerTitleAccent: {
    // Color applied dynamically
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  genderFiltersContainer: {
    marginBottom: 16,
  },
  genderFiltersList: {
    paddingHorizontal: 16,
  },
  genderFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  genderFilterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  celebritiesContainer: {
    flex: 1,
  },
  celebritiesList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  celebrityRow: {
    justifyContent: "space-between",
  },
  celebrityCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  celebrityImage: {
    width: "100%",
    height: CARD_WIDTH * 1.2,
  },
  celebrityInfo: {
    padding: 12,
  },
  celebrityName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  celebrityCategory: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});