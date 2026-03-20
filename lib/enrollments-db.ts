import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"

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

export async function getEnrollment(id: string): Promise<EnrollmentRecord | null> {
  if (!tableName) return null
  const res = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  )
  return (res.Item as EnrollmentRecord) ?? null
}

// Looks up an enrollment by squarePaymentId using a GSI named "squarePaymentId-index"
// You must add this GSI to your DynamoDB table for this to work.
export async function getEnrollmentByPaymentId(squarePaymentId: string): Promise<EnrollmentRecord | null> {
  if (!tableName) return null
  try {
    const res = await docClient.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: "squarePaymentId-index",
        KeyConditionExpression: "squarePaymentId = :pid",
        ExpressionAttributeValues: { ":pid": squarePaymentId },
        Limit: 1,
      })
    )
    return (res.Items?.[0] as EnrollmentRecord) ?? null
  } catch {
    return null
  }
}

export async function updateEnrollment(
  id: string,
  updates: Partial<Pick<EnrollmentRecord, "squarePaymentId" | "receiptUrl" | "lmsSyncedAt">>
): Promise<EnrollmentRecord | null> {
  if (!tableName) return null
  const updateExpr: string[] = []
  const exprNames: Record<string, string> = {}
  const exprValues: Record<string, unknown> = {}

  if (updates.squarePaymentId !== undefined) {
    updateExpr.push("#sq = :sq")
    exprNames["#sq"] = "squarePaymentId"
    exprValues[":sq"] = updates.squarePaymentId
  }
  if (updates.receiptUrl !== undefined) {
    updateExpr.push("#rcpt = :rcpt")
    exprNames["#rcpt"] = "receiptUrl"
    exprValues[":rcpt"] = updates.receiptUrl
  }
  if (updates.lmsSyncedAt !== undefined) {
    updateExpr.push("#lms = :lms")
    exprNames["#lms"] = "lmsSyncedAt"
    exprValues[":lms"] = updates.lmsSyncedAt
  }

  if (updateExpr.length === 0) return getEnrollment(id)

  const res = await docClient.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: "SET " + updateExpr.join(", "),
      ExpressionAttributeNames: exprNames,
      ExpressionAttributeValues: exprValues,
      ReturnValues: "ALL_NEW",
    })
  )
  return (res.Attributes as EnrollmentRecord) ?? null
}
