import { useNavigate } from "react-router-dom";
import OverviewCard from "../FreeLancerdashboard/OverviewCard";
import ActiveProject from "../FreeLancerdashboard/ActiveProject";
import RecentMessages from "../FreeLancerdashboard/RecentMessages";

const ADMIN_DATA = {
  overview: [
    { type: "users", title: "Total Users", value: 45 },
    { type: "projects", title: "Active Projects", value: 28 },
    { type: "disputes", title: "Open Disputes", value: 3 },
    { type: "payments", title: "Payments Processed", value: "$42,350" },
  ],
  activeProjects: [
    {
      id: 1,
      title: "Website Redesign",
      progress: 80,
      hoursWorked: 45,
      deadline: "April 10, 2025",
      freelancer: "Alex Johnson",
      client: "TechCorp Inc.",
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
      freelancer: "Sarah Williams",
      client: "Innovate Solutions",
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
      freelancer: "Michael Chen",
      client: "Global Marketing",
      checkpoints: [
        { value: 10, label: "Keyword Research" },
        { value: 40, label: "Content Update" },
        { value: 80, label: "Technical SEO" },
      ],
    },
  ],
  disputes: [
    { 
      id: 1, 
      project: "Logo Design", 
      freelancer: "Emma Davis", 
      client: "Fashion Brand", 
      status: "Under Review",
      submittedDate: "March 18, 2025"
    },
    { 
      id: 2, 
      project: "Content Writing", 
      freelancer: "James Wilson", 
      client: "Educational Platform", 
      status: "Awaiting Resolution",
      submittedDate: "March 20, 2025"
    },
    { 
      id: 3, 
      project: "Video Editing", 
      freelancer: "Olivia Brown", 
      client: "Media Company", 
      status: "Escalated",
      submittedDate: "March 21, 2025"
    },
  ],
  messages: [
    { sender: "System", message: "New dispute submitted for Logo Design project", time: "2 hours ago" },
    { sender: "Support Team", message: "Payment issue resolved for client XYZ", time: "Yesterday" },
    { sender: "System", message: "New user registration: David Miller", time: "2 days ago" },
  ],
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-center font-bold">Admin Dashboard</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ADMIN_DATA.overview.map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      {/* Active Projects Section */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold">Active Projects</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          onClick={() => navigate('/projects')}
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADMIN_DATA.activeProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/project/admin/${project.id}`, { state: { project } })}
            className="cursor-pointer"
          >
            <ActiveProject {...project} />
          </div>
        ))}
      </div>

      {/* Open Disputes Section */}
      <div className="flex justify-between items-center mt-6">
        <h2 className="text-xl font-semibold">Open Disputes</h2>
        <button 
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          onClick={() => navigate('/disputes')}
        >
          Manage Disputes
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Freelancer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ADMIN_DATA.disputes.map((dispute) => (
              <tr key={dispute.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispute.project}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispute.freelancer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{dispute.client}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dispute.status === 'Escalated' 
                      ? 'bg-red-100 text-red-800' 
                      : dispute.status === 'Under Review' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {dispute.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dispute.submittedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => navigate(`/disputes/${dispute.id}`)}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Messages/System Notifications Section */}
      <h2 className="text-xl font-semibold mt-6">Recent Notifications</h2>
      <RecentMessages messages={ADMIN_DATA.messages} />
    </div>
  );
}