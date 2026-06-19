import QRScanner from './QRScanner'
import { EInternalEvents, eventEmitter } from '@/utils/events'

// --- Cấu hình Animation & Style ---
const FloatingStyles = () => (
  <style>{`
    @keyframes float-slow {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }
    @keyframes float-medium {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(-3deg); }
    }
    @keyframes float-fast {
      0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
    }
    @keyframes scan-down {
      0% { top: -10%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 110%; opacity: 0; }
    }
    
    .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
    .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
    .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
    .animate-scan-down { animation: scan-down 3s linear infinite; }
    
    .glass-panel {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `}</style>
)

const ScanQRPage = () => {
  const handleData = (qrText: string) => {
    window.location.href = `${qrText}&is_direct=go_encycom`
  }

  return (
    // Container chính - Quay lại Gradient Hồng Đỏ tươi sáng
    <div className="relative smd:h-screen h-dvh w-screen overflow-hidden bg-white">
      <FloatingStyles />

      {/* --- BACKGROUND DECORATION & FLOATING ICONS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        {/* Nền họa tiết nhẹ */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        {/* Blobs màu tạo chiều sâu */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        {/* --- 8 ICON SẢN PHẨM TRÔI NỔI --- */}

        {/* 1. Góc Trên Trái (Áo Thun) */}
        <div className="absolute top-[8%] left-[5%] animate-float-slow opacity-80 z-10">
          <div className="glass-panel p-2.5 rounded-2xl transform -rotate-12 hover:scale-110 transition-transform duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-lg"
            >
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
            </svg>
          </div>
        </div>

        {/* 2. Góc Trên Phải (Ly Cà Phê) */}
        <div className="absolute top-[8%] right-[5%] animate-float-medium opacity-80 z-10">
          <div className="glass-panel p-2 rounded-full transform rotate-12 hover:scale-110 transition-transform duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-md"
            >
              <path d="M10 2v2" />
              <path d="M14 2v2" />
              <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
              <path d="M6 2v2" />
            </svg>
          </div>
        </div>

        {/* 3. Góc Dưới Trái (Túi Xách) */}
        <div className="absolute bottom-[8%] left-[5%] animate-float-fast opacity-80 z-10">
          <div className="glass-panel p-2.5 rounded-xl transform rotate-6 hover:scale-110 transition-transform duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-lg"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>

        {/* 4. Góc Dưới Phải (Điện thoại) */}
        <div className="absolute bottom-[8%] right-[5%] animate-float-slow opacity-80 z-10">
          <div className="glass-panel p-2 rounded-2xl transform -rotate-6 hover:scale-110 transition-transform duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-md"
            >
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
        </div>

        {/* 5. Giữa Cạnh Trái (Hộp Quà) */}
        <div className="absolute top-[50%] left-[2%] transform -translate-y-1/2 animate-float-medium opacity-70 z-0">
          <div className="glass-panel p-2 rounded-xl transform rotate-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-md"
            >
              <rect x="3" y="8" width="18" height="4" rx="1" />
              <path d="M12 8v13" />
              <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
              <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
            </svg>
          </div>
        </div>

        {/* 6. Giữa Cạnh Phải - Bên trên Hướng dẫn (Đồng Hồ) */}
        <div className="absolute top-[35%] right-[2%] animate-float-slow opacity-60 z-0">
          <div className="glass-panel p-2 rounded-full transform -rotate-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-md"
            >
              <circle cx="12" cy="12" r="6" />
              <polyline points="12 10 12 12 13 13" />
              <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" />
              <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" />
            </svg>
          </div>
        </div>

        {/* 7. Giữa Bên Trên - Dưới Header (Tranh Ảnh) */}
        <div className="absolute top-[20%] left-[45%] transform -translate-x-1/2 animate-float-fast opacity-50 z-0">
          <div className="glass-panel p-2 rounded-2xl transform rotate-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-sm"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        </div>

        {/* 8. Giữa Bên Dưới - Dưới QR (Chìa Khóa) */}
        <div className="absolute bottom-[20%] left-[45%] transform -translate-x-1/2 animate-float-slow opacity-50 z-0">
          <div className="glass-panel p-2 rounded-xl transform -rotate-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-main-cl drop-shadow-sm"
            >
              <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
              <path d="m21 2-9.6 9.6" />
              <circle cx="7.5" cy="15.5" r="5.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* --- HƯỚNG DẪN QUÉT QR (BÊN TRÁI) --- */}
      <div className="5xl:text-xl 5xl:block hidden text-base absolute left-6 top-1/2 -translate-y-1/2 w-[26vw] z-30 pointer-events-auto">
        <div className="bg-gray-100 border border-gray-400 rounded-xl p-4 pb-2">
          {/* Header */}
          <h2 className="text-[1.5rem] font-extrabold text-main-cl text-center mb-4 tracking-wide">
            HƯỚNG DẪN QUÉT QR
          </h2>

          {/* Các bước hướng dẫn */}
          <div className="flex flex-col items-start space-y-4">
            {/* Bước 1: Hướng QR vào webcam */}
            <div className="w-full">
              <p className="flex gap-2 text-black font-bold text-[1em] mb-1">
                <span className="flex items-center justify-center leading-none h-8 min-w-8 bg-main-cl rounded-full text-white">
                  1.
                </span>
                <span className="">Hướng mã QR trên ảnh photobooth vào webcam</span>
              </p>
              <div className="flex gap-2 items-center justify-center mb-3 w-full">
                <img className="w-56" src="/images/design-qr-page/front.png" alt="Photobooth" />
              </div>
            </div>

            {/* Bước 1: Hướng QR vào webcam */}
            <div className="w-full">
              <p className="flex gap-2 text-black font-bold text-[1em] mb-1">
                <span className="flex items-center justify-center leading-none h-8 min-w-8 bg-main-cl rounded-full text-white">
                  2.
                </span>
                <span>Giữ khoảng cách ảnh với camera khoảng 8cm</span>
              </p>
              <div className="flex gap-2 items-center justify-center mb-3 w-full">
                <img className="w-78" src="/images/design-qr-page/cm8.png" alt="Photobooth" />
              </div>
            </div>

            {/* Bước 3: Giữ khoảng cách 8cm */}
            <div className="w-full">
              <p className="flex gap-2 text-black font-bold text-[1em] mb-1">
                <span className="flex items-center justify-center leading-none h-8 min-w-8 bg-main-cl rounded-full text-white">
                  3.
                </span>
                <span>Đưa mã QR của bạn vào khung hình camera</span>
              </p>
              <div className="flex items-center justify-center mb-3 w-full relative">
                <div className="p-1.5 rounded-2xl w-fit bg-white">
                  <img className="w-52" src="/images/design-qr-page/chu-y-qr.png" alt="Ruler" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER (TOP CENTER) */}
      <section
        id="scan-qr-area"
        className="5xl:py-6 pt-8 pb-8 flex flex-col h-full items-center relative w-full text-center z-40 px-4 overflow-y-auto no-scrollbar"
      >
        <div className="5xl:justify-center 5xl:w-[38vw] 5xl:px-0 5xl:gap-4 gap-4 flex flex-col h-full items-center w-full max-w-lg">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-5 smd:p-8 border border-white/40 flex flex-col items-center w-full animate-fade-in-down">
            <h1
              onClick={() => {
                eventEmitter.emit(EInternalEvents.DO_TEST_PASS_SCAN_QR)
              }}
              className="smd:text-3xl block text-2xl md:text-5xl font-extrabold text-main-cl uppercase tracking-wide mb-2"
            >
              QUÉT MÃ QR
            </h1>
            <div className="5xl:text-[16px] w-full font-bold px-1 py-1 text-gray-700 text-sm mb-4">
              Đưa mã QR photobooth của bạn vào camera, căn chỉnh để quét QR thật rõ nét nhé!
            </div>
            <QRScanner onScanSuccess={handleData} />

            {/* DECORATION & TIP BELOW SCANNER */}
            <div className="mt-8 flex flex-col items-center justify-center gap-2 text-main-cl/80 animate-float-slow">
              <div className="bg-main-cl/10 p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-500">
                <span>Quét mã QR để đến với studio thiết kế của chúng mình </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500 inline-block align-text-bottom mb-1"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- BẠN SẼ NHẬN ĐƯỢC (BÊN PHẢI) --- */}
      <div className="5xl:text-xl 5xl:block hidden text-base absolute right-6 top-1/2 -translate-y-1/2 w-[26vw] z-40 pointer-events-auto">
        <div className="bg-gray-100 border border-gray-400 rounded-xl p-4 pb-2">
          {/* Header */}
          <h2 className="text-[1.5rem] font-extrabold text-main-cl text-center mb-4 tracking-wide">
            BẠN SẼ NHẬN ĐƯỢC
          </h2>

          <div className="flex flex-col items-start space-y-4">
            {/* Bước 4: Sản phẩm thiết kế */}
            <div className="flex flex-col items-center">
              <p className="flex gap-2 text-black font-bold text-[1em] mb-1">
                <span className="flex items-center justify-center leading-none h-8 min-w-8 bg-main-cl rounded-full text-white">
                  4.
                </span>
                <span className="">Sản phẩm thiết kế từ chính bức ảnh vừa chụp của bạn</span>
              </p>
              <div className="flex flex-col gap-2 items-center justify-center mb-3 w-full">
                <img
                  className="w-99"
                  src="/images/design-qr-page/demo-ra-intro-1.png"
                  alt="Photobooth"
                />
                <img
                  className="w-99"
                  src="/images/design-qr-page/demo-ra-intro-2.png"
                  alt="Photobooth"
                />
              </div>
            </div>

            {/* Bước 5: Giữ khoảng cách 8cm */}
            <div className="flex flex-col items-center">
              <p className="flex gap-2 text-black font-bold text-[1em] mb-1">
                <span className="flex items-center justify-center leading-none h-8 min-w-8 bg-main-cl rounded-full text-white">
                  5.
                </span>
                <span>Chọn 1 sản phẩm thiết kế bạn yêu thích và đặt hàng ngay</span>
              </p>
              <div className="w-full p-1.5 flex items-center justify-center mb-3 pt-12 relative">
                <img
                  className="STYLE-add-to-cart-intro--mockup absolute z-10 w-12 top-0 left-1/2 -translate-x-1/2"
                  src="/images/design-qr-page/tui-tote.png"
                  alt="Photobooth"
                />
                <img
                  className="STYLE-add-to-cart-intro--mockup STYLE--delay-1 absolute z-10 w-14 top-0 left-1/2 -translate-x-1/2"
                  src="/images/design-qr-page/ao-thun.png"
                  alt="Photobooth"
                />
                <img
                  className="STYLE-add-to-cart-intro--mockup STYLE--delay-2 absolute z-10 w-12 top-0 left-1/2 -translate-x-1/2"
                  src="/images/design-qr-page/khung-tranh.png"
                  alt="Photobooth"
                />
                <img
                  className="STYLE-add-to-cart-intro--mockup STYLE--delay-3 absolute z-10 w-14 top-0 left-1/2 -translate-x-1/2"
                  src="/images/design-qr-page/coc.png"
                  alt="Photobooth"
                />
                <div className="STYLE-add-to-cart-intro--cart p-2 relative z-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-26 h-26 text-main-cl"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScanQRPage
