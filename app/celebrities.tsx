
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Search, X, ArrowLeft } from "lucide-react-native";
import { useUserStore } from "@/store/user-store";
import { celebrities, celebrityCategories } from "@/mocks/celebrities";
import BottomNavigation from "@/components/BottomNavigation";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get("window");
const numColumns = 2;
const itemWidth = (width - 48) / numColumns;

export default function CelebritiesScreen() {
  const router = useRouter();
  const { setTargetImage, getColors } = useUserStore();
  const colors = getColors();
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
            Choose a Celebrity
          </Text>
          <Text style={[styles.subtitle, { color: colors.textLight }]}>
            Compare yourself with these famous personalities
          </Text>
        </View>
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
                  backgroundColor: selectedCategory === category.id ? colors.text : colors.card,
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
      
      <FlatList
        data={filteredCelebrities}
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
              <Image
                source={{ uri: item.image }}
                style={[styles.celebrityImage, { backgroundColor: colors.border }]}
                contentFit="cover"
              />
              <View style={styles.celebrityInfo}>
                <BlurView intensity={20} tint="prominent" style={styles.scoreContainer}>
                    <Text style={[styles.scoreText, { color: colors.text }]}>{Math.round(item.beautyScore * 10)}/10</Text>
                </BlurView>
              </View>
              <View style={styles.celebrityInfoName}>
                <Text style={[styles.celebrityName, { color: colors.text }]}>{item.name}</Text>
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
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "grey",
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
    zIndex: 1,
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
    height: 190,
    marginBottom: 16,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    zIndex: 1,
  },
  celebrityImage: {
    width: "100%",
    height: itemWidth * 1.2,
    zIndex: 1,
  },
  celebrityInfo: {
    padding: 12,
  },
  celebrityInfoName: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },

  celebrityName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    top: -85,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scoreContainer: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    width: 46,
    height: 22,
    borderWidth: 0.3,
    borderColor: "grey",
    backgroundColor: "rgba(37,37,37,0.27)",
    borderRadius: 6,
    top: -195,
    left: 94,
    zIndex: 10,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 4,
    flexDirection: "row",
    alignItems: "center",
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
});


/*

//wiki
import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { fetchCelebritiesFromWikidata } from "./data/wikidataFetcher";
import { formatWikidataResult } from "@/mocks/celebrities";
import { Celebrity } from "@/mocks/celebrity-test";

export default function CelebrityListScreen() {
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);

  useEffect(() => {
    const loadCelebrities = async () => {
      const rawData = await fetchCelebritiesFromWikidata();
      const formatted = formatWikidataResult(rawData);
      setCelebrities(formatted);
    };

    loadCelebrities();
  }, []);

  const renderItem = ({ item }: { item: Celebrity }) => (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>
          {item.gender} - Beauty: {(item.beautyScore * 100).toFixed(0)}%
        </Text>
      </View>
  );

  return (
      <FlatList
          data={celebrities}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.container}
      />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  meta: {
    fontSize: 14,
    color: "#666",
  },
});

*/
