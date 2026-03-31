import { motion } from "framer-motion";
import { Layout, Check, Eye } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useState } from "react";
import { Link } from "react-router-dom";

const TEMPLATES = [
  { 
    id: "modern", 
    name: "Moderne", 
    desc: "Design épuré avec une barre latérale pour les compétences.",
    image: "https://picsum.photos/seed/modern/400/600"
  },
  { 
    id: "classic", 
    name: "Classique", 
    desc: "Structure traditionnelle, idéale pour les secteurs conservateurs.",
    image: "https://picsum.photos/seed/classic/400/600"
  },
  { 
    id: "creative", 
    name: "Créatif", 
    desc: "Utilisation audacieuse des couleurs et de la typographie.",
    image: "https://picsum.photos/seed/creative/400/600"
  },
  { 
    id: "minimalist", 
    name: "Minimaliste", 
    desc: "Focus sur le contenu avec un design ultra-minimaliste.",
    image: "https://picsum.photos/seed/minimal/400/600"
  },
  { 
    id: "student", 
    name: "Étudiant", 
    desc: "Met en avant la formation et les projets académiques.",
    image: "https://picsum.photos/seed/student/400/600"
  },
];

export default function TemplatesPage() {
  const [selected, setSelected] = useState("modern");

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Modèles de CV</h1>
        <p className="text-slate-500 text-lg">Choisissez le design qui correspond le mieux à votre profil professionnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEMPLATES.map((template, i) => (
          <motion.div 
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "group relative bg-white rounded-2xl border-2 transition-all overflow-hidden",
              selected === template.id ? "border-blue-600 shadow-xl shadow-blue-50" : "border-slate-100 hover:border-slate-200"
            )}
          >
            <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
              <img 
                src={template.image} 
                alt={template.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button className="px-4 py-2 bg-white text-slate-900 rounded-lg font-bold text-sm flex items-center gap-2">
                  <Eye size={16} />
                  Aperçu
                </button>
                <Link 
                  to="/editor"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center gap-2"
                >
                  Utiliser
                </Link>
              </div>
              {selected === template.id && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg">
                  <Check size={18} />
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-1">{template.name}</h3>
              <p className="text-sm text-slate-500">{template.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
