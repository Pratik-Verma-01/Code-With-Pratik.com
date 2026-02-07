import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Youtube, Heart } from 'lucide-react';
import Logo from './Logo';
import { ROUTES } from '@config/routes.config';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-dark-900 pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-4">
              <Logo size="md" />
              <span className="text-lg font-bold font-display">CODE-With-PRATIK</span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-6">
              A futuristic platform for developers to share projects, collaborate, and grow with AI-powered assistance.
            </p>
            <div className="flex gap-4">
              <SocialLink href="https://github.com" icon={<Github size={18} />} label="GitHub" />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="https://youtube.com" icon={<Youtube size={18} />} label="YouTube" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <FooterLink to={ROUTES.EXPLORE}>Explore</FooterLink>
              <FooterLink to={ROUTES.FEATURES}>Features</FooterLink>
              <FooterLink to={ROUTES.REWARDS}>Rewards</FooterLink>
              <FooterLink to="/roadmap">Roadmap</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <FooterLink to="/docs">Documentation</FooterLink>
              <FooterLink to="/api">API Reference</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/community">Community</FooterLink>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
              <FooterLink to="/cookies">Cookie Policy</FooterLink>
              <FooterLink to="/security">Security</FooterLink>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-500">
          <p>© {currentYear} 〄𝙲𝙾𝙳𝙴-Ꮿɪᴛʜ-ᎮᏒᎪTᎥᏦ〄. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart size={14} className="text-red-500 fill-current animate-pulse-slow" />
            <span>by Pratik</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="hover:text-neon-blue transition-colors">
      {children}
    </Link>
  </li>
);

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-dark-400 hover:bg-white/10 hover:text-white transition-all hover:scale-110"
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
