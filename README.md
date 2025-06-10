# League Checker - AI Beauty Comparison App

A React Native mobile application that uses AI to compare beauty scores and determine if someone is "in your league." Built with Expo, TypeScript, and modern mobile development practices.

## 🌟 Features Overview

### Core Functionality
- **AI Beauty Analysis**: Upload photos for AI-powered beauty scoring
- **League Comparison**: Compare yourself with others or celebrities
- **Celebrity Database**: Compare with famous personalities
- **AI Roast Generator**: Get humorous AI-generated roasts
- **Premium Subscription**: Unlock unlimited features

### Technical Features
- **Multilingual Support**: English, Spanish, French, German, Portuguese, Italian
- **Dark Theme**: Modern orange/pink gradient design
- **Smooth Animations**: React Native Reanimated for fluid UX
- **Cross-Platform**: iOS, Android, and Web support
- **State Management**: Zustand with AsyncStorage persistence
- **Type Safety**: Full TypeScript implementation

## 📱 Screen-by-Screen Breakdown

### 1. Onboarding Flow
**Files**: `app/onboarding*.tsx`, `store/onboarding-store.ts`

- **Welcome Screen** (`/onboarding`): App introduction with hero image
- **Features Screen** (`/onboarding-features`): Core feature explanations
- **More Features Screen** (`/onboarding-more-features`): Advanced features showcase
- **Notifications Screen** (`/onboarding-notifications`): Permission requests
- **Subscription Screen** (`/onboarding-subscription`): Premium trial offer

**Key Features**:
- Smooth slide transitions between screens
- Skip/continue navigation options
- Premium trial introduction
- Notification permission handling

### 2. Homepage
**File**: `app/index.tsx`

**Features**:
- Hero section with couple dating image
- Large main CTA button for starting comparisons
- Quick access cards for celebrities and AI roast
- Premium upgrade banner for free users
- "How It Works" feature explanation
- Multilingual content support

**Navigation**: Central hub connecting to all major features

### 3. Gender Selection
**File**: `app/gender-selection.tsx`

**Features**:
- Male/Female selection for personalized analysis
- Animated selection cards
- Stores preference for comparison algorithm

### 4. Photo Capture Flow

#### User Photo Screen
**File**: `app/user-photo.tsx`

**Features**:
- Camera integration for selfie capture
- Gallery photo selection
- Photo preview with editing options
- Tips for optimal photo quality
- Real-time beauty score calculation

#### Target Photo Screen
**File**: `app/target-photo.tsx`

**Features**:
- Photo capture/upload for comparison target
- Celebrity database access button
- Premium feature gating
- Photo quality guidelines

### 5. Celebrity Database
**File**: `app/celebrities.tsx`, `mocks/celebrities.ts`

**Features**:
- Searchable celebrity database
- Category filtering (actors, musicians, models, etc.)
- Beauty score display for each celebrity
- Grid layout with smooth animations
- Premium access control

**Categories**: Actors, Musicians, Models, Athletes, Influencers

### 6. Comparison & Results

#### Loading Screen
**File**: `app/comparison-loading.tsx`

**Features**:
- AI analysis progress indicator
- Animated loading states
- Beauty score calculation simulation

#### Results Screen
**File**: `app/results.tsx`

**Features**:
- League status visualization with animated gauge
- Side-by-side photo comparison
- Beauty score breakdown
- Detailed feature analysis (premium)
- Social sharing capabilities
- Action buttons for next steps

**League Categories**:
- Way Beyond Your League
- Out of Your League
- Slightly Above Your League
- In Your League
- Slightly Below Your League
- You Can Do Better

### 7. AI Roastmaster
**File**: `app/roastmaster.tsx`

**Features**:
- Photo upload for roasting
- AI-generated humorous roasts
- Audio playback of roasts (premium)
- Multiple roast styles
- Social sharing integration
- Premium feature showcase

### 8. History & Results
**File**: `app/history.tsx`, `store/comparison-store.ts`

**Features**:
- Comparison history tracking
- Result filtering and search
- Detailed result viewing
- History management (clear, delete)

### 9. Subscription & Premium
**File**: `app/subscription.tsx`, `mocks/subscriptions.ts`

**Features**:
- Subscription plan comparison
- Free trial offers
- Premium feature explanations
- Payment integration ready
- Restore purchases functionality

### 10. Settings
**File**: `app/settings.tsx`

**Features**:
- Language switcher with 6 supported languages
- Notification preferences
- Premium subscription management
- App information and version
- Debug tools for development
- About & support links

## 🛠 Technical Architecture

