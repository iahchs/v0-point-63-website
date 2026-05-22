"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, Loader2 } from "lucide-react"

const services = [
  "Video & Photo Shoot",
  "3D Graphics",
  "Motion Graphics",
  "Video & Commercial Editing",
  "Full Production Package",
  "Other",
]

const budgetRanges = [
  "Under PHP 75,000",
  "PHP 75,000 - PHP 150,000",
  "PHP 150,000 - PHP 300,000",
  "PHP 300,000 - PHP 750,000",
  "PHP 750,000+",
  "Not sure yet",
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [service, setService] = useState("")
  const [budget, setBudget] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || '',
        service: service,
        budget: budget,
        message: formData.get('message') as string,
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to send email')
      }

      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error('[v0] Error submitting form:', error)
      setIsSubmitting(false)
      alert('Failed to send your message. Please try again or email us directly.')
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-muted/30 rounded-2xl p-8 lg:p-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Send className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Your message has been received. Our team will review your project details and get back to you within 24-48 hours.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Send Another Message
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold mb-2">Start Your Project</h2>
        <p className="text-muted-foreground">Fill out the form below and we&apos;ll get back to you within 24-48 hours.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              className="bg-muted/30 border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="bg-muted/30 border-border focus:border-primary"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+63 912 345 6789"
              className="bg-muted/30 border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Service Interested In *</Label>
            <Select value={service} onValueChange={setService} required>
              <SelectTrigger className="bg-muted/30 border-border focus:border-primary">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((svc) => (
                  <SelectItem key={svc} value={svc.toLowerCase().replace(/\s+/g, "-")}>
                    {svc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget Range</Label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className="bg-muted/30 border-border focus:border-primary">
              <SelectValue placeholder="Select your budget range" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range} value={range.toLowerCase().replace(/\s+/g, "-")}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Project Details *</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
            rows={6}
            required
            className="bg-muted/30 border-border focus:border-primary resize-none"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground mb-2">Or email us directly:</p>
          <a
            href="mailto:contact.point63@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#8E5BBE', backgroundColor: 'rgba(142, 91, 190, 0.1)' }}
          >
            <Send className="h-4 w-4" />
            contact.point63@gmail.com
          </a>
        </div>
      </form>
    </motion.div>
  )
}
