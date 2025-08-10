export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] text-gray-400 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© {new Date().getFullYear()} Code Bharat. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="https://github.com/Harsh3185/Code-Bharat" target="_blank" rel="noopener noreferrer" className="hover:text-white">
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
