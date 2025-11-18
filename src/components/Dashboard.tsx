import React from 'react';
import {
  User as UserIcon,
  MapPin,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Code,
  LogOut,
  CreditCard as Edit,
  ArrowRight
} from 'lucide-react';
import type { User as UserType, ParsedResumeData } from '../App';
import { supabase, isSupabaseConfigured } from '../utils/supabaseClient';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface DashboardProps {
  user: UserType | null;
  parsedData: ParsedResumeData | null;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, parsedData, onLogout }) => {
  const [profileData, setProfileData] = React.useState<ParsedResumeData | null>(parsedData);
  const [loading, setLoading] = React.useState(!parsedData);

  React.useEffect(() => {
    const fetchProfileData = async () => {
      if (!user || parsedData || !supabase || !isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase.from('profiles')
          .select('resume_data')
          .eq('id', user.id)
          .single();
        
        if (data?.resume_data) {
          setProfileData(data.resume_data);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, parsedData]);

  const headerAction = (
    <div className="flex items-center gap-3">
      {user && (
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm text-slate-600 shadow-sm sm:flex">
          Signed in as
          <span className="font-semibold text-slate-900">{user.name || user.email}</span>
        </div>
      )}
      <button
        onClick={onLogout}
        className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F5FF]">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-cyan-500/10">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            <h2 className="text-xl font-semibold text-slate-900">Loading your profile...</h2>
            <p className="mt-2 text-sm text-slate-500">We are fetching your saved Follio details.</p>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F5FF]">
        <BrandHeader subdued action={headerAction} />
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="max-w-md rounded-3xl border border-slate-200/70 bg-white/80 p-10 text-center shadow-lg shadow-cyan-500/10">
            <h2 className="text-2xl font-semibold text-slate-900">Your Follio is almost ready</h2>
            <p className="mt-3 text-sm text-slate-600">
              Upload your resume to unlock the personalized dashboard and publishing tools.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Begin upload
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#F4FBFF] via-white to-[#E9F5FF] text-slate-900">
      <BrandHeader subdued action={headerAction} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200/80 bg-gradient-to-br from-cyan-500 via-teal-500 to-indigo-500 p-10 text-white shadow-xl shadow-cyan-500/20">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-white">
                <UserIcon className="h-10 w-10" />
              </div>
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{profileData.profile.name}</h1>
                  <p className="mt-2 text-cyan-100 text-lg">{profileData.profile.headline}</p>
                </div>
                <div className="grid gap-3 text-sm text-cyan-50 md:grid-cols-2">
                  {profileData.profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{profileData.profile.location}</span>
                    </div>
                  )}
                  {profileData.profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{profileData.profile.email}</span>
                    </div>
                  )}
                  {profileData.profile.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{profileData.profile.phone}</span>
                    </div>
                  )}
                </div>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15">
                  <Edit className="h-4 w-4" />
                  Refine profile details
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">Snapshot</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">Follio progress overview</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-cyan-700">
                  <div className="text-3xl font-semibold text-cyan-800">{profileData.experience.length}</div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide">Roles captured</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-emerald-700">
                  <div className="text-3xl font-semibold text-emerald-800">{profileData.education.length}</div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide">Education entries</p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-indigo-700">
                  <div className="text-3xl font-semibold text-indigo-800">{profileData.skills.length}</div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide">Skills highlighted</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-900">Next steps to launch</h3>
              <p className="mt-2 text-sm text-slate-600">Complete these finishing touches to publish your Follio with confidence.</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Add project imagery and testimonials for visual impact.
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Customize your call-to-action links and contact preferences.
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  Connect your custom domain before sharing broadly.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Work experience</h3>
              <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                {profileData.experience.length} roles
              </span>
            </div>
            <div className="mt-6 space-y-6">
              {profileData.experience.map((exp) => (
                <div key={exp.id} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-cyan-600">{exp.company}</p>
                      <h4 className="text-lg font-semibold text-slate-900">{exp.role}</h4>
                    </div>
                    <p className="text-sm text-slate-500">
                      {exp.startDate && new Date(exp.startDate).toLocaleDateString()} –{' '}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      {exp.highlights.map((highlight, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Education</h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {profileData.education.length} schools
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {profileData.education.map((edu) => (
                  <div key={edu.id} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">{edu.school}</p>
                    <h4 className="text-lg font-semibold text-slate-900">{edu.degree}</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      {edu.startDate && new Date(edu.startDate).toLocaleDateString()} –{' '}
                      {edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-sm backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-900">Skills & tools</h3>
              <p className="mt-2 text-sm text-slate-600">Key strengths we highlight prominently on your Follio.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/70 px-4 py-1.5 text-sm font-medium text-indigo-700"
                  >
                    <Code className="h-4 w-4" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default Dashboard;