/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FilePlus, 
  Layout, 
  FileText, 
  User, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/src/lib/utils";

import EditorPage from "@/src/pages/Editor";
import CoverLetterPage from "@/src/pages/CoverLetter";
import TemplatesPage from "@/src/pages/Templates";
import Home from "@/src/pages/Home";
import Dashboard from "@/src/pages/Dashboard";
import ProfilePage from "@/src/pages/Profile";

import { AuthProvider, useAuth } from "@/src/AuthContext";

function AppContent() {
  const { user, signIn, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/dashboard", label: "Mes CV", icon: LayoutDashboard },
    { to: "/editor", label: "Créer CV", icon: FilePlus },
    { to: "/templates", label: "Modèles", icon: Layout },
    { to: "/cover-letter", label: "Lettre Motivation", icon: FileText },
    { to: "/profile", label: "Profil", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b",
        isScrolled ? "bg-white/80 backdrop-blur-md border-slate-200 py-3" : "bg-transparent border-transparent py-5"
      )}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
              <FileText size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">CV Pro <span className="text-blue-600">Builder</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-all flex items-center gap-2 rounded-lg",
                  location.pathname === link.to ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                )}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
            
            {loading ? (
              <div className="ml-4 w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            ) : user ? (
              <div className="ml-4 flex items-center gap-3">
                <Link to="/profile">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    alt={user.displayName || ""} 
                    className="w-8 h-8 rounded-full border border-slate-200 hover:border-blue-400 transition-all"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <button 
                  onClick={signOut}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={signIn}
                className="ml-4 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                Connexion
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[73px] left-0 right-0 bg-white border-b border-slate-200 z-40 md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "p-3 rounded-xl transition-all flex items-center gap-3 font-medium",
                    location.pathname === link.to ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                  )}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-slate-100 mt-2">
                {user ? (
                  <button 
                    onClick={() => { signOut(); setIsMenuOpen(false); }}
                    className="w-full p-3 text-red-600 bg-red-50 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Déconnexion
                  </button>
                ) : (
                  <button 
                    onClick={() => { signIn(); setIsMenuOpen(false); }}
                    className="w-full p-3 bg-blue-600 text-white rounded-xl font-bold"
                  >
                    Connexion
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/cover-letter" element={<CoverLetterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <FileText size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight">CV Pro Builder</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              L'outil intelligent pour créer des CV professionnels en quelques minutes. Boostez votre carrière avec l'IA.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Application</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><Link to="/editor">Créer CV</Link></li>
              <li><Link to="/templates">Modèles</Link></li>
              <li><Link to="/cover-letter">Lettre de Motivation</Link></li>
              <li><Link to="/dashboard">Mes CV</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><a href="#">Confidentialité</a></li>
              <li><a href="#">Conditions d'utilisation</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
          © 2026 CV Pro Builder. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
