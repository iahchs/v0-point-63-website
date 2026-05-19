"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, Quote, Loader2 } from "lucide-react"

interface Review {
  id: string
  client_name: string
  client_company: string | null
  client_role: string | null
  content: string
  rating: number
  created_at: string
}

export function TrustedReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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
    fetchReviews()
  }, [])

  // Don't render section if no reviews
  if (!isLoading && reviews.length === 0) {
    return null
  }

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0"

  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            Client Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            See what our clients have to say about working with Point 63 Productions
          </p>
          
          {/* Average Rating Badge */}
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(parseFloat(avgRating))
                        ? "text-accent fill-accent"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{avgRating}</span>
              <span className="text-muted-foreground">
                from {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </motion.div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-primary/20" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= review.rating
                ? "text-accent fill-accent"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-foreground/80 leading-relaxed flex-1 mb-6">
        &ldquo;{review.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
          {review.client_name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{review.client_name}</p>
          {(review.client_role || review.client_company) && (
            <p className="text-sm text-muted-foreground truncate">
              {review.client_role}
              {review.client_role && review.client_company && " at "}
              {review.client_company}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
