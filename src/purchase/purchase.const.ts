import { PurchaseStatus } from '@/purchase/purchase.types'

export const TRANSACTION_NEED_PURCHASE_STATUSES = [
  PurchaseStatus.PAID,
  PurchaseStatus.PENDING,
  PurchaseStatus.DELIVERED
]
