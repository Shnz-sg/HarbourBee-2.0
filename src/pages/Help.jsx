import React, { useState } from "react";
import PublicLayout from "../components/public/PublicLayout";
import { ChevronDown, ChevronRight } from "lucide-react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is HarbourBee?",
        a: "HarbourBee is a maritime supply delivery platform that uses pooled logistics to reduce costs. Orders from multiple vessels heading to the same port are grouped together, and when 3 or more orders join a pool, delivery becomes free for everyone."
      },
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' on the homepage, enter your email and create a password. You'll receive a verification email to activate your account. Once verified, you can start ordering supplies for your vessel."
      },
      {
        q: "Who can use HarbourBee?",
        a: "HarbourBee is designed for maritime operators, vessel crew, port agents, and anyone involved in vessel supply operations. Whether you're ordering provisions, deck stores, or spare parts, the platform streamlines the process."
      }
    ]
  },
  {
    category: "How Pooling Works",
    questions: [
      {
        q: "What is a delivery pool?",
        a: "A delivery pool groups orders from different vessels heading to the same port around the same time. By combining deliveries, we reduce logistics costs. When a pool reaches 3 or more orders, delivery is free for all participants."
      },
      {
        q: "Do I have to join a pool?",
        a: "Orders are automatically added to pools based on your delivery port and vessel ETA. This happens transparently in the background. If your order doesn't join a pool, standard delivery fees apply."
      },
      {
        q: "When do pools close?",
        a: "Pools typically close 72 hours before the earliest vessel ETA in the group. This allows time to prepare and coordinate delivery. You'll see the pool cut-off time clearly when placing your order."
      },
      {
        q: "What happens if a pool doesn't reach 3 orders?",
        a: "You still receive your delivery, but a shared delivery fee applies. This fee is split among pool participants and is typically lower than ordering independently. Any difference from your provisional fee is automatically refunded."
      }
    ]
  },
  {
    category: "Orders & Delivery",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse the product catalogue, add items to your cart, enter your vessel details and delivery port, then proceed to checkout. You'll see if your order joins a pool and the provisional delivery fee before confirming."
      },
      {
        q: "Can I cancel my order?",
        a: "Yes, orders can be cancelled before they're dispatched for delivery. Once a delivery is in progress, cancellation is not possible. Check your order status page for the current state."
      },
      {
        q: "How is delivery coordinated?",
        a: "Supplies are delivered to your vessel at the specified port or anchorage. Delivery methods include launch, barge, or truck depending on location and requirements. You'll receive status updates throughout the process."
      },
      {
        q: "What if my vessel's ETA changes?",
        a: "Contact support as soon as possible if your ETA changes significantly. We'll work to adjust your delivery or move your order to a different pool if needed."
      }
    ]
  },
  {
    category: "Payment & Refunds",
    questions: [
      {
        q: "When am I charged?",
        a: "Payment is processed at checkout. You're charged for the products plus a provisional delivery fee. The final delivery fee is determined when the pool closes, and any overpayment is automatically refunded."
      },
      {
        q: "How do refunds work?",
        a: "If your pool achieves free delivery (3+ orders), your provisional delivery fee is refunded in full. If the pool doesn't meet the threshold, you're refunded the difference between the provisional and actual shared fee. Refunds are processed within 5-7 business days."
      },
      {
        q: "What payment methods are accepted?",
        a: "We accept major credit cards and debit cards. Payment processing is handled securely through our payment provider. We do not store your payment details on our servers."
      }
    ]
  },
  {
    category: "Account & Security",
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot password' on the login page, enter your email, and you'll receive reset instructions. For security, the reset link expires after 24 hours."
      },
      {
        q: "Is my data secure?",
        a: "Yes. We use industry-standard encryption for all data transmission and storage. Your payment details are processed by our secure payment provider and never stored on our servers. See our Privacy Policy for full details."
      },
      {
        q: "Can I have multiple vessels on one account?",
        a: "Yes, you can manage orders for multiple vessels from a single account. Simply specify which vessel each order is for during checkout."
      }
    ]
  }
];

export default function Help() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Help & FAQ</h1>
          <p className="text-lg text-slate-600">
            Common questions about HarbourBee and how it works
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => (
                  <FAQItem key={qIndex} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-sky-50 border border-sky-200 rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Still have questions?</h3>
          <p className="text-slate-600 mb-4">
            We're here to help. Contact our support team for assistance.
          </p>
          <a 
            href={"/app/" + "Contact"}
            className="inline-block px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium text-sm"
          >
            Contact Support
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between text-left gap-4 group"
      >
        <span className="text-sm font-medium text-slate-900 group-hover:text-sky-600 transition-colors">
          {question}
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        )}
      </button>
      {isOpen && (
        <p className="text-sm text-slate-600 mt-3 leading-relaxed pl-0">
          {answer}
        </p>
      )}
    </div>
  );
}