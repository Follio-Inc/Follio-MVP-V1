# Follio - Professional Portfolio Creator

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Setup and Installation](#setup-and-installation)
4. [API Documentation](#api-documentation)
5. [Component Documentation](#component-documentation)
6. [Database Schema](#database-schema)
7. [Authentication System](#authentication-system)
8. [User Guide](#user-guide)
9. [Developer Guide](#developer-guide)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

Follio is a professional portfolio creation platform that allows users to:
- Upload and parse resume documents (PDF, DOCX)
- Extract structured professional information automatically
- Review and edit parsed data through an intuitive interface
- Display professional profiles in a clean, modern dashboard

### Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Backend/Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (Email/Password, Google OAuth, LinkedIn OAuth)

### Version Information

- **Version**: 0.0.0
- **Last Updated**: October 2025
- **Node Version**: 18.x or higher recommended

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Login   │  │ Upload  │  │  Parsed  │  │Dashboard │ │
│  │ Page    │→ │  Page   │→ │   Info   │→ │          │ │
│  └─────────┘  └─────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Application State                      │
│  - User Authentication State                             │
│  - Parsed Resume Data                                    │
│  - Page Navigation State                                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Supabase Backend                        │
│  ┌──────────────┐         ┌──────────────┐             │
│  │ Auth Service │         │  PostgreSQL  │             │
│  │  - Email/PW  │         │   Database   │             │
│  │  - OAuth     │         │   (profiles) │             │
│  └──────────────┘         └──────────────┘             │
└─────────────────────────────────────────────────────────┘
```

### Directory Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx        # Main dashboard view
│   │   ├── LoginPage.tsx        # Authentication page
│   │   ├── UploadPage.tsx       # Resume upload interface
│   │   ├── ParsedInfoPage.tsx   # Data review/edit page
│   │   └── ui/
│   │       ├── LoadingSpinner.tsx
│   │       └── Toaster.tsx
│   ├── utils/
│   │   └── resumeParser.ts      # Resume parsing logic
│   ├── assets/
│   │   └── follio-icon.svg      # Brand logo
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── supabase/
│   └── migrations/
│       └── 20250930010536_copper_tree.sql  # Database schema
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Setup and Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- A Supabase account and project
- Git (for version control)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd project

# Install dependencies
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**How to get Supabase credentials:**

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project or select an existing one
3. Navigate to Project Settings > API
4. Copy the `URL` (Project URL)
5. Copy the `anon` `public` key (Anonymous Key)

### Step 3: Database Setup

The database migration will be applied automatically through Supabase. The migration creates:
- `profiles` table for storing user data
- Row Level Security policies
- Indexes for performance
- Triggers for automatic timestamps

### Step 4: Authentication Setup

Configure OAuth providers in Supabase (optional):

1. Navigate to Authentication > Providers in Supabase Dashboard
2. Enable Google and/or LinkedIn OAuth
3. Configure redirect URLs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### Step 5: Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Step 6: Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

### Common Setup Issues

**Issue**: "Invalid API key" error
- **Solution**: Verify your `.env` file contains correct Supabase credentials

**Issue**: CORS errors
- **Solution**: Ensure your domain is added to Supabase allowed origins

**Issue**: OAuth not working
- **Solution**: Verify redirect URLs in Supabase auth settings match your application URLs

---

## API Documentation

### Supabase Client

**Location**: `src/App.tsx`

```typescript
export const supabase = createClient(supabaseUrl, supabaseKey);
```

The Supabase client is initialized once and exported for use throughout the application.

### Authentication API

#### Sign Up with Email

```typescript
const { data, error } = await supabase.auth.signUp({
  email: string,
  password: string
});
```

**Parameters:**
- `email` (string): User's email address
- `password` (string): Password (minimum 6 characters)

**Returns:**
- `data.user`: User object if successful
- `error`: Error object if failed

**Example:**
```typescript
const result = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123'
});
```

#### Sign In with Email

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string
});
```

**Parameters:**
- `email` (string): User's registered email
- `password` (string): User's password

**Returns:**
- `data.user`: User object if successful
- `data.session`: Active session object
- `error`: Error object if failed

#### Sign In with OAuth

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google' | 'linkedin_oidc',
  options: {
    redirectTo: string
  }
});
```

**Parameters:**
- `provider`: OAuth provider ('google' or 'linkedin_oidc')
- `options.redirectTo`: URL to redirect after authentication

**Example:**
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

#### Get Current Session

```typescript
const { data: { session } } = await supabase.auth.getSession();
```

**Returns:**
- `session`: Current session object or null
- `session.user`: User information if authenticated

#### Sign Out

```typescript
await supabase.auth.signOut();
```

**Returns:** Promise that resolves when sign out is complete

### Database API

#### Get User Profile

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('resume_data')
  .eq('id', userId)
  .single();
```

**Parameters:**
- `userId` (uuid): The authenticated user's ID

**Returns:**
- `data.resume_data`: Parsed resume data in JSON format
- `error`: Error object if query failed

#### Upsert User Profile

```typescript
const { error } = await supabase
  .from('profiles')
  .upsert({
    id: string,
    email: string,
    name: string,
    resume_data: ParsedResumeData
  });
```

**Parameters:**
- `id` (uuid): User's unique identifier
- `email` (string): User's email address
- `name` (string): User's full name
- `resume_data` (jsonb): Structured resume data

**Example:**
```typescript
await supabase.from('profiles').upsert({
  id: user.id,
  email: user.email,
  name: 'John Doe',
  resume_data: {
    profile: { ... },
    experience: [ ... ],
    education: [ ... ],
    skills: [ ... ]
  }
});
```

---

## Component Documentation

### App Component

**File**: `src/App.tsx`

#### Purpose

Root component that manages application state, authentication, and page routing.

#### State Variables

```typescript
const [currentPage, setCurrentPage] = useState<'login' | 'upload' | 'parsed' | 'dashboard'>('login');
const [user, setUser] = useState<User | null>(null);
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
const [loading, setLoading] = useState(true);
```

#### Key Functions

##### `checkAuth()`

Checks for existing authentication session on component mount.

**Flow:**
1. Retrieves current session from Supabase
2. If session exists, sets user state
3. Checks database for existing profile data
4. Navigates to appropriate page based on data presence

##### `handleLogin(userData: User)`

Handles successful authentication.

**Parameters:**
- `userData`: User object containing id, email, and name

**Actions:**
- Sets user state
- Navigates to upload page

##### `handleUpload(file: File)`

Handles resume file upload.

**Parameters:**
- `file`: Uploaded resume file

**Actions:**
- Stores file in state
- Simulates 1.5s parsing delay
- Navigates to parsed info page

##### `handleSave(data: ParsedResumeData)`

Saves parsed resume data to database.

**Parameters:**
- `data`: Structured resume data

**Actions:**
- Upserts profile data to Supabase
- Updates local state
- Navigates to dashboard

##### `handleLogout()`

Signs user out and resets application state.

**Actions:**
- Calls Supabase sign out
- Clears all state variables
- Navigates to login page

#### Type Definitions

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
}

interface ParsedResumeData {
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
```

---

### LoginPage Component

**File**: `src/components/LoginPage.tsx`

#### Purpose

Provides authentication interface with email/password and OAuth options.

#### Props

```typescript
interface LoginPageProps {
  onLogin: (user: User) => void;
}
```

#### State

```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isLogin, setIsLogin] = useState(true);  // Toggle between login/signup
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

#### Key Functions

##### `handleEmailAuth(e: React.FormEvent)`

Handles email/password authentication.

**Parameters:**
- `e`: Form submit event

**Validation:**
- Email must be valid format
- Password must be at least 6 characters

**Actions:**
- Calls `signInWithPassword` or `signUp` based on mode
- Handles errors and displays user feedback
- Calls `onLogin` callback on success

##### `handleSocialAuth(provider: 'google' | 'linkedin_oidc')`

Initiates OAuth authentication flow.

**Parameters:**
- `provider`: OAuth provider name

**Actions:**
- Opens OAuth popup/redirect
- Handles redirect after authentication
- Displays errors if OAuth fails

#### Error Handling

Common error messages:
- "Invalid login credentials" - Wrong email/password
- "User already registered" - Email already in use during signup
- "Social login failed" - OAuth provider error

---

### UploadPage Component

**File**: `src/components/UploadPage.tsx`

#### Purpose

Provides drag-and-drop interface for resume upload with file validation.

#### Props

```typescript
interface UploadPageProps {
  onUpload: (file: File) => void;
  user: User | null;
}
```

#### State

```typescript
const [dragActive, setDragActive] = useState(false);
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);
const [error, setError] = useState('');
```

#### Key Functions

##### `handleDrag(e: React.DragEvent)`

Manages drag and drop visual feedback.

**Parameters:**
- `e`: Drag event

**Actions:**
- Sets `dragActive` state based on event type
- Provides visual cues for valid drop zone

##### `handleDrop(e: React.DragEvent)`

Processes dropped files.

**Parameters:**
- `e`: Drop event containing file data

**Actions:**
- Extracts file from event
- Passes to `handleFile` for validation

##### `handleFile(file: File)`

Validates uploaded file.

**Validation Rules:**
- File type must be: PDF, DOCX, or DOC
- File size must be under 10MB

**Parameters:**
- `file`: File object to validate

**Accepted MIME Types:**
- `application/pdf`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- `application/msword`

**Error Messages:**
- "Please upload a PDF or DOCX file" - Invalid file type
- "File size must be less than 10MB" - File too large

##### `processUpload()`

Initiates resume parsing process.

**Actions:**
- Simulates 2s processing delay
- Calls `onUpload` callback with file
- Shows loading animation

---

### ParsedInfoPage Component

**File**: `src/components/ParsedInfoPage.tsx`

#### Purpose

Displays parsed resume data in editable form with collapsible sections.

#### Props

```typescript
interface ParsedInfoPageProps {
  uploadedFile: File | null;
  onSave: (data: ParsedResumeData) => void;
  onBack: () => void;
}
```

#### State

```typescript
const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
const [loading, setLoading] = useState(true);
const [expandedSections, setExpandedSections] = useState({
  profile: true,
  experience: true,
  education: true,
  skills: true
});
```

#### Key Functions

##### `toggleSection(section: keyof typeof expandedSections)`

Toggles visibility of data sections.

**Parameters:**
- `section`: Section name to toggle

##### `updateProfile(field: string, value: string)`

Updates profile information fields.

**Parameters:**
- `field`: Profile field name
- `value`: New value

**Editable Fields:**
- name
- headline
- location
- email
- phone

##### `addExperience()`

Adds new work experience entry.

**Creates:**
```typescript
{
  id: Date.now().toString(),
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  highlights: []
}
```

##### `updateExperience(id: string, field: string, value: string | string[])`

Updates specific experience entry.

**Parameters:**
- `id`: Experience entry ID
- `field`: Field to update
- `value`: New value

##### `removeExperience(id: string)`

Removes experience entry.

**Parameters:**
- `id`: Experience entry ID to remove

##### `addEducation()`

Adds new education entry.

##### `updateEducation(id: string, field: string, value: string)`

Updates specific education entry.

##### `removeEducation(id: string)`

Removes education entry.

##### `addSkill(skill: string)`

Adds new skill to list.

**Parameters:**
- `skill`: Skill name (trimmed)

**Validation:**
- Skill must not be empty after trimming

##### `removeSkill(index: number)`

Removes skill at specified index.

##### `handleSave()`

Saves all edited data to database.

**Actions:**
- Validates data completeness
- Calls `onSave` callback with updated data
- Navigates to dashboard on success

---

### Dashboard Component

**File**: `src/components/Dashboard.tsx`

#### Purpose

Displays user's professional profile in a polished dashboard layout.

#### Props

```typescript
interface DashboardProps {
  user: UserType | null;
  parsedData: ParsedResumeData | null;
  onLogout: () => void;
}
```

#### State

```typescript
const [profileData, setProfileData] = useState<ParsedResumeData | null>(parsedData);
const [loading, setLoading] = useState(!parsedData);
```

#### Layout Sections

##### Header
- Follio logo and branding
- User greeting
- Edit Profile button (placeholder)
- Logout button

##### Profile Summary Card
- User avatar (icon)
- Full name
- Professional headline
- Contact information (location, email, phone)
- Gradient background (cyan to teal)

##### Stats Cards
Three statistics cards displaying:
1. Work Experience count (with Building icon)
2. Education count (with GraduationCap icon)
3. Skills count (with Code icon)

##### Experience Section
- Vertical timeline layout
- Company name and role
- Date ranges
- Cyan accent color

##### Education Section
- Vertical timeline layout
- School name and degree
- Date ranges
- Green accent color

##### Skills Section
- Pill-style skill badges
- Gradient background (purple to cyan)
- Responsive grid layout

##### Next Steps Section
- Orange accent color
- Suggested actions for users
- Future feature previews

---

## Database Schema

### Profiles Table

**Table Name**: `profiles`

#### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PRIMARY KEY, REFERENCES auth.users | User's unique identifier |
| email | text | UNIQUE, NOT NULL | User's email address |
| name | text | - | User's full name |
| resume_data | jsonb | - | Structured resume data |
| created_at | timestamptz | DEFAULT now() | Record creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

#### Row Level Security Policies

**1. Users can read own profile**
```sql
FOR SELECT TO authenticated
USING (auth.uid() = id)
```

**2. Users can create own profile**
```sql
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id)
```

**3. Users can update own profile**
```sql
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id)
```

#### Indexes

- `profiles_email_idx`: Index on email column for faster lookups

#### Triggers

**update_profiles_updated_at**
- Automatically updates `updated_at` timestamp on row modification
- Executes before UPDATE operations

#### Resume Data JSON Structure

```json
{
  "profile": {
    "name": "string",
    "headline": "string",
    "location": "string",
    "email": "string",
    "phone": "string"
  },
  "experience": [
    {
      "id": "string",
      "company": "string",
      "role": "string",
      "startDate": "ISO date string",
      "endDate": "ISO date string",
      "highlights": ["string"]
    }
  ],
  "education": [
    {
      "id": "string",
      "school": "string",
      "degree": "string",
      "startDate": "ISO date string",
      "endDate": "ISO date string"
    }
  ],
  "skills": ["string"]
}
```

---

## Authentication System

### Authentication Flow

#### Email/Password Flow

```
1. User enters credentials
   ↓
2. Frontend validates input
   ↓
3. Supabase Auth processes request
   ↓
4. Session created on success
   ↓
5. User redirected to Upload page
```

#### OAuth Flow

```
1. User clicks OAuth provider button
   ↓
2. Redirected to provider login
   ↓
3. User authorizes application
   ↓
4. Provider redirects to callback URL
   ↓
5. Supabase processes OAuth response
   ↓
6. Session created automatically
   ↓
7. User redirected to Upload page
```

### Session Management

#### Session Persistence

Sessions are automatically managed by Supabase:
- Stored in browser's local storage
- Automatically refreshed when expired
- Cleared on logout

#### Session Validation

On application load:
1. App checks for existing session
2. If valid, restores user state
3. Fetches profile data from database
4. Redirects to appropriate page

#### Security Considerations

- Passwords must be minimum 6 characters
- Row Level Security ensures data isolation
- OAuth tokens stored securely by Supabase
- HTTPS required for production deployments

---

## User Guide

### Getting Started

#### 1. Create an Account

**Option A: Email Registration**
1. Open Follio application
2. Click "Don't have an account? Sign up"
3. Enter email and password (6+ characters)
4. Click "Create account"
5. You'll be automatically logged in

**Option B: OAuth Registration**
1. Open Follio application
2. Click "Continue with Google" or "Continue with LinkedIn"
3. Authorize Follio in OAuth popup
4. You'll be automatically logged in

#### 2. Upload Your Resume

1. After login, you'll see the Upload page
2. Choose one method:
   - **Drag and Drop**: Drag your resume file into the upload area
   - **File Browser**: Click "Choose File" and select your resume
3. Supported formats: PDF, DOCX, DOC (max 10MB)
4. Click "Parse Resume" to begin processing

#### 3. Review and Edit Parsed Data

1. After parsing completes, review extracted information
2. Each section can be expanded/collapsed:
   - **Profile Information**: Name, location, headline, contact details
   - **Work Experience**: Companies, roles, dates
   - **Education**: Schools, degrees, dates
   - **Skills**: List of technical and soft skills

3. Edit any fields as needed:
   - Click in text fields to modify values
   - Use date pickers for date fields
   - Add or remove experience/education entries
   - Add or remove skills

4. Click "Save Profile" when satisfied

#### 4. View Your Dashboard

Your dashboard displays:
- Professional profile summary with contact info
- Statistics cards showing counts of experience, education, and skills
- Detailed work experience timeline
- Education history
- Skills showcase
- Suggested next steps

#### 5. Logout

Click the "Logout" button in the dashboard header to sign out securely.

### Common Use Cases

#### Updating Your Profile

Currently, profile editing is done through the upload/parse workflow:
1. Re-upload your resume
2. Make edits in the parsed info page
3. Save to update your profile

#### Recovering Your Account

If you forget your password:
1. Use the password reset feature (to be implemented)
2. Or create a new account with a different email

---

## Developer Guide

### Contributing Guidelines

#### Code Style

- Use TypeScript for all new files
- Follow existing naming conventions
- Use functional components with hooks
- Keep components focused and single-purpose
- Add proper TypeScript types for all props and state

#### Component Structure

```typescript
// 1. Imports
import React, { useState } from 'react';
import { Icon } from 'lucide-react';

// 2. Type definitions
interface ComponentProps {
  prop1: string;
  prop2?: number;
}

// 3. Component definition
const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 4. State declarations
  const [state, setState] = useState<Type>(initialValue);

  // 5. Helper functions
  const helperFunction = () => {
    // logic
  };

  // 6. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);

  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 8. Export
export default Component;
```

#### Styling Conventions

- Use Tailwind utility classes
- Keep responsive breakpoints consistent:
  - `md:` for tablets (768px)
  - `lg:` for desktops (1024px)
- Use gradient colors: `from-cyan-500 to-teal-500`
- Maintain consistent spacing: 4px increments

#### Git Workflow

```bash
# Create feature branch
git checkout -b feature/description

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push and create pull request
git push origin feature/description
```

#### Commit Message Format

```
type: description

types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Formatting, styling
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks
```

### Testing Procedures

#### Manual Testing Checklist

**Authentication:**
- [ ] Email signup with valid credentials
- [ ] Email login with existing account
- [ ] Email signup with existing email shows error
- [ ] Login with wrong password shows error
- [ ] Google OAuth flow completes successfully
- [ ] LinkedIn OAuth flow completes successfully
- [ ] Logout clears session and redirects to login

**Upload:**
- [ ] Drag and drop PDF file works
- [ ] Drag and drop DOCX file works
- [ ] File picker works for all formats
- [ ] Files over 10MB show error
- [ ] Invalid file types show error
- [ ] Upload progress shows loading state

**Parsing:**
- [ ] Parsing shows loading state
- [ ] All sections populate with data
- [ ] Name, email, phone display correctly
- [ ] Experience entries have all fields
- [ ] Education entries have all fields
- [ ] Skills array populates

**Editing:**
- [ ] Profile fields can be edited
- [ ] Experience can be added
- [ ] Experience can be removed
- [ ] Education can be added
- [ ] Education can be removed
- [ ] Skills can be added
- [ ] Skills can be removed
- [ ] Save button persists changes

**Dashboard:**
- [ ] Profile summary displays correctly
- [ ] Statistics cards show accurate counts
- [ ] Experience timeline renders properly
- [ ] Education section renders properly
- [ ] Skills display in grid
- [ ] Logout button works

#### Type Checking

```bash
npm run typecheck
```

Ensure no TypeScript errors before committing.

#### Linting

```bash
npm run lint
```

Fix all linting errors before committing.

### Deployment Instructions

#### Build Production Bundle

```bash
npm run build
```

Output directory: `dist/`

#### Preview Production Build

```bash
npm run preview
```

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Environment Variables for Production

Ensure these are set in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

#### Post-Deployment Checklist

- [ ] Verify OAuth redirect URLs include production domain
- [ ] Test authentication flows in production
- [ ] Verify database connections work
- [ ] Check browser console for errors
- [ ] Test on multiple devices/browsers
- [ ] Verify SSL certificate is valid

### Performance Optimization

#### Image Optimization

The Follio icon is SVG for scalability. For additional images:
- Use WebP format when possible
- Compress images before upload
- Use lazy loading for off-screen images

#### Bundle Size

Current production bundle: ~312KB (gzipped: ~89KB)

To reduce:
- Avoid importing entire icon libraries
- Use dynamic imports for large components
- Tree-shake unused dependencies

#### Database Query Optimization

- Indexes created on frequently queried columns
- Use `.single()` when expecting one result
- Use `.select('columns')` to fetch only needed data
- Consider caching profile data in local state

---

## Troubleshooting

### Common Issues

#### Issue: "Invalid API key" Error

**Symptoms:**
- Unable to connect to Supabase
- Authentication fails immediately
- Database queries fail

**Solutions:**
1. Verify `.env` file exists in project root
2. Check environment variables are correct:
   ```bash
   cat .env
   ```
3. Restart development server after changing `.env`
4. Ensure variables start with `VITE_` prefix
5. Verify keys in Supabase dashboard match `.env`

---

#### Issue: OAuth Redirect Not Working

**Symptoms:**
- OAuth popup closes without logging in
- "Invalid redirect URL" error
- Stuck on loading after OAuth

**Solutions:**
1. Add redirect URL to Supabase Auth settings:
   - Go to Authentication > URL Configuration
   - Add: `http://localhost:5173/auth/callback` (dev)
   - Add: `https://yourdomain.com/auth/callback` (prod)
2. Ensure protocol matches (http vs https)
3. Check browser blocks popups
4. Clear browser cache and cookies

---

#### Issue: Resume Parsing Fails

**Symptoms:**
- "Failed to parse resume" message
- Stuck on parsing loading screen
- Empty data in parsed info page

**Solutions:**
1. This is currently a mock parser returning sample data
2. Verify file format is PDF, DOCX, or DOC
3. Ensure file is not corrupted
4. Check file size is under 10MB
5. Try re-uploading the file

---

#### Issue: Profile Data Not Saving

**Symptoms:**
- Changes don't persist after logout
- Dashboard shows outdated information
- "Save Profile" button doesn't work

**Solutions:**
1. Check browser console for errors
2. Verify user is authenticated:
   ```javascript
   supabase.auth.getSession()
   ```
3. Check Supabase database logs
4. Verify RLS policies are enabled
5. Ensure user ID matches authenticated user

---

#### Issue: Dashboard Not Loading

**Symptoms:**
- Infinite loading spinner
- "No profile data found" message
- Blank dashboard page

**Solutions:**
1. Verify profile exists in database:
   - Open Supabase dashboard
   - Navigate to Table Editor
   - Check `profiles` table for user's record
2. Clear browser cache
3. Try logging out and back in
4. Check network tab for failed requests
5. Verify database connection

---

#### Issue: Styling Not Applied

**Symptoms:**
- Components appear unstyled
- Tailwind classes not working
- Layout broken

**Solutions:**
1. Verify Tailwind is configured:
   ```bash
   cat tailwind.config.js
   ```
2. Check CSS import in `main.tsx`:
   ```typescript
   import './index.css'
   ```
3. Restart development server
4. Clear build cache:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```
5. Verify PostCSS configuration exists

---

#### Issue: TypeScript Errors

**Symptoms:**
- Red underlines in code editor
- Build fails with type errors
- `npm run typecheck` shows errors

**Solutions:**
1. Install type definitions:
   ```bash
   npm install --save-dev @types/react @types/react-dom
   ```
2. Verify `tsconfig.json` is correct
3. Restart TypeScript server in editor
4. Check import statements are correct
5. Ensure all props have proper types

---

### Debug Mode

Enable verbose logging:

```typescript
// In App.tsx, add console logs
console.log('Current page:', currentPage);
console.log('User state:', user);
console.log('Parsed data:', parsedData);
```

Check Supabase logs:
1. Open Supabase dashboard
2. Navigate to Database > Logs
3. Filter by table: `profiles`
4. Check for failed queries

---

### Performance Issues

#### Slow Loading

**Solutions:**
1. Check network speed
2. Verify Supabase region proximity
3. Enable browser caching
4. Optimize bundle size
5. Use React DevTools Profiler

#### High Memory Usage

**Solutions:**
1. Check for memory leaks in useEffect
2. Properly cleanup subscriptions
3. Avoid storing large files in state
4. Use React.memo for expensive components

---

### Getting Help

**Resources:**
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- React Documentation: [react.dev](https://react.dev)
- Tailwind CSS Docs: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- Vite Documentation: [vitejs.dev](https://vitejs.dev)

**Community:**
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- React Community: [reactjs.org/community](https://reactjs.org/community)

---

## Best Practices

### Security

- Never commit `.env` file to version control
- Use Row Level Security for all database tables
- Validate all user input on frontend and backend
- Use HTTPS in production
- Implement rate limiting for auth endpoints
- Regularly update dependencies for security patches

### Performance

- Lazy load components when possible
- Memoize expensive computations
- Use indexes for database queries
- Optimize images and assets
- Implement proper loading states
- Cache API responses when appropriate

### User Experience

- Provide clear error messages
- Show loading indicators for async operations
- Validate forms before submission
- Use optimistic UI updates
- Implement proper keyboard navigation
- Ensure mobile responsiveness

### Code Quality

- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names
- Maintain consistent code style
- Write reusable components

---

## Limitations and Known Issues

### Current Limitations

1. **Resume Parsing**: Currently uses mock parser that returns sample data. Real PDF/DOCX parsing not yet implemented.

2. **Profile Editing**: No dedicated edit mode in dashboard. Users must re-upload resume to update profile.

3. **File Storage**: Resume files not persisted. Only parsed data is stored in database.

4. **Multi-language Support**: Application only supports English.

5. **Profile Themes**: No customization options for dashboard appearance.

6. **Portfolio Sharing**: No public portfolio URLs or sharing functionality.

7. **Export Features**: Cannot export resume to different formats.

### Known Issues

1. **OAuth Redirect**: May require page refresh after OAuth callback in some browsers.

2. **Date Display**: Dates display in browser's locale format, may not be consistent.

3. **File Validation**: Limited MIME type checking may allow invalid files.

4. **Experience Highlights**: Parsed but not displayed or editable in current version.

---

## Future Roadmap

### Planned Features

- Real resume parsing with AI/ML
- In-dashboard profile editing
- Custom portfolio themes
- Public portfolio URLs
- Multi-language support
- PDF/DOCX export
- File upload to cloud storage
- Portfolio analytics
- Custom domains for portfolios
- Team/company accounts
- Resume templates
- Cover letter generation
- Job application tracking

---

## License

This project is private and proprietary. All rights reserved.

---

## Changelog

### Version 0.0.0 (October 2025)

**Initial Release**
- Email/password authentication
- Google OAuth integration
- LinkedIn OAuth integration
- Resume upload with drag-and-drop
- Mock resume parsing
- Profile data editing
- Professional dashboard
- Supabase backend integration
- Row Level Security implementation
- Responsive design
- Tailwind CSS styling

---

*Last Updated: October 6, 2025*
*Document Version: 1.0.0*
