"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, Youtube } from "lucide-react"

const contactDetails = [
  {
    icon: MapPin,
    label: "Our Location",
    value: "Manila, Philippines",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+63 912 345 6789",
    href: "tel:+639123456789",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact.point63@gmail.com",
    href: "mailto:contact.point63@gmail.com",
    highlight: true,
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Fri: 9AM - 6PM PHT",
    href: null,
  },
]

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
]

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="lg:pl-8"
    >
      <div className="bg-muted/30 rounded-2xl p-8 lg:p-10 border border-border">
        <h3 className="text-xl font-bold mb-6">Contact Information</h3>

        <div className="space-y-6 mb-10">
          {contactDetails.map((detail) => (
            <div key={detail.label} className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'highlight' in detail && detail.highlight ? 'rgba(142, 91, 190, 0.15)' : 'rgba(126, 211, 90, 0.1)' }}
              >
                <detail.icon 
                  className="w-5 h-5" 
                  style={{ color: 'highlight' in detail && detail.highlight ? '#8E5BBE' : undefined }}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{detail.label}</p>
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="font-medium transition-colors"
                    style={{ color: 'highlight' in detail && detail.highlight ? '#8E5BBE' : undefined }}
                  >
                    {detail.value}
                  </a>
                ) : (
                  <p className="font-medium text-foreground">{detail.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Follow Us
          </p>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-11 h-11 rounded-xl bg-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors group"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Additional CTA Card */}
      <div className="mt-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
        <h4 className="font-semibold mb-2">Need a quick response?</h4>
        <p className="text-sm text-muted-foreground mb-4">
          For urgent inquiries, reach out directly via phone or email. We typically respond within a few hours during business hours.
        </p>
        <a
          href="mailto:contact.point63@gmail.com"
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: '#8E5BBE' }}
        >
          <Mail className="w-4 h-4" />
          contact.point63@gmail.com
        </a>
      </div>
    </motion.div>
  )
}
