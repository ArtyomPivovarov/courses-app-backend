import { Transaction } from '@/transaction/entities/transaction.entity'
import { Purchase } from '@/purchase/entities/purchase.entity'

export type UserProfile = {
  id: number
  email: string
  name: string
  transactions: Transaction[]
  purchases: Purchase[]
}
