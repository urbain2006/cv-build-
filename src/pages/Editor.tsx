import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import CVEditor from "@/src/components/CVEditor";
import { CVData } from "@/src/types";
import { motion } from "framer-motion";
import { db } from "@/src/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useAuth } from "@/src/AuthContext";
import { Loader2, Save, CheckCircle } from "lucide-react";

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cvId = searchParams.get("id");
  
  const [initialData, setInitialData] = useState<CVData | undefined>(undefined);
  const [loading, setLoading] = useState(!!cvId);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchCV = async () => {
      if (!cvId || !user) return;
      
      try {
        const docRef = doc(db, "cvs", cvId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as CVData;
          // Security check: ensure user owns this CV
          if (data.userId === user.uid) {
            setInitialData({ ...data, id: docSnap.id });
          } else {
            console.error("Unauthorized access to CV");
            navigate("/dashboard");
          }
        } else {
          console.error("CV not found");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching CV:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [cvId, user, navigate]);

  const handleSave = async (data: CVData) => {
    if (!user) {
      alert("Vous devez être connecté pour sauvegarder votre CV.");
      return;
    }

    setSaving(true);
    setSaveStatus("idle");
    
    try {
      const cvData = {
        ...data,
        userId: user.uid,
        lastModified: Date.now()
      };

      if (cvId) {
        // Update existing
        await updateDoc(doc(db, "cvs", cvId), cvData);
      } else {
        // Create new
        const docRef = await addDoc(collection(db, "cvs"), cvData);
        navigate(`/editor?id=${docRef.id}`, { replace: true });
      }
      
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving CV:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Chargement de votre CV...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {cvId ? "Modifier mon CV" : "Créer un nouveau CV"}
          </h1>
          <p className="text-slate-500">Remplissez les informations pour générer votre CV professionnel.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-100"
            >
              <CheckCircle size={16} />
              Sauvegardé
            </motion.div>
          )}
          <div className="text-xs text-slate-400 italic">
            {saving ? "Sauvegarde en cours..." : ""}
          </div>
        </div>
      </motion.div>

      <CVEditor initialData={initialData} onSave={handleSave} />
    </div>
  );
}
