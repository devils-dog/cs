export interface TelegramWebApp {
  readonly id: string
  readonly version: string
  readonly platform: string
  readonly initData: string
  readonly initDataUnsafe: TelegramInitDataUnsafe
  readonly themeParams: TelegramThemeParams
  readonly viewport: TelegramViewport
  readonly isExpanded: boolean
  readonly BackButton: TelegramBackButton
  readonly MainButton: TelegramMainButton
  
  readonly onEvent: (event: TelegramEvent, handler: () => void) => void
  readonly offEvent: (event: TelegramEvent, handler: () => void) => void
  
  readonly ready: () => void
  readonly expand: () => void
  
  readonly setHeaderColor: (color: string) => void
  readonly setBgColor: (color: string) => void
  readonly setBackgroundColor: (color: string) => void
  readonly setSettings: (settings: TelegramSettings) => void
}

export interface TelegramInitDataUnsafe {
  readonly query_id?: string
  readonly user?: TelegramUser
  readonly client_data?: string
  readonly chat?: TelegramChat
  readonly chat_type?: string
  readonly start_param?: string
  readonly auth_date: number
  readonly hash: string
}

export interface TelegramUser {
  readonly id: number
  readonly username?: string
  readonly first_name: string
  readonly last_name?: string
  readonly photo_url?: string
}

export interface TelegramChat {
  readonly id: number
  readonly type: string
  readonly title?: string
  readonly photo_url?: string
}

export interface TelegramThemeParams {
  readonly bg_color?: string
  readonly section_bg_color?: string
  readonly text_color?: string
  readonly hint_color?: string
  readonly link_color?: string
  readonly button_color?: string
  readonly button_text_color?: string
}

export interface TelegramViewport {
  readonly width: number
  readonly height: number
  readonly is_state_stable: boolean
  readonly is_expanded: boolean
}

export interface TelegramBackButton {
  readonly isVisible: boolean
  readonly onClick: (handler: () => void) => void
  readonly offClick: (handler: () => void) => void
  readonly show: () => void
  readonly hide: () => void
}

export interface TelegramMainButton {
  readonly isVisible: boolean
  readonly isProgressVisible: boolean
  readonly text: string
  readonly color: string
  readonly textColor: string
  readonly onClick: (handler: () => void) => void
  readonly offClick: (handler: () => void) => void
  readonly show: () => void
  readonly hide: () => void
  readonly showProgress: () => void
  readonly hideProgress: () => void
  readonly setText: (text: string) => void
  readonly setParams: (params: TelegramMainButtonParams) => void
}

export interface TelegramMainButtonParams {
  readonly text?: string
  readonly color?: string
  readonly textColor?: string
  readonly isVisible?: boolean
  readonly isProgressVisible?: boolean
}

export type TelegramEvent = 
  | 'themeChanged' 
  | 'viewportChanged'
  | 'dataSent'
  | 'settingsChanged'
  | 'backButtonClicked'
  | 'mainButtonClicked'
  | 'invoiceClosed'
  | 'popupClosed'
  | 'webAppCall'

export type TelegramSettings = {
  readonly theme?: TelegramTheme
  readonly viewport?: TelegramViewportSettings
}

export type TelegramTheme = {
  readonly background_color?: string
  readonly header_color?: string
  readonly text_color?: string
  readonly hint_color?: string
  readonly link_color?: string
  readonly button_color?: string
  readonly button_text_color?: string
}