"use client"

import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Data Cleaning And Exploring with SQL",
    description:
      "This repository showcases practical applications of SQL for data cleaning and exploration tasks. It focuses on a real-world dataset related to layoffs sourced from publicly available CSV files.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-rqq5K7GPMGNXu168Z7GzgOssG1Ajl5.png",
    github: "https://github.com/joaquin-codes/sql-data-cleaning",
    technologies: ["SQL", "MySQL", "Data Analysis", "Data Cleaning"],
  },
  {
    title: "Optical Character Recognition",
    description:
      "A foundational OCR system built from scratch for identifying handwritten characters. Uses core image processing techniques and template matching to recognize uppercase letters, lowercase letters, and numbers. Perfect for educational purposes and understanding OCR principles.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7PuLmxOuO8XBTE0JnuUCaqqKrZdnff.png",
    github: "https://github.com/joaquin-codes/Optical-Character-Recognition",
    technologies: ["Python", "OpenCV", "NumPy", "Image Processing"],
  },
]

export default function ProjectsContent() {
  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl font-bold mb-6">My Projects</h2>
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="neo-brutalist p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <div className="aspect-video rounded-lg overflow-hidden border-2 border-black">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-contain bg-white p-4"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                  <p className="text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 rounded-full border-2 border-black bg-gray-100">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  className="flex items-center gap-2 w-full sm:w-auto"
                  onClick={() => window.open(project.github, "_blank")}
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

