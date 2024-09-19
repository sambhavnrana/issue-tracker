import Link from 'next/link';
import { Button } from '@radix-ui/themes';
import { ArrowRight, CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-full px-4 py-16 text-center">

      <h1 className="text-6xl md:text-9xl font-bold text-brand-dark animate-fade-in-up">
        Track<span className="text-brand">Buddy</span>
      </h1>
      <div className="w-56 md:w-96 h-2 bg-gradient-to-r from-brand-light to-brand-dark mx-auto rounded-full animate-fade-in-up [animation-delay:0.2s]"></div>

      <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light pt-6 animate-fade-in-up [animation-delay:0.4s]">
        Your all-in-one solution for <span className="font-semibold text-brand-light">efficient issue tracking</span> and
        <span className="font-semibold text-brand-light"> project management</span>
      </p>

      <div className="flex flex-col sm:flex-row gap-12 justify-center items-center pt-8">

        <Link href="/dashboard">

          <Button
            size="3"
            className="hover:bg-gray-200 transform transition-transform duration-200 hover:scale-125 text-lg animate-fade-in-in2 [animation-delay:2.2s]"
          >Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>

        <Link href="/issues/list">
          <Button
            variant="outline"
            size="3"
            className="hover:bg-gray-200 transform transition-transform duration-400 hover:scale-125 text-lg animate-fade-in-in1 [animation-delay:2.8s]"
          >
            View Issues
          </Button>
        </Link>
      </div>

      <div className="mt-12 text-center animate-fade-in-left [animation-delay:1.5s]">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6">
          Why Choose TrackBuddy?
        </h2>

        <div className="grid md:grid-cols-2 gap-2 md:gap-6 max-w-4xl mx-auto">
          {[
            "Lightning Fast",
            "Team Collaboration",
            "Customizable workflows",
            "Mobile-responsive design",
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 text-left">
              <CheckCircle className="h-5 w-5 text-brand flex-shrink-0" />
              <span className="text-slate-700 font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        <div className='text-center pt-12 mt-20px -mb-16'>
          <Link href="/issues/list">
            <Button size="4"
              variant="solid"
              className="hover:bg-gray-200 transform transition-transform duration-800 hover:scale-150 text-lg animate-fade-in-right [animation-delay:3.5s] "
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
