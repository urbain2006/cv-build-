import { CVData } from "@/src/types";
import { cn } from "@/src/lib/utils";

interface TemplateProps {
  data: CVData;
}

export default function ModernTemplate({ data }: TemplateProps) {
  const { personalInfo, education, experience, skills, projects, certifications } = data;

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-12 shadow-2xl min-h-[1122px]">
      {/* Header */}
      <header className="border-b-4 border-blue-600 pb-8 mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-2">
          {personalInfo.fullName || "Votre Nom"}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="col-span-8 space-y-10">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-4">Profil</h2>
              <p className="text-slate-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-6">Expérience Professionnelle</h2>
              <div className="space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-slate-100">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white" />
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900">{exp.position}</h3>
                      <span className="text-sm font-bold text-slate-400">{exp.duration}</span>
                    </div>
                    <div className="text-blue-600 font-bold text-sm mb-3">{exp.company}</div>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-6">Projets</h2>
              <div className="space-y-6">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <h3 className="font-bold text-slate-900 mb-1">{proj.name}</h3>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2">{proj.technologies}</div>
                    <p className="text-slate-600 text-sm">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-4 space-y-10">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-6">Compétences</h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-bold text-slate-700">{skill.name}</span>
                      <span className="text-xs text-slate-400">{skill.level}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ 
                          width: skill.level === "Expert" ? "100%" : 
                                 skill.level === "Advanced" ? "75%" : 
                                 skill.level === "Intermediate" ? "50%" : "25%" 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-6">Formation</h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="text-sm font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-sm text-blue-600 font-medium">{edu.university}</div>
                    <div className="text-xs font-bold text-slate-400 mt-1">{edu.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-600 uppercase tracking-widest mb-6">Certifications</h2>
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="text-sm font-bold text-slate-900">{cert.name}</div>
                    <div className="text-xs text-slate-500">{cert.organization} • {cert.year}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
