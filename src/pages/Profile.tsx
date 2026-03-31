import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Shield, Bell, Globe, LogOut, Camera, Loader2, CheckCircle, Save } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/AuthContext";
import { db } from "@/src/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    phone: "",
    location: "",
    photoURL: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            displayName: data.displayName || user.displayName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            location: data.location || "",
            photoURL: data.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random`
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    setSaveStatus("idle");
    
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        displayName: profileData.displayName,
        phone: profileData.phone,
        location: profileData.location,
        lastLogin: Date.now()
      });
      
      setSaveStatus("success");
      setIsEditing(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "account", label: "Compte", icon: User },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "language", label: "Langue", icon: Globe },
  ];

  const [activeSection, setActiveSection] = useState("account");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Chargement de votre profil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Veuillez vous connecter</h2>
        <p className="text-slate-500">Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
        {saveStatus === "success" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-100"
          >
            <CheckCircle size={16} />
            Profil mis à jour
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <img 
                src={profileData.photoURL} 
                alt={profileData.displayName} 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                referrerPolicy="no-referrer"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{profileData.displayName}</h2>
            <p className="text-slate-500 text-sm mb-6">{profileData.email}</p>
            <button 
              onClick={signOut}
              className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeSection === section.id 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-8">
          <motion.div 
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8"
          >
            {activeSection === "account" && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Informations Personnelles</h3>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 font-bold text-sm hover:underline"
                    >
                      Modifier
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nom complet</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={profileData.displayName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                        className={cn(
                          "w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all",
                          isEditing ? "bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border border-slate-100"
                        )}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        value={profileData.email}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-slate-400"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Ex: +33 6 12 34 56 78"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all",
                          isEditing ? "bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border border-slate-100"
                        )}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Localisation</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Ex: Paris, France"
                        className={cn(
                          "w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all",
                          isEditing ? "bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50" : "bg-slate-50 border border-slate-100"
                        )}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Sauvegarder les modifications
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </>
            )}

            {activeSection === "security" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Sécurité du compte</h3>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900">Méthode de connexion</h4>
                      <p className="text-sm text-slate-500">Connecté via Google</p>
                    </div>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      Actif
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Votre compte est sécurisé par votre compte Google. Vous n'avez pas besoin de gérer un mot de passe séparé pour CV Pro Builder.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
