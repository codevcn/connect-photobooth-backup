import { TVoucher } from '@/utils/types/global'

type AvailableVouchersProps = {
  onVoucherSelect: (voucherCode: string) => void
  disabled?: boolean
}

// Mock data - có thể thay bằng API call thực tế
const AVAILABLE_VOUCHERS: TVoucher[] = [
  // {
  //   code: 'ENCYCOM-HELLO',
  //   description: 'Giảm 10% cho đơn hàng của bạn',
  //   discountType: 'percentage',
  //   discountValue: 10,
  //   minOrderValue: 0,
  // },
]

export const AvailableVouchers = ({ onVoucherSelect, disabled }: AvailableVouchersProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const getVoucherDescription = (voucher: TVoucher) => {
    const parts = [voucher.description]

    if (voucher.minOrderValue || voucher.minOrderValue === 0) {
      parts.push(`Đơn tối thiểu ${formatCurrency(voucher.minOrderValue)}`)
    }

    if (voucher.maxDiscount && voucher.discountType === 'percentage') {
      parts.push(`Giảm tối đa ${formatCurrency(voucher.maxDiscount)}`)
    }

    return parts
  }

  return (
    <div className="4xl:text-xl text-base space-y-1">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-ticket-icon lucide-ticket text-main-cl w-4 h-4 4xl:w-5 4xl:h-5"
        >
          <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
          <path d="M13 5v2" />
          <path d="M13 17v2" />
          <path d="M13 11v2" />
        </svg>
        <h3 className="text-[0.85em] font-semibold text-gray-700">Mã giảm giá có sẵn</h3>
      </div>

      <div className="grid gap-2 max-h-[200px] overflow-y-auto no-scrollbar border border-gray-200 rounded-xl p-1">
        {AVAILABLE_VOUCHERS.map((voucher) => (
          <button
            key={voucher.code}
            onClick={() => onVoucherSelect(voucher.code)}
            disabled={disabled}
            className="text-left p-3 border border-main-cl rounded-xl hover:border-main-cl hover:bg-main-cl/5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent group"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-main-cl text-[0.8em]">{voucher.code}</span>
                {voucher.discountType === 'percentage' && (
                  <span className="text-[0.75em] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                    <span>-</span>
                    <span>{voucher.discountValue}</span>
                    <span>%</span>
                  </span>
                )}
                {voucher.discountType === 'fixed' && (
                  <span className="text-[0.75em] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                    Freeship
                  </span>
                )}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right text-gray-400 group-hover:text-main-cl transition-colors 5xl:w-5 5xl:h-5 shrink-0"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>

            <div className="space-y-0.5">
              {getVoucherDescription(voucher).map((desc, index) => (
                <p
                  key={index}
                  className={`text-[0.75em] ${
                    index === 0 ? 'text-gray-700 font-medium' : 'text-gray-500'
                  }`}
                >
                  {desc}
                </p>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
