import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import UploadPage from './components/UploadPage';
import ParsedInfoPage from './components/ParsedInfoPage';
import Dashboard from './components/Dashboard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Toaster } from './components/ui/Toaster';
import { supabase, isSupabaseConfigured } from './utils/supabaseClient';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface ParsedResumeData {
  profile: {
    name: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
  };
  experience: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    highlights: string[];
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'upload' | 'parsed' | 'dashboard'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setConfigError('Supabase environment variables are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const bootstrapSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        if (!isMounted) return;

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
          });

          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('resume_data')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (data?.resume_data) {
            setParsedData(data.resume_data);
            setCurrentPage('dashboard');
          } else {
            setCurrentPage('upload');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (isMounted) {
          setConfigError('We could not reach Supabase. Please verify your Supabase configuration.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const { data: authSubscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        });
        setCurrentPage('upload');
      } else {
        setUser(null);
        setParsedData(null);
        setCurrentPage('login');
      }
    });

    bootstrapSession();

    return () => {
      isMounted = false;
      authSubscription?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('upload');
  };

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    // Simulate parsing delay
    setTimeout(() => {
      setCurrentPage('parsed');
    }, 1500);
  };

  const handleSave = async (data: ParsedResumeData) => {
    if (!user) {
      return;
    }

    if (!supabase) {
      setConfigError('Supabase is not available. Please check your configuration.');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          name: data.profile.name,
          resume_data: data
        });

      if (error) {
        throw error;
      }

      setParsedData(data);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Save error:', error);
      setConfigError('Unable to save your profile to Supabase. Please try again.');
    }
  };

  const handleLogout = async () => {
    if (!supabase) {
      setUser(null);
      setUploadedFile(null);
      setParsedData(null);
      setCurrentPage('login');
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setUploadedFile(null);
    setParsedData(null);
    setCurrentPage('login');
  };

  if (configError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 p-6 text-center">
        <div className="max-w-xl bg-white shadow-lg rounded-2xl p-8 border border-red-100">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Configuration required</h1>
          <p className="text-gray-700 mb-6">{configError}</p>
          <p className="text-sm text-gray-500">
            Update the deployment environment with your Supabase credentials and redeploy to restore full functionality.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
        />
      )}
      {currentPage === 'upload' && <UploadPage onUpload={handleUpload} user={user} />}
      {currentPage === 'parsed' && (
        <ParsedInfoPage
          uploadedFile={uploadedFile}
          onSave={handleSave}
          onBack={() => setCurrentPage('upload')}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard
          user={user}
          parsedData={parsedData}
          onLogout={handleLogout}
        />
      )}
      <Toaster />
    </div>
  );
}

export default App;