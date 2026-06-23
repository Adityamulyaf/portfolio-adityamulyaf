"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Project, projects } from "../data/projects";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ProjectsProps {
  activeSpecialization: string | null;
  onSelectProject: (project: Project) => void;
  onClearFilter: () => void;
}

export default function Projects({
  activeSpecialization,
  onSelectProject,
  onClearFilter,
}: ProjectsProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".gsap-project-card");
      
      // Clear any existing timelines to avoid duplications
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === gridRef.current) {
          trigger.kill();
        }
      });

      gsap.fromTo(
        cards,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="pt-28 md:pt-8 pb-xl scroll-mt-24" id="projects">
      {/* Section Header */}
      <div className="mb-xxl text-left">
        <span className="font-mono-label text-[11px] text-text-muted uppercase mb-xs block tracking-[0.04em]">
          WORK
        </span>
        <h2 className="font-body-md text-headline-lg-mobile md:text-headline-lg font-bold text-text-primary leading-none">
          Projects
        </h2>
      </div>

      {/* Filter Status */}
      {activeSpecialization && (
        <div className="mb-lg flex items-center gap-sm text-left bg-surface border border-border px-sm py-xs rounded-card inline-flex animate-fade-in">
          <span className="font-mono-label text-[11px] text-primary-container font-semibold uppercase tracking-[0.04em]">
            Filter: {activeSpecialization}
          </span>
          <span className="text-text-muted">|</span>
          <button
            onClick={onClearFilter}
            className="font-mono-label text-[11px] text-secondary hover:text-primary transition-colors underline cursor-pointer focus:outline-none"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Bento Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-12 gap-x-lg gap-y-xxl"
      >
        {projects.map((project) => {
          const isMatched = activeSpecialization
            ? project.specializations.includes(activeSpecialization)
            : true;

          return (
            <article
              key={project.id}
              className={`${project.gridClass} group gsap-project-card opacity-0 transition-all duration-500 ${
                isMatched
                  ? "opacity-100 scale-100"
                  : "opacity-20 blur-[1px] scale-[0.98] pointer-events-none"
              }`}
            >
              <button
                onClick={() => isMatched && onSelectProject(project)}
                className="block w-full text-left cursor-pointer focus:outline-none transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99] ease-[0.16,1,0.3,1]"
              >
                {/* Image Wrapper */}
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-card mb-md bg-surface">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Card Meta */}
                <span className="font-mono-label text-[11px] text-text-muted uppercase mb-xs block tracking-[0.04em]">
                  {project.domain}
                </span>
                <h3 className="font-body-md text-headline-md-mobile md:text-[22px] font-bold text-text-primary mb-xs">
                  {project.title}
                </h3>
                <p className="font-body-md text-[15px] font-light text-secondary-fixed-dim mb-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Stack Tags */}
                <div className="flex flex-wrap gap-x-sm gap-y-xs">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono-label text-[11px] text-text-muted tracking-[0.04em]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
