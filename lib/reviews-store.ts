import fs from "fs"
import path from "path"

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

// Data file location
const DATA_PATH = process.env.DATA_PATH || path.join(process.cwd(), "data", "reviews.json")

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

// In-memory cache
let reviewsCache: Review[] | null = null

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(DATA_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Load reviews from file
function loadReviews(): Review[] {
  if (reviewsCache !== null) {
    return reviewsCache
  }

  try {
    ensureDataDir()
    if (fs.existsSync(DATA_PATH)) {
      const data = fs.readFileSync(DATA_PATH, "utf-8")
      reviewsCache = JSON.parse(data)
      return reviewsCache!
    }
  } catch (error) {
    console.error("Error loading reviews:", error)
  }

  // Return defaults if file doesn't exist or error
  reviewsCache = [...defaultReviews]
  saveReviews(reviewsCache)
  return reviewsCache
}

// Save reviews to file
function saveReviews(reviews: Review[]) {
  try {
    ensureDataDir()
    fs.writeFileSync(DATA_PATH, JSON.stringify(reviews, null, 2))
    reviewsCache = reviews
  } catch (error) {
    console.error("Error saving reviews:", error)
  }
}

export function getAllReviews(): Review[] {
  const reviews = loadReviews()
  return [...reviews].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function getReviewById(id: string): Review | undefined {
  const reviews = loadReviews()
  return reviews.find((r) => r.id === id)
}

export function createReview(
  data: Omit<Review, "id" | "created_at" | "updated_at">
): Review {
  const reviews = loadReviews()
  const newReview: Review = {
    ...data,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  reviews.push(newReview)
  saveReviews(reviews)
  return newReview
}

export function updateReview(
  id: string,
  data: Partial<Omit<Review, "id" | "created_at" | "updated_at">>
): Review | null {
  const reviews = loadReviews()
  const index = reviews.findIndex((r) => r.id === id)
  if (index === -1) return null

  reviews[index] = {
    ...reviews[index],
    ...data,
    updated_at: new Date().toISOString(),
  }
  saveReviews(reviews)
  return reviews[index]
}

export function deleteReview(id: string): boolean {
  const reviews = loadReviews()
  const index = reviews.findIndex((r) => r.id === id)
  if (index === -1) return false

  reviews.splice(index, 1)
  saveReviews(reviews)
  return true
}
