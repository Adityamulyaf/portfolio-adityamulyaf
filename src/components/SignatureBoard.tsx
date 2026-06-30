"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

interface Signature {
  id: string;
  name: string;
  dataUrl: string;
  date: string;
}

export default function SignatureBoard() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const lastY = useRef(0);

  // Initialize and load signatures from Firestore or LocalStorage
  useEffect(() => {
    if (isFirebaseConfigured && db) {
      console.log("Firebase Firestore is active for Carved Statues guestbook.");
      const q = query(collection(db, "carved_statues"), orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: Signature[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              name: data.name || "Anonymous",
              dataUrl: data.dataUrl || "",
              date: data.date || "",
            });
          });

          if (list.length === 0) {
            // Load mock defaults if database table is completely empty
            const defaults = getMockDefaults();
            setSignatures(defaults);
          } else {
            setSignatures(list);
          }
        },
        (error) => {
          console.error("Firestore onSnapshot error, falling back to localStorage:", error);
          loadFromLocalStorage();
        }
      );

      return () => unsubscribe();
    } else {
      console.log("Firebase not configured. Running Guestbook in local offline mode (localStorage).");
      loadFromLocalStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadFromLocalStorage() {
    const saved = localStorage.getItem("carved_statues");
    if (saved) {
      try {
        setSignatures(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local signatures", e);
      }
    } else {
      const defaults = getMockDefaults();
      setSignatures(defaults);
      localStorage.setItem("carved_statues", JSON.stringify(defaults));
    }
  }

  function getMockDefaults(): Signature[] {
    return [
      {
        id: "ada",
        name: "Ada Lovelace",
        dataUrl: createMockSignature("Ada Lovelace"),
        date: "10 Dec 1843",
      },
      {
        id: "alan",
        name: "Alan Turing",
        dataUrl: createMockSignature("Alan Turing"),
        date: "23 Jun 1912",
      },
    ];
  }

  // Programmatically draw a mock signature on load
  function createMockSignature(text: string): string {
    if (typeof window === "undefined") return "";
    const canvas = document.createElement("canvas");
    canvas.width = 240;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calligraphy font mock
      ctx.font = "italic 28px 'Instrument Serif', Georgia, serif";
      ctx.fillStyle = "#1C2E46";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Draw signature name
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      
      // Draw a calligraphic underline loop
      ctx.beginPath();
      ctx.moveTo(30, 70);
      ctx.bezierCurveTo(90, 85, 150, 50, 210, 70);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#1C2E46";
      ctx.stroke();
    }
    return canvas.toDataURL();
  }

  // Handle modal animation and body scrolling when opened
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power3.out" }
      );
      initCanvas();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  function initCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Support High-DPI screens
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Styling
    ctx.strokeStyle = "#1C2E46";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  // Drawing pad handlers
  const startDrawing = (x: number, y: number) => {
    setIsDrawing(true);
    lastX.current = x;
    lastY.current = y;
  };

  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX.current = x;
    lastY.current = y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Mouse helper events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    startDrawing(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  };

  // Touch helper events for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
  };

  const handleCarve = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !name.trim()) return;

    const dataUrl = canvas.toDataURL();
    const formattedDate = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, "carved_statues"), {
          name: name.trim(),
          dataUrl,
          date: formattedDate,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error carving signature to Firestore:", error);
        alert("Failed to write to Cloud Firestore database. Running in local mode.");
        
        // Fallback to local storage if write fails
        saveLocalSignature(name.trim(), dataUrl, formattedDate);
      }
    } else {
      saveLocalSignature(name.trim(), dataUrl, formattedDate);
    }

    // Reset and close
    setName("");
    setIsModalOpen(false);
  };

  const saveLocalSignature = (sigName: string, dataUrl: string, date: string) => {
    const newSignature: Signature = {
      id: Date.now().toString(),
      name: sigName,
      dataUrl,
      date,
    };
    const updatedList = [newSignature, ...signatures];
    setSignatures(updatedList);
    localStorage.setItem("carved_statues", JSON.stringify(updatedList));
  };

  return (
    <div className="w-full text-left">
      <div className="flex flex-col gap-sm">
        <div className="flex justify-between items-end border-b border-border/40 pb-sm mb-xs">
          <div>
            <span className="font-mono-label text-[11px] text-text-muted uppercase block tracking-[0.04em]">
              GUESTBOOK
            </span>
            <h3 className="font-body-md text-[18px] md:text-[20px] font-bold text-text-primary mt-1">
              Carved Statues
            </h3>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-mono-label text-[11px] uppercase tracking-widest text-primary-container hover:text-accent-hover font-semibold cursor-pointer border border-primary-container/20 rounded-md px-sm py-xs hover:border-accent-hover transition-all focus:outline-none"
          >
            + Carve Yours
          </button>
        </div>

        {/* List of Signatures */}
        <div className="flex flex-wrap gap-md items-center min-h-[80px]">
          {signatures.length === 0 ? (
            <p className="font-body-sm text-[13px] text-text-muted italic">
              No signatures carved yet. Be the first!
            </p>
          ) : (
            signatures.map((sig) => (
              <div
                key={sig.id}
                className="group relative flex items-center justify-center bg-surface hover:bg-border/30 border border-border/60 hover:border-border rounded-card h-[60px] w-[140px] px-sm overflow-hidden transition-all duration-300 shadow-sm cursor-help"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sig.dataUrl}
                  alt={`Signature of ${sig.name}`}
                  className="max-h-[85%] max-w-full object-contain pointer-events-none filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                />

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-primary text-white text-[11px] font-mono-label px-sm py-xs rounded shadow-lg pointer-events-none opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-50">
                  <span className="block font-semibold">{sig.name}</span>
                  <span className="block text-[9px] text-on-primary-container mt-0.5">{sig.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Drawing Pad Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-[4px] p-gutter">
          <div
            ref={modalRef}
            className="w-full max-w-[450px] bg-background border border-border rounded-xl shadow-2xl p-md sm:p-lg flex flex-col gap-sm sm:gap-md opacity-0 scale-95"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-body-md text-[20px] font-bold text-text-primary">
                  Carve Your Statue
                </h4>
                <p className="font-body-sm text-[13px] text-text-muted mt-1 leading-relaxed">
                  Carve your signature or doodle onto a stone floor tile.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary font-mono text-[16px] focus:outline-none cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Input Name */}
            <div className="flex flex-col gap-xs">
              <label
                htmlFor="signature-name"
                className="font-mono-label text-[11px] text-text-muted uppercase tracking-wider"
              >
                Your Name
              </label>
              <input
                id="signature-name"
                type="text"
                placeholder="Enter name or initials..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={25}
                className="w-full bg-surface border border-border rounded-card px-md py-sm font-body-sm text-[14px] text-text-primary focus:outline-none focus:border-primary-container transition-colors"
              />
            </div>

            {/* Drawing Canvas Area */}
            <div className="flex flex-col gap-xs">
              <span className="font-mono-label text-[11px] text-text-muted uppercase tracking-wider">
                Drawing Slate
              </span>
              <div className="relative w-full h-[180px] bg-[#fdfaf2] border border-border/80 rounded-card overflow-hidden cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={stopDrawing}
                  className="absolute inset-0 w-full h-full touch-none"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-md sm:gap-sm mt-xs">
              <button
                onClick={clearCanvas}
                className="w-full sm:w-auto font-mono-label text-[11px] uppercase tracking-widest text-secondary hover:text-primary transition-colors cursor-pointer focus:outline-none text-center sm:text-left py-xs"
              >
                Clear Slate
              </button>

              <div className="flex w-full sm:w-auto gap-sm justify-between sm:justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-initial text-center font-mono-label text-[11px] uppercase tracking-widest text-secondary hover:text-primary transition-colors cursor-pointer focus:outline-none px-md py-sm rounded-md border border-border/40"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCarve}
                  disabled={!name.trim()}
                  className={`flex-1 sm:flex-initial text-center font-mono-label text-[11px] uppercase tracking-widest text-white bg-primary-container hover:bg-accent-hover transition-colors px-md sm:px-lg py-sm rounded-md shadow-md focus:outline-none cursor-pointer ${
                    !name.trim() ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  Carve Tile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
