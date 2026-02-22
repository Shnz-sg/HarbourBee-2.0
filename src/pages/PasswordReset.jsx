import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AuthCard from "../components/public/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate password reset request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <AuthCard 
          title="Check your email" 
          subtitle="Password reset instructions sent"
        >
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-sm text-slate-600 mb-6">
              If an account exists for <span className="font-medium text-slate-900">{email}</span>, 
              you will receive password reset instructions shortly.
            </p>
            <p className="text-xs text-slate-500 mb-6">
              Check your spam folder if you don't see the email within a few minutes.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Login"))}
              className="w-full h-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AuthCard 
        title="Reset your password" 
        subtitle="Enter your email to receive reset instructions"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="mt-1.5 h-10"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-sky-600 hover:bg-sky-700"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className="text-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(createPageUrl("Login"))}
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Login
            </button>
          </div>
        </form>
      </AuthCard>
    </div>
  );
}