import { OrderStatus } from '@/order/order.types'

export const PAYMENT_NEED_ORDER_STATUSES = [
  OrderStatus.Paid,
  OrderStatus.Pending,
  OrderStatus.Delivered
]
