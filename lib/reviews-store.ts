// In-memory store for reviews (fallback when Supabase is not connected)
// This will persist during the server session but reset on restart

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

// Default reviews data
const defaultReviews: Review[] = [
  {
    id: "1",
    client_name: "Sarah Chen",
    client_company: "TechStart Inc.",
    client_role: "CEO",
    content: "Point 63 transformed our brand vision into stunning reality. Their 3D work and motion graphics elevated our product launch beyond expectations.",
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    client_name: "Marcus Rivera",
    client_company: "Bloom Creative",
    client_role: "Creative Director",
    content: "Exceptional attention to detail and creative execution. The team delivered a commercial that truly captured our brand essence.",
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    client_name: "Emily Watson",
    client_company: "Nova Dynamics",
    client_role: "Marketing Head",
    content: "Professional, responsive, and incredibly talented. Our product visualization exceeded all expectations.",
    rating: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Global store (persists during server runtime)
let reviewsStore: Review[] = [...defaultReviews]

export function getAllReviews(): Review[] {
  return [...reviewsStore].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getReviewById(id: string): Review | undefined {
  return reviewsStore.find(r => r.id === id)
}

export function createReview(data: Omit<Review, "id" | "created_at" | "updated_at">): Review {
  const newReview: Review = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  reviewsStore.push(newReview)
  return newReview
}

export function updateReview(id: string, data: Partial<Omit<Review, "id" | "created_at" | "updated_at">>): Review | null {
  const index = reviewsStore.findIndex(r => r.id === id)
  if (index === -1) return null
  
  reviewsStore[index] = {
    ...reviewsStore[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  return reviewsStore[index]
}

export function deleteReview(id: string): boolean {
  const index = reviewsStore.findIndex(r => r.id === id)
  if (index === -1) return false
  
  reviewsStore.splice(index, 1)
  return true
}
