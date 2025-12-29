import { useState } from 'react'

type TTermConditionsProps = {
  closeModal: () => void
}

type TTabType = 'terms' | 'privacy'

export const TermConditions = ({ closeModal }: TTermConditionsProps) => {
  const [activeTab, setActiveTab] = useState<TTabType>('terms')

  return (
    <div
      id="termsModal"
      className="fixed inset-0 z-999 animate-pop-in"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity"
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div className="flex justify-center items-center min-h-screen p-4 text-center sm:p-0">
        <div className="relative bg-white rounded-xl shadow-2xl text-left overflow-hidden transform transition-all w-full max-w-4xl flex flex-col max-h-[95dvh]">
          {/* HEADER */}
          <div className="bg-white px-4 py-2 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-gray-900" id="modal-title">
                ĐIỀU KHOẢN DỊCH VỤ & CHÍNH SÁCH BẢO HÀNH
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Dành cho Dịch vụ Photobooth & Print-on-Demand
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-gray-600 hover:text-red-500 transition focus:outline-none p-2 rounded-full hover:bg-red-50 group"
            >
              <svg
                className="h-6 w-6 smd:h-8 smd:w-8 5xl:h-10 5xl:w-10 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* TABS */}
          <div className="bg-white px-4 border-b border-gray-200">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('terms')}
                className={`px-4 py-3 font-semibold text-sm transition-all ${
                  activeTab === 'terms'
                    ? 'text-main-cl border-b-2 border-main-cl'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Điều khoản dịch vụ
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-4 py-3 font-semibold text-sm transition-all ${
                  activeTab === 'privacy'
                    ? 'text-main-cl border-b-2 border-main-cl'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Chính sách bảo mật
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="px-4 py-4 overflow-y-auto custom-scrollbar grow bg-gray-50 text-gray-700 leading-relaxed">
            {activeTab === 'terms' ? <TermsOfServiceContent /> : <PrivacyPolicyContent />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PHẦN 1: ĐIỀU KHOẢN DỊCH VỤ (TERMS OF SERVICE)
// ============================================
const TermsOfServiceContent = () => {
  return (
    <>
      {/* Thông tin công ty */}
      <section className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        {/* <h4 className="text-lg font-bold text-main-cl mb-4">THÔNG TIN BÊN BÁN</h4> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="col-span-1 md:col-span-2">
            <span className="font-semibold text-gray-900">Đơn vị vận hành:</span> CÔNG TY TNHH
            ENCYCOM
          </div>
          <div className="col-span-1 md:col-span-2">
            <span className="font-semibold text-gray-900">Lĩnh vực hoạt động:</span> Dịch vụ in ấn
            theo yêu cầu (POD - Print on Demand) và giải pháp Photobooth.
          </div>
          <div>
            <span className="font-semibold text-gray-900">Mã số thuế:</span> 0316725482
          </div>
          <div className="col-span-1 md:col-span-2">
            <span className="font-semibold text-gray-900">Địa chỉ trụ sở:</span> 436/38 Cách Mạng
            Tháng Tám, Phường Nhiêu Lộc, Thành phố Hồ Chí Minh, Việt Nam
          </div>
        </div>
      </section>

      {/* Thông báo cam kết */}
      <section className="mb-6 bg-superlight-main-cl p-3 rounded-lg border-l-4 border-main-cl shadow-sm">
        <p className="text-base text-amber-800 font-bold">
          Bằng việc sử dụng dịch vụ trên Ứng dụng Encycom, tổ chức, cá nhân sử dụng chấp nhận và cam
          kết thực hiện các điều khoản và điều kiện sử dụng sau đây:
        </p>
      </section>

      {/* 1. Đặc thù sản phẩm */}
      <section className="mb-6 p-5 rounded-lg shadow-sm">
        <h4 className="text-lg font-bold mb-3">1. ĐẶC THÙ SẢN PHẨM</h4>
        <ul className="space-y-3 text-sm text-gray-800">
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-main-cl mr-2 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>
              Đây là sản phẩm <span className="font-bold">"Made-to-order"</span> (Sản xuất theo đơn
              đặt hàng) và được cá nhân hóa với hình ảnh riêng của Quý khách.
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
            <span>
              Do đó, đơn hàng <span className="font-bold text-red-600">KHÔNG THỂ HỦY</span> hoặc{' '}
              <span className="font-bold text-red-600">THAY ĐỔI</span> (mẫu mã, size, hình ảnh) sau
              khi hệ thống đã xác nhận thanh toán và gửi lệnh xuống xưởng sản xuất (thường là sau{' '}
              <span className="font-bold">15 phút</span>).
            </span>
          </li>
          <li className="flex items-start">
            <svg
              className="w-5 h-5 text-main-cl mr-2 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <span>
              Chúng tôi <span className="font-bold">không chấp nhận</span> yêu cầu trả hàng/hoàn
              tiền với lý do chủ quan từ khách hàng (đổi ý, không thích nữa, chọn nhầm size...).
            </span>
          </li>
        </ul>
      </section>

      {/* 2. Miễn trừ về màu sắc */}
      <section className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-3">
          2. MIỄN TRỪ TRÁCH NHIỆM VỀ MÀU SẮC & CHẤT LƯỢNG ẢNH
        </h4>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
            <span>
              <span className="font-bold">Sai số màu sắc:</span> Màu sắc in ấn thực tế trên vải/gốm
              sứ <span className="font-bold">có thể chênh lệch khoảng 10-15%</span> so với hình ảnh
              hiển thị trên màn hình điện thoại/máy tính (do độ sáng màn hình và công nghệ in khác
              nhau). Đây là sai số kỹ thuật cho phép trong ngành in ấn.
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
            <span>
              <span className="font-bold">Cam kết về độ trung thực:</span> Sản phẩm in ấn sẽ phản
              ánh trung thực chất lượng hình ảnh mà Quý khách đã xem và duyệt (confirm) trên màn
              hình máy chụp. Chúng tôi thực hiện in chính xác theo file hình ảnh được hệ thống ghi
              nhận. Các hiện tượng như: ảnh gốc bị rung, nhòe, thiếu sáng, hoặc biểu cảm chưa ưng
              ý... thuộc về nội dung bức ảnh gốc, không được coi là lỗi kỹ thuật in ấn.
            </span>
          </li>
        </ul>
      </section>

      {/* 3. Chính sách giao hàng */}
      <section className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-3">3. CHÍNH SÁCH GIAO HÀNG</h4>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
            <span>
              <span className="font-bold">Thời gian giao hàng:</span> Thời gian giao hàng là dự kiến
              (ETA). Trong các trường hợp bất khả kháng (thiên tai, dịch bệnh, vận chuyển quá tải
              dịp Lễ/Tết), thời gian có thể chậm hơn <span className="font-bold">1-3 ngày</span>.
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
            <span>
              Chúng tôi cam kết hỗ trợ tối đa nhưng{' '}
              <span className="font-bold">không chịu trách nhiệm bồi thường</span> cho các thiệt hại
              gián tiếp do giao hàng chậm trễ.
            </span>
          </li>
        </ul>
      </section>

      {/* 4. Trách nhiệm trước pháp luật */}
      <section className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-3">4. TRÁCH NHIỆM TRƯỚC PHÁP LUẬT</h4>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Tổ chức, cá nhân sử dụng dịch vụ, tiện ích trên Ứng dụng Encycom tự chịu trách nhiệm
            trước pháp luật:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>
                Về tất cả các nội dung do mình tạo, gửi khi sử dụng các dịch vụ, tiện ích trên Ứng
                dụng Encycom và phải chịu trách nhiệm về mọi hoạt động, nội dung được thực hiện
                trong giao dịch của mình.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>
                Về việc giữ bí mật thông tin hình ảnh của mình, trường hợp phát hiện có người sử
                dụng trái phép hình ảnh của mình, phải thông báo kịp thời cho Chúng tôi.
              </span>
            </li>
          </ul>

          <p className="font-semibold pt-2">
            Tổ chức, cá nhân sử dụng dịch vụ, tiện ích trên Ứng dụng Encycom không được thực hiện
            những hành vi sau:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>
                Cản trở hoặc ngăn chặn trái phép quá trình truyền, gửi, nhận thông điệp dữ liệu.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>
                Thay đổi, giả mạo, sao chép trái phép một phần hoặc toàn bộ thông điệp dữ liệu.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>Tạo ra thông điệp dữ liệu nhằm thực hiện các hành vi trái pháp luật.</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>
                Tạo ra hoặc phát tán chương trình tin mã độc gây hại, xâm nhập trái phép, can thiệp
                vào các chức năng hoạt động của Ứng dụng hoặc có hành vi khác nhằm phá hoại hạ tầng
                công nghệ phục vụ cung cấp các dịch vụ, tiện ích trên Ứng dụng.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>
                Gian lận, chiếm đoạt hoặc sử dụng trái pháp thông tin cá nhân của người khác.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
              <span>Các hành vi khác theo quy định của pháp luật.</span>
            </li>
          </ul>

          <p className="pt-2">
            Trong trường hợp sửa đổi nội dung, các điều khoản và điều kiện sử dụng Ứng dụng, các nội
            dung sửa đổi sẽ được thông báo trên Ứng dụng. Người sử dụng tiếp tục sử dụng và thực
            hiện các yêu cầu dịch vụ, tiện ích trên Ứng dụng có nghĩa là đã chấp nhận các sửa đổi
            đó.
          </p>
        </div>
      </section>

      {/* Thông tin liên hệ */}
      <section className="mb-6 bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-200">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Nếu Người dùng có thắc mắc về Chính sách này, hãy liên hệ với chúng tôi theo thông tin
          sau:
        </p>
        <p className="text-sm text-gray-700 mb-2">
          📍 436/38 Cách Mạng Tháng Tám, Phường Nhiêu Lộc, Thành phố Hồ Chí Minh, Việt Nam
        </p>
        <p className="text-sm text-gray-700">📞 Hotline: 0901366095</p>
      </section>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-600 border-t pt-4">
        Cập nhật lần cuối: Tháng 12/2025 | Bản quyền © ENCYCOM
      </div>
    </>
  )
}

// ============================================
// PHẦN 2: CHÍNH SÁCH BẢO MẬT
// ============================================
const PrivacyPolicyContent = () => {
  return (
    <>
      {/* Giới thiệu */}
      <section className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-700 mb-4">
          Chính sách bảo mật được xây dựng nhằm cho Người dùng biết được Ứng dụng có thể thu thập,
          sử dụng, chia sẻ và xử lý thông tin cá nhân mà Người dùng đã cung cấp cho chúng tôi như
          thế nào. Chính sách này được xây dựng dựa trên quy định pháp luật Việt Nam liên quan đến
          bảo mật Dữ liệu cá nhân.
        </p>
        <p className="text-sm text-gray-700 mb-4">
          Bằng việc trao cho chúng tôi thông tin cá nhân, sử dụng các dịch vụ trên Ứng dụng nghĩa là
          Người dùng đồng ý thông tin cá nhân của Người dùng sẽ được thu thập, sử dụng như được nêu
          trong Chính sách này. Trường hợp Người dùng không đồng ý với Chính sách này, Người dùng
          không được sử dụng Ứng dụng.
        </p>
        <p className="text-sm text-gray-700 font-semibold">
          Chúng tôi có quyền được sửa đổi, bổ sung bất kỳ và toàn bộ nội dung của Chính sách này tại
          bất kỳ thời điểm nào mà không cần báo trước hay cần có sự đồng ý trước của Người dùng.
        </p>
      </section>

      {/* Quyền riêng tư */}
      <section className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-3">QUYỀN RIÊNG TƯ</h4>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
            <span>
              Bằng việc tải ảnh lên và đặt hàng, Quý khách xác nhận mình có quyền sử dụng hình ảnh
              đó.
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
            <span>
              Chúng tôi cam kết chỉ sử dụng hình ảnh để in ấn đơn hàng và sẽ xóa file gốc sau 30
              ngày.
            </span>
          </li>
          <li className="flex items-start">
            <span className="font-bold text-main-cl mr-2 shrink-0">•</span>
            <span>
              Dữ liệu cá nhân sẽ không được chia sẻ, bán hoặc trao đổi cho bên thứ ba mà không có sự
              đồng ý của người dùng, trừ trường hợp tuân thủ pháp luật.
            </span>
          </li>
        </ul>
      </section>

      {/* Thông tin liên hệ */}
      <section className="mb-6 bg-blue-50 p-5 rounded-lg shadow-sm border border-blue-200">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Nếu Người dùng có thắc mắc về Chính sách này, hãy liên hệ với chúng tôi theo thông tin
          sau:
        </p>
        <p className="text-sm text-gray-700 mb-2">
          📍 436/38 Cách Mạng Tháng Tám, Phường Nhiêu Lộc, Thành phố Hồ Chí Minh, Việt Nam
        </p>
        <p className="text-sm text-gray-700">📞 Hotline: 0901366095</p>
      </section>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-600 border-t pt-4">
        Cập nhật lần cuối: Tháng 12/2025 | Bản quyền © ENCYCOM
      </div>
    </>
  )
}
