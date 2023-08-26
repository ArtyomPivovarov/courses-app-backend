import { Transaction } from '@/transaction/entities/transaction.entity'

export type UserProfile = {
  id: number
  email: string
  name: string
  transactions: Transaction[]
}
