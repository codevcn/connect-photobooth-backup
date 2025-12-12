// const items: TCreateOrderReq['items'] = []
// for (const item of cartItems) {
//   for (const variant of item.productVariants) {
//     const mockups: TCreateOrderReq['items'][number]['surfaces'] = []
//     for (const mockup of variant.mockupDataList) {
//       const preSentImageSize = mockup.imageData.size
//       if (!mockup.preSentImageLink) {
//         throw new Error('Thiếu đường dẫn hình ảnh đã gửi trước cho dữ liệu mockup')
//       }
//       mockups.push({
//         surface_id: mockup.surfaceInfo.id,
//         editor_state_json: mockup.elementsVisualState,
//         file_url: mockup.preSentImageLink,
//         width_px: preSentImageSize.width,
//         height_px: preSentImageSize.height,
//       })
//     }
//     items.push({
//       variant_id: variant.variantId,
//       quantity: mockup.quantity,
//       surfaces: mockups,
//     })
//   }
// }
