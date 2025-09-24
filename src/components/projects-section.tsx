import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

export default function ProjectsSection() {
  const projects = [
    {
      title: "Algorithme Auto",
      description:
        "A full-stack car rental agency solution for fleet and client management",
      tags: [
        "Angular",
        "Nest.js",
        "Postgres",
        "Docker",
        "Typescript",
        "RxJS",
        "Tailwind",
        "Responsive design",
      ],
      demoUrl: "https://algorithmeauto.chhilif.com",
      githubUrl: "https://github.com/Bidbogs-prog/algorithme-auto-front",
    },
    {
      title: "Expensio",
      description:
        "An expense tracker app that helps you log different income sources, expenses, and your overall balance, with customized financial recommendations.",
      tags: [
        "Next.js",
        "TypeScript",
        "Supabase",
        "Tailwind CSS",
        "Responsive design",
      ],
      demoUrl: "https://expensio-tau.vercel.app",
      githubUrl: "https://github.com/Bidbogs-prog/expensio",
    },
    {
      title: "Tale",
      description:
        "A birthday gift I made for my Fiancée's on Valentine's using a poem I wrote.",
      tags: ["Next.js", "Tailwind CSS", "Responsive design"],
      demoUrl:
        "https://tale-isaquq4as-haytham-chhilifs-projects.vercel.app/poem",
      githubUrl: "https://github.com/Bidbogs-prog/tale",
    },
  ];

  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Projects
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Here are some of the projects I've worked on. Each project represents
          different skills and technologies I've mastered.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="h-full flex flex-col hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
