import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, Calendar } from "lucide-react";

const Officers = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-bio bg-clip-text text-transparent">
          Our Leadership Team
        </h1>
        
        <Card className="border-bio-green/20 hover:shadow-bio transition-all duration-300 max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-gradient-bio rounded-full flex items-center justify-center mx-auto mb-8">
              <Users className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-6 text-bio-green">
              Coming Soon!
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Meet our leadership team! We're currently updating this page with information about our officers, their roles, and how to get in touch with them.
            </p>
            
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="w-5 h-5 mr-3 text-bio-green" />
                <span>Elections held each semester</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Mail className="w-5 h-5 mr-3 text-bio-green" />
                <span>Contact us through our social channels</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Users className="w-5 h-5 mr-3 text-bio-green" />
                <span>Student-led organization</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Officers;