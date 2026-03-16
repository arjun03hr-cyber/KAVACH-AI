import { Link } from 'react-router-dom';
import { Shield, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg neon-text">Kavach AI</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Next-generation AI password strength classification. Secure your digital life with neural networks.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/analyze" className="hover:text-white transition-colors">Analyzer</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>
          {/* Socials */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="https://github.com/arjun03hr-cyber/KAVACH-AI" className="text-gray-500 hover:text-primary transition-colors"><Github size={20} /></a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Kavach AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
