import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Attention Ops?",
    answer: "Attention Ops is an AI-powered content generator that creates viral social media threads from your topic ideas. Just enter a topic, choose your platform and writing style, and get ready-to-post content in seconds."
  },
  {
    question: "How do I generate a mission?",
    answer: "Select your target platform, choose a writing style, and type in your topic idea. Click 'Generate Mission' and the AI will create a hook and supporting bullets formatted for social media."
  },
  {
    question: "What platforms are supported?",
    answer: "We support LinkedIn, Instagram, Twitter/X, Facebook, Email, Phone scripts, and In-Person talking points. Each platform gets optimized content formatting."
  },
  {
    question: "What are the different writing styles?",
    answer: "We offer six styles: Viral & Engaging (scroll-stopping), Controversial/Bold (drives debate), Educational/Teaching (builds trust), Professional/Data Driven (authority), Storytelling/Narrative (connection), and Casual/Conversational (approachable)."
  },
  {
    question: "Can I edit and regenerate missions?",
    answer: "Yes. Every mission is saved to your history. Click the edit button on any past mission to load the topic back into the generator for a new variation."
  },
  {
    question: "How does the affiliate program work?",
    answer: "Earn 50% commission on every referral. Click 'Become an Affiliate' at the bottom of the generator page to get your unique referral link."
  },
  {
    question: "Is my mission history saved?",
    answer: "Yes. All generated missions are saved in your session and displayed in the 'Your Mission' history section below the generator."
  },
  {
    question: "How do I contact support?",
    answer: "For support questions, reach out to the Vet2Ceo community or email support@vet2ceo.com."
  }
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4" data-testid="text-faq-title">
          Help Center
        </h1>
        <p className="text-lg text-muted-foreground">
          Frequently asked questions about Attention Ops
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            FAQs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`accordion-faq-${index}`}>
                <AccordionTrigger className="text-left" data-testid={`trigger-faq-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" data-testid={`content-faq-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
