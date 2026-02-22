import React from "react";
import PublicLayout from "../components/public/PublicLayout";

export default function Privacy() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
            <p className="text-sm text-slate-500">
              Last updated: February 10, 2026 • Version 1.0
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                HarbourBee collects information necessary to provide maritime supply delivery services:
              </p>
              
              <h3 className="text-base font-semibold text-slate-900 mb-3 mt-6">Account Information</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Email address and password</li>
                <li>Full name and contact details</li>
                <li>Role and organization affiliation</li>
              </ul>

              <h3 className="text-base font-semibold text-slate-900 mb-3 mt-6">Vessel Information</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Vessel name and IMO number</li>
                <li>Port and anchorage locations</li>
                <li>Estimated time of arrival (ETA)</li>
              </ul>

              <h3 className="text-base font-semibold text-slate-900 mb-3 mt-6">Order Data</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Products ordered and quantities</li>
                <li>Delivery preferences and timing</li>
                <li>Pool participation and delivery fee reconciliation</li>
              </ul>

              <h3 className="text-base font-semibold text-slate-900 mb-3 mt-6">Payment Information</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Payment method details (processed securely by our payment provider)</li>
                <li>Transaction history and refund records</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Your information is used to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Process and fulfill orders</li>
                <li>Coordinate pooled delivery logistics</li>
                <li>Calculate and process delivery fee refunds</li>
                <li>Send order status updates and notifications</li>
                <li>Improve platform functionality and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Pooling and Data Sharing</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                When orders are pooled for delivery:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Vessel names and port destinations are visible to pool participants</li>
                <li>Order contents remain private to each vessel</li>
                <li>Delivery fee reconciliation is automatic and transparent</li>
                <li>Vendors receive only information necessary to fulfill orders</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Third-Party Services</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We work with trusted third-party providers for:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Payment processing (your payment details are not stored on our servers)</li>
                <li>Email notifications and communications</li>
                <li>Cloud infrastructure and data storage</li>
                <li>Analytics and platform performance monitoring</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                These providers are contractually obligated to protect your data and use it only for specified purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Data Security</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure password storage with hashing</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your order history and data</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                To exercise these rights, contact us at{" "}
                <a href="mailto:privacy@harbourbee.com" className="text-sky-600 hover:text-sky-700 font-medium">
                  privacy@harbourbee.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Data Retention</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We retain your data for as long as your account is active or as needed to provide services. 
                Order history and transaction records are retained for 7 years for accounting and legal compliance purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Changes to Privacy Policy</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
                Significant changes will be communicated via email. Continued use of the platform after changes 
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                For questions about this Privacy Policy or our data practices, contact us at:{" "}
                <a href="mailto:privacy@harbourbee.com" className="text-sky-600 hover:text-sky-700 font-medium">
                  privacy@harbourbee.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}