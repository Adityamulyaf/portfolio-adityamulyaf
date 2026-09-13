"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

export interface Signature {
  id: string;
  name: string;
  dataUrl: string;
  date: string;
}

const STORE = "carved_statues";

/** Draws the two sample statues shown before anyone has signed. */
function mockSignature(text: string): string {
  if (typeof window === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = 240;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.font = "italic 28px 'Instrument Serif', Georgia, serif";
  ctx.fillStyle = "#1C2E46";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  ctx.beginPath();
  ctx.moveTo(30, 70);
  ctx.bezierCurveTo(90, 85, 150, 50, 210, 70);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#1C2E46";
  ctx.stroke();

  return canvas.toDataURL();
}

function mockDefaults(): Signature[] {
  return [
    { id: "ada", name: "Ada Lovelace", dataUrl: mockSignature("Ada Lovelace"), date: "10 Dec 1843" },
    { id: "alan", name: "Alan Turing", dataUrl: mockSignature("Alan Turing"), date: "23 Jun 1912" },
  ];
}

function readLocal(): Signature[] {
  try {
    const saved = localStorage.getItem(STORE);
    if (saved) return JSON.parse(saved) as Signature[];
  } catch {
    /* unreadable or disabled storage — fall through to the defaults */
  }
  const defaults = mockDefaults();
  try {
    localStorage.setItem(STORE, JSON.stringify(defaults));
  } catch {
    /* nothing to do: the defaults still render for this session */
  }
  return defaults;
}

/**
 * Reads the guestbook, newest first, capped at `take`.
 *
 * The cap is the whole point of the hook: the wall is unbounded by nature, so
 * every caller states how much of it it is willing to render. `total` is the
 * count actually loaded, which equals the real total only while it is under
 * the cap — enough for "showing N of the wall", not a source of truth.
 */
export function useSignatures(take: number) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  // Local-mode writes have nowhere to push to, so the hook keeps its own copy.
  const localRef = useRef<Signature[]>([]);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const q = query(
        collection(db, STORE),
        orderBy("createdAt", "desc"),
        limit(take)
      );
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
          setSignatures(list.length ? list : mockDefaults());
          setLoading(false);
        },
        (error) => {
          console.error("Firestore read failed, using local guestbook:", error);
          localRef.current = readLocal();
          setSignatures(localRef.current.slice(0, take));
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }

    localRef.current = readLocal();
    setSignatures(localRef.current.slice(0, take));
    setLoading(false);
  }, [take]);

  // Declared before addSignature so it is initialised by the time that
  // callback closes over it, and memoised so it can be a real dependency.
  const saveLocal = useCallback(
    (name: string, dataUrl: string, date: string) => {
      const entry: Signature = { id: Date.now().toString(), name, dataUrl, date };
      const next = [entry, ...localRef.current];
      localRef.current = next;
      setSignatures(next.slice(0, take));
      try {
        localStorage.setItem(STORE, JSON.stringify(next));
      } catch {
        /* the statue still shows for this session */
      }
    },
    [take]
  );

  /** Returns null on success, or a message to show the person. */
  const addSignature = useCallback(
    async (name: string, dataUrl: string): Promise<string | null> => {
      const date = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (isFirebaseConfigured && db) {
        try {
          // onSnapshot delivers the new statue, so there is nothing to set here.
          await addDoc(collection(db, STORE), {
            name,
            dataUrl,
            date,
            createdAt: serverTimestamp(),
          });
          return null;
        } catch (error) {
          console.error("Firestore write failed, saving locally:", error);
          saveLocal(name, dataUrl, date);
          return "Saved to this device only. The guestbook is offline right now.";
        }
      }

      saveLocal(name, dataUrl, date);
      return null;
    },
    [saveLocal]
  );

  return { signatures, loading, total: signatures.length, addSignature };
}
