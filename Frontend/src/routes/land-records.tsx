import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion } from "framer-motion";
import { MapPin, Upload, FileText, Plane, Loader2 } from "lucide-react";
import { GradientButton } from "@/components/ui-kit/GradientButton";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/land-records")({
  head: () => ({ meta: [{ title: "Land Records — Agri-TrekOps" }] }),
  component: LandRecords,
});

const lands = [
  { id: "LR-1042", owner: "R. Kumar", sector: "Sector 12", area: "4.2", crop: "Wheat", health: 94 },
  { id: "LR-1043", owner: "S. Devi", sector: "Sector 4", area: "1.8", crop: "Rice", health: 88 },
  { id: "LR-1044", owner: "M. Rao", sector: "Sector 9", area: "6.5", crop: "Cotton", health: 76 },
  { id: "LR-1045", owner: "A. Khan", sector: "Sector 3", area: "2.1", crop: "Mustard", health: 82 },
  { id: "LR-1046", owner: "P. Joshi", sector: "Sector 7", area: "3.7", crop: "Sugarcane", health: 91 },
  { id: "LR-1047", owner: "V. Naidu", sector: "Sector 11", area: "5.0", crop: "Maize", health: 85 },
];

function LandRecords() {
  const [files, setFiles] = useState<{name: string, size: string}[]>([
    {name: "Survey-LR1042.pdf", size: "2.4 MB"},
    {name: "Khasra-LR1044.pdf", size: "1.8 MB"},
    {name: "Deed-LR1045.pdf", size: "3.2 MB"}
  ]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file: File) => {
    setUploading(true);
    setTimeout(() => {
      setFiles(prev => [{name: file.name, size: (file.size / (1024*1024)).toFixed(1) + ' MB'}, ...prev]);
      setUploading(false);
      toast.success("Document uploaded successfully");
    }, 1500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && !uploading) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <AppLayout title="Land Records">
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">GIS map · land parcels</h3>
            <span className="flex items-center gap-1.5 text-xs"><span className="h-2 w-2 rounded-full bg-success animate-pulse"/>Synced</span>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald/15 via-info/10 to-transparent border border-border">
            <div className="absolute inset-0 grid-bg opacity-50"/>
            {/* parcels */}
            {[
              {x:"6%",y:"10%",w:"24%",h:"30%",c:"oklch(0.78 0.20 145 / 0.35)"},
              {x:"34%",y:"14%",w:"28%",h:"22%",c:"oklch(0.70 0.14 220 / 0.30)"},
              {x:"66%",y:"8%",w:"28%",h:"34%",c:"oklch(0.78 0.20 75 / 0.30)"},
              {x:"8%",y:"46%",w:"32%",h:"40%",c:"oklch(0.72 0.18 150 / 0.30)"},
              {x:"44%",y:"42%",w:"22%",h:"26%",c:"oklch(0.62 0.22 25 / 0.25)"},
              {x:"68%",y:"50%",w:"26%",h:"38%",c:"oklch(0.85 0.20 145 / 0.25)"},
            ].map((p,i)=>(
              <motion.div key={i} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.05}}
                className="absolute rounded-xl border border-border" style={{left:p.x,top:p.y,width:p.w,height:p.h,background:p.c}}>
                <div className="text-[10px] text-foreground/80 p-1.5">LR-{1042+i}</div>
              </motion.div>
            ))}
            <motion.div className="absolute top-3 right-3 text-primary" animate={{x:[0,-260,0],y:[0,180,0]}} transition={{duration:12,repeat:Infinity,ease:"easeInOut"}}>
              <Plane className="h-5 w-5"/>
            </motion.div>
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Upload documents</h3>
          <p className="text-xs text-muted-foreground">Khasra, deeds, survey forms</p>
          <label 
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            className={`mt-4 block border-2 border-dashed rounded-2xl p-6 text-center transition ${uploading ? 'opacity-50 cursor-not-allowed border-border' : dragActive ? 'border-primary bg-primary/5 cursor-pointer' : 'border-border hover:border-primary cursor-pointer'}`}>
            {uploading ? (
              <Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" />
            ) : (
              <Upload className={`h-6 w-6 mx-auto ${dragActive ? 'text-primary' : 'text-muted-foreground'}`}/>
            )}
            <div className={`mt-2 text-sm ${dragActive ? 'text-primary' : ''}`}>{uploading ? 'Uploading...' : 'Drop files or click to upload'}</div>
            <div className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG · max 25MB</div>
            <input type="file" className="hidden" onChange={handleUpload} disabled={uploading}/>
          </label>
          <div className="mt-4 space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {files.map(f=>(
              <div key={f.name} className="flex items-center justify-between glass rounded-xl px-3 py-2 text-sm">
                <span className="flex items-center gap-2"><FileText className="h-4 w-4 text-info"/>{f.name}</span>
                <span className="text-xs text-muted-foreground">{f.size}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {lands.map((l,i)=>(
          <motion.div key={l.id} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.04}} className="glass rounded-2xl p-5 glow-hover">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary"/><span className="font-semibold">{l.id}</span></div>
              <span className="text-xs text-muted-foreground">{l.sector}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="glass rounded-xl p-2"><div className="text-muted-foreground">Owner</div><div className="font-semibold mt-0.5">{l.owner}</div></div>
              <div className="glass rounded-xl p-2"><div className="text-muted-foreground">Area</div><div className="font-semibold mt-0.5">{l.area} ha</div></div>
              <div className="glass rounded-xl p-2"><div className="text-muted-foreground">Crop</div><div className="font-semibold mt-0.5">{l.crop}</div></div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Crop health</span><span>{l.health}%</span></div>
              <div className="mt-1.5 h-2 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{width:0}} whileInView={{width:`${l.health}%`}} viewport={{once:true}} transition={{duration:1}} className="h-full bg-gradient-primary"/>
              </div>
            </div>
            <div className="mt-4 flex justify-end"><GradientButton variant="outline">View details</GradientButton></div>
          </motion.div>
        ))}
      </div>
    </AppLayout>
  );
}
