/**
 * Translations System - Multilingual support for League Checker
 * 
 * This file contains all the text strings used throughout the app in multiple languages.
 * Currently supports English and Spanish, with easy extensibility for more languages.
 * 
 * Usage:
 * import { useTranslations } from '@/constants/translations';
 * const t = useTranslations();
 * <Text>{t.common.continue}</Text>
 * 
 * To add a new language:
 * 1. Add the language code to the Language type
 * 2. Add the translations object for that language
 * 3. Update the SUPPORTED_LANGUAGES array
 * 
 * Structure:
 * - common: Shared strings across the app
 * - screens: Screen-specific strings organized by screen name
 * - components: Component-specific strings
 * - errors: Error messages and validation strings
 */

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it';

export interface Translations {
  common: {
    continue: string;
    cancel: string;
    back: string;
    next: string;
    done: string;
    skip: string;
    save: string;
    delete: string;
    edit: string;
    share: string;
    loading: string;
    error: string;
    success: string;
    retry: string;
    close: string;
    yes: string;
    no: string;
    maybe_later: string;
    get_started: string;
    upgrade: string;
    premium: string;
    free: string;
    settings: string;
  };
  
  screens: {
    home: {
      title: string;
      subtitle: string;
      main_cta: string;
      free_comparison: string;
      celebrities_title: string;
      celebrities_subtitle: string;
      ai_roast_title: string;
      ai_roast_subtitle: string;
      premium_title: string;
      premium_subtitle: string;
      premium_cta: string;
      how_it_works: string;
      step1_title: string;
      step1_description: string;
      step2_title: string;
      step2_description: string;
      step3_title: string;
      step3_description: string;
      disclaimer: string;
    };
    
    settings: {
      title: string;
      app_settings: string;
      notifications: string;
      save_history: string;
      about_support: string;
      how_it_works: string;
      rate_app: string;
      help_support: string;
      debug_testing: string;
      reset_onboarding: string;
      demo_premium: string;
      demo_disable_premium: string;
      language: string;
      version: string;
      disclaimer: string;
    };
    
    onboarding: {
      welcome_title: string;
      welcome_subtitle: string;
      features_title: string;
      features_subtitle: string;
      notifications_title: string;
      notifications_subtitle: string;
      notifications_allow: string;
      notifications_skip: string;
      subscription_title: string;
      subscription_subtitle: string;
      subscription_cta: string;
      subscription_skip: string;
      disclaimer: string;
    };
    
    celebrities: {
      title: string;
      subtitle: string;
      search_placeholder: string;
      no_results: string;
      beauty_score: string;
    };
    
    results: {
      title: string;
      analyzing: string;
      calculating: string;
      no_results_title: string;
      no_results_message: string;
      start_comparison: string;
      league_status: {
        way_beyond: string;
        out_of_league: string;
        slightly_above: string;
        in_your_league: string;
        slightly_below: string;
        you_can_do_better: string;
      };
      league_descriptions: {
        way_beyond: string;
        out_of_league: string;
        slightly_above: string;
        in_your_league: string;
        slightly_below: string;
        you_can_do_better: string;
      };
      league_phrases: {
        way_beyond: string;
        out_of_league: string;
        slightly_above: string;
        in_your_league: string;
        slightly_below: string;
        you_can_do_better: string;
      };
      beauty_analysis: string;
      share_results: string;
      whats_next: string;
      try_again: string;
      compare_celebrities: string;
      get_roasted: string;
      disclaimer: string;
    };
    
    roastmaster: {
      title: string;
      subtitle: string;
      select_photo: string;
      camera: string;
      gallery: string;
      ai_says: string;
      preparing: string;
      generate_roast: string;
      generate_another: string;
      hear_roast: string;
      premium_features: string;
      roast_me_now: string;
      unlock_features: string;
      disclaimer: string;
    };
    
    user_photo: {
      title: string;
      subtitle: string;
      take_photo: string;
      upload_photo: string;
      tips_title: string;
      tip_lighting: string;
      tip_expression: string;
      tip_accessories: string;
      tip_visibility: string;
      add_selfie: string;
    };
    
    target_photo: {
      title: string;
      subtitle: string;
      take_photo: string;
      upload_photo: string;
      or: string;
      compare_celebrities: string;
      celebrities_subtitle: string;
      tips_title: string;
      tip_clear: string;
      tip_lighting: string;
      tip_expression: string;
      tip_one_person: string;
      compare_now: string;
      add_photo: string;
      premium_comparison: string;
    };
  };
  
