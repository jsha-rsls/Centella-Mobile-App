// Header animation constants
export const HEADER_CONFIG = {
  MAX_HEIGHT: 200,
  MIN_HEIGHT: 110,
  get SCROLL_DISTANCE() {
    return this.MAX_HEIGHT - this.MIN_HEIGHT
  }
}

// Animation timing constants
export const ANIMATION_CONFIG = {
  SCROLL_EVENT_THROTTLE: 16,
  CONTENT_FADE_START: 0.4,
  TITLE_FADE_START: 0.85,
  CONTENT_TRANSLATE_Y: -12
}

// Category constants
export const CATEGORIES = {
  ANNOUNCEMENT: 'announcement',
  UPDATES: 'updates'
}

// Layout constants
export const LAYOUT = {
  CONTENT_PADDING_TOP: 30,
  CONTENT_HORIZONTAL_PADDING: 20,
  BUTTON_TOP_POSITION: 50,
  BUTTON_SIZE: 40,
  BUTTON_BORDER_RADIUS: 20
}