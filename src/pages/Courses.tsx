import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Code, Microscope } from "lucide-react";

const Courses = () => {
  const courseData = [
    {
      date: "Week of Sep 21",
      computational: "Intro to Programming",
      biological: "Central Dogma & Genome Regulation"
    },
    {
      date: "Week of Oct 5",
      computational: "Data Structures & Algorithms",
      biological: "Genetics"
    },
    {
      date: "Oct 19",
      computational: "Data Science & Statistics",
      biological: "Sequencing"
    },
    {
      date: "Week of Nov 2",
      computational: "Machine Learning Algorithms",
      biological: "Microscopy & Imaging"
    },
    {
      date: "Week of Nov 16",
      computational: "Computational Biology",
      biological: "Protein Properties & Structural Bioinformatics"
    },
    {
      date: "Week of Nov 30",
      computational: "Computational Epidemiology / Public Health",
      biological: "Last week of classes"
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-bio bg-clip-text text-transparent">
            Course Schedule
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive curriculum bridges computation and biology, providing hands-on experience with both disciplines.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-compute-blue/20 hover:shadow-compute transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl text-compute-blue">
                <Code className="w-6 h-6 mr-2" />
                Computational Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Learn programming, algorithms, data science, and machine learning techniques essential for computational biology.
              </p>
            </CardContent>
          </Card>

          <Card className="border-bio-green/20 hover:shadow-bio transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center text-2xl text-bio-green">
                <Microscope className="w-6 h-6 mr-2" />
                Biological Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Explore genetics, genomics, protein structure, and biological systems from a computational perspective.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 hover:shadow-glow transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center text-3xl text-primary">
              <GraduationCap className="w-8 h-8 mr-3" />
              Weekly Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left p-4 font-semibold text-lg text-foreground">Date / Week</th>
                    <th className="text-left p-4 font-semibold text-lg text-compute-blue">Computational Topic</th>
                    <th className="text-left p-4 font-semibold text-lg text-bio-green">Biological Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {courseData.map((week, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-border transition-all duration-300 hover:bg-gradient-to-r ${
                        index % 2 === 0 
                          ? 'hover:from-bio-green/5 hover:to-transparent' 
                          : 'hover:from-compute-blue/5 hover:to-transparent'
                      }`}
                    >
                      <td className="p-4 font-medium text-foreground">
                        {week.date}
                      </td>
                      <td className="p-4 text-compute-blue">
                        {week.computational}
                      </td>
                      <td className="p-4 text-bio-green">
                        {week.biological}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            All courses are designed to be hands-on and interactive. No prior experience required - we welcome students from all backgrounds!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Courses;