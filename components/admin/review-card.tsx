"use client"

import { Button } from "@/components/ui/button"
import { Star, Pencil, Trash2, Calendar, Building2 } from "lucide-react"
import type { Review } from "./admin-dashboard"

interface ReviewCardProps {
  review: Review
  onEdit: (review: Review) => void
  onDelete: (id: string) => void
}

export function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold truncate">{review.client_name}</h4>
            <div className="flex items-center gap-0.5">
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
          </div>
          
          {(review.client_role || review.client_company) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              {review.client_role && <span>{review.client_role}</span>}
              {review.client_role && review.client_company && <span>at</span>}
              {review.client_company && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {review.client_company}
                </span>
              )}
            </div>
          )}

          <p className="text-sm text-foreground/80 line-clamp-3 mb-2">
            {review.content}
          </p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(review)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="w-4 h-4" />
            <span className="sr-only">Edit review</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(review.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete review</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
