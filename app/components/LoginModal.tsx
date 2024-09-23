"use client";
import { signIn } from "next-auth/react";
import { X } from "lucide-react";

export default function LoginModal({ 
  open, 
  onClose 
}: { 
  open: boolean;
  onClose?: () => void;
}) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-center max-w-sm sm:max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-200">
        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        )}
        
        {/* Icon */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand to-brand-dark rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        {/* Content */}
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Welcome Back</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Please log in or sign up to continue</p>
        
        {/* Login button */}
        <button
          className="w-full bg-gradient-to-r from-brand to-brand-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg text-base sm:text-lg font-semibold hover:scale-105 hover:from-brand-dark hover:to-brand transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-dark focus:ring-offset-2 transform"
          onClick={() => signIn(undefined, { callbackUrl: '/dashboard' })}
        >
          Log In / Sign Up
        </button>
        
        {/* Footer */}
        <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
          By continuing, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
} 