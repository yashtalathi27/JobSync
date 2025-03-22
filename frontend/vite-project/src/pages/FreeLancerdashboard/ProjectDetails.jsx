import { useState } from "react";
import ChatBox from "../../components/ChatBox";

export default function FreelancerDashboard() {
  const [projects] = useState([
    { id: 1, title: "Website Redesign", progress: 60, deadline: "April 30" },
  ]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Freelancer Dashboard</h1>

      <h2 className="text-xl font-semibold">Your Projects</h2>
      <ul className="list-disc ml-6">
        {projects.map((project) => (
          <li key={project.id}>
            {project.title} - Progress: {project.progress}% - Deadline: {project.deadline}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold">Submit Work</h2>
      <input type="file" className="border p-2 w-full" />

      <h2 className="text-xl font-semibold">Chat with Organizer</h2>
      <ChatBox userName="Freelancer123" role="freelancer" />
    </div>
  );
}
