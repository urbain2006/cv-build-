export interface PersonalInfo {
  fullName: string;
  photoUrl?: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string;
}

export interface Education {
  id: string;
  university: string;
  degree: string;
  year: string;
  field: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  duration: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  type: "Technical" | "Professional" | "Language";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  year: string;
}

export interface CVData {
  id?: string;
  userId?: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  lastModified: number;
}

export type TemplateType = "Modern" | "Classic" | "Creative" | "Minimalist" | "Student";
