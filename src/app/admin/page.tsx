"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  Shield, 
  LogOut, 
  RefreshCw, 
  AlertCircle,
  MessageSquare,
  Calendar,
  SmilePlus,
  Frown,
  Minus,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Feedback {
  id: number
  feedbackText: string
  createdAt: string
}

type Sentiment = "positive" | "negative" | "neutral"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminToken, setAdminToken] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [total, setTotal] = useState(0)
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    if (storedToken) {
      setAdminToken(storedToken)
      setIsAuthenticated(true)
      loadFeedback(storedToken)
    } else {
      router.push("/admin/login")
    }
    setIsCheckingAuth(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setAdminToken("")
    setIsAuthenticated(false)
    setFeedbackList([])
    setTotal(0)
    router.push("/admin/login")
  }

  const loadFeedback = async (token: string) => {
    setIsLoading(true)
    setLoadError("")

    try {
      const response = await fetch("/api/feedback/list?limit=100&sort=desc", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          handleLogout()
          throw new Error("Session expired. Please login again.")
        }
        throw new Error("Failed to load feedback")
      }

      const data = await response.json()
      setFeedbackList(data.data || [])
      setTotal(data.total || 0)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Failed to load feedback")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this feedback? This action cannot be undone.")) {
      return
    }

    setDeletingIds(prev => new Set(prev).add(id))

    try {
      const response = await fetch("/api/feedback/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          handleLogout()
          throw new Error("Session expired. Please login again.")
        }
        throw new Error("Failed to delete feedback")
      }

      // Remove from list and update total
      setFeedbackList(prev => prev.filter(f => f.id !== id))
      setTotal(prev => prev - 1)
      toast.success("Feedback deleted successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete feedback")
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const analyzeSentiment = (text: string): Sentiment => {
    const lowerText = text.toLowerCase()
    
    // Positive keywords
    const positiveKeywords = [
      "great", "excellent", "amazing", "wonderful", "fantastic", "love", "good",
      "awesome", "brilliant", "perfect", "outstanding", "superb", "thank",
      "appreciate", "helpful", "best", "impressed", "happy", "pleased"
    ]
    
    // Negative keywords
    const negativeKeywords = [
      "bad", "terrible", "awful", "horrible", "worst", "hate", "poor",
      "disappointing", "disappointed", "frustrated", "angry", "useless",
      "broken", "problem", "issue", "bug", "error", "slow", "difficult"
    ]

    let positiveCount = 0
    let negativeCount = 0

    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) positiveCount++
    })

    negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) negativeCount++
    })

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  const getSentimentBadge = (sentiment: Sentiment) => {
    switch (sentiment) {
      case "positive":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950">
            <SmilePlus className="h-3 w-3 mr-1" />
            Positive
          </Badge>
        )
      case "negative":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-950">
            <Frown className="h-3 w-3 mr-1" />
            Negative
          </Badge>
        )
      case "neutral":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            <Minus className="h-3 w-3 mr-1" />
            Neutral
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Managing {total} feedback submission{total !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => loadFeedback(adminToken)}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {loadError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && feedbackList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading feedback...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && feedbackList.length === 0 && (
          <Card className="text-center py-20">
            <CardContent>
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Feedback Yet</h3>
              <p className="text-muted-foreground mb-4">
                There are no feedback submissions to display.
              </p>
              <Link href="/feedback">
                <Button variant="outline">Go to Feedback Page</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Feedback List */}
        {feedbackList.length > 0 && (
          <div className="space-y-4">
            {feedbackList.map((feedback) => {
              const sentiment = analyzeSentiment(feedback.feedbackText)
              const isDeleting = deletingIds.has(feedback.id)
              return (
                <Card key={feedback.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <CardTitle className="text-base font-semibold">
                            Feedback #{feedback.id}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 text-xs mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(feedback.createdAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSentimentBadge(sentiment)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(feedback.id)}
                          disabled={isDeleting}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {feedback.feedbackText}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}