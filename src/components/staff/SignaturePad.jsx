import { useRef, useState, useEffect } from "react";
import { Loader2, Trash2, Check } from "lucide-react";

export default function SignaturePad({ onConfirm, onCancel, submitting }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const resize = () => {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.putImageData(data, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasStrokes(true);
  };

  const end = (e) => { e.preventDefault(); drawing.current = false; };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const confirm = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    onConfirm(dataUrl);
  };

  return (
    <div className="space-y-3">
      <div className="relative rounded-xl border-2 border-dashed border-border bg-white dark:bg-slate-900 overflow-hidden" style={{ height: 180 }}>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
          onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={move} onTouchEnd={end}
        />
        {!hasStrokes && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-muted-foreground text-sm select-none">Sign here</p>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 bg-muted text-foreground font-heading font-bold py-2.5 rounded-xl hover:bg-muted/80 transition-colors text-sm">
          Back
        </button>
        <button type="button" onClick={clear} className="p-2.5 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={!hasStrokes || submitting}
          className="flex-1 bg-primary text-white font-heading font-bold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {submitting ? "Submitting…" : "Confirm & Submit"}
        </button>
      </div>
    </div>
  );
}