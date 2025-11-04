import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Shield, Lock, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <MessageSquare className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight">
              Anonymous Feedback Drop-Box
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts freely and securely. Your feedback matters, your identity doesn't.
          </p>
        </div>

        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Public Feedback Card */}
          <Card className="shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Submit Feedback</CardTitle>
              </div>
              <CardDescription className="text-base">
                Share your thoughts anonymously. No login required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Completely anonymous
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  No personal data collected
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Submit in seconds
                </li>
              </ul>
              <Link href="/feedback" className="block">
                <Button size="lg" className="w-full text-base">
                  Submit Feedback
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Dashboard Card */}
          <Card className="shadow-xl border-2 hover:shadow-2xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-primary" />
                <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
              </div>
              <CardDescription className="text-base">
                View and analyze all feedback submissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Secured with authentication
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Admin role required
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Sentiment analysis included
                </li>
              </ul>
              <Link href="/admin/login" className="block">
                <Button size="lg" variant="outline" className="w-full text-base">
                  Admin Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="bg-muted/50 rounded-lg p-8 border">
          <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Complete Anonymity</h3>
              <p className="text-sm text-muted-foreground">
                No user identification or tracking. Your privacy is guaranteed.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secured Access</h3>
              <p className="text-sm text-muted-foreground">
                Admin dashboard protected with token-based authentication.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Smart Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Automatic sentiment analysis helps categorize feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}