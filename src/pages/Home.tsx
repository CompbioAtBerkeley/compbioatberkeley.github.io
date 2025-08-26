import { ExternalLink, Users, Microscope, Computer } from "lucide-react";
import { Link } from "react-router-dom";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Card, CardContent } from "@/components/ui/card";
import heroBg from "@/assets/hero-bg.jpg";
import compBioLogo from "@/assets/comp-bio-logo.png";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-center px-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src={compBioLogo} 
              alt="Computational Biology at Berkeley" 
              className="w-40 h-40 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-bio-green-light to-compute-blue bg-clip-text text-transparent animate-pulse">
            Computational Biology at Berkeley
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            A student-driven community exploring the intersection of computer science, biology, and healthcare.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a 
              href="https://forms.gle/nrsXrPFKA8CRn9P66" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <EnhancedButton variant="hero" size="xl" className="min-w-[200px]">
                Sign up for updates
                <ExternalLink className="w-5 h-5" />
              </EnhancedButton>
            </a>
            
            {/* <a 
              href="https://join.slack.com/t/computational-yzc4071/shared_invite/zt-3bqva9ctw-FdzQ~QsK90qYMhgBlWZKyg" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <EnhancedButton variant="bio-outline" size="xl" className="min-w-[200px] border-white text-white hover:bg-white hover:text-primary">
                Join our Slack
                <ExternalLink className="w-5 h-5" />
              </EnhancedButton>
            </a> */}
          </div>
        </div>
      </section>

      {/* About Us Preview */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-bio bg-clip-text text-transparent">
              About Us
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              At Computational Biology at Berkeley, we aim to:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="border-bio-green/20 hover:border-bio-green/50 transition-all duration-300 hover:shadow-bio">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-bio rounded-full flex items-center justify-center mx-auto mb-6">
                  <Microscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-bio-green">Expand Understanding</h3>
                <p className="text-muted-foreground">
                  Expand members' understanding of computational biology through hands-on learning and research.
                </p>
              </CardContent>
            </Card>

            <Card className="border-compute-blue/20 hover:border-compute-blue/50 transition-all duration-300 hover:shadow-compute">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-compute rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-compute-blue">Build Connections</h3>
                <p className="text-muted-foreground">
                  Build connections with peers, faculty, alumni, and industry professionals in the field.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
                  <Computer className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-primary">Real-world Impact</h3>
                <p className="text-muted-foreground">
                  Engage in projects with real-world impact on healthcare and communities.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link to="/about">
              <EnhancedButton variant="bio-solid" size="lg">
                Learn More
              </EnhancedButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;