export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  email: string;
  website?: string;
}

export interface MetricItem {
  label: string;
  value: string;
  detail: string;
}

export interface Profile {
  name: string;
  title: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  availableForWork: boolean;
  statusMessage: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: SocialLinks;
  metrics: MetricItem[];
}

export interface CaseStudy {
  summary: string;
  clientOrContext: string;
  role: string;
  timeline: string;
  architecture: string[];
  challenges: string[];
  metrics: { label: string; value: string }[];
  keyLearnings: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  category: 'Full Stack' | 'Cloud & Systems' | 'AI & Agents' | 'Open Source';
  tags: string[];
  featured: boolean;
  liveUrl: string;
  githubUrl: string;
  coverGradient: string;
  caseStudy: CaseStudy;
  sortOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend & Cloud' | 'Systems & Architecture' | 'DevOps & Tools';
  proficiency: number; // 0 to 100
  experienceYears: number;
  highlight: string;
}

export interface TimelineItem {
  id: string;
  type: 'work' | 'education' | 'achievement';
  title: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  relationship: string;
  featured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  createdAt: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
  replied: boolean;
}

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  timeline: TimelineItem[];
  testimonials: Testimonial[];
  lastUpdated?: string;
}

export interface AnalyticsStats {
  pageViews: number;
  uniqueVisitors: number;
  resumeDownloads: number;
  contactSubmissions: number;
  recentActivity: Array<{
    type: 'visit' | 'contact' | 'resume' | 'project_click';
    timestamp: string;
    detail: string;
  }>;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  adminEmail: string | null;
}
