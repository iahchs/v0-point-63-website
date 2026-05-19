"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  LogOut, 
  Plus, 
  Star,
  MessageSquareQuote,
  Loader2,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { ReviewForm } from "./review-form"
import { ReviewCard } from "./review-card"

export interface Review {
  id: string
  client_name: string
  client_company: string | null
  client_role: string | null
  content: string
  rating: number
  created_at: string
  updated_at: string
}

export function AdminDashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const router = useRouter()

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews")
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  const handleSave = async (review: Omit<Review, "id" | "created_at" | "updated_at">) => {
    try {
      if (editingReview) {
        // Update existing review
        const res = await fetch(`/api/reviews/${editingReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        })
        if (res.ok) {
          fetchReviews()
          setEditingReview(null)
          setShowForm(false)
          toast.success("Review updated successfully")
        } else {
          toast.error("Failed to update review")
        }
      } else {
        // Create new review
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        })
        if (res.ok) {
          fetchReviews()
          setShowForm(false)
          toast.success("Review added successfully")
        } else {
          toast.error("Failed to add review")
        }
      }
    } catch {
      toast.error("An error occurred")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" })
        if (res.ok) {
          fetchReviews()
          toast.success("Review deleted successfully")
        } else {
          toast.error("Failed to delete review")
        }
      } catch {
        toast.error("An error occurred")
      }
    }
  }

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingReview(null)
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to site</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsLoading(true)
                  fetchReviews()
                  toast.success("Reviews refreshed")
                }}
                className="gap-2"
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MessageSquareQuote className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{reviews.length}</p>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{avgRating}</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-secondary fill-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {reviews.filter(r => r.rating === 5).length}
                  </p>
                  <p className="text-sm text-muted-foreground">5-Star Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Client Reviews</CardTitle>
              <CardDescription>
                Manage trusted client testimonials displayed on the home page
              </CardDescription>
            </div>
            {!showForm && (
              <Button 
                onClick={() => setShowForm(true)}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                Add Review
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {showForm && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold mb-4">
                  {editingReview ? "Edit Review" : "Add New Review"}
                </h3>
                <ReviewForm 
                  initialData={editingReview || undefined}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquareQuote className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add your first client review to display on the home page
                </p>
                {!showForm && (
                  <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add First Review
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
