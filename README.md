# MythosEngine
An open-source, AI-powered world-building platform for creators. Build and manage your TTRPG campaigns, novels, and fictional worlds with a tool that you own and control.

## About The Project
Mythos Engine is a tool for game masters, writers, and creators to build intricate worlds and weave compelling narratives. It provides a structured, wiki-style interface to document everything from characters and locations to entire timelines and magic systems.

While excellent platforms like World Anvil exist, Mythos Engine is built with an open-source first philosophy. Our goal is to provide a powerful, community-driven, and self-hostable alternative that puts the creator in complete control of their data.

Our Philosophy: Open Source First
We believe powerful creative tools should be accessible to everyone. Mythos Engine is, and always will be, open-source. You can clone this repository, run it on your own hardware, and modify it to your heart's content.

We also plan to offer an official managed instance of the application. The subscription fee for this service is designed primarily to cover operational costs (servers, AI API usage) and support the project's maintenance, not to lock essential features behind an aggressive paywall.

## Core Features
📚 Interconnected Wiki-Style Articles: Create articles for your characters, locations, items, and lore. Easily link them together using @mentions to build a rich, traversable knowledge base.

📂 Project-Based Organization: Keep your different worlds and stories completely separate by organizing them into distinct projects.

🤖 AI-Powered Writing Assistant:

Brainstorming & Ideation: Overcome writer's block by generating leading questions, plot hooks, and concepts based on your ideas.

Smart Prompts: Use a library of pre-written prompts to perform common tasks like describing a location, creating a character's backstory, or summarizing a historical event.

Content Refinement: Get help expanding on a point, rephrasing a paragraph, or checking for consistency.

## Tech Stack
Mythos Engine is built with a modern, performant, and scalable technology stack.

Backend: Python with FastAPI

Database: PostgreSQL

ORM: SQLAlchemy

Frontend: React with TanStack Router & TanStack Query

Styling: Tailwind CSS with Shadcn UI for components

Deployment: Docker

## 🚀 Getting Started
You can get a local instance of Mythos Engine up and running in a few simple steps.

### Prerequisites
Docker & Docker Compose

### Installation
Clone the repo:
```sh
git clone https://github.com/your-username/mythos-engine.git
```
Navigate to the project directory:
```sh
cd mythos-engine
```
Create your local environment file from the example:
```
cp .env.example .env
```
Update the .env file with your preferred database credentials. To enable the AI features, you will also need to add your own OpenAI API key.

```
OPENAI_API_KEY='your_key_here'
```
Build and run the application with Docker Compose:
```sh
docker-compose up --build
```
Access the application in your browser at http://localhost:3000.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Please refer to our CONTRIBUTING.md for guidelines on how to get started.

## License

Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]
