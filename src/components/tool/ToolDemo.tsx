import type { ReactNode } from "react";
import AppMockup from "@/components/common/AppMockup";
import Icon from "@/components/ui/Icon";
import ContactActions from "@/components/common/ContactActions";
import type { Tool } from "@/types";

/**
 * The demonstration slot.
 *
 * When a tool has a recorded demo, this renders the player. Until then it
 * falls back to the drawn interface preview and an honest note — no broken
 * embeds and no empty black rectangle.
 *
 * To add a demo, set `video` on the tool in src/data/tools.ts:
 *   video: { kind: "youtube", id: "dQw4w9WgXcQ", duration: "1:24" }
 */
export function ToolDemo({ tool }: { tool: Tool }) {
  const { video } = tool;

  if (video.kind === "youtube" && video.id) {
    return (
      <Frame>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}`}
          title={`${tool.name} demonstration`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </Frame>
    );
  }

  if (video.kind === "vimeo" && video.id) {
    return (
      <Frame>
        <iframe
          src={`https://player.vimeo.com/video/${video.id}`}
          title={`${tool.name} demonstration`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </Frame>
    );
  }

  if (video.kind === "file" && video.id) {
    return (
      <Frame>
        <video
          controls
          preload="metadata"
          poster={video.poster}
          className="absolute inset-0 h-full w-full bg-navy object-contain"
        >
          <source src={video.id} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </Frame>
    );
  }

  /* No demo recorded yet — show the interface preview instead. */
  return (
    <div>
      <div className="rounded-2xl border border-ink-200 bg-ink-50/60 p-4 sm:p-6">
        <AppMockup
          layout={tool.mockup}
          title={`${tool.name} — interface`}
          glyph={tool.glyph}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-dashed border-ink-200 bg-white px-4 py-3">
        <Icon name="video" className="text-base text-ink-400" />
        <p className="flex-1 text-[0.8125rem] leading-relaxed text-ink-600">
          A recorded walkthrough of {tool.name} is not published yet. Ask for a live
          demonstration and we will walk you through it on a real model.
        </p>
        <ContactActions context={`a demo of ${tool.name}`} size="sm" showLabels={false} />
      </div>
    </div>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-ink-200 bg-navy shadow-lift">
      {children}
    </div>
  );
}

export default ToolDemo;
