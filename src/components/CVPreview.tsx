import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { CVData } from "@/src/types";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import { Download, Share2, Layout, Printer } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface CVPreviewProps {
  data: CVData;
}

export default function CVPreview({ data }: CVPreviewProps) {
  const [activeTemplate, setActiveTemplate] = useState(data.templateId || "modern");
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `CV_${data.personalInfo.fullName || "Sans_Nom"}`,
  });

  const templates = [
    { id: "modern", name: "Moderne", icon: Layout },
    { id: "classic", name: "Classique", icon: Printer },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-500 mr-2">Modèle:</span>
          <div className="flex gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                  activeTemplate === t.id 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                <t.icon size={16} />
                {t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePrint()}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm flex items-center gap-2 shadow-lg shadow-blue-100"
          >
            <Download size={18} />
            Exporter PDF
          </button>
          <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-auto bg-slate-200 p-8 rounded-3xl border border-slate-300 shadow-inner max-h-[800px]">
        <div className="mx-auto shadow-2xl" style={{ width: "210mm" }}>
          <div ref={componentRef}>
            {activeTemplate === "modern" && <ModernTemplate data={data} />}
            {activeTemplate === "classic" && <ClassicTemplate data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}
