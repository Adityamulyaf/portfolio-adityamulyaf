"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

interface CarveModalProps {
  open: boolean;
  onClose: () => void;
  /** Resolves to null on success, or a message to show the person. */
  onCarve: (name: string, dataUrl: string) => Promise<string | null>;
}

export default function CarveModal({ open, onClose, onCarve }: CarveModalProps) {
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
    }
    initCanvas();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function initCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Match the backing store to the display size so strokes aren't blurry.
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = "#1C2E46";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  const startDrawing = (x: number, y: number) => {
    setIsDrawing(true);
    lastX.current = x;
    lastY.current = y;
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX.current = x;
    lastY.current = y;
  };

  const at = (e: { clientX: number; clientY: number }, el: HTMLCanvasElement) => {
    const rect = el.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top] as const;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
  };

  const handleCarve = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !name.trim() || saving) return;

    setSaving(true);
    setNotice(null);
    const message = await onCarve(name.trim(), canvas.toDataURL());
    setSaving(false);

    if (message) {
      setNotice(message);
      return;
    }
    setName("");
    onClose();
  };

  const close = () => {
    setNotice(null);
    onClose();
  };

  // `open` only flips from a click, so document is guaranteed by then; no
  // mounted flag needed just to keep the portal out of the server render.
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carve your statue"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[4px] p-gutter"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-[450px] bg-background border border-border rounded-xl shadow-2xl p-md sm:p-lg flex flex-col gap-sm sm:gap-md opacity-0 scale-95"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-display text-h3 italic text-text-primary">
              Carve your statue
            </h2>
            <p className="font-body text-small text-text-muted mt-1">
              Draw a signature or a doodle onto the stone tile.
            </p>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="font-body text-label text-secondary hover:text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container"
          >
            Close
          </button>
        </div>

        <div className="flex flex-col gap-xs">
          <label htmlFor="signature-name" className="font-body text-label text-text-muted">
            Your name
          </label>
          <input
            id="signature-name"
            type="text"
            placeholder="Name or initials"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={25}
            className="w-full bg-surface border border-border rounded-card px-md py-sm font-body text-small text-text-primary focus:outline-none focus:border-primary-container transition-colors"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <span className="font-body text-label text-text-muted">Drawing slate</span>
          <div className="relative w-full h-[180px] bg-[#fdfaf2] border border-border rounded-card overflow-hidden cursor-crosshair">
            <canvas
              ref={canvasRef}
              onMouseDown={(e) => startDrawing(...at(e, e.currentTarget))}
              onMouseMove={(e) => draw(...at(e, e.currentTarget))}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)}
              onTouchStart={(e) => startDrawing(...at(e.touches[0], e.currentTarget))}
              onTouchMove={(e) => {
                e.preventDefault();
                draw(...at(e.touches[0], e.currentTarget));
              }}
              onTouchEnd={() => setIsDrawing(false)}
              className="absolute inset-0 w-full h-full touch-none"
            />
          </div>
        </div>

        {notice && (
          <p
            role="status"
            className="font-body text-small text-parchment-deep bg-surface border border-border rounded-card px-sm py-xs"
          >
            {notice}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-md sm:gap-sm mt-xs">
          <button
            onClick={clearCanvas}
            className="w-full sm:w-auto font-body text-label font-medium text-secondary hover:text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container text-center sm:text-left py-xs"
          >
            Clear slate
          </button>

          <div className="flex w-full sm:w-auto gap-sm justify-between sm:justify-end">
            <button
              onClick={close}
              className="flex-1 sm:flex-initial text-center font-body text-label font-medium text-secondary hover:text-primary transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container px-md py-sm rounded-md border border-border"
            >
              Cancel
            </button>
            <button
              onClick={handleCarve}
              disabled={!name.trim() || saving}
              className="flex-1 sm:flex-initial text-center font-body text-label font-medium text-white bg-primary-container hover:bg-accent-hover transition-colors px-md sm:px-lg py-sm rounded-md shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-container disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? "Carving…" : "Carve tile"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
