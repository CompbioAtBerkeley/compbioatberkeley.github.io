import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
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

  return (
    <footer className="bg-gradient-to-r from-primary/5 to-bio-green/5 border-t border-bio-green/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-gradient-bio rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div> */}
              <img 
              src={compBioLogo} 
              alt="Computational Biology at Berkeley" 
              className="h-10 w-10 object-contain"
            />
              <span className="font-semibold text-lg bg-gradient-bio bg-clip-text text-transparent">
                Computational Biology at Berkeley
              </span>
            </div>
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
                  <Link 
                    to={link.path} 
                    className="text-muted-foreground hover:text-bio-green transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-compute-blue mb-4">Connect With Us</h3>
            <div className="space-y-2">
              
              <a 
                href="#" 
                className="flex items-center text-muted-foreground hover:text-compute-blue transition-colors duration-200 text-sm"
              >
                LinkedIn
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <a 
                href="#" 
                className="flex items-center text-muted-foreground hover:text-compute-blue transition-colors duration-200 text-sm"
              >
                Instagram
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
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