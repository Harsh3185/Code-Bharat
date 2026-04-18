import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { useSelector } from "react-redux";
import mesh from "../assets/mesh.png";

const links = [
  { title: "Problems", to: "/problems" },
  { title: "Explore", to: "/explore" },
  { title: "Contests", to: "/contests" },
  { title: "Leaderboard", to: "/leaderboard" },
];

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0f14] text-white">
      <Motion.img
        src={mesh}
        alt="Code Bharat background"
        initial={{ scale: 1.04, opacity: 0.78 }}
        animate={{
          scale: [1.04, 1.08, 1.04],
          opacity: [0.76, 0.9, 0.76],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,10,14,0.78)_0%,rgba(6,10,14,0.48)_45%,rgba(6,10,14,0.3)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70"
          >
            Code Bharat
          </Motion.p>

          <Motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.06 }}
            className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            Practice coding in one serious workspace.
          </Motion.h1>

          <Motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.14 }}
            className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg"
          >
            Read. Code. Run. Submit.
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/problems"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#10212d] transition hover:bg-[#e7eef5]"
            >
              Start Solving
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
              >
                {user.userName}
              </Link>
            ) : (
              <Link
                to="/register"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
              >
                Create Account
              </Link>
            )}
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {links.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="rounded-[24px] border border-white/15 bg-black/20 px-5 py-5 backdrop-blur-md transition hover:bg-black/28"
              >
                <p className="text-lg font-semibold text-white">{item.title}</p>
              </Link>
            ))}
          </Motion.div>
        </div>
      </section>
    </main>
  );
}
