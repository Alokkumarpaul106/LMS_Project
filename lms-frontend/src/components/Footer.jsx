export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white/80 backdrop-blur-md mt-auto shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        
        <p className="text-sm font-medium text-gray-600">
          © 2026 TARGET. Developed by <span className="text-indigo-600 font-semibold">Alok kumar paul</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600">
          <a href="tel:01738300106" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <span className="font-medium">Mobile:</span> 01738300106
          </a>
          <span className="hidden sm:inline text-gray-300">|</span>
          <a href="mailto:alokkumar.dev@gmail.com" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <span className="font-medium">Gmail:</span> alokpaul.dev@gmail.com
          </a>
        </div>

      </div>
    </footer>
  );
}
