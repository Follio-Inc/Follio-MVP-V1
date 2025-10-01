import type { ParsedResumeData } from '../App';

export const mockParseResume = (file: File): ParsedResumeData => {
  // This is a mock parser that returns sample data
  // In a real application, this would process the actual file content
  
  const mockData: ParsedResumeData = {
    profile: {
      name: 'Alex Johnson',
      headline: 'Senior Software Developer',
      location: 'San Francisco, CA',
      email: 'alex.johnson@example.com',
      phone: '(555) 123-4567'
    },
    experience: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        role: 'Senior Software Developer',
        startDate: '2021-03-01',
        endDate: '',
        highlights: [
          'Led development of microservices architecture',
          'Improved application performance by 40%',
          'Mentored junior developers'
        ]
      },
      {
        id: '2',
        company: 'StartupXYZ',
        role: 'Full Stack Developer',
        startDate: '2019-01-15',
        endDate: '2021-02-28',
        highlights: [
          'Built responsive web applications',
          'Implemented CI/CD pipelines',
          'Collaborated with design team'
        ]
      }
    ],
    education: [
      {
        id: '1',
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        startDate: '2015-09-01',
        endDate: '2019-05-15'
      }
    ],
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'PostgreSQL',
      'Git',
      'Agile'
    ]
  };

  // Simulate some randomization based on file name
  if (file.name.toLowerCase().includes('john')) {
    mockData.profile.name = 'John Smith';
    mockData.profile.headline = 'Frontend Developer';
  } else if (file.name.toLowerCase().includes('sarah')) {
    mockData.profile.name = 'Sarah Williams';
    mockData.profile.headline = 'Data Scientist';
  }

  return mockData;
};