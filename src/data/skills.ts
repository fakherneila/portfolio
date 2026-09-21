import type { SkillCategory } from '@/types/skill'

export const SKILLS: SkillCategory[] = [
  {
    id: 'languages',
    labelKey: 'languages',
    skills: [
      { name: 'TypeScript', slug: 'typescript', icon: 'code' },
      { name: 'JavaScript', slug: 'javascript', icon: 'code' },
      { name: 'Python', slug: 'python', icon: 'code' },
      { name: 'Java', slug: 'java', icon: 'code' },
      { name: 'C', slug: 'c', icon: 'code' },
      { name: 'C++', slug: 'cpp', icon: 'code' },
    ],
  },
  {
    id: 'frontend',
    labelKey: 'frameworks',
    skills: [
      { name: 'React 18', slug: 'react', icon: 'code' },
      { name: 'Angular', slug: 'angular', icon: 'code' },
      { name: 'Vite', slug: 'vite', icon: 'zap' },
      { name: 'Tailwind CSS', slug: 'tailwind', icon: 'palette' },
      { name: 'TanStack Query', slug: 'tanstack', icon: 'layers' },
      { name: 'Recharts', slug: 'recharts', icon: 'trending-up' },
    ],
  },
  {
    id: 'backend',
    labelKey: 'backend',
    skills: [
      { name: 'Node.js', slug: 'node', icon: 'server' },
      { name: 'Express', slug: 'express', icon: 'server' },
      { name: 'Spring Boot', slug: 'spring', icon: 'leaf' },
      { name: 'Django', slug: 'django', icon: 'server' },
      { name: 'Symfony', slug: 'symfony', icon: 'server' },
      { name: 'Airtable API', slug: 'airtable', icon: 'table' },
      { name: 'Appwrite', slug: 'appwrite', icon: 'cloud' },
    ],
  },
  {
    id: 'databases',
    labelKey: 'databases',
    skills: [
      { name: 'PostgreSQL', slug: 'postgres', icon: 'database' },
      { name: 'MongoDB', slug: 'mongodb', icon: 'database' },
      { name: 'SQL', slug: 'sql', icon: 'database' },
      { name: 'PL/SQL', slug: 'plsql', icon: 'database' },
      { name: 'SQLite', slug: 'sqlite', icon: 'database' },
    ],
  },
  {
    id: 'devops',
    labelKey: 'devops',
    skills: [
      { name: 'Docker', slug: 'docker', icon: 'container' },
      { name: 'Git', slug: 'git', icon: 'git-branch' },
      { name: 'GitHub', slug: 'github', icon: 'github' },
      { name: 'GitLab', slug: 'gitlab', icon: 'git-branch' },
      { name: 'Microsoft Azure', slug: 'azure', icon: 'cloud' },
      { name: 'Render', slug: 'render', icon: 'server' },
      { name: 'cPanel', slug: 'cpanel', icon: 'server' },
    ],
  },
  {
    id: 'ai',
    labelKey: 'ai',
    skills: [
      { name: 'Groq (Llama 3.3)', slug: 'groq', icon: 'bot' },
      { name: 'Facebook Prophet', slug: 'prophet', icon: 'trending-up' },
      { name: 'n8n Automation', slug: 'n8n', icon: 'workflow' },
    ],
  },
  {
    id: 'testing',
    labelKey: 'testing',
    skills: [
      { name: 'Vitest', slug: 'vitest', icon: 'test-tube' },
      { name: 'Testing Library', slug: 'testinglibrary', icon: 'test-tube' },
      { name: 'Playwright', slug: 'playwright', icon: 'test-tube' },
      { name: 'JUnit', slug: 'junit', icon: 'test-tube' },
      { name: 'Selenium', slug: 'selenium', icon: 'test-tube' },
      { name: 'Robot Framework', slug: 'robotframework', icon: 'bot' },
      { name: 'k6', slug: 'k6', icon: 'activity' },
    ],
  },
  {
    id: 'design',
    labelKey: 'design',
    skills: [
      { name: 'Figma', slug: 'figma', icon: 'figma' },
      { name: 'Postman', slug: 'postman', icon: 'send' },
      { name: 'UI/UX Design', icon: 'palette' },
    ],
  },
]
