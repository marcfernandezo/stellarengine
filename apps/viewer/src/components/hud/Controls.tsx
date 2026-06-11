"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pause, Play, Clock } from "lucide-react";

interface ControlsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  timeScale: number;
  onTimeScaleChange: (value: number) => void;
}

export const Controls = ({
  isPaused,
  onTogglePause,
  timeScale,
  onTimeScaleChange,
}: ControlsProps) => {
  const [simDate, setSimDate] = useState(new Date());
  // eslint-disable-next-line react-hooks/purity
  const lastRealTime = useRef(performance.now());

  // --- SIMULATION TIME ---
  useEffect(() => {
    let raf: number;

    const update = () => {
      const now = performance.now();
      const deltaSec = (now - lastRealTime.current) / 1000;
      lastRealTime.current = now;

      if (!isPaused) {
        const simDelta = deltaSec * timeScale;
        setSimDate((prev) => new Date(prev.getTime() + simDelta * 1000));
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [isPaused, timeScale]);

  // FORMAT
  const formatDate = (date: Date) => {
    return date.toUTCString();
  };

  const formatScale = () => {
    if (timeScale < 1) return `${timeScale.toFixed(2)}x`;
    if (timeScale < 60) return `${timeScale.toFixed(1)}x`;

    const perSecond = timeScale;

    if (perSecond >= 86400) return `${(perSecond / 86400).toFixed(2)} days/sec`;
    if (perSecond >= 3600) return `${(perSecond / 3600).toFixed(2)} h/sec`;
    if (perSecond >= 60) return `${(perSecond / 60).toFixed(2)} min/sec`;

    return `${timeScale.toFixed(1)}x`;
  };

  return (
    <div className="absolute top-5 left-5 z-50 w-[320px]">
      <Card className="bg-black/70 backdrop-blur-xl border border-zinc-800 text-white shadow-2xl">
        
        {/* HEADER */}
        <CardHeader className="pb-3 border-b border-zinc-800">
          <CardTitle className="text-xs tracking-widest text-zinc-400 flex items-center gap-2">
            <Clock size={14} />
            TEMPORAL CONTROL
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">

          {/* DATE DISPLAY */}
          <div className="space-y-1">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wide">
              Simulation Time (UTC)
            </div>
            <div className="font-mono text-sm text-white">
              {formatDate(simDate)}
            </div>
          </div>

          {/* PLAY / PAUSE */}
          <Button
            onClick={onTogglePause}
            variant={isPaused ? "default" : "destructive"}
            className="w-full flex items-center justify-center gap-2 h-9"
          >
            {isPaused ? (
              <>
                <Play size={14} />
                Resume Simulation
              </>
            ) : (
              <>
                <Pause size={14} />
                Pause Simulation
              </>
            )}
          </Button>

          {/* TIME SCALE */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Time Scale</span>
              <span className="font-mono text-white">
                {formatScale()}
              </span>
            </div>

            <Slider
              min={0}
              max={200000}
              step={10}
              value={[timeScale]}
              onValueChange={(val) => onTimeScaleChange(val[0])}
            />

            {/* QUICK PRESETS */}
            <div className="flex gap-2 flex-wrap">
              {[1, 60, 3600, 86400].map((v) => (
                <Button
                  key={v}
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => onTimeScaleChange(v)}
                >
                  {v === 1 && "1x"}
                  {v === 60 && "1m/s"}
                  {v === 3600 && "1h/s"}
                  {v === 86400 && "1d/s"}
                </Button>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};