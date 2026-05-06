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

const FADE_DURATION = 800;

export default function PlaygroundSection({ data }: Props) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setPlaying(false);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  function cancelFade() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }

  function fadeIn(audio: HTMLAudioElement) {
    cancelFade();
    audio.volume = 0;
    audio.play();
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / FADE_DURATION, 1);
      audio.volume = Math.min(1, t);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function fadeOut(audio: HTMLAudioElement, onDone: () => void) {
    cancelFade();
    const startVol = audio.volume;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / FADE_DURATION, 1);
      audio.volume = Math.max(0, startVol * (1 - t));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        audio.pause();
        audio.volume = 1;
        onDone();
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      fadeOut(audio, () => setPlaying(false));
    } else {
      setPlaying(true);
      fadeIn(audio);
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
          bottom: "5%",
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {data?.musicButtonText && data?.musicUrl && (
          <Button
            as="button"
            variant="secondary"
            size="md"
            onClick={toggleMusic}
            className="rotate-[-6deg]"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "30px", lineHeight: 1, verticalAlign: "middle", display: "inline-flex", alignItems: "center" }}
              aria-hidden="true"
            >
              {playing ? "pause" : "play_arrow"}
            </span>
            {playing ? "PAUSE" : data.musicButtonText}
          </Button>
        )}

        {data?.thankYouText && (
          <p
            className="font-sans font-bold text-6xl leading-none tracking-normal text-center text-white"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            {data.thankYouText}
          </p>
        )}
      </div>
    </section>
  );
}
