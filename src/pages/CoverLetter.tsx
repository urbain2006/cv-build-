import { useState } from "react";
import { FileText, Sparkles, Download, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { generateCoverLetter } from "@/src/lib/gemini";
import { cn } from "@/src/lib/utils";

export default function CoverLetterPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // In a real app, we would use the user's CV data
    const mockUserData = {
      fullName: "Jean Dupont",
      experience: [
        { position: "Développeur Full Stack", company: "Tech Solutions", duration: "2 ans" }
      ],
      skills: [{ name: "React" }, { name: "Node.js" }]
    };
    
    const letter = await generateCoverLetter(mockUserData, jobDescription);
    setGeneratedLetter(letter);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Générateur de Lettre de Motivation</h1>
        <p className="text-slate-500 text-lg">L'IA rédige une lettre personnalisée basée sur votre profil et l'offre d'emploi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold mb-2">
              <FileText size={20} />
              Détails de l'offre
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Description du poste / Offre d'emploi</label>
              <textarea 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Collez ici la description du poste pour lequel vous postulez..."
                rows={10}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={!jobDescription || isGenerating}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Générer la lettre
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div className={cn(
            "bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col transition-all",
            !generatedLetter && "items-center justify-center border-dashed"
          )}>
            {generatedLetter ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lettre Générée</div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      {copied ? "Copié !" : "Copier"}
                    </button>
                    <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-all flex items-center gap-2 text-xs font-bold">
                      <Download size={16} />
                      PDF
                    </button>
                  </div>
                </div>
                <div className="flex-1 text-sm text-slate-700 leading-relaxed whitespace-pre-line overflow-auto max-h-[500px] pr-2">
                  {generatedLetter}
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto">
                  <FileText size={32} />
                </div>
                <p className="text-slate-400 text-sm max-w-[200px]">Votre lettre de motivation apparaîtra ici après la génération.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
