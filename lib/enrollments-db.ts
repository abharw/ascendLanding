import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

const tableName = process.env.DYNAMODB_ENROLLMENTS_TABLE

const client = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION ?? process.env.AWS_REGION ?? "us-east-1",
  ...(process.env.DYNAMODB_ACCESS_KEY_ID &&
    process.env.DYNAMODB_SECRET_ACCESS_KEY && {
      credentials: {
        accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID,
        secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY,
      },
    }),
})

const docClient = DynamoDBDocumentClient.from(client)

export type EnrollmentRecord = {
  id: string
  name: string
  email: string
  phone: string
  studentName: string
  programId: string
  programName: string
  amountCents: number
  squarePaymentId: string
  receiptUrl?: string
  lmsSyncedAt?: string
  createdAt: string
  parentFirstName?: string
  parentLastName?: string
  signUpForNews?: boolean
  country?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  zipCode?: string
  grade?: string
  studentFirstName?: string
  studentLastName?: string
  studentEmail?: string
  studentPhone?: string
  highSchoolAttending?: string
}

export async function saveEnrollment(record: Omit<EnrollmentRecord, "id" | "createdAt">): Promise<EnrollmentRecord> {
  if (!tableName) {
    console.warn("DYNAMODB_ENROLLMENTS_TABLE not set — skipping enrollment save")
    throw new Error("DYNAMODB_ENROLLMENTS_TABLE not configured")
  }

  const item: EnrollmentRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: item,
    })
  )
  return item
}
