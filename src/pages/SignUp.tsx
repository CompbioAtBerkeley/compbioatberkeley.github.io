import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { ExternalLink } from "lucide-react";

const SignUp = () => {
  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-bio-green/5 to-compute-blue/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-bio bg-clip-text text-transparent">
            Join Our Community
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay connected with Computational Biology at Berkeley and be the first to know about events, opportunities, and updates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sign Up Form */}
          <Card className="border-bio-green/20 hover:shadow-bio transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-bio-green text-center">Get Updates</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Sign up for our newsletter to receive updates about events, courses, and opportunities.
              </p>
              <iframe 
                src="https://forms.gle/nrsXrPFKA8CRn9P66"
                width="100%" 
                height="400"
                className="rounded-lg border border-bio-green/20"
                title="Sign Up Form"
              >
                Loading...
              </iframe>
              <div className="mt-4">
                <a 
                  href="https://forms.gle/nrsXrPFKA8CRn9P66" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <EnhancedButton variant="bio-solid" size="lg">
                    Open Form in New Tab
                    <ExternalLink className="w-4 h-4" />
                  </EnhancedButton>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-compute-blue/20 hover:shadow-compute transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-compute-blue text-center">Connect With Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Follow us on social media</h3>
                
                <div className="space-y-4">
                  <a 
                    href="https://join.slack.com/t/computational-yzc4071/shared_invite/zt-3bqva9ctw-FdzQ~QsK90qYMhgBlWZKyg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <EnhancedButton variant="hero" size="lg" className="w-full">
                      Join our Slack
                      <ExternalLink className="w-4 h-4" />
                    </EnhancedButton>
                  </a>
                  
                  <EnhancedButton variant="bio-outline" size="lg" className="w-full">
                    Follow on Instagram
                    <ExternalLink className="w-4 h-4" />
                  </EnhancedButton>
                  
                  <EnhancedButton variant="compute-outline" size="lg" className="w-full">
                    Connect on LinkedIn
                    <ExternalLink className="w-4 h-4" />
                  </EnhancedButton>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Questions? Reach out to us through any of these platforms, and we'll get back to you soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;