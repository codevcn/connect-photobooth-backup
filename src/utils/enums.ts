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
}

// User Behavior Tracking
export enum ETrackingUserEvents {
  SELECT_PRODUCT = 'select_product',
  SELECT_VARIANT = 'select_variant',
  ADD_STICKER = 'add_sticker',
  ADD_TEXT = 'add_text',
  CHANGE_FRAME = 'change_frame',
  PICK_PRINTED_IMAGE = 'pick_printed_image',
  PREVIEW_MOCKUP = 'preview_mockup',
  VIEW_CART = 'view_cart',
  UPDATE_QUANTITY = 'update_quantity',
  REMOVE_CART_ITEM = 'remove_cart_item',
  APPLY_VOUCHER = 'apply_voucher',
  ACCEPT_TERMS = 'accept_terms',
  EDIT_MOCKUP = 'edit_mockup',
  START_PROCESS_PAYMENT = 'start_process_payment',
  START_PAYMENT_QR = 'start_payment_qr',
  COMPLETE_PAYMENT = 'complete_payment',
  CANCEL_PAYMENT = 'cancel_payment',
  BACK_TO_EDIT = 'back_to_edit',
  PICK_LAYOUT = 'pick_layout',
  PICK_NO_LAYOUT = 'pick_no_layout',
  VIEW_PRODUCT_DESCRIPTION_TAB = 'view_product_description_tab',
  VIEW_RETURN_POLICY_TAB = 'view_return_policy_tab',
  VIEW_FAQ_TAB = 'view_faq_tab',
  EXPAND_FAQ_QUESTION = 'expand_faq_question',
  SHIPPING_FORM_CHANGE = 'shipping_form_change',
  PAGE_VIEW = 'page_view',
  PAYMENT_PROCEED = 'payment_proceed',
  ADD_TO_CART = 'add_to_cart',
}

export enum ELocationBoudaryType {
  PROVINCE = 0,
  DISTRICT = 1,
  WARD = 2,
}
