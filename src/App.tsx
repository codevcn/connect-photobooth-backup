window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
    let startTime = Date.now()
    return setTimeout(function () {
      handler({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - startTime))
        },
      })
    }, 1)
  }

window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id)
  }

import { Routes, Route, BrowserRouter } from 'react-router-dom'
import EditPageFUN from '@/pages/edit/Layout-Fun'
import NotFound from '@/pages/NotFound'
import { LocalStorageHelper } from './utils/localstorage'
import { ToastContainer } from 'react-toastify'
import { AppRootProvider } from './providers/RootProvider'
import { useEffect } from 'react'
import { checkIfMobileScreen, isHomePage } from './utils/helpers'
import PaymentPage from './pages/payment/Page'
import { usePrintedImageStore } from './stores/printed-image/printed-image.store'
import MaintainPage from './pages/maintain/Page'
import { AppTempContainer } from './components/custom/TempContainer'
import { useQueryFilter } from './hooks/extensions'
import { UserIdleTracker } from './components/custom/IdleWarningModal'
import Dev from './dev/pages/Dev'

const IdleCountdown = () => {
  const getIdleTimeout = (): number => {
    // nếu là trang /qr thì modal timeout là 20s, còn lại là 10s
    if (window.location.pathname.includes('/qr')) {
      return 20
    }
    return 10
  }

  return <UserIdleTracker idleTimeout={30} modalTimeout={getIdleTimeout()} />
  // return <></>
}

// Component để quản lý routes dựa trên query string
function AppRoutes() {
  const queryFilter = useQueryFilter()
  const { clearAllPrintedImages } = usePrintedImageStore()

  const handleReturnHome = () => {
    if (isHomePage()) {
      LocalStorageHelper.clearAllMockupData()
    }
  }

  useEffect(() => {
    handleReturnHome()
  }, [location.pathname])

  useEffect(() => {
    LocalStorageHelper.clearAllMockupData()
    return () => {
      clearAllPrintedImages()
    }
  }, [])

  // Routes cho Fun Studio
  if (queryFilter.funId) {
    return (
      <Routes>
        <Route path="/" element={<EditPageFUN />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  // Không có query string hợp lệ
  return <NotFound />
}

function App() {
  return (
    <AppRootProvider>
      <AppTempContainer />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored" // "light" | "dark" | "colored"
        toastStyle={{ color: '#fff', fontWeight: 'bold' }}
      />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppRootProvider>
  )
}

function AppWrapper() {
  return <App />
}

export default AppWrapper
