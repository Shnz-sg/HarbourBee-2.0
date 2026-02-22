import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AuthCard from "../components/public/AuthCard";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    
    try {
      // Simulate resend verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <AuthCard 
        title="Verify your email" 
        subtitle="We've sent you a verification link"
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-sky-600" />
          </div>
          
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Check your inbox and click the verification link to activate your account. 
            This helps us ensure the security of your account.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs font-medium text-amber-900 mb-1">Can't find the email?</p>
            <ul className="text-xs text-amber-800 space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email</li>
              <li>• Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          {resent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-sm text-green-700">Verification email resent</p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending}
            className="w-full h-10 mb-3"
          >
            {isResending ? "Resending..." : "Resend Verification Email"}
          </Button>

          <button
            onClick={() => navigate(createPageUrl("Login"))}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Back to Login
          </button>
        </div>
      </AuthCard>
    </div>
  );
}