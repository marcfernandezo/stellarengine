import { MenuStarfield } from "@/components/hud/menu-starfield";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MenuProps {
  onStart: () => void;
}

export function Menu({ onStart }: MenuProps) {
  return (
    <div className="fixed inset-0 flex items-center bg-transparent overflow-hidden">
      {/* Three.js background */}
      <MenuStarfield />

      {/* Vignette - Gradiente mejorado con Tailwind */}
      <div className="fixed inset-0 z-10 pointer-events-none bg-linear-to-r from-[#020408]/95 via-[#020408]/65 to-transparent" />

      {/* Contenido */}
      <main className="relative z-20 flex flex-col items-start gap-6 px-16 text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        
        <div className="space-y-1">
          <Badge variant="outline" className="border-white/20 text-white/60 font-mono tracking-tighter">
            v0.1 · Early Access
          </Badge>
        </div>

        <h1 className="font-['Bebas_Neue'] text-[clamp(70px,10vw,130px)] leading-[0.85] tracking-wider text-[#f0ede8] m-0">
          STELLAR<br />
          <span className="text-blue-500 brightness-125">ENGINE</span>
        </h1>

        <p className="text-white/50 text-lg font-light tracking-wide max-w-md italic">
          N-body gravitational simulator <span className="mx-2 text-white/20">|</span> Real orbital mechanics
        </p>

        <Separator className="w-64 bg-white/10" />

        <div className="flex gap-10">
          <Stat value="9" label="Bodies" />
          <Stat value="RK4" label="Integrator" />
          <Stat value="AU" label="Scale" />
        </div>

        <div className="flex flex-col gap-3 w-64 pt-4">
          <Button 
            size="lg" 
            onClick={onStart} 
            className="w-full justify-start pl-6 bg-white text-black hover:bg-blue-500 hover:text-white transition-all duration-300"
          >
            Launch Simulator
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full justify-start pl-6 border-white/20 text-white/80 hover:bg-white/5" 
            disabled
          >
            Load Scenario
          </Button>
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-4">
          Scroll · Orbit · Zoom — Mouse controls
        </p>
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-light text-white/90">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
    </div>
  );
}