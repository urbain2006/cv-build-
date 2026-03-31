import { CVData } from "@/src/types";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

export default function ClassicTemplate({ data }: { data: CVData }) {
  const { personalInfo, education, experience, skills, projects, certifications } = data;

  return (
    <div className="bg-white p-12 shadow-inner min-h-[1100px] font-serif text-slate-900">
      {/* Header */}
      <header className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-4">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail size={14} />
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              {personalInfo.address}
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin size={14} />
              {personalInfo.linkedin.replace('https://', '')}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Résumé Professionnel</h2>
          <p className="text-sm leading-relaxed text-justify">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 pb-1">Expérience Professionnelle</h2>
          <div className="space-y-6">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-base">{exp.position}</h3>
                  <span className="text-sm italic">{exp.duration}</span>
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-semibold text-sm">{exp.company}</span>
                </div>
                <p className="text-sm leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 pb-1">Formation</h2>
          <div className="space-y-4">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-sm">{edu.degree} en {edu.field}</h3>
                  <span className="text-sm italic">{edu.year}</span>
                </div>
                <div className="text-sm">{edu.university}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Compétences</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm font-bold">{skill.name}</span>
                <span className="text-xs text-slate-400 italic">({skill.level})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects & Certifications */}
      <div className="grid grid-cols-2 gap-12">
        {projects.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Projets</h2>
            <div className="space-y-3">
              {projects.map((project, i) => (
                <div key={i}>
                  <h3 className="font-bold text-sm">{project.name}</h3>
                  <p className="text-xs leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-3 pb-1">Certifications</h2>
            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={i} className="flex justify-between items-baseline">
                  <span className="text-sm font-bold">{cert.name}</span>
                  <span className="text-xs italic">{cert.year}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
