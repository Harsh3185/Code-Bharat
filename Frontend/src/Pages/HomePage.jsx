import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mesh from "../assets/mesh.png";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#f8f8f8] via-[#f4f4f4] to-[#fdfdfd] text-black overflow-hidden">
      
      <motion.img
        src={mesh}
        alt="mesh texture"
        initial={{ opacity: 0.4, scale: 1.05, x: -80, y: -60 }}
        animate={{
          opacity: 0.6,
          scale: [1.05, 1.03, 1.05],
          x: [-80, -60, -80],
          y: [-60, -50, -60],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-[1400px] md:w-[1700px] pointer-events-none select-none mix-blend-multiply md:opacity-50 [filter:contrast(130%)_saturate(120%)]"
      />

      <div className="relative z-10 flex flex-col justify-center min-h-screen px-6 sm:px-12">
        <div className="max-w-[820px] ml-auto pt-24 text-right">
          <motion.h1
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight space-y-2"
          >
            <span className="block">Empowering</span>
            <span className="block text-slate-800">Future&nbsp;Coders</span>
            <span className="block">to&nbsp;Build&nbsp;Tomorrow.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-700"
          >
            Practice.&nbsp;Compete.&nbsp;Grow. <br />
            <span className="text-gray-800/80">Code&nbsp;Bharat is your online coding battleground.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 flex justify-end gap-4 flex-wrap"
          >
            <Link to="/problems">
              <button className="px-6 py-3 rounded-md border border-black font-medium hover:bg-black hover:text-white transition duration-200 shadow-sm hover:shadow-md">
                Start&nbsp;Practicing
              </button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-3 rounded-md bg-black text-white font-medium hover:bg-gray-900 transition duration-200 shadow-sm hover:shadow-md">
                Join&nbsp;Now&nbsp;→
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
