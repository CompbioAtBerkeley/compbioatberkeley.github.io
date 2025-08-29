import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { GraduationCap, Users, Building, Mail, ExternalLink } from "lucide-react";

const Collaborations = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-bio bg-clip-text text-transparent">
            Work With Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We welcome collaboration with students, alumni, faculty, and industry partners to advance computational biology education and research.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Research Section */}
          <Card className="border-bio-green/20 hover:shadow-bio transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-bio-green">
                <GraduationCap className="w-6 h-6 mr-3" />
                Research Projects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We can help you build computational tools and analyze data to accelerate your biological research.
              </p>
              <EnhancedButton variant="bio-solid" size="lg">
                Contact our Projects Lead
                <ExternalLink className="w-4 h-4" />
              </EnhancedButton>
            </CardContent>
          </Card>

          {/* Presentation Section */}
          <Card className="border-compute-blue/20 hover:shadow-compute transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-compute-blue">
                <Users className="w-6 h-6 mr-3" />
                Share your experiences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Give a presentation on industry or research topics related to computational biology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <EnhancedButton variant="compute-solid" size="lg">
                  Contact our Academic Lead
                  <Mail className="w-4 h-4" />
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>

          {/* Industry Section */}
          <Card className="border-primary/20 hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-primary">
                <Building className="w-6 h-6 mr-3" />
                Industry Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Partner with us through sponsorships, guest lectures, workshop collaborations, and internship opportunities. Help us bridge the gap between academia and industry. 
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-primary">What we can provide</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Top Undergraduates in Computational Biology</li>
                    <li>• Software Development for Research</li>
                    <li>• A platform to promote your events and opportunities</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-primary">What we are looking for (open to discussion)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Company Tours and Connections </li>
                    <li>• Computational Resources and Mentorship</li>
                    <li>• Research Partnerships</li>
                  </ul>
                </div>
              </div>
              <EnhancedButton variant="hero" size="lg">
                Contact EVP for Partnerships
                <Mail className="w-4 h-4" />
              </EnhancedButton>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center p-8 bg-gradient-to-r from-bio-green/10 to-compute-blue/10 rounded-2xl border border-bio-green/20">
          <h3 className="text-2xl font-semibold mb-4 bg-gradient-compute bg-clip-text text-transparent">
            Ready to Collaborate?
          </h3>
          <p className="text-muted-foreground mb-6">
            We're always looking for new opportunities to work with passionate individuals and organizations who share our vision for advancing computational biology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton variant="bio-outline" size="lg">
              Send us an Email
              <Mail className="w-4 h-4" />
            </EnhancedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collaborations;