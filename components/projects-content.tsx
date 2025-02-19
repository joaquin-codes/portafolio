import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Project 1",
    description: "A cool project description goes here. This is a sample project to demonstrate the card layout.",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/username/project1",
  },
  {
    title: "Project 2",
    description: "Another amazing project with its own unique features and implementation details.",
    image: "/placeholder.svg?height=200&width=400",
    github: "https://github.com/username/project2",
  },
  // Add more projects as needed
]

export default function ProjectsContent() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <div key={index} className="neo-brutalist p-4">
            <div className="aspect-video rounded-lg overflow-hidden border-2 border-black mb-4">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold mb-2">{project.title}</h3>
            <p className="text-sm mb-4">{project.description}</p>
            <Button className="flex items-center gap-2" onClick={() => window.open(project.github, "_blank")}>
              <Github className="w-4 h-4" />
              View on GitHub
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

