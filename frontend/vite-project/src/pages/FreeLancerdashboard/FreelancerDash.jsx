import { useNavigate } from "react-router-dom";
import OverviewCard from "./OverviewCard";
import ActiveProject from "./ActiveProject";
import RecentMessages from "./RecentMessages";

const DUMMY_DATA = {
  overview: [
    { type: "projects", title: "Total Projects", value: 12 },
    { type: "earnings", title: "Total Earnings", value: "$5,200" },
    { type: "completed", title: "Completed Jobs", value: 8 },
    { type: "hours", title: "Total Hours Worked", value: 120 },
  ],
  activeProjects: [
    {
      id: 1,
      title: "Website Redesign",
      progress: 80,
      hoursWorked: 45,
      deadline: "April 10, 2025",
      checkpoints: [
        { value: 20, label: "Wireframe" },
        { value: 50, label: "UI Design" },
        { value: 80, label: "Development" },
      ],
    },
    {
      id: 2,
      title: "Mobile App Development",
      progress: 60,
      hoursWorked: 30,
      deadline: "May 5, 2025",
      checkpoints: [
        { value: 30, label: "Prototype" },
        { value: 60, label: "Beta Release" },
        { value: 100, label: "Final Launch" },
      ],
    },
    {
      id: 3,
      title: "SEO Optimization",
      progress: 40,
      hoursWorked: 20,
      deadline: "March 28, 2025",
      checkpoints: [
        { value: 10, label: "Keyword Research" },
        { value: 40, label: "Content Update" },
        { value: 80, label: "Technical SEO" },
      ],
    },
  ],
  messages: [
    { sender: "John Doe", message: "Can we discuss the design changes?", time: "10:30 AM" },
    { sender: "Jane Smith", message: "Great job on the last project!", time: "Yesterday" },
    { sender: "Client XYZ", message: "Please send the final invoice.", time: "2 days ago" },
  ],
};

export default function FreelancerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-center font-bold">Freelancer Dashboard</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {DUMMY_DATA.overview.map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      {/* Active Projects Section */}
      <h2 className="text-xl font-semibold mt-4">Active Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DUMMY_DATA.activeProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/project/${project.id}`, { state: { project } })}
            className="cursor-pointer"
          >
            <ActiveProject {...project} />
          </div>
        ))}
      </div>

      {/* Recent Messages Section */}
      <h2 className="text-xl font-semibold mt-4">Recent Messages</h2>
      <RecentMessages messages={DUMMY_DATA.messages} />
    </div>
  );
}
