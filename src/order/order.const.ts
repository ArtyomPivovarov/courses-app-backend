import { OrderStatus } from '@/order/order.types'

export const PAYMENT_NEED_ORDER_STATUSES = [
  OrderStatus.PAID,
  OrderStatus.PENDING,
  OrderStatus.DELIVERED
]
