import mesh from "../assets/mesh.png";

export default function MeshPageShell({ children, contentClassName = "" }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0f14] text-white">
      <img
        src={mesh}
        alt="Code Bharat background"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,14,0.76)_0%,rgba(6,10,14,0.5)_45%,rgba(6,10,14,0.42)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />

      <section className={`relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${contentClassName}`}>
        {children}
      </section>
    </main>
  );
}
