import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, Calendar, AlertCircle } from "lucide-react";
import { useOfficers } from "@/hooks/useOfficers";
import { useOfficersFa25 } from "@/hooks/useOfficersFa25";
import { OfficerCard } from "@/components/OfficerCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Officers = () => {
  const { officers, loading, error } = useOfficers(); // Current officers from Notion (SP26+)
  const { officers: officersFa25, loading: loadingFa25, error: errorFa25 } = useOfficersFa25();

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
        
        {/* Current semester officers */}
        <div className="flex flex-wrap justify-center gap-6">
          {officers.map((officer, index) => (
            <div key={index} className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]">
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

        {/* Previous Semesters Section */}
        <div className="mt-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-bio bg-clip-text text-transparent">
            Previous Semesters
          </h2>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="fa25" className="border-bio-green/20">
                <AccordionTrigger className="text-xl font-semibold hover:text-bio-green">
                  Fall 2025
                </AccordionTrigger>
                <AccordionContent>
                  {loadingFa25 ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-bio-green"></div>
                    </div>
                  ) : errorFa25 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Unable to load Fall 2025 officers data.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                      {officersFa25.map((officer, index) => (
                        <div key={index} className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]">
                          <OfficerCard officer={officer} />
                        </div>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Officers;