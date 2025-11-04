"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function FeedbackPage() {
  const [feedbackText, setFeedbackText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!feedbackText.trim()) {
      setErrorMessage("Please enter your feedback before submitting")
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedbackText: feedbackText.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit feedback")
      }

      setSubmitStatus("success")
      setFeedbackText("")
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus("idle")
      }, 5000)
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit feedback")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Anonymous Feedback</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Share your thoughts freely. Your identity remains completely private.
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Submit Your Feedback</CardTitle>
            <CardDescription className="text-base">
              Your feedback is completely anonymous. We don't collect any identifying information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Textarea */}
              <div className="space-y-2">
                <label htmlFor="feedback" className="text-sm font-medium">
                  Your Feedback
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts, suggestions, or concerns here..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[200px] resize-none text-base"
                  maxLength={5000}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {feedbackText.length} / 5000 characters
                </p>
              </div>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    Thank you! Your feedback has been submitted successfully.
                  </AlertDescription>
                </Alert>
              )}

              {submitStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-base"
                disabled={isSubmitting || !feedbackText.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Your Privacy is Protected
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1 ml-7">
            <li>• No login or account required</li>
            <li>• No IP addresses or personal data collected</li>
            <li>• Completely anonymous submission</li>
            <li>• Your feedback helps us improve</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
