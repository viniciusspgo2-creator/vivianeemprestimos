"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Reproduz o IntersectionObserver do main.js original:
 * adiciona .visible aos .reveal quando entram na viewport.
 * Re-executa a cada troca de rota.
 */
export function RevealEngine() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.visible)")
    );
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

/**
 * Acordeão com comportamento exclusivo do original:
 * abrir um item fecha os demais.
 */
export function AccordionGroup({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const refs = useRef<(HTMLDetailsElement | null)[]>([]);

  function handleToggle(index: number) {
    const current = refs.current[index];
    if (!current?.open) return;
    refs.current.forEach((d, i) => {
      if (d && i !== index) d.open = false;
    });
  }

  return (
    <div className="accordion reveal">
      {items.map((item, i) => (
        <details
          key={item.q}
          ref={(el) => {
            refs.current[i] = el;
          }}
          onToggle={() => handleToggle(i)}
        >
          <summary>
            {item.q}
            <i />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
