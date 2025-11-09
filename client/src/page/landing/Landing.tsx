import { Link } from "react-router-dom";
import { Blend,} from "lucide-react";

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
          <a href="#pricing" className="hover:text-white">Pricing</a>
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

        <section className="mt-12 md:mt-16">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
            <div className="absolute -inset-40 bg-white/10 blur-3xl animate-drift-slow" />
            <div className="relative grid md:grid-cols-2">
              <div className="p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                <h2 id="features" className="text-2xl font-semibold">Everything in one place</h2>
                <ul className="mt-3 md:mt-4 space-y-3 text-white/85 text-sm md:text-base">
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" /> Tasks, projects, and timelines</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" /> Real-time team and AI chat</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" /> Invoices and contracts</li>
                  <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/70" /> Permissions and workspace settings</li>
                </ul>
              </div>
              <div className="p-6 sm:p-8 md:p-10 bg-gradient-to-br from-black to-zinc-900">
                <div className="h-56 sm:h-72 md:h-full w-full rounded-xl border border-white/10 bg-black/60 grid place-items-center text-white/50 animate-float-slow">
                  <span className="text-sm">Beautiful app preview</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mt-16 md:mt-20 text-center">
          <h3 className="text-lg md:text-xl font-semibold">Simple pricing</h3>
          <p className="mt-1 md:mt-2 text-white/70">Start free, upgrade when you grow.</p>
          <div className="mt-5 md:mt-6 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 md:px-6 py-3 md:py-4">
            <div>
              <div className="text-2xl md:text-3xl font-bold">Free</div>
              <div className="text-white/60 text-sm">Up to 3 members</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-2xl md:text-3xl font-bold">Pro</div>
              <div className="text-white/60 text-sm">$9/member/mo</div>
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
