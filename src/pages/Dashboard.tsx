import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FilePlus, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  Download,
  Search,
  Filter,
  Clock,
  Layout,
  Plus,
  Loader2,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/AuthContext";
import { db } from "@/src/firebase";
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from "firebase/firestore";
import { CVData } from "@/src/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "cvs"),
      where("userId", "==", user.uid),
      orderBy("lastModified", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cvList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CVData[];
      setCvs(cvList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching CVs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce CV ?")) {
      try {
        await deleteDoc(doc(db, "cvs", id));
      } catch (error) {
        console.error("Error deleting CV:", error);
      }
    }
  };

  const filteredCvs = cvs.filter(cv => 
    cv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Connectez-vous pour voir vos CV</h2>
        <p className="text-slate-500 mb-8">Vous devez être connecté pour accéder à votre tableau de bord.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes CV</h1>
          <p className="text-slate-500">Gérez et modifiez vos CV professionnels.</p>
        </div>
        <Link 
          to="/editor" 
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
        >
          <FilePlus size={20} />
          Nouveau CV
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un CV..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* CV Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCvs.map((cv, i) => (
            <motion.div 
              key={cv.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-blue-100 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(cv.id!)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{cv.title}</h3>
              
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(cv.lastModified).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Layout size={14} />
                  {cv.templateId}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to={`/editor?id=${cv.id}`}
                  className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-all"
                >
                  <Edit3 size={16} />
                  Modifier
                </Link>
                <Link
                  to={`/editor?id=${cv.id}&preview=true`}
                  className="flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-all"
                >
                  <Eye size={16} />
                  Aperçu
                </Link>
              </div>
            </motion.div>
          ))}
          
          {/* Empty State / Add New */}
          <Link 
            to="/editor"
            className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all min-h-[240px]"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-4">
              <Plus size={24} />
            </div>
            <span className="font-bold">Créer un nouveau CV</span>
          </Link>
        </div>
      )}
    </div>
  );
}
