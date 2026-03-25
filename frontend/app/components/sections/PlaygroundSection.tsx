export default function Playground() {
  return (
    <section
      id="postFooter"
      className="h-svh relative overflow-hidden"
    >
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
    </section>
  );
}
