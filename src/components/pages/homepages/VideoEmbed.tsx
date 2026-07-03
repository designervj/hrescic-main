"use client";

import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import YouTube, { type YouTubeProps } from "react-youtube";
import { PageBlock } from "@/lib/store/pages/pageType";


interface VideoEmbedProps {
  videoUrl: string;
  youtubeId: string;
}

export default function VideoEmbed({ block }: { block: PageBlock }) {
  const props = block.props as unknown as VideoEmbedProps;
  const [loadVideo, setLoadVideo] = useState(false);

  const ytOpts: YouTubeProps["opts"] = useMemo(
    () => ({
      width: "100%", height: "100%",
      playerVars: { autoplay: 1, controls: 1, rel: 0, modestbranding: 1 },
    }),
    []
  );

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-[#3E0577] md:h-[450px]"
      style={!loadVideo ? {
        backgroundImage: `url('${props.videoUrl || `https://img.youtube.com/vi/${props.youtubeId}/maxresdefault.jpg`}')`,
        backgroundSize: "cover", backgroundPosition: "center",
      } : undefined}
    >
      {!loadVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button onClick={() => setLoadVideo(true)}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-black/30"
            aria-label="Play video" type="button"
          >
            <Play className="h-8 w-8 fill-white" />
          </button>
        </div>
      )}
      {loadVideo && (
        <div className="absolute inset-0">
          <YouTube videoId={props.youtubeId} opts={ytOpts} className="h-full w-full" iframeClassName="h-full w-full" />
        </div>
      )}
    </div>
  );
}
