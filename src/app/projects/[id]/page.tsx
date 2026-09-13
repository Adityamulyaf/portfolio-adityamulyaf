import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BackLink from "@/components/BackLink";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { projects } from "@/data/projects";

type Params = { params: Promise<{ id: string }> };

/** Every project is known at build time, so all six are prerendered. */
export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title} | Firizqi Aditya Mulya`,
    description: project.details.overview,
  };
}

/** A small caption above a block of prose. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-body text-label text-text-muted mb-xs block">
      {children}
    </span>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const { details } = project;

  return (
    <>
      <Navbar />

      <main className="flex-1 flex flex-col">
        <article className="max-w-max-width mx-auto px-gutter md:px-xl w-full pt-[120px] md:pt-[160px] pb-xxl">
          <BackLink className="font-body text-label text-text-muted hover:text-primary transition-colors link-hover cursor-pointer">
            ← Back to projects
          </BackLink>

          <header className="mt-md mb-xl">
            <Label>
              {project.domain} · Spellbook
            </Label>
            <h1 className="font-display text-h2 italic text-text-primary">
              {project.title}
            </h1>
            <p className="font-body text-lead font-light text-secondary-fixed-dim mt-sm max-w-[58ch] text-justify">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-sm gap-y-xs mt-md">
              {project.stack.map((tech) => (
                <span key={tech} className="font-body text-micro text-text-muted">
                  {tech}
                </span>
              ))}
            </div>
          </header>

          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-card bg-surface mb-xxl">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
            <section className="md:col-span-7">
              <Label>Overview</Label>
              <p className="font-body text-lead font-light text-secondary-fixed-dim max-w-[62ch] text-justify">
                {details.overview}
              </p>

              <div className="mt-xl grid grid-cols-1 sm:grid-cols-2 gap-lg">
                <div>
                  <Label>The challenge</Label>
                  <p className="font-body text-small text-secondary-fixed-dim text-justify">
                    {details.challenge}
                  </p>
                </div>
                <div>
                  <Label>The solution</Label>
                  <p className="font-body text-small text-secondary-fixed-dim text-justify">
                    {details.solution}
                  </p>
                </div>
              </div>
            </section>

            <aside className="md:col-span-4 md:col-start-9 self-start">
              <Label>Links</Label>
              <div className="flex flex-col items-start gap-sm">
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-small font-medium text-primary-container hover:text-accent-hover transition-colors link-hover"
                >
                  View repository ↗
                </a>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-small font-medium text-primary-container hover:text-accent-hover transition-colors link-hover"
                  >
                    Visit live site ↗
                  </a>
                )}
              </div>
            </aside>
          </div>

          {/* The data has carried this snippet all along; the scroll overlay
              never had room to show it. */}
          <section className="mt-xxl">
            <Label>{details.codeSnippetTitle}</Label>
            <pre className="overflow-x-auto rounded-card bg-primary text-on-primary-container p-md md:p-lg">
              <code className="font-mono text-small leading-relaxed">
                {details.codeSnippet}
              </code>
            </pre>
          </section>
        </article>
      </main>

      <Footer showContactIcons />
    </>
  );
}
