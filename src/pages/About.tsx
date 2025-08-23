import { Card, CardContent } from "@/components/ui/card";
import { Dna, Brain, Network, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Mission Statement */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-bio bg-clip-text text-transparent">
            Our Mission
          </h1>
          <div className="bg-gradient-to-r from-bio-green/10 to-compute-blue/10 rounded-2xl p-8 border border-bio-green/20">
            <p className="text-lg md:text-xl leading-relaxed text-foreground">
              Computational Biology at Berkeley is a student organization dedicated to bridging the gap between biology and computation. We provide a collaborative environment where students can deepen their knowledge, work on interdisciplinary projects, and connect with leaders in academia and industry.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-compute bg-clip-text text-transparent">
            What We Do
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-bio-green/20 hover:border-bio-green/50 transition-all duration-300 hover:shadow-bio">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-bio rounded-lg flex items-center justify-center mr-4">
                    <Dna className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-bio-green">Educational Excellence</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Educational courses and workshops in computational biology, designed to bridge the gap between theoretical knowledge and practical application.
                </p>
              </CardContent>
            </Card>

            <Card className="border-compute-blue/20 hover:border-compute-blue/50 transition-all duration-300 hover:shadow-compute">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-compute rounded-lg flex items-center justify-center mr-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-compute-blue">Research & Projects</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Research and project teams working on cutting-edge problems at the intersection of computation and biology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-glow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mr-4">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary">Professional Networking</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Networking opportunities with faculty, alumni, and biotech companies to build meaningful professional relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 hover:border-accent/50 transition-all duration-300 hover:shadow-glow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold text-accent-foreground">Community Impact</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Community events that highlight computational biology's role in healthcare, sustainability, and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;