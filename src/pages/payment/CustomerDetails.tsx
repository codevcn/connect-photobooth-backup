type TCustomerDetailsProps = {
  shippingInfo: {
    name: string
    phone: string
    email?: string
    province: string
    city: string
    ward?: string
    address: string
    message?: string
  }
}

export const CustomerDetails = ({ shippingInfo }: TCustomerDetailsProps) => {
  const { name, phone, email, province, city, ward, address, message } = shippingInfo

  return (
    <div className="STYLE-styled-scrollbar 5xl:text-2xl text-sm bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-blue-600"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <h4 className="text-[0.9em] font-bold text-gray-800">Thông tin người nhận</h4>
      </div>

      <div className="space-y-1.5 max-w-[300px]">
        <div className="flex items-start gap-2">
          <span className="text-[0.9em] text-gray-600 min-w-20 font-medium">Họ và tên:</span>
          <span className="text-[0.9em] text-gray-900 font-semibold">{name}</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-[0.9em] text-gray-600 min-w-20 font-medium">Điện thoại:</span>
          <span className="text-[0.9em] text-gray-900 font-semibold">{phone}</span>
        </div>

        {email && (
          <div className="flex items-start gap-2">
            <span className="text-[0.9em] text-gray-600 min-w-20 font-medium">Email:</span>
            <span className="text-[0.9em] text-gray-900">{email}</span>
          </div>
        )}

        <div className="border-t border-blue-200 pt-1.5 mt-1.5">
          <div className="flex items-start gap-2">
            <span className="text-[0.9em] text-gray-600 min-w-20 font-medium">Địa chỉ:</span>
            <div className="text-[0.9em] text-gray-900 flex-1">
              <p>{address}</p>
              {ward && <p className="mt-0.5">{ward}</p>}
              <p className="mt-0.5">
                {city}, {province}
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="border-t border-blue-200 pt-1.5 mt-1.5">
            <div className="flex items-start gap-2">
              <span className="text-[0.9em] text-gray-600 min-w-20 font-medium">Ghi chú:</span>
              <span className="text-[0.9em] text-gray-700 italic">{message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
