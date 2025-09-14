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
                {/* <div className="flex items-center justify-center">
                  <Users className="w-5 h-5 mr-3 text-bio-green" />
                  <span>Student-led organization</span>
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Officers;