// Type declarations for Square Web Payments SDK (loaded via <Script> tag)
// https://developer.squareup.com/reference/sdks/web/payments

interface SquareTokenResult {
  status: "OK" | "Cancel" | "Error" | "Invalid"
  token?: string
  errors?: Array<{ field?: string; message: string; type: string }>
}

interface SquareCard {
  attach(selector: string): Promise<void>
  tokenize(): Promise<SquareTokenResult>
  destroy(): Promise<void>
}

interface SquarePayments {
  card(options?: Record<string, unknown>): Promise<SquareCard>
}

interface SquareSDK {
  payments(applicationId: string, locationId: string): Promise<SquarePayments>
}

declare global {
  interface Window {
    Square?: SquareSDK
  }
}

export {}
