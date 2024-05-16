import type { PaymentType } from './Payment'

export interface PaymentToken {
  token: string
  type: PaymentType
}
