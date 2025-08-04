"use client";

export default function VideoHero() {
  return (
    <video
      className="object-cover h-screen w-screen"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src="/interview-one.mp4" type="video/mp4" />
    </video>
  );
}
