import React, { useState } from "react";
import PublicLayout from "../components/public/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Message Received</h1>
          <p className="text-slate-600 mb-8">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: "", email: "", message: "" });
            }}
            variant="outline"
          >
            Send Another Message
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Us</h1>
          <p className="text-lg text-slate-600">
            Have a question or need assistance? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Your name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                  className="mt-1.5 h-10"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="mt-1.5 h-10"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                  className="mt-1.5 min-h-32"
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-sky-600 hover:bg-sky-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">Email Support</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    For general inquiries and support
                  </p>
                  <a 
                    href="mailto:support@harbourbee.com" 
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    support@harbourbee.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">Operating Hours</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM UTC</p>
                    <p>Saturday: 9:00 AM - 3:00 PM UTC</p>
                    <p>Sunday: Closed</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    We aim to respond within 24 hours during business days
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
              <h3 className="text-base font-semibold text-slate-900 mb-3">Before you reach out</h3>
              <p className="text-sm text-slate-600 mb-3">
                Many common questions are answered in our FAQ section. This might help you get answers faster.
              </p>
              <a 
                href={"/app/" + "Help"}
                className="text-sm text-sky-600 hover:text-sky-700 font-medium"
              >
                Browse FAQ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}