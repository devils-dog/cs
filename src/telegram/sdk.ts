import { TelegramWebApp } from './types'

let telegramWebApp: TelegramWebApp | null = null
let initialized = false

export const initTelegramWebApp = (): TelegramWebApp => {
  // Check if we're in a Telegram environment
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    if (!initialized) {
      telegramWebApp = window.Telegram.WebApp
      // Only call ready and expand if not already called by Telegram
      // Note: In real app, ready() and expand() are typically called by Telegram itself
      telegramWebApp.ready()
      telegramWebApp.expand()
      initialized = true
    }
    return telegramWebApp
  }

  // Development mode - create mock Telegram WebApp
  console.warn('Telegram WebApp not available - running in development mode')
  
  // For development, we want to ensure the app starts even if no real Telegram env
  if (initialized) {
    return telegramWebApp as TelegramWebApp
  }
  
  // Mock implementation for development
  const mockWebApp: TelegramWebApp = {
    id: 'mock_app_id',
    version: '1.0.0',
    platform: 'development',
    initData: '',
    initDataUnsafe: {} as any,
    themeParams: {
      bg_color: '#ffffff',
      section_bg_color: '#f0f0f0',
      text_color: '#000000',
      hint_color: '#8e8e93',
      link_color: '#007aff',
      button_color: '#007aff',
      button_text_color: '#ffffff'
    },
    viewport: {
      width: 375,
      height: 667,
      is_state_stable: true,
      is_expanded: true
    },
    isExpanded: true,
    
    // Mock methods
    onEvent: () => {},
    offEvent: () => {},
    ready: () => console.log('Telegram WebApp ready'),
    expand: () => console.log('Telegram WebApp expanded'),
    
    // Mock properties we'll use
    BackButton: {
      isVisible: false,
      onClick: () => {},
      offClick: () => {},
      show: () => console.log('Back button shown'),
      hide: () => console.log('Back button hidden')
    },
    
    MainButton: {
      isVisible: true,
      isProgressVisible: false,
      text: 'Proceed',
      color: '#007aff',
      textColor: '#ffffff',
      onClick: () => console.log('Main button clicked'),
      offClick: () => {},
      show: () => console.log('Main button shown'),
      hide: () => console.log('Main button hidden'),
      showProgress: () => console.log('Main button progress shown'),
      hideProgress: () => console.log('Main button progress hidden'),
      setText: () => console.log('Main button text set'),
      setParams: () => console.log('Main button params set')
    },
    
    setHeaderColor: () => console.log('Header color set'),
    setBgColor: () => console.log('Background color set'),
    setBackgroundColor: () => console.log('Background color set'),
    setSettings: () => console.log('Settings set')
  }

  telegramWebApp = mockWebApp
  initialized = true
  return mockWebApp
}

export const getTelegramWebApp = (): TelegramWebApp | null => {
  return telegramWebApp
}