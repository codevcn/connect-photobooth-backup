export default function MaintainPage() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-superlight-main-cl via-white to-light-main-cl flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8 animate-bounce-slow">
          <div className="relative">
            <div className="absolute inset-0 bg-main-cl opacity-20 blur-3xl rounded-full"></div>
            <svg
              className="w-24 h-24 text-main-cl relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 animate-fade-in">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Đang bảo trì</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-1 bg-main-cl rounded-full animate-pulse"></div>
              <div className="h-1 w-1 bg-secondary-cl rounded-full animate-pulse animation-delay-200"></div>
              <div className="h-1 w-1 bg-main-cl rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
              <span className="font-semibold text-main-cl">Encycom</span> xin phép tạm dừng Demo để
              update server chuẩn bị cho việc tích hợp.
            </p>
            <p className="text-lg md:text-xl text-slate-700 leading-relaxed mt-4">
              Vui lòng quay lại vào thời gian tới.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary-cl" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-slate-600 font-medium">Đang nâng cấp hệ thống</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in-up">
          <p className="text-slate-500 text-sm">Cảm ơn bạn đã kiên nhẫn chờ đợi 🙏</p>
        </div>
      </div>
    </div>
  )
}
