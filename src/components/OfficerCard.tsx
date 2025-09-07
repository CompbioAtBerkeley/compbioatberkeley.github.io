import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FaGlobe, FaLinkedin, FaGithub } from "react-icons/fa";
import { Officer } from "@/types/officers";

interface OfficerCardProps {
  officer: Officer;
}

export const OfficerCard = ({ officer }: OfficerCardProps) => {
  // Use the current JSON structure fields
  const name = officer.name || '';
  const role = officer.role || '';
  const image = officer.image || '';
  const personalWebsite = officer["personal website"] || '';
  const linkedin = officer.linkedin || '';
  const github = officer.github || '';
  const orcid = officer.orcid || '';

  // Default placeholder image path
  const defaultImage = '/placeholder.svg';

  return (
    <Card className="border-bio-green/20 hover:shadow-bio transition-all duration-300 h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile Image */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-bio flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultImage;
                }}
              />
            ) : (
              <img
                src={defaultImage}
                alt={name}
                className="w-full h-full object-cover opacity-70"
              />
            )}
          </div>

          {/* Name and Role */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-bio-green">{name}</h3>
            {role && (
              <Badge variant="secondary" className="bg-bio-green/10 text-bio-green">
                {role}
              </Badge>
            )}
          </div>

          {/* Contact Links */}
          <div className="flex space-x-4 pt-2">
            {personalWebsite && (
              <a
                href={personalWebsite.startsWith('http') ? personalWebsite : `https://${personalWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bio-green hover:text-bio-green/80 transition-colors"
                title="Personal Website"
              >
                <FaGlobe className="w-5 h-5" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bio-green hover:text-bio-green/80 transition-colors"
                title="LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            )}
            {github && (
              <a
                href={github.startsWith('http') ? github : `https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bio-green hover:text-bio-green/80 transition-colors"
                title="GitHub"
              >
                <FaGithub className="w-5 h-5" />
              </a>
            )}
            {orcid && (
              <a
                href={orcid.startsWith('http') ? orcid : `https://orcid.org/${orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-bio-green hover:text-bio-green/80 transition-colors"
                title="ORCID"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947-.525 0-.946-.422-.946-.947 0-.525.421-.947.946-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.781-1.4 3.781-3.722 0-2.016-1.178-3.722-3.781-3.722h-2.297z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