### State Management
**Files**: `store/user-store.ts`, `store/comparison-store.ts`, `store/onboarding-store.ts`

- **Zustand**: Lightweight state management
- **AsyncStorage**: Persistent storage for user preferences
- **Language Support**: Integrated translation system

### Translations System
**File**: `constants/translations.ts`

- **Multi-language Support**: 6 languages with easy extensibility
- **Type-Safe Translations**: Full TypeScript support
- **Organized Structure**: Screen and component-specific translations
- **Hook-Based Usage**: `useTranslations()` for components

### Component Architecture
**Directory**: `components/`

- **BottomNavigation**: Main app navigation with multilingual labels
- **CameraView**: Camera integration with permissions
- **ImagePreview**: Photo display with editing capabilities
- **LeagueGauge**: Animated result visualization
- **PaywallModal**: Premium upgrade prompts
- **FeatureScoreCard**: Beauty analysis breakdown

### Styling & Design
**File**: `constants/colors.ts`

- **Dark Theme**: Primary design approach
- **Orange/Pink Gradients**: Brand color scheme
- **Responsive Design**: Works across all screen sizes
- **Accessibility**: Proper contrast and touch targets

### Mock Data
**Directory**: `mocks/`

- **celebrities.ts**: Celebrity database with categories
- **subscriptions.ts**: Premium plan configurations

## 🌍 Multilingual Support

### Supported Languages
1. **English** (en) - Default
2. **Spanish** (es) - Español
3. **French** (fr) - Français
4. **German** (de) - Deutsch
5. **Portuguese** (pt) - Português
6. **Italian** (it) - Italiano

### Implementation
- Language preference stored in user store
- Automatic persistence across app sessions
- Settings screen language switcher
- All UI text translated through centralized system

### Adding New Languages
1. Add language code to `Language` type in `constants/translations.ts`
2. Create translation object following existing structure
3. Add to `SUPPORTED_LANGUAGES` array
4. Update translations object with new language

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator / Android Emulator

### Installation
```bash
npm install
npx expo start
```

### Development
- **iOS**: Press `i` in terminal
- **Android**: Press `a` in terminal  
- **Web**: Press `w` in terminal

## 📦 Key Dependencies

- **Expo SDK 52**: Cross-platform development
- **React Native Reanimated**: Smooth animations
- **Expo Router**: File-based navigation
- **Zustand**: State management
- **TypeScript**: Type safety
- **Expo Image**: Optimized image handling
- **Expo Camera**: Camera integration
- **Lucide React Native**: Icon library

## 🎨 Design System

### Colors
- **Primary**: Orange (#FF6B35)
- **Secondary**: Pink/Red (#FF1744)
- **Background**: Dark (#121212)
- **Cards**: Dark Gray (#1E1E1E)
- **Text**: White/Gray variants

### Typography
- **Headings**: 900 weight, large sizes
- **Body**: 400-600 weight
- **Accents**: Primary color highlights

### Animations
- **Entrance**: Fade in with slide up
- **Interactions**: Scale on press
- **Loading**: Smooth progress indicators
- **Celebrations**: Pulse and sequence animations

## 🔒 Premium Features

### Free Tier
- One free comparison
- Basic league status
- Limited celebrity access

### Premium Tier
- Unlimited comparisons
- Full celebrity database
- AI roast generator
- Detailed beauty analysis
- Advanced sharing options
- Priority support

## 📱 Platform Support

### Mobile (Primary)
- **iOS**: Full feature support
- **Android**: Full feature support
- **Haptic Feedback**: iOS/Android only
- **Camera**: Native integration

### Web (Secondary)
- **Basic Functionality**: Core features work
- **Limited Features**: No haptics, camera limitations
- **Responsive Design**: Adapts to web layout

## 🧪 Development Tools

### Debug Features (Settings Screen)
- Reset onboarding flow
- Navigate to specific onboarding steps
- Toggle premium status
- Language switching
- Version information

### Mock Data
- Realistic celebrity database
- Simulated AI responses
- Beauty score algorithms
- Subscription plans

## 🔮 Future Enhancements

### Planned Features
- Real AI integration
- Social features and sharing
- More celebrity categories
- Advanced photo editing
- Voice roasts
- Video comparisons

### Technical Improvements
- Backend integration
- Real-time updates
- Push notifications
- Analytics integration
- Performance optimizations

## 📄 License

This project is for demonstration purposes. All celebrity images and data are used for educational/portfolio purposes only.

---

**League Checker** - Discover if someone is in your league with AI-powered beauty analysis! 🌟