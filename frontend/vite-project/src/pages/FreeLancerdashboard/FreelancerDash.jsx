import { useNavigate, useParams } from "react-router-dom";
import OverviewCard from "./OverviewCard";
import ActiveProject from "./ActiveProject";
import RecentMessages from "./RecentMessages";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchFreelancerData() {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch freelancer info and projects in parallel
      const [freelancerRes, projectsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/freelancer/${id}`),
        axios.get(`http://localhost:5000/api/freelancer/${id}/projects`)
      ]);
      
      setFreelancer(freelancerRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error("Error fetching freelancer data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchFreelancerData();
    }
  }, [id]);

  // Calculate overview statistics
  const getOverviewData = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === true).length;
    const totalEarnings = projects.reduce((sum, p) => {
      const completedCheckpoints = p.checkpoints?.filter(c => c.completed) || [];
      return sum + completedCheckpoints.reduce((cSum, c) => cSum + (c.amount || 0), 0);
    }, 0);

    return [
      {
        type: "projects",
        title: "Total Projects",
        value: totalProjects
      },
      {
        type: "completed",
        title: "Completed",
        value: completedProjects
      },
      {
        type: "earnings",
        title: "Total Earnings",
        value: `$${totalEarnings}`
      },
      {
        type: "projects",
        title: "Active Projects",
        value: totalProjects - completedProjects
      }
    ];
  };

  // Calculate progress for each project
  const getProjectProgress = (project) => {
    if (!project.checkpoints || project.checkpoints.length === 0) return 0;
    const completedCheckpoints = project.checkpoints.filter(c => c.completed).length;
    return Math.round((completedCheckpoints / project.checkpoints.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={fetchFreelancerData}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {freelancer?.name ? `${freelancer.name}'s Dashboard` : 'Freelancer Dashboard'}
        </h1>
        {freelancer?.availability !== undefined && (
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            freelancer.availability 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {freelancer.availability ? 'Available' : 'Busy'}
          </span>
        )}
      </div>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getOverviewData().map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      {/* Active Projects Section */}
      <h2 className="text-xl font-semibold mt-4">Active Projects</h2>
      {projects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No projects found. Start applying for projects to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => navigate(`/project/free/${project._id}`, { state: { project } })}
              className="cursor-pointer hover:transform hover:scale-105 transition-transform duration-200"
            >
              <ActiveProject 
                name={project.name || 'Untitled Project'}
                progress={getProjectProgress(project)}
                hoursWorked={0} // This would need to be tracked separately
                deadline={project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline set'}
                checkpoints={project.checkpoints}
                budget={project.budget}
                status={project.status}
              />
            </div>
          ))}
        </div>
      )}

      {/* Recent Messages Section */}
      <h2 className="text-xl font-semibold mt-4">Recent Messages</h2>
      <RecentMessages messages={[]} />
    </div>
  );
}
