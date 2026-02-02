import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const faqs = [
    {
      question: 'What insurance coverage is provided?',
      answer: 'All rentals include comprehensive insurance coverage up to $1 million. This covers liability, collision, and comprehensive damage. Both renters and hosts are protected under our premium insurance policy provided by our trusted partners.'
    },
    {
      question: 'How does the booking process work?',
      answer: 'Simply search for available cars in your area, select your dates, and book instantly. You can communicate with the host through our secure messaging system. Payment is processed securely through our platform, and funds are released to hosts after successful completion of the rental.'
    },
    {
      question: 'What are the fees involved?',
      answer: 'Renters pay a service fee of 10% on top of the rental price. Hosts pay a 15% commission on each booking, which covers insurance, 24/7 support, and platform maintenance. There are no hidden fees - all costs are clearly displayed before you confirm your booking.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, cancellation policies vary by host. Most offer flexible cancellation up to 24 hours before the trip starts for a full refund. Some hosts offer moderate or strict policies. Always check the specific cancellation policy before booking.'
    },
    {
      question: 'What if there\'s an issue during my rental?',
      answer: 'We offer 24/7 roadside assistance and customer support. If you experience any issues during your rental, contact our support team immediately through the app or call our emergency hotline. We\'ll help resolve the situation quickly and ensure your safety.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg sm:text-xl text-gray-600">Everything you need to know about AutoShare</p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors group">
                <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform group-data-[state=open]:rotate-180" style={{ color: '#1E40AF' }} />
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 pt-2 text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}