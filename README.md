# League Checker - Beauty Comparison App

A React Native app built with Expo that allows users to compare their attractiveness with others using AI-powered beauty analysis.

## 🎯 App Overview

League Checker is an entertainment app that analyzes facial features and provides beauty scores to determine if someone is "in your league." The app uses mock AI analysis to compare users with celebrities or other people through photo uploads.

## 📱 Features

### Core Features
- **Photo Comparison**: Compare your selfie with another person's photo
- **Celebrity Database**: Compare yourself with famous personalities
- **AI Beauty Analysis**: Get detailed feature-by-feature beauty scores
- **League Status**: Find out if someone is in your league with fun categories
- **AI Roastmaster**: Get humorous AI-generated roasts about your appearance
- **Premium Subscription**: Unlock unlimited comparisons and advanced features

### Technical Features
- **Cross-platform**: Works on iOS, Android, and Web
- **Offline Support**: Basic functionality works without internet
- **Dark Theme**: Modern orange/pink gradient design
- **Smooth Animations**: React Native Reanimated for fluid UX
- **State Management**: Zustand for app state
- **Backend Integration**: tRPC for type-safe API calls

## 🏗️ App Structure

### Main Screens

#### 1. **Homepage** (`app/index.tsx`)
- **Purpose**: Main landing screen with app overview
- **Features**:
  - Hero section with dating couple image
  - Main CTA button to start comparison
  - Quick action cards for celebrities and AI roast
  - Premium upgrade banner (for non-premium users)
  - "How It Works" feature explanation
  - App disclaimer
- **Navigation**: Bottom navigation with scan, results, history tabs

#### 2. **Onboarding Flow** (`app/onboarding*.tsx`)
- **Purpose**: First-time user experience
- **Screens**:
  - **Welcome** (`onboarding.tsx`): App introduction
  - **Features** (`onboarding-features.tsx`): Core features overview
  - **More Features** (`onboarding-more-features.tsx`): Advanced features
  - **Notifications** (`onboarding-notifications.tsx`): Permission request
  - **Subscription** (`onboarding-subscription.tsx`): Premium offer
- **Flow**: Linear progression with skip options

#### 3. **Gender Selection** (`app/gender-selection.tsx`)
- **Purpose**: User gender selection for better analysis
- **Features**:
  - Male/Female selection cards
  - Animated selection feedback
  - Proceeds to photo capture

#### 4. **User Photo Capture** (`app/user-photo.tsx`)
- **Purpose**: Capture or upload user's selfie
- **Features**:
  - Camera integration with CameraView component
  - Photo library access
  - Image preview with removal option
  - Photo tips for best results
  - Validation before proceeding

#### 5. **Target Photo Selection** (`app/target-photo.tsx`)
- **Purpose**: Select comparison target
- **Features**:
  - Camera capture or photo upload
  - Celebrity comparison option
  - Premium feature gating
  - Photo tips and guidelines
  - Paywall integration for non-premium users

#### 6. **Celebrity Selection** (`app/celebrities.tsx`)
- **Purpose**: Browse and select celebrities for comparison
- **Features**:
  - Grid layout of celebrity photos
  - Search functionality
  - Category filtering (actors, musicians, etc.)
  - Beauty scores display
  - Premium feature (gated for free users)

#### 7. **Comparison Loading** (`app/comparison-loading.tsx`)
- **Purpose**: Show analysis progress
- **Features**:
  - Animated loading indicators
  - Progress messages
  - Simulated AI analysis delay
  - Smooth transition to results

#### 8. **Results Screen** (`app/results.tsx`)
- **Purpose**: Display comparison results
- **Features**:
  - League status with visual gauge
  - Side-by-side photo comparison
  - Beauty scores for both subjects
  - Feature analysis (premium)
  - Social sharing options
  - Action buttons for next steps
  - Results history integration

#### 9. **History** (`app/history.tsx`)
- **Purpose**: View past comparisons
- **Features**:
  - Chronological list of comparisons
  - Comparison cards with key details
  - Empty state for new users
  - Clear history option
  - Navigation to detailed results

#### 10. **Settings** (`app/settings.tsx`)
- **Purpose**: App configuration and user preferences
- **Features**:
  - Premium status display
  - Subscription management
  - Privacy settings
  - App information
  - Support links

#### 11. **AI Roastmaster** (`app/roastmaster.tsx`)
- **Purpose**: AI-generated humorous roasts
- **Features**:
  - Photo upload for roasting
  - AI-generated roast text
  - Sharing capabilities
  - Premium feature gating
  - Entertainment-focused content

#### 12. **Subscription** (`app/subscription.tsx`)
- **Purpose**: Premium subscription management
- **Features**:
  - Subscription plan display
  - Feature comparison
  - Payment integration (mock)
  - Terms and privacy links

## 🧩 Key Components

### UI Components

#### **CameraView** (`components/CameraView.tsx`)
- **Purpose**: Camera interface for photo capture
- **Features**: Front/back camera toggle, capture button, cancel option

#### **ImagePreview** (`components/ImagePreview.tsx`)
- **Purpose**: Display and manage uploaded images
- **Features**: Image display, removal option, loading states

#### **LeagueGauge** (`components/LeagueGauge.tsx`)
- **Purpose**: Visual representation of league status
- **Features**: Animated gauge, color-coded status, descriptive text

