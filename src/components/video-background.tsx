"use client";

import { useEffect, useRef } from "react";

const FADE_SECONDS = 0.8;
const MAX_OPACITY = 0.4;
const MIN_OPACITY = 0.18;

export function VideoBackground({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function handleTimeUpdate() {
      if (!video || !video.duration) return;
      const remaining = video.duration - video.currentTime;
      let factor = 1;
      if (remaining < FADE_SECONDS) {
        factor = Math.max(remaining / FADE_SECONDS, 0);
      } else if (video.currentTime < FADE_SECONDS) {
        factor = Math.min(video.currentTime / FADE_SECONDS, 1);
      }
      video.style.opacity = String(MIN_OPACITY + (MAX_OPACITY - MIN_OPACITY) * factor);
    }

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 h-full w-full object-cover transition-opacity duration-150"
      style={{ opacity: MIN_OPACITY }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
