export const usePaymentApi = () => {
  const { GET, POST } = useApi()
  return {
    getPaymentSession: (data) => POST('/api/payment/checkout', data),
    getOrders: () => GET('/api/payment/order')
  }
}
