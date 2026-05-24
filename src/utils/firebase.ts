import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAnalytics, Analytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics'
import { EAppPage, EAppFeature, ETrackingUserEvents } from './enums'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Firebase Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export interface EventParams {
  page_title?: string
  page_location?: string
  method?: string
  item_id?: string
  item_name?: string
  price?: number
  currency?: string
  quantity_amount?: number
  order_id?: string
  layout_id?: string
  layout_type?: string
  printed_image_id?: string
  faq_question?: string
  shipping_form_field?: string
  [key: string]: any
}

// Ensure proper typing for event names
export type AppEventName = ETrackingUserEvents

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  )
}

class UserBehaviorTracker {
  private static instance: UserBehaviorTracker
  private app: FirebaseApp | null = null
  private analytics: Analytics | null = null
  private isEnabled: boolean = import.meta.env.VITE_ENABLE_TRACKING === 'true'
  private accessId: string = ''
  private sessionId: string = ''
  private brand: string = 'fun-studio'

  private constructor() {
    const storedAccessId = localStorage.getItem('access_id')
    if (storedAccessId) {
      this.accessId = storedAccessId
    } else {
      this.accessId = generateUUID()
      localStorage.setItem('access_id', this.accessId)
    }

    const storedSessionId = sessionStorage.getItem('session_id')
    if (storedSessionId) {
      this.sessionId = storedSessionId
    } else {
      this.sessionId = generateUUID()
      sessionStorage.setItem('session_id', this.sessionId)
    }

    if (this.isEnabled) {
      try {
        if (firebaseConfig.projectId) {
          this.app = initializeApp(firebaseConfig)
          this.analytics = getAnalytics(this.app)
          this.identifyUser(this.accessId)
        } else {
          console.warn(
            '[Firebase Tracking] Missing config. Tracker is enabled but will not log to cloud.'
          )
        }
      } catch (error) {
        console.error('Lỗi khi khởi tạo Firebase Analytics:', error)
      }
    }
  }

  public static getInstance(): UserBehaviorTracker {
    if (!UserBehaviorTracker.instance) {
      UserBehaviorTracker.instance = new UserBehaviorTracker()
    }
    return UserBehaviorTracker.instance
  }

  public trackEventSafe(eventName: AppEventName, params?: EventParams): void {
    if (!this.isEnabled) return
    try {
      const enhancedParams = {
        ...params,
        access_id: this.accessId,
        session_id: this.sessionId,
        current_path: window.location.pathname,
        brand: this.brand,
      }
      if (this.analytics) {
        logEvent(this.analytics, eventName as string, enhancedParams)
      }
      if (import.meta.env.DEV) {
        console.log(`[Firebase Tracking] Event: ${eventName}`, enhancedParams)
      }
    } catch (error) {
      console.error('Lỗi Tracking, nhưng ứng dụng vẫn hoạt động bình thường:', error)
    }
  }

  public identifyUser(userId: string, traits?: Record<string, string | number>): void {
    if (!this.isEnabled) return
    try {
      if (this.analytics) {
        setUserId(this.analytics, userId)
        if (traits) {
          setUserProperties(this.analytics, traits)
        }
      }
    } catch (error) {
      console.error('Lỗi khi định danh người dùng:', error)
    }
  }
}

export const userTracker = UserBehaviorTracker.getInstance()

export const useTrackPageView = (pageName: EAppPage | string) => {
  const location = useLocation()
  useEffect(() => {
    userTracker.trackEventSafe(ETrackingUserEvents.PAGE_VIEW, { page_title: pageName })
  }, [location])
}
