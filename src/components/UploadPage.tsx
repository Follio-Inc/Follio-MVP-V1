import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';
import type { User } from '../App';
import BrandHeader from './layout/BrandHeader';
import AppFooter from './layout/AppFooter';

interface UploadPageProps {
  onUpload: (file: File) => Promise<void> | void;
  user: User | null;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUpload, user }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setUploadedFile(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
  };

  const processUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    setError('');
    try {
      await onUpload(uploadedFile);
    } catch (error) {
      console.error('Upload processing failed:', error);
      const message = error instanceof Error ? error.message : 'We could not parse that resume. Please try a different file.';
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const headerAction = user ? (
    <div className="hidden sm:flex items-center gap-3 rounded-xl border border-primary/10 bg-white px-4 py-2 text-sm text-primary">
      Signed in as
      <span className="font-medium text-primary">{user.name || user.email}</span>
    </div>
  ) : null;

  return (
    <div className="flex min-h-screen flex-col bg-secondary text-primary font-sans selection:bg-accent/30">
      <BrandHeader subdued action={headerAction} />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-16 px-6 py-24 animate-fade-in">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary/70">
              Step 1 of 3 · Upload
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-serif font-medium leading-tight tracking-tight text-primary md:text-5xl">
                Upload your resume to craft your <span className="text-primary">Follio presence</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-primary/70">
                Drop in your latest resume and we will translate it into a polished, on-brand digital portfolio. Keep your story consistent across every touchpoint.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="group rounded-2xl border border-primary/5 bg-surface p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary/60">
                  <Upload className="h-3.5 w-3.5" />
                  Smart import
                </div>
                <p className="text-sm leading-relaxed text-primary/60">
                  Upload PDF or DOCX files and let our parser structure your experience, education, and highlights instantly.
                </p>
              </div>
              <div className="group rounded-2xl border border-primary/5 bg-surface p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary/60">
                  <Sparkles className="h-3.5 w-3.5" />
                  Guided polish
                </div>
                <p className="text-sm leading-relaxed text-primary/60">
                  Use the next steps to fine-tune messaging, imagery, and calls to action that match your brand voice.
                </p>
              </div>
              <div className="group rounded-2xl border border-primary/5 bg-surface p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary/60">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Secure storage
                </div>
                <p className="text-sm leading-relaxed text-primary/60">
                  Your documents are encrypted at rest with Supabase so your credentials and achievements stay protected.
                </p>
              </div>
              <div className="group rounded-2xl border border-primary/5 bg-surface p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary/60">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Ready to publish
                </div>
                <p className="text-sm leading-relaxed text-primary/60">
                  In just a few clicks, publish a responsive Follio that is easy to share with clients, recruiters, and teams.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-surface p-10 shadow-sm ring-1 ring-primary/5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif font-medium tracking-tight text-primary">Upload resume</h2>
                <p className="mt-1 text-sm font-medium text-primary/50">PDF or DOCX · up to 10MB</p>
              </div>
              <div className="rounded-full bg-accent/20 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-primary/60">
                Auto-parse enabled
              </div>
            </div>
            {!uploadedFile ? (
              <div
                className={`group relative overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${dragActive
                  ? 'border-cyan-400 bg-cyan-50/50 scale-[1.02]'
                  : 'border-slate-200/80 hover:border-cyan-300 hover:bg-slate-50/50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <div
                    className={`rounded-2xl p-5 transition-all duration-300 ${dragActive
                      ? 'bg-accent text-primary scale-110'
                      : 'bg-primary/10 text-primary/40 group-hover:bg-accent/30 group-hover:text-primary group-hover:scale-110'
                      }`}
                  >
                    <Upload className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-medium text-primary">Drag and drop your resume</h3>
                    <p className="mt-2 text-sm font-medium text-primary/50">or click below to choose a file from your device</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-xl bg-primary px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95">
                    <Upload className="h-4 w-4" />
                    Choose file
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileInput}
                    />
                  </label>
                  <p className="text-xs font-medium text-primary/40">Supported formats: PDF, DOCX (max 10MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-center">
                <div className="inline-flex items-center gap-4 rounded-2xl border border-primary/10 bg-accent/20 px-6 py-4 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">File uploaded successfully</p>
                    <p className="text-xs font-medium text-primary/60">{uploadedFile.name}</p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="ml-2 rounded-full p-2 text-primary/40 transition hover:bg-secondary hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <FileText className="h-4 w-4" />
                    <span>{uploadedFile.name}</span>
                    <span className="text-slate-400">·</span>
                    <span>{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>

                <button
                  onClick={processUpload}
                  disabled={uploading}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-base font-medium text-white transition-all hover:bg-primary/90 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Parse resume & build profile
                    </>
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm font-medium text-red-600">
                <X className="h-5 w-5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-12 shadow-sm ring-1 ring-primary/5 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-4 text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-primary shadow-sm md:mx-0">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-medium text-primary">Smart parsing</h3>
              <p className="text-[15px] leading-relaxed text-primary/60">
                Advanced AI extracts your experience, education, and signature skills automatically so you can focus on storytelling.
              </p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-primary shadow-sm md:mx-0">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-medium text-primary">Effortless editing</h3>
              <p className="text-[15px] leading-relaxed text-primary/60">
                Review every section with inline controls that match our polished design system—no clunky forms or modals.
              </p>
            </div>
            <div className="space-y-4 text-center md:text-left">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-primary shadow-sm md:mx-0">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-serif font-medium text-primary">Portfolio ready</h3>
              <p className="text-[15px] leading-relaxed text-primary/60">
                Instantly transform your documents into a shareable Follio site with responsive layouts and branded theming.
              </p>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
};

export default UploadPage;