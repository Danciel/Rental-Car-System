import { Car, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const footerSections = {
    about: {
      title: 'About',
      links: ['About Us', 'Careers', 'Press', 'Blog']
    },
    community: {
      title: 'Community',
      links: ['Hosts', 'Renters', 'Referrals', 'Events']
    },
    support: {
      title: 'Support',
      links: ['Help Center', 'Safety', 'Contact Us', 'Trust & Safety']
    }
  };

  const socialLinks = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' }
  ];

  return (
    <footer className="text-white" style={{ backgroundColor: '#1E3A8A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{footerSections.about.title}</h3>
            <ul className="space-y-2">
              {footerSections.about.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm sm:text-base">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{footerSections.community.title}</h3>
            <ul className="space-y-2">
              {footerSections.community.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm sm:text-base">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{footerSections.support.title}</h3>
            <ul className="space-y-2">
              {footerSections.support.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/80 hover:text-white transition-colors text-sm sm:text-base">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Social Links</h3>
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Car className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">AutoShare</span>
          </div>
          <p className="text-white/60 text-sm text-center">
            © {new Date().getFullYear()} AutoShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}