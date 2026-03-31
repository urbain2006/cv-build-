import { useState, useEffect } from "react";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  FolderKanban, 
  Award, 
  Sparkles, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Download,
  Eye,
  Layout,
  Camera,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { CVData, PersonalInfo, Education, Experience, Skill, Project, Certification } from "@/src/types";
import { enhanceText, generateProfessionalSummary } from "@/src/lib/gemini";
import { storage } from "@/src/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/src/AuthContext";

interface CVEditorProps {
  initialData?: CVData;
  onSave: (data: CVData) => void;
}

import CVPreview from "./CVPreview";

const STEPS = [
  { id: "personal", label: "Infos Personnelles", icon: User },
  { id: "education", label: "Formation", icon: GraduationCap },
  { id: "experience", label: "Expérience", icon: Briefcase },
  { id: "skills", label: "Compétences", icon: Wrench },
  { id: "projects", label: "Projets", icon: FolderKanban },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "preview", label: "Aperçu & Export", icon: Eye },
];

import CVTips from "@/src/components/CVTips";

export default function CVEditor({ initialData, onSave }: CVEditorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CVData>(initialData || {
    title: "Mon CV sans titre",
    templateId: "modern",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    lastModified: Date.now(),
  });

  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);
  const [isApplyingAI, setIsApplyingAI] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
      lastModified: Date.now()
    }));
  };

  const handleEnhanceSummary = async () => {
    setIsEnhancing("summary");
    const enhanced = await enhanceText(data.personalInfo.summary || "", "professional CV summary");
    updatePersonalInfo("summary", enhanced);
    setIsEnhancing(null);
  };

  const handleGenerateSummary = async () => {
    setIsEnhancing("summary");
    const summary = await generateProfessionalSummary(data);
    updatePersonalInfo("summary", summary);
    setIsEnhancing(null);
  };

  const handlePhotoUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingPhoto(true);
    try {
      const storageRef = ref(storage, `cv_photos/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      updatePersonalInfo("photoUrl", downloadURL);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Erreur lors du téléchargement de la photo. Veuillez réessayer.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleApplyAISuggestions = async (improvedData: CVData) => {
    setIsApplyingAI(true);
    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(improvedData);
    setIsApplyingAI(false);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      university: "",
      degree: "",
      year: "",
      field: "",
    };
    setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      position: "",
      company: "",
      duration: "",
      description: "",
    };
    setData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleEnhanceExperience = async (id: string) => {
    const exp = data.experience.find(e => e.id === id);
    if (!exp) return;
    
    setIsEnhancing(id);
    const enhanced = await enhanceText(exp.description, "professional experience description");
    updateExperience(id, "description", enhanced);
    setIsEnhancing(null);
  };

  const removeExperience = (id: string) => {
    setData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: "",
      level: "Intermediate",
      type: "Technical",
    };
    setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const removeSkill = (id: string) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
  };

  const addProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      technologies: "",
    };
    setData(prev => ({ ...prev, projects: [...prev.projects, newProj] }));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const removeProject = (id: string) => {
    setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: "",
      organization: "",
      year: "",
    };
    setData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const removeCertification = (id: string) => {
    setData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-3 space-y-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Étapes</h2>
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                currentStep === index 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <step.icon size={18} />
              {step.label}
            </button>
          ))}
        </div>
        
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Sparkles size={18} />
            <span className="font-bold">Astuce IA</span>
          </div>
          <p className="text-xs text-blue-600 leading-relaxed">
            Utilisez le bouton "Améliorer avec l'IA" pour transformer vos descriptions simples en phrases professionnelles percutantes.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="lg:col-span-9 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-xl font-bold flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                {(() => {
                  const Icon = STEPS[currentStep].icon;
                  return Icon ? <Icon size={20} /> : null;
                })()}
              </div>
              {STEPS[currentStep].label}
            </h1>
            <div className="text-sm font-medium text-slate-400">
              Étape {currentStep + 1} sur {STEPS.length}
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={STEPS[currentStep].id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="space-y-4 flex-shrink-0">
                        <label className="text-sm font-bold text-slate-700 block">Photo de profil</label>
                        <div className="relative group">
                          <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 group-hover:border-blue-400 transition-all">
                            {isUploadingPhoto ? (
                              <Loader2 size={24} className="animate-spin text-blue-600" />
                            ) : data.personalInfo.photoUrl ? (
                              <img 
                                src={data.personalInfo.photoUrl} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <User size={40} className="text-slate-300" />
                            )}
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            disabled={isUploadingPhoto}
                            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                          />
                          {!isUploadingPhoto && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl pointer-events-none">
                              <Camera className="text-white" size={24} />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">JPG, PNG (Max 2MB)</p>
                      </div>

                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Nom complet</label>
                          <input 
                            type="text" 
                            value={data.personalInfo.fullName}
                            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                            placeholder="Jean Dupont"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Email</label>
                          <input 
                            type="email" 
                            value={data.personalInfo.email}
                            onChange={(e) => updatePersonalInfo("email", e.target.value)}
                            placeholder="jean.dupont@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Téléphone</label>
                          <input 
                            type="tel" 
                            value={data.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                            placeholder="+33 6 12 34 56 78"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Adresse</label>
                          <input 
                            type="text" 
                            value={data.personalInfo.address}
                            onChange={(e) => updatePersonalInfo("address", e.target.value)}
                            placeholder="Paris, France"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Portfolio / Site web</label>
                          <input 
                            type="url" 
                            value={data.personalInfo.portfolio || ""}
                            onChange={(e) => updatePersonalInfo("portfolio", e.target.value)}
                            placeholder="https://monportfolio.com"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">LinkedIn</label>
                          <input 
                            type="url" 
                            value={data.personalInfo.linkedin || ""}
                            onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                            placeholder="https://linkedin.com/in/username"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700">Résumé professionnel</label>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleGenerateSummary}
                            disabled={isEnhancing === "summary"}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                          >
                            <Sparkles size={14} />
                            Générer avec l'IA
                          </button>
                          <button 
                            onClick={handleEnhanceSummary}
                            disabled={isEnhancing === "summary"}
                            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
                          >
                            <Sparkles size={14} />
                            Améliorer
                          </button>
                        </div>
                      </div>
                      <textarea 
                        value={data.personalInfo.summary}
                        onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                        placeholder="Décrivez votre profil en quelques phrases..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      />
                      {isEnhancing === "summary" && (
                        <p className="text-xs text-blue-500 animate-pulse">L'IA travaille sur votre résumé...</p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    {data.education.map((edu, index) => (
                      <div key={edu.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                        <button 
                          onClick={() => removeEducation(edu.id)}
                          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Université / École</label>
                            <input 
                              type="text" 
                              value={edu.university}
                              onChange={(e) => updateEducation(edu.id, "university", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Diplôme</label>
                            <input 
                              type="text" 
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Année</label>
                            <input 
                              type="text" 
                              value={edu.year}
                              onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                              placeholder="2020 - 2023"
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Domaine d'étude</label>
                            <input 
                              type="text" 
                              value={edu.field}
                              onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={addEducation}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Plus size={20} />
                      Ajouter une formation
                    </button>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    {data.experience.map((exp) => (
                      <div key={exp.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Poste</label>
                            <input 
                              type="text" 
                              value={exp.position}
                              onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Entreprise</label>
                            <input 
                              type="text" 
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Durée</label>
                            <input 
                              type="text" 
                              value={exp.duration}
                              onChange={(e) => updateExperience(exp.id, "duration", e.target.value)}
                              placeholder="Jan 2022 - Présent"
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <button 
                              onClick={() => handleEnhanceExperience(exp.id)}
                              disabled={isEnhancing === exp.id}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 disabled:opacity-50"
                            >
                              <Sparkles size={14} />
                              Améliorer avec l'IA
                            </button>
                          </div>
                          <textarea 
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none resize-none"
                          />
                          {isEnhancing === exp.id && (
                            <p className="text-xs text-blue-500 animate-pulse">L'IA optimise votre description...</p>
                          )}
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={addExperience}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Plus size={20} />
                      Ajouter une expérience
                    </button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.skills.map((skill) => (
                        <div key={skill.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 group">
                          <div className="flex-1 space-y-2">
                            <input 
                              type="text" 
                              value={skill.name}
                              onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                              placeholder="Nom de la compétence"
                              className="w-full bg-transparent font-bold outline-none"
                            />
                            <div className="flex gap-2">
                              {["Technical", "Professional", "Language"].map(type => (
                                <button
                                  key={type}
                                  onClick={() => updateSkill(skill.id, "type", type)}
                                  className={cn(
                                    "px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider",
                                    skill.type === type ? "bg-blue-600 text-white" : "bg-white text-slate-400 border border-slate-200"
                                  )}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>
                          <select 
                            value={skill.level}
                            onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none"
                          >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                            <option>Expert</option>
                          </select>
                          <button 
                            onClick={() => removeSkill(skill.id)}
                            className="p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={addSkill}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Plus size={20} />
                      Ajouter une compétence
                    </button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    {data.projects.map((proj) => (
                      <div key={proj.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                        <button 
                          onClick={() => removeProject(proj.id)}
                          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Nom du projet</label>
                            <input 
                              type="text" 
                              value={proj.name}
                              onChange={(e) => updateProject(proj.id, "name", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Technologies</label>
                            <input 
                              type="text" 
                              value={proj.technologies}
                              onChange={(e) => updateProject(proj.id, "technologies", e.target.value)}
                              placeholder="React, Node.js, etc."
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                          <textarea 
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none resize-none"
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={addProject}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Plus size={20} />
                      Ajouter un projet
                    </button>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-6">
                    {data.certifications.map((cert) => (
                      <div key={cert.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                        <button 
                          onClick={() => removeCertification(cert.id)}
                          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Certification</label>
                            <input 
                              type="text" 
                              value={cert.name}
                              onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Organisme</label>
                            <input 
                              type="text" 
                              value={cert.organization}
                              onChange={(e) => updateCertification(cert.id, "organization", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Année</label>
                            <input 
                              type="text" 
                              value={cert.year}
                              onChange={(e) => updateCertification(cert.id, "year", e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={addCertification}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-bold"
                    >
                      <Plus size={20} />
                      Ajouter une certification
                    </button>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="space-y-8">
                      {isApplyingAI && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-700 animate-pulse">
                          <Sparkles size={20} />
                          <span className="font-bold">Application des améliorations IA en cours...</span>
                        </div>
                      )}
                      <CVTips data={data} onApply={handleApplyAISuggestions} />
                      <CVPreview data={data} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-6 py-3 text-slate-600 font-bold hover:text-blue-600 disabled:opacity-30 flex items-center gap-2"
            >
              <ChevronLeft size={20} />
              Précédent
            </button>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onSave(data)}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Download size={20} className="text-slate-400" />
                Sauvegarder
              </button>
              
              {currentStep < STEPS.length - 1 ? (
                <button 
                  onClick={nextStep}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => onSave(data)}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 flex items-center gap-2"
                >
                  Terminer
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