#### **PaywallModal** (`components/PaywallModal.tsx`)
- **Purpose**: Premium subscription prompt
- **Features**: Plan selection, pricing display, subscription flow

#### **BottomNavigation** (`components/BottomNavigation.tsx`)
- **Purpose**: Main app navigation
- **Features**: Tab-based navigation, active state indicators

#### **FeatureScoreCard** (`components/FeatureScoreCard.tsx`)
- **Purpose**: Display individual beauty feature scores
- **Features**: Score visualization, status indicators, premium feature

#### **ComparisonCard** (`components/ComparisonCard.tsx`)
- **Purpose**: Display comparison results in lists
- **Features**: Thumbnail images, scores, date stamps

#### **EmptyState** (`components/EmptyState.tsx`)
- **Purpose**: Handle empty data states
- **Features**: Illustrations, call-to-action buttons, helpful messaging

#### **SubscriptionCard** (`components/SubscriptionCard.tsx`)
- **Purpose**: Display subscription plan options
- **Features**: Plan details, pricing, selection states

## 🗄️ State Management

### **User Store** (`store/user-store.ts`)
- **Purpose**: Main application state management
- **State**:
  - User profile and photos
  - Comparison targets
  - Premium status
  - App settings
  - Comparison history
- **Actions**:
  - Photo management
  - Comparison execution
  - Premium status updates
  - Settings management

### **Comparison Store** (`store/comparison-store.ts`)
- **Purpose**: Comparison-specific state
- **State**:
  - Comparison history
  - Current comparison data
  - Loading states
- **Actions**:
  - Add new comparisons
  - Clear history
  - Manage current comparison

### **Onboarding Store** (`store/onboarding-store.ts`)
- **Purpose**: Onboarding flow state
- **State**:
  - Completion status
  - Current step
- **Actions**:
  - Mark onboarding complete
  - Track progress

## 🔧 Backend Integration

### **tRPC Setup** (`lib/trpc.ts`)
- **Purpose**: Type-safe API client configuration
- **Features**: React Query integration, error handling

### **API Routes** (`backend/trpc/routes/`)

#### **Beauty Analysis** (`beauty/analyze/route.ts`)
- **Purpose**: Mock AI beauty analysis
- **Input**: User and target images, gender
- **Output**: Beauty scores, league status, feature analysis

#### **Beauty Roast** (`beauty/roast/route.ts`)
- **Purpose**: Generate AI roasts
- **Input**: User image
- **Output**: Humorous roast text

## 🎨 Design System

### **Colors** (`constants/colors.ts`)
- **Theme**: Dark theme with orange/pink gradients
- **Primary**: Orange (#FF6B35)
- **Secondary**: Pink (#FF8E9B)
- **Background**: Dark (#1A1A1A)
- **Text**: White/Light gray
- **Cards**: Dark gray (#2A2A2A)

### **Typography**
- **Headers**: Bold, large fonts for impact
- **Body**: Readable, medium-weight fonts
- **Accents**: Colored text for emphasis

### **Animations**
- **Library**: React Native Reanimated
- **Types**: Spring animations, fade transitions, scale effects
- **Purpose**: Smooth user interactions, loading states, celebrations

## 📊 Data Models

### **User**
```typescript
{
  id: string
  gender?: "male" | "female"
  frontImage: string | null
  sideImage: string | null
  beautyScore: number
}
```

### **Target**
```typescript
{
  id: string
  image: string
  name?: string
  beautyScore: number
  isCelebrity?: boolean
}
```

### **ComparisonResult**
```typescript
{
  id: string
  date: string
  user: User
  target: Target
  leagueStatus: LeagueStatus
  feedback: string
}
```

### **Celebrity**
```typescript
{
  id: string
  name: string
  image: string
  beautyScore: number
  category: string
}
```

## 🔒 Premium Features

### **Free Tier**
- One comparison per user
- Basic league status
- Limited celebrity access
- Basic sharing

### **Premium Tier**
- Unlimited comparisons
- Detailed feature analysis
- Full celebrity database
- AI roastmaster
- Priority support
- Advanced sharing options

## 🚀 Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **API**: tRPC with React Query
- **Backend**: Hono.js
- **Animations**: React Native Reanimated
- **Camera**: Expo Camera
- **Image Handling**: Expo Image
- **Navigation**: Expo Router
- **Styling**: StyleSheet (React Native)

## 📱 Platform Support

- **iOS**: Full feature support
- **Android**: Full feature support
- **Web**: Limited features (no camera, haptics)

## 🎯 User Flow

1. **First Launch**: Onboarding flow → Gender selection
2. **Main Flow**: Homepage → Photo capture → Target selection → Analysis → Results
3. **Celebrity Flow**: Homepage → Celebrity selection → Photo capture → Analysis → Results
4. **Premium Flow**: Any premium feature → Paywall → Subscription → Feature access

## 🔧 Development Notes

- **Mock Data**: All AI analysis is simulated for demo purposes
- **Offline Support**: Basic functionality works without internet
- **Error Handling**: Graceful degradation for network issues
- **Performance**: Optimized images and animations
- **Accessibility**: Screen reader support and proper contrast
- **Security**: No sensitive data storage, privacy-focused

## 📄 Disclaimer

This app is for entertainment purposes only. Beauty is subjective, and the algorithm provides approximations based on photographic evidence. Results should not be taken seriously as they don't reflect real attractiveness or worth.