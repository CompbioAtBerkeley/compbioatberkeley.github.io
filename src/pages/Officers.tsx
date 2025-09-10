import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, Calendar, AlertCircle } from "lucide-react";
import { useOfficers } from "@/hooks/useOfficers";
import { OfficerCard } from "@/components/OfficerCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Officers = () => {
  const { officers, loading, error } = useOfficers();

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-bio bg-clip-text text-transparent">
            Our Leadership Team
          </h1>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-bio-green"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-bio bg-clip-text text-transparent">
            Our Leadership Team
          </h1>
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load officers data. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!officers || officers.length === 0) {
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
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-bio bg-clip-text text-transparent">
            Our Leadership Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated students leading Computational Biology at Berkeley
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {officers.map((officer, index) => (
            <div key={index} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              <OfficerCard officer={officer} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="border-bio-green/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-bio-green">Interested in Leadership?</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-3 text-bio-green" />
                  <span>Elections held each semester</span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-3 text-bio-green" />
                  <span>Contact us through our social channels</span>
                </div>
                <div className="flex items-center justify-center">
                  <Users className="w-5 h-5 mr-3 text-bio-green" />
                  <span>Student-led organization</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Officers;