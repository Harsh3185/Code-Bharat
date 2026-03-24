export default function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] py-6 text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between px-4 text-sm md:flex-row">
        <p>&copy; {new Date().getFullYear()} Code Bharat. All rights reserved.</p>
        <div className="mt-4 flex gap-6 md:mt-0">
          <a
            href="https://github.com/Harsh3185/Code-Bharat"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white"
          >
            GitHub
          </a>
          <a href="https://harsh-choudhary-nine.vercel.app/" className="hover:text-white">
            About
          </a>
          <a href="https://harsh-choudhary-nine.vercel.app/" className="hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
