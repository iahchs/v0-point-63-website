"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import type { Review } from "./admin-dashboard"

interface ReviewFormProps {
  initialData?: Review
  onSave: (review: Omit<Review, "id" | "created_at" | "updated_at">) => Promise<void>
  onCancel: () => void
}

export function ReviewForm({ initialData, onSave, onCancel }: ReviewFormProps) {
  const [clientName, setClientName] = useState(initialData?.client_name || "")
  const [clientCompany, setClientCompany] = useState(initialData?.client_company || "")
  const [clientRole, setClientRole] = useState(initialData?.client_role || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [rating, setRating] = useState(initialData?.rating || 5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave({
        client_name: clientName,
        client_company: clientCompany || null,
        client_role: clientRole || null,
        content,
        rating,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="John Smith"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientCompany">Company</Label>
          <Input
            id="clientCompany"
            value={clientCompany}
            onChange={(e) => setClientCompany(e.target.value)}
            placeholder="Acme Corp"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientRole">Role / Title</Label>
        <Input
          id="clientRole"
          value={clientRole}
          onChange={(e) => setClientRole(e.target.value)}
          placeholder="Marketing Director"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Review Content *</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write the client's testimonial here..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "text-accent fill-accent"
                    : "text-muted-foreground/30"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating} star{rating !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? "Saving..." : initialData ? "Update Review" : "Add Review"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
