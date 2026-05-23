export enum ELogLevel {
  INFO = 'info',
  ERROR = 'error',
}

export enum EAppPage {
  INTRO = 'intro',
  SCAN_QR = 'scan-qr',
  EDIT = 'edit',
  PAYMENT = 'payment',
}

export enum EAppFeature {
  // Intro Page
  INTRO_CTA_BUTTON = 'intro-cta-button',
  INTRO_QR_CODE = 'intro-qr-code',
  // QR Scan Page
  QR_LAUNCH_CAMERA = 'qr-launch-camera',
  QR_EXTRACT_DATA = 'qr-extract-data',
  // Edit Page
  ADD_TO_CART = 'add-to-cart',
  // Payment Page
  PAYMENT_PROCEED = 'payment-proceed',
  PAYMENT_PROCESS = 'payment-process',
  PAYMENT_SUCCESS = 'payment-success',
  PAYMENT_FAILURE = 'payment-failure',
  PAYMENT_TIMEOUT = 'payment-timeout',
  PAYMENT_CANCEL = 'payment-cancel',
  // Common features
  VIRTUAL_KEYBOARD = 'virtual-keyboard',

  // User Behavior Tracking
  SELECT_PRODUCT = 'select-product',
  SELECT_VARIANT = 'select-variant',
  ADD_STICKER = 'add-sticker',
  ADD_TEXT = 'add-text',
  CHANGE_FRAME = 'change-frame',
  PICK_PRINTED_IMAGE = 'pick-printed-image',
  PREVIEW_MOCKUP = 'preview-mockup',
  VIEW_CART = 'view-cart',
  UPDATE_QUANTITY = 'update-quantity',
  REMOVE_CART_ITEM = 'remove-cart-item',
  APPLY_VOUCHER = 'apply-voucher',
  ACCEPT_TERMS = 'accept-terms',
  EDIT_MOCKUP = 'edit-mockup',
  START_PROCESS_PAYMENT = 'start-process-payment',
  START_PAYMENT_QR = 'start-payment-qr',
  COMPLETE_PAYMENT = 'complete-payment',
  CANCEL_PAYMENT = 'cancel-payment',
  BACK_TO_EDIT = 'back-to-edit',
}

export enum ELocationBoudaryType {
  PROVINCE = 0,
  DISTRICT = 1,
  WARD = 2,
}
