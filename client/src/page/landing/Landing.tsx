import { Link } from "react-router-dom";
import { Blend } from "lucide-react";

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black text-white animate-gradient-slow">
      {/* Moving grid background */}
      <div className="pointer-events-none absolute inset-0 bg-grid-slow opacity-50" />
      <header className="container mx-auto px-4 md:px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-white/10 grid place-items-center">
            <Blend className="h-5 w-5" />
          </div>
          <span className="text-base md:text-lg font-semibold">ClientX</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how" className="hover:text-white">How it works</a>
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/sign-in" className="px-3 md:px-4 py-2 rounded-md text-sm bg-white/10 hover:bg-white/15">Sign in</Link>
          <Link to="/sign-up" className="px-3 md:px-4 py-2 rounded-md text-sm bg-white text-black hover:bg-zinc-200">Get started</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-16 md:pb-24">
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 mb-6">
            <span className="h-2 w-2 rounded-full bg-white/70" />
            Now with AI-powered workspace chat
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight">
            Organize work. Collaborate faster. Delight clients.
          </h1>
          <p className="mt-4 md:mt-6 text-white/80 text-base md:text-lg">
            ClientX unifies tasks, chat, invoicing, and contracts in a single, powerful workspace so your team can ship more and spend less time juggling tools.
          </p>
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link to="/sign-up" className="px-5 md:px-6 py-3 rounded-md bg-white text-black hover:bg-zinc-200 font-medium text-center">
              Create your workspace
            </Link>
            <Link to="/sign-in" className="px-5 md:px-6 py-3 rounded-md bg-white/10 hover:bg-white/15 text-white font-medium text-center">
              I already have an account
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/60">Free plan available. No credit card required.</p>
        </section>

        <section id="features" className="mt-12 md:mt-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Everything in one place</h2>
            <p className="mt-2 text-white/70">All the tools you need to manage your business efficiently</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-white/10 grid place-items-center mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Tasks & Projects</h3>
              <p className="text-sm text-white/70">Organize work with tasks, projects, and timelines that keep everyone aligned</p>
            </div>

            <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-white/10 grid place-items-center mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Team & AI Chat</h3>
              <p className="text-sm text-white/70">Collaborate in real-time with your team and get instant AI assistance</p>
            </div>

            <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-white/10 grid place-items-center mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Invoices & Contracts</h3>
              <p className="text-sm text-white/70">Create professional invoices and manage contracts all in one place</p>
            </div>

            <div className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 hover:bg-white/10 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-white/10 grid place-items-center mb-4">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Workspace Settings</h3>
              <p className="text-sm text-white/70">Control permissions, manage members, and customize your workspace</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-10 text-center text-white/60 text-sm">
        © {new Date().getFullYear()} ClientX. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;