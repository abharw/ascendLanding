"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react"

function EnrollSuccessContent() {
  const searchParams = useSearchParams()
  const enrollmentId = searchParams.get("enrollmentId")
  const orderId = searchParams.get("orderId")

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [data, setData] = useState<{
    programName?: string
    paymentId?: string
    receiptUrl?: string
  } | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (!enrollmentId || !orderId) {
      setStatus("error")
      setErrorMsg("Missing enrollment or order information. Please contact support if you completed a payment.")
      return
    }

    let cancelled = false

    async function completeEnrollment() {
      try {
        const res = await fetch("/api/enroll/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enrollmentId, orderId }),
        })
        const json = await res.json()

        if (cancelled) return

        if (!res.ok) {
          setStatus("error")
          setErrorMsg(json.error ?? "Failed to complete enrollment.")
          return
        }

        setData({
          paymentId: json.paymentId,
          receiptUrl: json.receiptUrl,
        })
        setStatus("success")
      } catch (err) {
        if (cancelled) return
        setStatus("error")
        setErrorMsg(err instanceof Error ? err.message : "Something went wrong.")
      }
    }

    completeEnrollment()
    return () => {
      cancelled = true
    }
  }, [enrollmentId, orderId])

  return (
    <main className="min-h-screen">
      <Header />

      <section className="pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-6">
            Enrollment
          </p>

          {status === "loading" && (
            <div className="py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Confirming your payment…</p>
            </div>
          )}

          {status === "error" && (
            <div className="py-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="h-9 w-9 text-destructive" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl tracking-tight text-foreground mb-3">
                Something went wrong
              </h2>
              <p className="text-muted-foreground mb-6">{errorMsg}</p>
              <Button asChild>
                <Link href="/enroll">Return to Enrollment</Link>
              </Button>
            </div>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-9 w-9 text-primary" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-tight text-foreground mb-3">
                You&apos;re enrolled!
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-2">
                Your payment was successful. A confirmation email is on its way.
              </p>
              <p className="text-muted-foreground text-sm mb-8">
                We&apos;ll reach out within 24 hours with next steps.
              </p>

              {data?.paymentId && (
                <div className="inline-block text-left bg-card border border-border rounded-lg px-6 py-4 mb-8 text-sm">
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                    Payment ID
                  </div>
                  <div className="font-mono text-foreground">{data.paymentId}</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {data?.receiptUrl && (
                  <Button asChild variant="outline">
                    <a href={data.receiptUrl} target="_blank" rel="noopener noreferrer">
                      View Receipt
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button asChild>
                  <Link href="/programs">Explore Other Programs</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function EnrollSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen">
        <Header />
        <section className="pt-24 pb-24 lg:pt-32 lg:pb-32">
          <div className="mx-auto max-w-2xl px-6 lg:px-8 text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading…</p>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <EnrollSuccessContent />
    </Suspense>
  )
}
