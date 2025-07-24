import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Camera, ScanFace, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const AutoScrollFeatures = () => {
    const scrollRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const features = [
        {
            icon: <Camera size={24} color="pink" />,
            title: "Take Your Selfie",
            description: "Capture a clear selfie for accurate beauty analysis",
        },
        {
            icon: <ScanFace size={24} color="pink" />,
            title: "Compare With Someone",
            description: "Upload their photo or choose from our celebrity database",
        },
        {
            icon: <Sparkles size={24} color="pink" />,
            title: "Get Honest Result",
            description: "Receive a percentage-based feedback on your beauty score",
        },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const newIndex = (currentIndex + 1) % features.length;
                setCurrentIndex(newIndex);
                scrollRef.current.scrollTo({
                    x: newIndex * (width - 16),
                    animated: true
                });
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleScrollEnd = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(scrollPosition / (width - 30));
        setCurrentIndex(newIndex);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContainer}
                onMomentumScrollEnd={handleScrollEnd}
                decelerationRate="fast"
            >
                {features.map((feature, index) => (
                    <View key={index} style={styles.featureCard}>
                        <View style={[styles.iconBubble, { backgroundColor: "#FFA4B9" + "20" }]}>
                            {feature.icon}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title} numberOfLines={1}>
                                {feature.title}
                            </Text>
                            <Text style={styles.description} numberOfLines={2}>
                                {feature.description}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Indicateurs de pagination */}
            <View style={styles.pagination}>
                {features.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            {
                                backgroundColor: index === currentIndex ? 'pink' : '#555',
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },

    container: {
        marginVertical: 20,
        alignItems: 'center',
    },
    featureCard: {
        width: width - 32,
        backgroundColor: '#1c1c1e',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    iconBubble: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2a2a2d',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    gaugeIcon: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'pink',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#aaa',
        flexShrink: 1,
    },
    scrollView: {
        marginHorizontal: -16,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingRight: 32,
    },
});

export default AutoScrollFeatures;