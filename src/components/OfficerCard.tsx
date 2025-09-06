import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Linkedin, Github, User } from "lucide-react";
import { Officer } from "@/types/officers";

interface OfficerCardProps {
  officer: Officer;
}

export const OfficerCard = ({ officer }: OfficerCardProps) => {
  // Common field mappings - adjust based on your Google Sheet columns
  const name = officer.Name || officer.name || '';
  const position = officer.Position || officer.Role || officer.role || '';
  const email = officer.Email || officer.email || '';
  const year = officer.Year || officer.year || '';
  const major = officer.Major || officer.major || '';
  const bio = officer.Bio || officer.bio || officer.Description || officer.description || '';
  const linkedin = officer.LinkedIn || officer.linkedin || '';
  const github = officer.GitHub || officer.github || '';
  const photo = officer.Photo || officer['Photo URL'] || officer.photo || '';

  return (
    <Card className="border-bio-green/20 hover:shadow-bio transition-all duration-300 h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Profile Image */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-bio flex items-center justify-center">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`${photo ? 'hidden' : 'flex'} w-12 h-12 text-white items-center justify-center`}>
              <User className="w-8 h-8" />
            </div>
          </div>

          {/* Name and Position */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-bio-green">{name}</h3>
            {position && (
              <Badge variant="secondary" className="bg-bio-green/10 text-bio-green">
                {position}
              </Badge>
            )}
          </div>

          {/* Academic Info */}
          {(year || major) && (
            <div className="text-sm text-muted-foreground space-y-1">
              {year && <div>Class of {year}</div>}
              {major && <div>{major}</div>}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {bio}
            </p>
          )}

          {/* Contact Links */}
          <div className="flex space-x-4 pt-2">
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-bio-green hover:text-bio-green/80 transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
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
                <Linkedin className="w-5 h-5" />
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
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
