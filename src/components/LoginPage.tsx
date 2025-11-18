import React, { useState } from 'react';
import {
  Mail,
  ArrowRight,
  Sparkles,
  Layers,
  Palette,
  UploadCloud,
  Wand2,
  Globe
} from 'lucide-react';
import type { User } from '../App';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase is not configured. Please contact the administrator.');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        setError(result.error.message);
      } else if (result.data.user) {
        onLogin({
          id: result.data.user.id,
          email: result.data.user.email || '',
          name: result.data.user.email?.split('@')[0]
        });
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'linkedin_oidc') => {
    setLoading(true);
    setError('');

    if (!supabase || !isSupabaseConfigured) {
      setError('Supabase is not configured. Please contact the administrator.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError('Social login failed');
    } finally {
      setLoading(false);
    }
  };

  const scrollToAuth = () => {
    const section = document.getElementById('auth-section');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headerAction = (
    <button
      onClick={scrollToAuth}
      className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-cyan-300 hover:text-slate-900"
    >
      Access your account
      <ArrowRight className="h-4 w-4" />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5FBFF] via-white to-[#ECF8FF] text-slate-900">
      <BrandHeader subdued action={headerAction} />

      <main className="max-w-6xl mx-auto px-4">
        <section className="py-16 md:py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              Build polished portfolios in minutes
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Create Stunning Digital Portfolios Effortlessly
            </h1>
            <p className="mt-6 text-lg text-slate-600 md:text-xl">
              Follio helps individuals and businesses launch beautiful, customizable portfolios in minutes. No coding, just smart layouts crafted for you.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={scrollToAuth}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                Build your portfolio
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                className="inline-flex items-center gap-2 text-base font-semibold text-cyan-600 hover:text-cyan-700"
                onClick={scrollToAuth}
              >
                Explore the platform
              </button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[{ icon: Layers, title: 'AI-Driven', description: 'Let Follio transform your content into a polished digital portfolio that reflects your brand.' }, { icon: Palette, title: 'Drag-and-Drop Simplicity', description: 'Choose layouts, tweak sections, and launch faster with intuitive tools.' }, { icon: Globe, title: 'Branded Customization', description: 'Match your colors, fonts, and voice to create a cohesive online presence.' }].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 text-cyan-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-semibold text-slate-900">Why Follio?</h2>
            <p className="mt-4 text-slate-600">
              We believe your digital presence deserves the same polish as your skills. Follio removes the noise and delivers beautiful, AI-powered portfolios that convert attention into opportunity.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[{ icon: UploadCloud, title: 'Upload Your Content', description: 'Drop your resume, copy, or assets into Follio. Our parser structures everything instantly.' }, { icon: Wand2, title: 'Let Follio Handle Design', description: 'AI suggests layouts, sections, and messaging that highlights what makes you unique.' }, { icon: Globe, title: 'Publish in Minutes', description: 'Launch a responsive, shareable site with custom domains and analytics built in.' }].map((item) => (
              <div key={item.title} className="rounded-2xl bg-gradient-to-br from-[#F5FBFF] to-white p-6 text-left">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="auth-section" className="py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-teal-500 p-10 text-white shadow-xl">
              <h2 className="text-3xl font-semibold leading-tight">Ready to build your digital presence?</h2>
              <p className="mt-4 text-cyan-100">
                Get started with Follio and launch your professional portfolio in minutes. Sign in to continue designing, or create an account to unlock AI-crafted experiences tailored to you.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[{ title: 'Smart personalization', description: 'Follio adapts layouts based on your industry and goals.' }, { title: 'Collaborative workflow', description: 'Invite clients or teammates to review and approve updates fast.' }, { title: 'Built-in analytics', description: 'Track engagement and understand how your portfolio performs.' }, { title: 'Seamless publishing', description: 'Connect your domain and go live with confidence.' }].map((benefit) => (
                  <div key={benefit.title} className="rounded-2xl bg-white/10 p-4">
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="mt-2 text-sm text-cyan-50">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-slate-900">
                  {isLogin ? 'Welcome back to Follio' : 'Join Follio today'}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {isLogin
                    ? 'Sign in to keep building and refining your standout digital portfolio.'
                    : 'Create an account to craft a professional presence with AI-assisted storytelling.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => handleSocialAuth('google')}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialAuth('linkedin_oidc')}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0077B5] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#005f8d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Continue with LinkedIn
                </button>
              </div>

              <div className="my-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      {isLogin ? 'Sign in' : 'Create account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-cyan-600 transition hover:text-cyan-700"
                >
                  {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
};

export default LoginPage;