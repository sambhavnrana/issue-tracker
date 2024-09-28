"use client";
import Link from 'next/link';
import { Button } from '@radix-ui/themes';
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 text-center animate-fade-in-up">

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-brand-dark">
        Track<span className="text-brand">Buddy</span>
      </h1>
      <div className="w-32 sm:w-40 md:w-48 lg:w-64 xl:w-80 h-1 sm:h-2 bg-gradient-to-r from-brand-light to-brand-dark mx-auto rounded-full  shadow-2xl [animation-delay:2s] animate-pulse"></div>

      <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl sm:max-w-3xl mx-auto leading-relaxed font-light pt-4 sm:pt-6 animate-fade-in-up [animation-delay:0.4s]">
        Your all-in-one solution for <span className="font-semibold text-brand-light">efficient issue tracking</span> and
        <span className="font-semibold text-brand-light"> project management</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center pt-6 sm:pt-8">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 900, damping: 12 }}
          >
            <Link href="/dashboard"
              className="inline-block bg-brand text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-xl text-lg sm:text-xl font-semibold hover:bg-brand-dark hover:shadow-2xl duration-200 focus:outline-none focus:ring-2"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.6 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 900, damping: 12 }}
          >
            <Link href="/issues/list"
              className="inline-block bg-gray-100 text-brand border border-brand px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-xl text-lg sm:text-xl font-semibold hover:bg-gray-200 hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2"
            >
              View Issues
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-6 mb-2 animate-fade-in-up [animation-delay:0.8s]">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-dark mb-4 sm:mb-6 text-center">See TrackBuddy in Action</h2>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start justify-center">
          {/* Demo Issues Table */}
          <div className="flex-1 bg-white border border-brand-light rounded-xl shadow-xl p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold text-brand mb-3">Sample Issues</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-light text-xs sm:text-sm">
                <thead className="bg-brand-light">
                  <tr>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Title</th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Status</th>
                    <th className="px-2 sm:px-3 py-2 text-left text-xs font-bold text-white uppercase tracking-wider">Project</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-brand-light">
                  <tr>
                    <td className="px-2 sm:px-3 py-2 text-blue-700">Fix login bug</td>
                    <td className="px-2 sm:px-3 py-2 "><span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">Open</span></td>
                    <td className="px-2 sm:px-3 py-2">Website</td>
                  </tr>
                  <tr>
                    <td className="px-2 sm:px-3 py-2 text-blue-700">Add dark mode</td>
                    <td className="px-2 sm:px-3 py-2"><span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-semibold">In Progress</span></td>
                    <td className="px-2 sm:px-3 py-2">Mobile App</td>
                  </tr>
                  <tr>
                    <td className="px-2 sm:px-3 py-2 text-blue-700">Update docs</td>
                    <td className="px-2 sm:px-3 py-2"><span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Closed</span></td>
                    <td className="px-2 sm:px-3 py-2">API</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* Demo Project Card */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="bg-white border border-brand-light rounded-xl shadow-xl p-4 sm:p-5 w-full max-w-xs">
              <h3 className="text-base sm:text-lg font-semibold text-brand mb-2">Sample Project</h3>
              <div className="text-brand-dark font-bold text-lg sm:text-xl mb-1">Website Redesign</div>
              <div className="text-gray-600 text-xs sm:text-sm mb-3">A project to modernize the company website with a new look and improved UX.</div>
              <div className="flex gap-2 mb-2">
                <span className="inline-block px-2 py-1 rounded bg-brand-light text-white text-xs font-semibold">4 Issues</span>
                <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">2 Closed</span>
              </div>
              <div className="text-xs text-gray-400">Created: 2/12/2024</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center animate-fade-in-left [animation-delay:1.5s]">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">
          Why Choose TrackBuddy?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl sm:max-w-3xl mx-auto">
          {[
            "Lightning Fast",
            "Team Collaboration",
            "Customizable workflows",
            "Mobile-responsive design",
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-2 sm:gap-3 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
            >
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-brand flex-shrink-0" />
              <span className="text-sm sm:text-base text-slate-700 font-medium">{benefit}</span>
            </motion.div>
          ))}
        </div>

        <div className='text-center pt-6 sm:pt-8 mt-6 sm:mt-8 -mb-6 sm:-mb-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 600, damping: 7 }}
            >
              <Link href="/issues/list"
                className="inline-block bg-brand text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-xl text-base sm:text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 animate-bounce hover:bg-brand-dark hover:scale-110 hover:shadow-2xl hover:animate-none"
              >
                Get Started Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
