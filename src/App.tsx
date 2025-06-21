import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, ExternalLink, Mail, MapPin } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const projects = [
    {
      id: 1,
      title: "Tale",
      description: "A little romantic poem I created as a gift for my beautiful partner",
      tech: ["React", "JavaScript", "CSS3"],
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f79e?w=400&h=200&fit=crop",
      github: "https://github.com/Bidbogs-prog/tale",
      live: "https://tale-eta.vercel.app/",
      status: "completed"
    },
    {
      id: 2,
      title: "Age Calculator",
      description: "Responsive web app that calculates age with precision down to days and hours",
      tech: ["React", "Date API", "Tailwind"],
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
      github: "#",
      live: "#",
      status: "completed"
    },
    {
      id: 3,
      title: "Expensio",
      description: "An app you can use to track your income and expenses with recommendations",
      tech: ["Next.js", "API Integration", "Charts", "Supabase"],
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop",
      github: "https://github.com/Bidbogs-prog/expensio",
      live: "https://expensio-tau.vercel.app/",
      status: "completed"
    },
    {
      id: 4,
      title: "Algorithme-Auto",
      description: "An inventory management system for car rental agencies",
      tech: ["Angular", "API Integration", "CMS", "Supabase"],
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop",
      github: "https://github.com/Bidbogs-prog/algorithme-auto-front",
      live: "#",
      status: "planning"
    }
  ];

  const skills = [
    { name: "React", level: 85, icon: "⚛️" },
    { name: "JavaScript", level: 80, icon: "🟨" },
    { name: "Angular", level: 70, icon: "🔺" },
    { name: "TypeScript", level: 75, icon: "🔷" },
    { name: "Tailwind CSS", level: 90, icon: "🎨" },
    { name: "Node.js", level: 65, icon: "🟢" },


  ];

  const scrollToSection = (sectionId: any) => {
    setActiveSection(sectionId);
    // In a real app, you'd scroll to the actual section
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              HC
            </div>
            <div className="hidden md:flex space-x-1">
              {['home', 'about', 'projects', 'contact'].map((section) => (
                <Button
                  key={section}
                  variant={activeSection === section ? "default" : "ghost"}
                  onClick={() => scrollToSection(section)}
                  className="capitalize"
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Welcome to my
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    little corner
                  </span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                  My name is <strong>Haytham Chhilif</strong> and I am a self-taught Web Developer 
                  riding the ever-lasting journey towards mastering the craft. My passions are 
                  learning new things and supporting your business with simple, efficient, 
                  and creative tech solutions.
                  <span className="inline-block w-0.5 h-6 bg-blue-600 ml-1 animate-blink"></span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </Button>
                <Button variant="outline" size="lg">
                  <Github className="w-4 h-4 mr-2" />
                  View GitHub
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Available for opportunities
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Open to work
                </div>
              </div>
            </div>

            {/* Animated Background */}
            <div className="relative h-96 lg:h-[500px]">
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-10 left-1/2 w-36 h-36 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-16 px-6 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
            Skills & Technologies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card key={skill.name} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">{skill.icon}</span>
                    <h3 className="font-semibold text-lg">{skill.name}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>Proficiency</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              My Projects
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Here are some of the projects I've been working on. Each one taught me something new 
              and helped me grow as a developer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.status === 'planning' && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Coming soon
                    </div>
                  )}
                </div>
                
               <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {project.title}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => window.open(project.github, '_blank')}
                        disabled={project.github === '#'}
                      >
                        <Github className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                        onClick={() => window.open(project.live, '_blank')}
                        disabled={project.live === '#'}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                
                
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-xs rounded-full text-slate-700 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl mb-8 text-blue-100">
            I'm always interested in new opportunities and exciting projects. 
            Let's connect and see how we can create something amazing together.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              <Mail className="w-5 h-5 mr-2" />
              haythamchhilif@gmail.com
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-purple-600">
              <Github className="w-5 h-5 mr-2" />
              GitHub Profile
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-slate-400 text-center">
        <p>© 2025 Haytham Chhilif. Built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;