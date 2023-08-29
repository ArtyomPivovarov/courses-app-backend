import { OrderStatus } from '@/order/order.types'

export const TRANSACTION_NEED_PURCHASE_STATUSES = [
  OrderStatus.PAID,
  OrderStatus.PENDING,
  OrderStatus.DELIVERED
]
