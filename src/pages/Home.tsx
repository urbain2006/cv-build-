import { Link } from "react-router-dom";
import { 
  FilePlus, 
  Layout, 
  FileText, 
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  ShieldCheck,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

export default function Home() {
  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-8 border border-blue-100">
            <Sparkles size={16} />
            Propulsé par l'Intelligence Artificielle
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]">
            DÉCROCHEZ VOTRE <span className="text-blue-600">JOB DE RÊVE</span> EN QUELQUES MINUTES.
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            CV Pro Builder utilise l'IA pour transformer vos expériences en descriptions percutantes et générer des CV professionnels qui attirent l'œil des recruteurs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/editor" 
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center gap-3 group"
            >
              <FilePlus size={22} />
              Créer mon CV maintenant
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/templates" 
              className="px-10 py-5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-3"
            >
              <Layout size={22} />
              Voir les modèles
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-medium">Gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-medium">Pas de carte bancaire</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-medium">Export PDF illimité</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Pourquoi choisir CV Pro Builder ?</h2>
          <p className="text-slate-500 text-lg">Tout ce dont vous avez besoin pour une candidature réussie.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Optimisation par IA", 
              desc: "L'IA analyse vos descriptions et les transforme en phrases professionnelles percutantes avec des mots-clés stratégiques.", 
              icon: Zap,
              color: "bg-amber-50 text-amber-600"
            },
            { 
              title: "Modèles Experts", 
              desc: "Nos modèles sont conçus pour passer les systèmes de filtrage (ATS) et plaire aux recruteurs humains.", 
              icon: Layout,
              color: "bg-blue-50 text-blue-600"
            },
            { 
              title: "Lettre de Motivation", 
              desc: "Générez instantanément une lettre de motivation personnalisée pour chaque offre d'emploi.", 
              icon: FileText,
              color: "bg-purple-50 text-purple-600"
            },
            { 
              title: "Traduction 🌍", 
              desc: "Traduisez votre CV en anglais ou en français en un clic pour postuler à l'international.", 
              icon: Globe,
              color: "bg-green-50 text-green-600"
            },
            { 
              title: "Sécurisé & Privé", 
              desc: "Vos données sont cryptées et vous appartiennent. Nous ne vendons jamais vos informations personnelles.", 
              icon: ShieldCheck,
              color: "bg-red-50 text-red-600"
            },
            { 
              title: "Export PDF HD", 
              desc: "Téléchargez des fichiers PDF haute définition, parfaits pour l'impression ou l'envoi par email.", 
              icon: FilePlus,
              color: "bg-indigo-50 text-indigo-600"
            },
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", feature.color)}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Prêt à booster votre carrière ?
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui ont déjà trouvé leur emploi grâce à CV Pro Builder.
            </p>
            <Link 
              to="/editor" 
              className="inline-flex px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 items-center gap-3"
            >
              Commencer gratuitement
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
