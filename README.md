# League Checker App

A mobile application that allows users to compare their attractiveness with others and celebrities, providing a fun and engaging way to see if someone is "in your league."

## Features Overview

### Home Screen
- Hero section with app introduction
- Main CTA to start photo comparison
- Quick access to premium features (celebrities, AI roast)
- Premium upgrade banner for free users
- Feature explanation section
- App disclaimer

### Onboarding Flow
1. **Welcome Screen**: Introduction to the app
2. **Features Screen**: Overview of main features
3. **More Features Screen**: Additional premium features
4. **Notifications Screen**: Option to enable notifications
5. **Subscription Screen**: Premium subscription offer

### Gender Selection
- Choose between male and female for more accurate comparisons

### Photo Upload
- Take a selfie using the camera
- Upload a photo from the gallery
- Photo preview and retake option

### Target Photo
- Take or upload a photo of the person to compare with
- Option to select from celebrities (premium feature)

### Comparison Process
- Loading screen with analysis animation
- AI-powered beauty score calculation
- League status determination

### Results Screen
- League status visualization with animated gauge
- Side-by-side photo comparison with beauty scores
- Detailed feature analysis (premium feature)
- Social sharing capabilities
- Action buttons for next steps

### Celebrity Comparisons
Three main options:
1. **Compare Yourself with Celebrities**:
   - Browse and filter celebrities by category, gender, and age
   - Select a celebrity to compare with
   - Upload your photo for comparison
   - View detailed comparison results

2. **Compare Between Celebrities**:
   - Select two different celebrities
   - View side-by-side comparison of their beauty scores
   - See detailed analysis of which celebrity ranks higher

3. **Find Your Celebrity Lookalike** (Coming Soon):
   - Upload your photo
   - Get AI-powered analysis to find celebrity matches
   - View a ranked list of celebrities you resemble

### AI Roastmaster
- Upload your photo for an AI-generated roast
- Humorous commentary on your appearance
- Option to get a new roast or share results

### History
- View past comparisons
- Revisit previous results
- Clear history option

### Settings
- Account management
- Theme preferences
- Notification settings
- Privacy options
- Subscription management
- About and help resources

### Premium Features
- Unlimited comparisons (free users get one free comparison)
- Celebrity comparisons
- Detailed beauty analysis
- AI roast feature
- Advanced sharing options

## Technical Implementation

### Architecture
- React Native with Expo
- File-based routing with Expo Router
- State management with Zustand
- Persistent storage with AsyncStorage
- Animations with React Native Reanimated
- UI components with React Native core components
- Image handling with Expo Image
- Camera integration with Expo Camera

### Backend Integration
- tRPC for type-safe API calls
- React Query for data fetching and caching
- Mock data for demonstration purposes

### Design System
- Dark theme with orange/pink accent colors
- Consistent UI components
- Responsive layouts for different screen sizes
- Smooth animations and transitions
- Haptic feedback for enhanced user experience

## Premium Subscription
- Monthly and yearly subscription options
- One-time lifetime purchase
- 3-day free trial
- Unlock all premium features
- Subscription management through app stores

## Privacy and Data Handling
- Photos are processed securely
- Option to delete all data
- Clear privacy policy and terms of service
- No data sharing with third parties

---

This app is designed for entertainment purposes only. Beauty is subjective, and our algorithm provides an approximation based on photographic evidence. Not everyone is photogenic, so don't take the results too seriously!