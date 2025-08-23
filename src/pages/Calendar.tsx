import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import { EnhancedButton } from "@/components/ui/enhanced-button";

const Calendar = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-bio bg-clip-text text-transparent">
            Events Calendar
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay up to date with our workshops, meetings, and special events.
          </p>
        </div>

        <Card className="border-bio-green/20 hover:shadow-bio transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-2xl text-bio-green">
              <CalendarIcon className="w-6 h-6 mr-2" />
              Computational Biology at Berkeley Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full overflow-hidden rounded-lg border border-bio-green/20">
              <iframe 
                src="https://calendar.google.com/calendar/embed?src=c_89fd0fd6639f6879e54e29cf6160bd6b715c0d824d84fdc0166332e82c13404c%40group.calendar.google.com&ctz=Asia%2FHong_Kong" 
                className="w-full h-[600px] border-0"
                title="Computational Biology at Berkeley Events Calendar"
              />
            </div>
            
            <div className="mt-6 text-center">
              <a 
                href="https://calendar.google.com/calendar/embed?src=c_89fd0fd6639f6879e54e29cf6160bd6b715c0d824d84fdc0166332e82c13404c%40group.calendar.google.com&ctz=Asia%2FHong_Kong" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <EnhancedButton variant="bio-outline" size="lg">
                  View Full Calendar
                  <ExternalLink className="w-4 h-4" />
                </EnhancedButton>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            All times are shown in Hong Kong timezone. Subscribe to our calendar to get notifications about upcoming events!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calendar;