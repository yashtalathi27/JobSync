import { useNavigate, useParams } from "react-router-dom";
import OverviewCard from "./OverviewCard";
import ActiveProject from "./ActiveProject";
import RecentMessages from "./RecentMessages";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Get ID first
  const [projects, setProjects] = useState([]); // ✅ Store API response in state

  async function fetchFreelancerData() {
    try {
      const res = await axios.get(`http://localhost:5000/api/freelancer/${id}/projects`);
      setProjects(res.data); // ✅ Store fetched data
    } catch (error) {
      console.error("Error fetching freelancer data:", error);
    }
  }

  async function fetchFreelancer(){
    try{
      const res = await axios.get(`http://localhost:5000/api/freelancer/${id}`);
      console.log(res.data);
    }catch(error){
      console.error("Error fetching freelancer data:", error);
    }
  }

  useEffect(() => {
    if (id) fetchFreelancerData();
  }, [id]); // ✅ Run effect when `id` changes

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl text-center font-bold">Freelancer Dashboard</h1>

      {/* Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {projects.map((item, index) => (
          <OverviewCard key={index} {...item} />
        ))}
      </div>

      {/* Active Projects Section */}
      <h2 className="text-xl font-semibold mt-4">Active Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project._id} // ✅ Use `_id` from MongoDB instead of `id`
            onClick={() => navigate(`/project/free/${project._id}`, { state: { project } })}
            className="cursor-pointer"
          >
            <ActiveProject {...project} />
          </div>
        ))}
      </div>

      {/* Recent Messages Section */}
      <h2 className="text-xl font-semibold mt-4">Recent Messages</h2>
      <RecentMessages messages={[]} />
    </div>
  );
}
