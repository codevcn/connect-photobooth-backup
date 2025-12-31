import { CTAButtonStar } from '@/components/custom/CTAButtonStar'
import { useState } from 'react'

export const TutorialForMobile = () => {
  const [showGuideModal, setShowGuideModal] = useState(false)

  return (
    <>
      {/* MOBILE GUIDE BUTTON */}
      <button
        onClick={() => setShowGuideModal(true)}
        id="vcn-vcn-qr"
        className="5xl:hidden w-[90%] absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-main-cl border-b-6 border-main-cl outline outline-main-cl font-bold px-6 py-3 rounded-full shadow-lg active:scale-95 transition-transform flex justify-center items-center gap-2"
      >
        <CTAButtonStar
          index={1}
          top="-12px"
          left="-12px"
          classNames={{ container: 'w-10 h-10 5xl:w-14 5xl:h-14' }}
        />
        <CTAButtonStar
          index={2}
          top="-12px"
          right="-12px"
          classNames={{ container: 'w-10 h-10 5xl:w-14 5xl:h-14' }}
        />
        <CTAButtonStar
          index={3}
          bottom="-26px"
          left="30px"
          classNames={{ container: 'w-10 h-10 5xl:w-14 5xl:h-14' }}
        />
        <CTAButtonStar
          index={4}
          bottom="-26px"
          right="12px"
          classNames={{ container: 'w-10 h-10 5xl:w-14 5xl:h-14' }}
        />
        <CTAButtonStar
          index={5}
          top="-26px"
          right="32px"
          classNames={{ container: 'w-10 h-10 5xl:w-14 5xl:h-14' }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        Hướng dẫn quét QR siêu dễ
      </button>

      {/* MOBILE GUIDE MODAL */}
      {showGuideModal && (
        <div
          className="5xl:hidden fixed inset-0 bg-black/50 z-100 flex items-center justify-center p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-extrabold text-main-cl">HƯỚNG DẪN QUÉT QR</h2>
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:scale-95 transition-transform"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Bước 1 */}
              <div className="w-full">
                <p className="flex gap-2 text-black font-bold text-base mb-2">
                  <span className="flex items-center justify-center leading-none h-7 min-w-7 bg-main-cl rounded-full text-white text-sm">
                    1
                  </span>
                  <span>Hướng mã QR trên ảnh photobooth vào webcam</span>
                </p>
                <div className="flex justify-center">
                  <img className="w-48" src="/images/design-qr-page/front.png" alt="Photobooth" />
                </div>
              </div>

              {/* Bước 2 */}
              <div className="w-full">
                <p className="flex gap-2 text-black font-bold text-base mb-2">
                  <span className="flex items-center justify-center leading-none h-7 min-w-7 bg-main-cl rounded-full text-white text-sm">
                    2
                  </span>
                  <span>Giữ khoảng cách ảnh với camera khoảng 8cm</span>
                </p>
                <div className="flex justify-center">
                  <img className="w-64" src="/images/design-qr-page/cm8.png" alt="Distance" />
                </div>
              </div>

              {/* Bước 3 */}
              <div className="w-full">
                <p className="flex gap-2 text-black font-bold text-base mb-2">
                  <span className="flex items-center justify-center leading-none h-7 min-w-7 bg-main-cl rounded-full text-white text-sm">
                    3
                  </span>
                  <span>Đưa mã QR của bạn vào khung hình camera</span>
                </p>
                <div className="flex justify-center">
                  <div className="p-2 rounded-xl w-fit bg-white border border-gray-200">
                    <img
                      className="w-44"
                      src="/images/design-qr-page/chu-y-qr.png"
                      alt="QR Frame"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Bạn sẽ nhận được */}
              <div className="w-full">
                <h3 className="text-lg font-extrabold text-main-cl mb-3 text-center">
                  BẠN SẼ NHẬN ĐƯỢC
                </h3>

                {/* Bước 4 */}
                <div className="mb-4">
                  <p className="flex gap-2 text-black font-bold text-base mb-2">
                    <span className="flex items-center justify-center leading-none h-7 min-w-7 bg-main-cl rounded-full text-white text-sm">
                      4
                    </span>
                    <span>Sản phẩm thiết kế từ chính bức ảnh vừa chụp của bạn</span>
                  </p>
                  <div className="flex flex-col gap-2 items-center">
                    <img
                      className="w-full max-w-xs"
                      src="/images/design-qr-page/demo-ra-intro-1.png"
                      alt="Product Demo 1"
                    />
                    <img
                      className="w-full max-w-xs"
                      src="/images/design-qr-page/demo-ra-intro-2.png"
                      alt="Product Demo 2"
                    />
                  </div>
                </div>

                {/* Bước 5 */}
                <div>
                  <p className="flex gap-2 text-black font-bold text-base mb-2">
                    <span className="flex items-center justify-center leading-none h-7 min-w-7 bg-main-cl rounded-full text-white text-sm">
                      5
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

            {/* Footer Button */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-xl z-99">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full bg-main-cl text-white font-bold py-3 rounded-lg active:scale-95 transition-transform"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
