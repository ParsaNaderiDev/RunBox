export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  coverUrl: string;
  status: "draft" | "published";
  code?: string;
  buildCmd?: string;
  runCmd?: string;
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    slug: "realtime-chatbot",
    title: "Realtime Chatbot",
    description: "LangChain-powered chatbot streaming responses via WebSocket.",
    language: "python",
    tags: ["ai", "websocket", "langchain"],
    coverUrl: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80",
    status: "published",
    code: `import asyncio\n\nasync def stream():\n    for chunk in [\"Hi there!\", \" What can I build for you?\"]:\n        await asyncio.sleep(0.4)\n        print(chunk, flush=True)\n\nif __name__ == \"__main__\":\n    asyncio.run(stream())`,
    runCmd: "python Main.py"
  },
  {
    id: "2",
    slug: "graph-engine",
    title: "Graph Engine",
    description: "Rust-based graph computation engine compiled to WebAssembly.",
    language: "rust",
    tags: ["rust", "wasm", "algorithms"],
    coverUrl: "https://images.unsplash.com/photo-1517436073-076c1a3849cf?auto=format&fit=crop&w=800&q=80",
    status: "published",
    code: `use std::collections::HashMap;\n\nfn main() {\n    let mut edges: HashMap<&str, Vec<&str>> = HashMap::new();\n    edges.insert(\"A\", vec![\"B\", \"C\"]);\n    edges.insert(\"B\", vec![\"D\"]);\n    println!(\"Nodes: {}\", edges.keys().count());\n}`,
    runCmd: "rustc Main.rs && ./Main"
  },
  {
    id: "3",
    slug: "serverless-tasks",
    title: "Serverless Tasks",
    description: "Task orchestration with FastAPI, Celery, and Redis.",
    language: "python",
    tags: ["fastapi", "celery"],
    coverUrl: "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=800&q=80",
    status: "draft",
    code: `from datetime import datetime\n\ndef handler(event: dict):\n    print(f\"Task {event['id']} executed at {datetime.utcnow().isoformat()}\")\n\nif __name__ == \"__main__\":\n    handler({\"id\": \"demo\"})`,
    runCmd: "python Main.py"
  }
];

export function findProjectBySlug(slug: string) {
  return MOCK_PROJECTS.find((project) => project.slug === slug);
}
