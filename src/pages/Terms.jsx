import React from "react";
import PublicLayout from "../components/public/PublicLayout";

export default function Terms() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Terms & Conditions</h1>
            <p className="text-sm text-slate-500">
              Last updated: February 10, 2026 • Version 1.0
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                By accessing or using HarbourBee, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, you may not use the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Service Description</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                HarbourBee is a maritime supply delivery platform that facilitates:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Ordering of provisions, stores, and spare parts for vessels</li>
                <li>Pooled logistics to reduce delivery costs</li>
                <li>Delivery coordination to ports and anchorages</li>
                <li>Payment processing and refund management</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Pooled Delivery System</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Orders may be grouped with other vessels heading to the same port to achieve cost savings:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Pools with 3 or more orders qualify for free delivery</li>
                <li>Provisional delivery fees are charged at checkout</li>
                <li>Refunds are processed automatically based on final pool composition</li>
                <li>Pool cut-off times are determined by vessel ETA and operational requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Pricing and Payment</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                All prices are displayed in USD unless otherwise stated. Payment is required at the time of order placement. 
                Refunds for delivery fee adjustments are processed within 5-7 business days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Order Cancellation</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Orders may be cancelled before they are dispatched for delivery. Once a delivery has been dispatched, 
                cancellation is not possible. Refund policies apply based on the order status at the time of cancellation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Delivery</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Delivery is coordinated to the port or anchorage specified in your order. Delivery times are estimates 
                and may be affected by weather, port operations, or vessel movements. HarbourBee is not liable for 
                delays beyond our reasonable control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">7. User Responsibilities</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Providing accurate vessel and delivery information</li>
                <li>Ensuring authorized personnel receive deliveries</li>
                <li>Inspecting goods upon delivery and reporting any issues promptly</li>
                <li>Maintaining the confidentiality of your account credentials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                HarbourBee acts as a platform connecting maritime operators with supply vendors. We are not responsible 
                for the quality, safety, or legality of products ordered through the platform beyond our reasonable efforts 
                to work with reputable vendors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Changes to Terms</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Changes will be posted with an updated version number 
                and effective date. Continued use of the platform after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                For questions about these Terms & Conditions, contact us at:{" "}
                <a href="mailto:legal@harbourbee.com" className="text-sky-600 hover:text-sky-700 font-medium">
                  legal@harbourbee.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}