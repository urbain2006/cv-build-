import { useState, useEffect } from "react";
import { Lightbulb, Sparkles, RefreshCw, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CVData } from "@/src/types";
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from "@/src/lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface CVTipsProps {
  data: CVData;
  onApply?: (improvedData: CVData) => void;
}

export default function CVTips({ data, onApply }: CVTipsProps) {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTips = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `En tant qu'expert en recrutement, analyse les données suivantes de ce CV et donne 3 à 5 conseils courts et percutants pour l'améliorer.
      Données du CV: ${JSON.stringify(data)}
      
      Réponds uniquement avec une liste de conseils, un par ligne, sans numérotation au début.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text || "";
      const tipsList = text.split('\n').filter(line => line.trim().length > 0);
      setTips(tipsList);
    } catch (err) {
      console.error("Error generating tips:", err);
      setError("Impossible de générer des conseils pour le moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyImprovements = async () => {
    if (!onApply) return;
    setApplying(true);
    setError(null);
    try {
      const prompt = `En tant qu'expert en recrutement, améliore les données de ce CV en appliquant tes meilleurs conseils.
      Données actuelles: ${JSON.stringify(data)}
      
      Retourne l'objet CV complet au format JSON, avec les textes améliorés (résumé, descriptions d'expérience, etc.).
      Garde les IDs intacts.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const improvedData = JSON.parse(response.text || "{}") as CVData;
      onApply(improvedData);
    } catch (err) {
      console.error("Error applying improvements:", err);
      setError("Impossible d'appliquer les améliorations pour le moment.");
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    if (data.personalInfo.fullName && tips.length === 0) {
      generateTips();
    }
  }, [data.personalInfo.fullName]);

  return (
    <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-700">
          <Lightbulb size={20} />
          <h3 className="font-bold">Conseils d'expert (IA)</h3>
        </div>
        <div className="flex items-center gap-2">
          {onApply && tips.length > 0 && (
            <button 
              onClick={handleApplyImprovements}
              disabled={applying || loading}
              className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {applying ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Appliquer les conseils
            </button>
          )}
          <button 
            onClick={generateTips}
            disabled={loading || applying}
            className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-all disabled:opacity-50"
            title="Actualiser les conseils"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 text-amber-600/70 py-4"
          >
            <Sparkles size={18} className="animate-pulse" />
            <span className="text-sm font-medium italic">Analyse de votre CV en cours...</span>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-500 py-2 text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        ) : (
          <motion.ul 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {tips.map((tip, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 text-sm text-amber-800"
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {tip}
              </motion.li>
            ))}
            {tips.length === 0 && !loading && (
              <p className="text-sm text-amber-600 italic">Remplissez votre CV pour obtenir des conseils personnalisés.</p>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
