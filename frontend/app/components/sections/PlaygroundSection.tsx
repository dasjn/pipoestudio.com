"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/app/components/Button";

interface PostFooterSectionData {
  _type: "postFooterSection";
  thankYouText?: string;
  musicButtonText?: string;
  musicUrl?: string;
}

interface Props {
  data?: PostFooterSectionData;
}

export default function PlaygroundSection({ data }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <section id="postFooter" className="h-svh relative overflow-hidden">
      <video
        src="/videos/PipoDancing-01.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {data?.musicUrl && (
        <audio ref={audioRef} src={data.musicUrl} />
      )}

      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {data?.musicButtonText && data?.musicUrl && (
          <Button
            as="button"
            variant="secondary"
            size="sm"
            onClick={toggleMusic}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
              aria-hidden="true"
            >
              {playing ? "pause" : "play_arrow"}
            </span>
            {playing ? "PAUSE" : data.musicButtonText}
          </Button>
        )}

        {data?.thankYouText && (
          <p
            className="font-sans font-bold text-4xl leading-none tracking-normal text-center text-white"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            {data.thankYouText}
          </p>
        )}
      </div>
    </section>
  );
}