  components: {
    bottom_nav: {
      scan: string;
      celebrities: string;
      results: string;
      roast: string;
      settings: string;
    };
    
    paywall: {
      title: string;
      subtitle: string;
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
      start_trial: string;
      restore_purchases: string;
      terms: string;
      privacy: string;
    };
  };
  
  errors: {
    no_camera_permission: string;
    no_gallery_permission: string;
    image_load_failed: string;
    comparison_failed: string;
    network_error: string;
    unknown_error: string;
  };
}

const englishTranslations: Translations = {
  common: {
    continue: "Continue",
    cancel: "Cancel",
    back: "Back",
    next: "Next",
    done: "Done",
    skip: "Skip",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    share: "Share",
    loading: "Loading",
    error: "Error",
    success: "Success",
    retry: "Retry",
    close: "Close",
    yes: "Yes",
    no: "No",
    maybe_later: "Maybe Later",
    get_started: "Get Started",
    upgrade: "Upgrade",
    premium: "Premium",
    free: "Free",
    settings: "Settings",
  },
  
  screens: {
    home: {
      title: "League Checker",
      subtitle: "Find out if someone is in your league",
      main_cta: "Find out if (s)he is out of your league!",
      free_comparison: "First comparison is FREE!",
      celebrities_title: "Celebrities",
      celebrities_subtitle: "Compare with famous people",
      ai_roast_title: "AI Roast",
      ai_roast_subtitle: "Get roasted by our AI",
      premium_title: "Upgrade to Premium",
      premium_subtitle: "Unlimited comparisons, celebrity matches, and AI beauty analysis",
      premium_cta: "Get Premium",
      how_it_works: "How It Works",
      step1_title: "📸 Take Your Selfie",
      step1_description: "Capture a clear selfie for accurate beauty analysis",
      step2_title: "🎯 Compare With Someone",
      step2_description: "Upload their photo or choose from our celebrity database",
      step3_title: "✨ Get Honest Results",
      step3_description: "Find out if they're in your league with our advanced algorithm",
      disclaimer: "This app is for entertainment purposes only. Beauty is subjective and our algorithm provides an approximation based on photographic evidence. Not everyone is photogenic, so don't take the results too seriously!",
    },
    
    settings: {
      title: "Settings",
      app_settings: "App Settings",
      notifications: "Notifications",
      save_history: "Save History",
      about_support: "About & Support",
      how_it_works: "How It Works",
      rate_app: "Rate the App",
      help_support: "Help & Support",
      debug_testing: "Debug & Testing",
      reset_onboarding: "Reset & Show Onboarding",
      demo_premium: "Demo: Enable Premium",
      demo_disable_premium: "Demo: Disable Premium",
      language: "Language",
      version: "v1.0.0",
      disclaimer: "This app is for entertainment purposes only. Beauty is subjective and our algorithm provides an approximation based on photographic evidence.",
    },
    
    onboarding: {
      welcome_title: "Want to see who's out of your league?",
      welcome_subtitle: "Find out if that crush is in your league with our AI-powered beauty analysis",
      features_title: "Discover Your League",
      features_subtitle: "Compare yourself with anyone using advanced AI analysis",
      notifications_title: "Stay Updated",
      notifications_subtitle: "Get notified about new features and comparison results",
      notifications_allow: "Allow Notifications",
      notifications_skip: "Skip for Now",
      subscription_title: "Get the Full Experience",
      subscription_subtitle: "Unlock unlimited comparisons and premium features",
      subscription_cta: "Start Free Trial",
      subscription_skip: "Not Right Now",
      disclaimer: "For entertainment purposes only. Beauty is subjective and our algorithm provides an approximation based on photographic evidence.",
    },
    
    celebrities: {
      title: "Choose a Celebrity",
      subtitle: "Compare yourself with these famous personalities",
      search_placeholder: "Search celebrities...",
      no_results: "No celebrities found",
      beauty_score: "Beauty Score",
    },
    
    results: {
      title: "Your Results",
      analyzing: "Analyzing your photos...",
      calculating: "Calculating league status",
      no_results_title: "No Results Yet",
      no_results_message: "Take photos to see if someone is in your league!",
      start_comparison: "Start Comparison",
      league_status: {
        way_beyond: "They are way beyond your league",
        out_of_league: "They are out of your league",
        slightly_above: "They are slightly above your league",
        in_your_league: "They are in your league",
        slightly_below: "They are slightly below your league",
        you_can_do_better: "You can do better",
      },
      league_descriptions: {
        way_beyond: "This person is significantly more attractive than you based on our analysis.",
        out_of_league: "This person is more attractive than you, but not impossibly so.",
        slightly_above: "This person is slightly more attractive than you.",
        in_your_league: "You and this person are well-matched in terms of attractiveness!",
        slightly_below: "You are slightly more attractive than this person.",
        you_can_do_better: "You are significantly more attractive than this person.",
      },
      league_phrases: {
        way_beyond: "Dream on! 🌟",
        out_of_league: "Aim high! 🎯",
        slightly_above: "Close call! 📈",
        in_your_league: "Perfect match! 💫",
        slightly_below: "You're winning! 🏆",
        you_can_do_better: "Reach higher! 🚀",
      },
      beauty_analysis: "Your Beauty Analysis",
      share_results: "Share Your Results",
      whats_next: "What's Next?",
      try_again: "Try with another photo again",
      compare_celebrities: "Compare with celebrities",
      get_roasted: "Get roasted by our AI if you dare",
      disclaimer: "This comparison is based on photographic evidence only. Beauty is subjective and not everyone is photogenic. Don't take these results too seriously!",
    },
    
    roastmaster: {
      title: "AI Roastmaster",
      subtitle: "Get roasted by our AI",
      select_photo: "Select a photo to get roasted",
      camera: "Camera",
      gallery: "Gallery",
      ai_says: "AI Roastmaster Says:",
      preparing: "Preparing your roast...",
      generate_roast: "Generate Roast",
      generate_another: "Generate Another Roast",
      hear_roast: "Hear Your Roast",
      premium_features: "Premium Roast Features",
      roast_me_now: "Roast Me Now!",
      unlock_features: "Unlock unlimited roasts and premium features",
      disclaimer: "Our AI roasts are meant to be humorous and not to be taken seriously. We believe everyone is beautiful in their own way! ✨",
    },
    
    user_photo: {
      title: "Take Your Selfie",
      subtitle: "We need a clear photo of your face for accurate comparison",
      take_photo: "Take Photo",
      upload_photo: "Upload Photo",
      tips_title: "Tips for Best Results:",
      tip_lighting: "💡 Use good lighting",
      tip_expression: "😐 Keep a neutral expression",
      tip_accessories: "👓 Remove glasses and hats",
      tip_visibility: "👤 Ensure your full face is visible",
      add_selfie: "Please add a selfie to continue",
    },
    
    target_photo: {
      title: "Who Are You Comparing With?",
      subtitle: "Take or upload a photo of the person you want to compare with",
      take_photo: "Take Photo",
      upload_photo: "Upload Photo",
      or: "Or",
      compare_celebrities: "Compare with Celebrities",
      celebrities_subtitle: "Choose from our database of famous people",
      tips_title: "For Best Results:",
      tip_clear: "📸 Use a clear, front-facing photo",
      tip_lighting: "💡 Ensure good lighting",
      tip_expression: "😐 Choose a photo with neutral expression",
      tip_one_person: "🧑‍🤝‍🧑 One person per photo works best",
      compare_now: "Compare Now",
      add_photo: "Please add a photo to compare with",
      premium_comparison: "This will use your premium comparison",
    },
  },
  
  components: {
    bottom_nav: {
      scan: "Scan",
      celebrities: "Stars",
      results: "Results",
      roast: "Roast",
      settings: "Settings",
    },
    
    paywall: {
      title: "Upgrade to Premium",
      subtitle: "Unlock all features and unlimited comparisons",
      feature1: "Unlimited comparisons",
      feature2: "Celebrity database access",
      feature3: "AI roast generator",
      feature4: "Advanced beauty analysis",
      start_trial: "Start Free Trial",
      restore_purchases: "Restore Purchases",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
    },
  },
  
  errors: {
    no_camera_permission: "Camera permission is required to take photos",
    no_gallery_permission: "Gallery permission is required to select photos",
    image_load_failed: "Failed to load image",
    comparison_failed: "Comparison failed. Please try again.",
    network_error: "Network error. Please check your connection.",
    unknown_error: "An unknown error occurred",
  },
};

