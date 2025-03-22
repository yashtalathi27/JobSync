import { useState } from "react";
import ChatBox from "../../components/ChatBox";

export default function OrganizerDashboard() {
  const [projects] = useState([
    { id: 1, title: "Website Redesign", progress: 60, deadline: "April 30" },
    { id: 2, title: "Logo Creation", progress: 40, deadline: "May 10" },
  ]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Organizer Dashboard</h1>

      <h2 className="text-xl font-semibold">Projects Overview</h2>
      <ul className="list-disc ml-6">
        {projects.map((project) => (
          <li key={project.id}>
            {project.title} - Progress: {project.progress}% - Deadline: {project.deadline}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold">Chat with Freelancer</h2>
      <ChatBox userName="OrganizerXYZ" role="organizer" />
    </div>
  );
}
