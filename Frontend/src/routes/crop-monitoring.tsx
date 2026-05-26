import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Sprout, Droplets, Sun, ThermometerSun, Loader2 } from "lucide-react";
import { StatCard } from "@/components/ui-kit/StatCard";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const Route = createFileRoute("/crop-monitoring")({
  head: () => ({ meta: [{ title: "Crop Monitoring — Agri-TrekOps" }] }),
  component: CropMonitoring,
});

const mockNdviData = Array.from({length:14}).map((_,i)=>({d:`D${i+1}`,ndvi:60+Math.round(Math.sin(i/2)*15+i)}));

function CropMonitoring() {
  const { data: weather, isLoading: isLoadingWeather } = useQuery({
    queryKey: ["weather"],
    queryFn: async () => {
      let lat = 28.6139;
      let lon = 77.2090;
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          }
        });
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      } catch (err) {
        console.warn("Could not get location, falling back to default.", err);
      }

      const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,soil_moisture_1_to_3cm,shortwave_radiation&timezone=auto`);
      return res.data.current;
    }
  });

  if (isLoadingWeather) {
    return (
      <AppLayout title="Crop Monitoring">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Crop Monitoring">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Field Sensors & Weather (Live)</h2>
          <p className="text-sm text-muted-foreground">Real-time telemetry from Open-Meteo and field sensors.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="NDVI Avg" value={78} suffix="%" icon={Sprout} accent="primary"/>
        <StatCard label="Soil Moisture" value={weather?.soil_moisture_1_to_3cm ? Math.round(weather.soil_moisture_1_to_3cm * 100) : 67} suffix="%" icon={Droplets} accent="info"/>
        <StatCard label="Sunlight" value={weather?.shortwave_radiation || 812} suffix=" W/m²" icon={Sun} accent="warning"/>
        <StatCard label="Temperature" value={weather?.temperature_2m || 28} suffix="°C" icon={ThermometerSun} accent="destructive"/>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h3 className="font-semibold">NDVI trend · last 14 days</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <LineChart data={mockNdviData}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false}/>
                <XAxis dataKey="d" stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis stroke="oklch(0.68 0.02 150)" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background:"oklch(0.16 0.02 160)", border:"1px solid oklch(0.30 0.03 160)", borderRadius: 12 }}/>
                <Line type="monotone" dataKey="ndvi" stroke="oklch(0.85 0.20 145)" strokeWidth={3} dot={{r:4}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold">Active alerts</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              { c:"warning", t:"Moisture dropping in Sector 9", d:"2h ago" },
              { c:"destructive", t:"Pest signal · Cotton field 4", d:"4h ago" },
              { c:"info", t:"Survey scheduled · Sector 7", d:"6h ago" },
              { c:"success", t:"NDVI recovered in Sector 4", d:"1d ago" },
            ].map((a,i)=>(
              <motion.li key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}} className="glass rounded-xl p-3">
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.c==="warning"?"bg-warning/15 text-warning":a.c==="destructive"?"bg-destructive/15 text-destructive":a.c==="info"?"bg-info/15 text-info":"bg-success/15 text-success"}`}>{a.c}</span>
                  <span className="text-xs text-muted-foreground">{a.d}</span>
                </div>
                <div className="mt-2">{a.t}</div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