const spanishTranslations: Translations = {
  common: {
    continue: "Continuar",
    cancel: "Cancelar",
    back: "Atrás",
    next: "Siguiente",
    done: "Hecho",
    skip: "Omitir",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    share: "Compartir",
    loading: "Cargando",
    error: "Error",
    success: "Éxito",
    retry: "Reintentar",
    close: "Cerrar",
    yes: "Sí",
    no: "No",
    maybe_later: "Tal vez más tarde",
    get_started: "Comenzar",
    upgrade: "Actualizar",
    premium: "Premium",
    free: "Gratis",
    settings: "Configuración",
  },
  
  screens: {
    home: {
      title: "Verificador de Liga",
      subtitle: "Descubre si alguien está en tu liga",
      main_cta: "¡Descubre si él/ella está fuera de tu liga!",
      free_comparison: "¡Primera comparación GRATIS!",
      celebrities_title: "Celebridades",
      celebrities_subtitle: "Compárate con personas famosas",
      ai_roast_title: "IA Roast",
      ai_roast_subtitle: "Deja que nuestra IA te critique",
      premium_title: "Actualizar a Premium",
      premium_subtitle: "Comparaciones ilimitadas, celebridades y análisis de belleza con IA",
      premium_cta: "Obtener Premium",
      how_it_works: "Cómo Funciona",
      step1_title: "📸 Toma tu Selfie",
      step1_description: "Captura una selfie clara para un análisis preciso de belleza",
      step2_title: "🎯 Compara con Alguien",
      step2_description: "Sube su foto o elige de nuestra base de datos de celebridades",
      step3_title: "✨ Obtén Resultados Honestos",
      step3_description: "Descubre si están en tu liga con nuestro algoritmo avanzado",
      disclaimer: "Esta aplicación es solo para entretenimiento. La belleza es subjetiva y nuestro algoritmo proporciona una aproximación basada en evidencia fotográfica. ¡No todos son fotogénicos, así que no te tomes los resultados muy en serio!",
    },
    
    settings: {
      title: "Configuración",
      app_settings: "Configuración de la App",
      notifications: "Notificaciones",
      save_history: "Guardar Historial",
      about_support: "Acerca de y Soporte",
      how_it_works: "Cómo Funciona",
      rate_app: "Calificar la App",
      help_support: "Ayuda y Soporte",
      debug_testing: "Depuración y Pruebas",
      reset_onboarding: "Reiniciar y Mostrar Introducción",
      demo_premium: "Demo: Activar Premium",
      demo_disable_premium: "Demo: Desactivar Premium",
      language: "Idioma",
      version: "v1.0.0",
      disclaimer: "Esta aplicación es solo para entretenimiento. La belleza es subjetiva y nuestro algoritmo proporciona una aproximación basada en evidencia fotográfica.",
    },
    
    onboarding: {
      welcome_title: "¿Quieres ver quién está fuera de tu liga?",
      welcome_subtitle: "Descubre si esa persona especial está en tu liga con nuestro análisis de belleza con IA",
      features_title: "Descubre Tu Liga",
      features_subtitle: "Compárate con cualquiera usando análisis avanzado de IA",
      notifications_title: "Mantente Actualizado",
      notifications_subtitle: "Recibe notificaciones sobre nuevas funciones y resultados de comparación",
      notifications_allow: "Permitir Notificaciones",
      notifications_skip: "Omitir por Ahora",
      subscription_title: "Obtén la Experiencia Completa",
      subscription_subtitle: "Desbloquea comparaciones ilimitadas y funciones premium",
      subscription_cta: "Iniciar Prueba Gratuita",
      subscription_skip: "Ahora No",
      disclaimer: "Solo para entretenimiento. La belleza es subjetiva y nuestro algoritmo proporciona una aproximación basada en evidencia fotográfica.",
    },
    
    celebrities: {
      title: "Elige una Celebridad",
      subtitle: "Compárate con estas personalidades famosas",
      search_placeholder: "Buscar celebridades...",
      no_results: "No se encontraron celebridades",
      beauty_score: "Puntuación de Belleza",
    },
    
    results: {
      title: "Tus Resultados",
      analyzing: "Analizando tus fotos...",
      calculating: "Calculando estado de liga",
      no_results_title: "Aún No Hay Resultados",
      no_results_message: "¡Toma fotos para ver si alguien está en tu liga!",
      start_comparison: "Iniciar Comparación",
      league_status: {
        way_beyond: "Están muy por encima de tu liga",
        out_of_league: "Están fuera de tu liga",
        slightly_above: "Están ligeramente por encima de tu liga",
        in_your_league: "Están en tu liga",
        slightly_below: "Están ligeramente por debajo de tu liga",
        you_can_do_better: "Puedes hacerlo mejor",
      },
      league_descriptions: {
        way_beyond: "Esta persona es significativamente más atractiva que tú según nuestro análisis.",
        out_of_league: "Esta persona es más atractiva que tú, pero no imposiblemente.",
        slightly_above: "Esta persona es ligeramente más atractiva que tú.",
        in_your_league: "¡Tú y esta persona están bien emparejados en términos de atractivo!",
        slightly_below: "Eres ligeramente más atractivo que esta persona.",
        you_can_do_better: "Eres significativamente más atractivo que esta persona.",
      },
      league_phrases: {
        way_beyond: "¡Sigue soñando! 🌟",
        out_of_league: "¡Apunta alto! 🎯",
        slightly_above: "¡Por poco! 📈",
        in_your_league: "¡Pareja perfecta! 💫",
        slightly_below: "¡Estás ganando! 🏆",
        you_can_do_better: "¡Apunta más alto! 🚀",
      },
      beauty_analysis: "Tu Análisis de Belleza",
      share_results: "Compartir Tus Resultados",
      whats_next: "¿Qué Sigue?",
      try_again: "Intentar con otra foto",
      compare_celebrities: "Comparar con celebridades",
      get_roasted: "Deja que nuestra IA te critique si te atreves",
      disclaimer: "Esta comparación se basa solo en evidencia fotográfica. La belleza es subjetiva y no todos son fotogénicos. ¡No te tomes estos resultados muy en serio!",
    },
    
    roastmaster: {
      title: "IA Roastmaster",
      subtitle: "Deja que nuestra IA te critique",
      select_photo: "Selecciona una foto para ser criticado",
      camera: "Cámara",
      gallery: "Galería",
      ai_says: "La IA Roastmaster Dice:",
      preparing: "Preparando tu crítica...",
      generate_roast: "Generar Crítica",
      generate_another: "Generar Otra Crítica",
      hear_roast: "Escuchar Tu Crítica",
      premium_features: "Funciones Premium de Crítica",
      roast_me_now: "¡Critícame Ahora!",
      unlock_features: "Desbloquea críticas ilimitadas y funciones premium",
      disclaimer: "Nuestras críticas de IA están destinadas a ser humorísticas y no deben tomarse en serio. ¡Creemos que todos son hermosos a su manera! ✨",
    },
    
    user_photo: {
      title: "Toma tu Selfie",
      subtitle: "Necesitamos una foto clara de tu cara para una comparación precisa",
      take_photo: "Tomar Foto",
      upload_photo: "Subir Foto",
      tips_title: "Consejos para Mejores Resultados:",
      tip_lighting: "💡 Usa buena iluminación",
      tip_expression: "😐 Mantén una expresión neutral",
      tip_accessories: "👓 Quítate gafas y sombreros",
      tip_visibility: "👤 Asegúrate de que tu cara completa sea visible",
      add_selfie: "Por favor agrega una selfie para continuar",
    },
    
    target_photo: {
      title: "¿Con Quién Te Estás Comparando?",
      subtitle: "Toma o sube una foto de la persona con quien quieres compararte",
      take_photo: "Tomar Foto",
      upload_photo: "Subir Foto",
      or: "O",
      compare_celebrities: "Comparar con Celebridades",
      celebrities_subtitle: "Elige de nuestra base de datos de personas famosas",
      tips_title: "Para Mejores Resultados:",
      tip_clear: "📸 Usa una foto clara, de frente",
      tip_lighting: "💡 Asegúrate de tener buena iluminación",
      tip_expression: "😐 Elige una foto con expresión neutral",
      tip_one_person: "🧑‍🤝‍🧑 Una persona por foto funciona mejor",
      compare_now: "Comparar Ahora",
      add_photo: "Por favor agrega una foto para comparar",
      premium_comparison: "Esto usará tu comparación premium",
    },
  },
  
  components: {
    bottom_nav: {
      scan: "Escanear",
      celebrities: "Estrellas",
      results: "Resultados",
      roast: "Crítica",
      settings: "Config",
    },
    
    paywall: {
      title: "Actualizar a Premium",
      subtitle: "Desbloquea todas las funciones y comparaciones ilimitadas",
      feature1: "Comparaciones ilimitadas",
      feature2: "Acceso a base de datos de celebridades",
      feature3: "Generador de críticas IA",
      feature4: "Análisis avanzado de belleza",
      start_trial: "Iniciar Prueba Gratuita",
      restore_purchases: "Restaurar Compras",
      terms: "Términos de Servicio",
      privacy: "Política de Privacidad",
    },
  },
  
  errors: {
    no_camera_permission: "Se requiere permiso de cámara para tomar fotos",
    no_gallery_permission: "Se requiere permiso de galería para seleccionar fotos",
    image_load_failed: "Error al cargar la imagen",
    comparison_failed: "La comparación falló. Por favor intenta de nuevo.",
    network_error: "Error de red. Por favor verifica tu conexión.",
    unknown_error: "Ocurrió un error desconocido",
  },
};

export const SUPPORTED_LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

const translations: Record<Language, Translations> = {
  en: englishTranslations,
  es: spanishTranslations,
  // Add more languages here as needed
  fr: englishTranslations, // Placeholder - would need French translations
  de: englishTranslations, // Placeholder - would need German translations
  pt: englishTranslations, // Placeholder - would need Portuguese translations
  it: englishTranslations, // Placeholder - would need Italian translations
};

export default translations;

// Hook to use translations in components
export const useTranslations = (language: Language = 'en'): Translations => {
  return translations[language] || translations.en;
};