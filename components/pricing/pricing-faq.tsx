"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do you determine project pricing?",
    answer: "Project pricing is based on several factors including project scope, complexity, timeline, and specific requirements. We provide detailed quotes after an initial consultation to understand your needs. Package plans offer predictable pricing for common project types.",
  },
  {
    question: "What payment terms do you offer?",
    answer: "We typically require a 50% deposit to begin work, with the remaining 50% due upon project completion. For larger projects, we can arrange milestone-based payments. We accept bank transfers, credit cards, and other major payment methods.",
  },
  {
    question: "How many revisions are included?",
    answer: "Revision limits depend on your chosen package. Basic includes 2 rounds, Professional includes 3 rounds, and Premium offers unlimited revisions. Additional revisions beyond package limits can be purchased at our standard hourly rate.",
  },
  {
    question: "What is your typical turnaround time?",
    answer: "Turnaround varies by project complexity. Basic projects typically complete in 5 business days, Professional in 10 days, and Premium projects are prioritized for faster delivery. Rush services are available for an additional fee.",
  },
  {
    question: "Do you offer rush or expedited services?",
    answer: "Yes! We understand sometimes deadlines are tight. Rush services are available at 1.5x the standard rate for delivery within 48-72 hours, subject to team availability and project scope.",
  },
  {
    question: "What file formats do you deliver?",
    answer: "We deliver in all standard formats based on your needs - MP4, MOV, AVI for video; PNG, TIFF, PSD for images; and various 3D formats like OBJ, FBX, and GLTF. Premium packages include source files and raw footage.",
  },
]

export function PricingFAQ() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-4"
          >
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold tracking-tight mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Got questions? We&apos;ve got answers.
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg border border-border px-6 data-[state=open]:border-primary/30 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline hover:text-primary py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
