import { Link as RouterLink } from "react-router-dom";
import { FaGithub, FaFolderOpen, FaLink, FaInstagram, FaLinkedin } from "react-icons/fa";
import compBioLogo from "@/assets/comp-bio-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "Calendar", path: "/calendar" },
    { name: "Collaborations", path: "/collaborations" },
  ];

  const socialLinks = [
    { 
      name: "Instagram", 
      url: "https://www.instagram.com/ucb_compbio/", 
      icon: FaInstagram 
    },
    { 
      name: "LinkedIn", 
      url: "https://www.linkedin.com/company/computational-biology-at-berkeley/", 
      icon: FaLinkedin 
    },
    { 
      name: "Organization GitHub", 
      url: "https://github.com/CompbioAtBerkeley", 
      icon: FaGithub 
    },
    { 
      name: "Projects GitHub", 
      url: "https://github.com/Compbio-at-berkeley-projects", 
      icon: FaFolderOpen 
    },
    { 
      name: "Linktree", 
      url: "https://linktr.ee/compbioatberkeley", 
      icon: FaLink 
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-primary/5 to-bio-green/5 border-t border-bio-green/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <RouterLink to="/" className="flex items-center space-x-2 group">
              <img 
                src={compBioLogo} 
                alt="Computational Biology at Berkeley" 
                className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
              />
              <span className="font-semibold text-lg bg-gradient-bio bg-clip-text text-transparent">
                Computational Biology at Berkeley
              </span>
            </RouterLink>
            <p className="text-muted-foreground text-sm">
              Bridging the gap between biology and computation through education, research, and community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-bio-green mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <RouterLink 
                    to={link.path} 
                    className="text-muted-foreground hover:text-bio-green transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-compute-blue mb-4">Connect With Us</h3>
            <div className="space-y-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.name}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-compute-blue transition-colors duration-200 text-sm group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    {social.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs">
            © {currentYear} Computational Biology at Berkeley | Designed by students, for students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;