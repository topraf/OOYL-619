import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from "expo-linear-gradient";

const PremiumCard = ({ onPress }: any) => {
    return (
        <LinearGradient
            colors={[
                '#913f8f',
                '#e5a0b9',
                '#f9943b',]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
        >
            <Text style={styles.title}>Unlock PRO</Text>
            <Text style={styles.subtitle}>
                Unlimited comparisons, celebrity matches, {'\n'} and AI beauty analysis
            </Text>

            <TouchableOpacity style={styles.goProButton} onPress={onPress}>
                <Text style={styles.goProText}>Go Pro</Text>
                <Text style={styles.goProPlus}>+</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
    },
    goProButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    goProText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
        marginRight: 4,
    },
    goProPlus: {
        color: '#000',
        fontWeight: '800',
        fontSize: 14,
    },
});

export default PremiumCard;
