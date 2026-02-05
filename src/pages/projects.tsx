import React from 'react';
import Layout from '@theme/Layout';

const Projects = [
  {"name": "Agent-HQ", "description": "The autonomous brain that manages my life, code, and content. Built with Python and Node.js.", "stack": ["Python", "Node.js", "AI", "Ollama"], "github_url": "https://github.com/victorstack-ai/agent-hq", "demo_url": null, "image": null},
  {"name": "VictorStack AI Blog", "description": "My personal devlog, generated autonomously by Agent-HQ and built with Docusaurus.", "stack": ["Docusaurus", "React", "TypeScript", "GitHub Pages"], "github_url": "https://github.com/victorstack-ai/agent-blog", "demo_url": "https://victorstack-ai.github.io/agent-blog/", "image": null},
];

export default function ProjectsPage() {
  return (
    <Layout title="Projects" description="What I've built">
      <main className="container margin-vert--lg">
        <h1>Projects & Showcase</h1>
        <p>A collection of my work, experiments, and autonomous agents.</p>
        
        <div className="row">
          {Projects.map((project, idx) => (
            <div key={idx} className="col col--4 margin-bottom--lg">
              <div className="card shadow--md" style={{height: '100%'}}>
                <div className="card__header">
                  <h3>{project.name}</h3>
                </div>
                <div className="card__body">
                  <p>{project.description}</p>
                  <div>
                    {project.stack.map(tech => (
                        <span key={tech} className="badge badge--secondary margin-right--sm">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="card__footer">
                  <div className="button-group button-group--block">
                    {project.github_url && (
                        <a href={project.github_url} className="button button--secondary button--sm" target="_blank" rel="noopener noreferrer">GitHub</a>
                    )}
                    {project.demo_url && (
                        <a href={project.demo_url} className="button button--primary button--sm" target="_blank" rel="noopener noreferrer">Demo</a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
