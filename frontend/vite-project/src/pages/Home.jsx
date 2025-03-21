import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import { FaUsers, FaBriefcase, FaCheckCircle, FaStar, FaBuilding } from "react-icons/fa";

const Home = () => {
  const stats = {
    totalRecruitments: 5000,
    totalFreelancers: 12000,
    totalJobsCompleted: 8500,
  };

  const reviews = [
    { id: 1, name: "Alice Johnson", comment: "Great platform! Found my dream job here.", rating: 5 },
    { id: 2, name: "Mark Smith", comment: "Easy to use and great support!", rating: 4.5 },
    { id: 3, name: "Sophia Davis", comment: "Highly recommended for freelancers.", rating: 5 },
  ];

  const organizations = [
    "Google",
    "Microsoft",
    "Amazon",
    "Facebook",
    "Apple",
    "Tesla",
    "Netflix",
    "IBM",
  ];

  return (
    <div>
      <Banner />

      {/* Stats Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-8">Our Achievements</h2>
        <div className="container mx-auto flex flex-wrap justify-center gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md w-64 flex flex-col items-center">
            <FaBriefcase size={40} className="text-blue-500 mb-3" />
            <h3 className="text-xl font-semibold">{stats.totalRecruitments}+</h3>
            <p className="text-gray-600">Total Recruitments</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-64 flex flex-col items-center">
            <FaUsers size={40} className="text-green-500 mb-3" />
            <h3 className="text-xl font-semibold">{stats.totalFreelancers}+</h3>
            <p className="text-gray-600">Freelancers</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-64 flex flex-col items-center">
            <FaCheckCircle size={40} className="text-purple-500 mb-3" />
            <h3 className="text-xl font-semibold">{stats.totalJobsCompleted}+</h3>
            <p className="text-gray-600">Jobs Completed</p>
          </div>
        </div>
      </section>

      {/* Top Organizations Section */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-8">Top Organizations Hired</h2>
        <div className="container mx-auto flex flex-wrap justify-center gap-8">
          {organizations.map((org, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md w-64 flex flex-col items-center">
              <FaBuilding size={40} className="text-blue-500 mb-3" />
              <h3 className="text-xl font-semibold">{org}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-8">What People Say</h2>
        <div className="container mx-auto flex flex-wrap justify-center gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow-md w-80">
              <FaStar size={30} className="text-yellow-500 mb-3 mx-auto" />
              <p className="italic">"{review.comment}"</p>
              <h3 className="font-semibold mt-4">{review.name}</h3>
              <p className="text-gray-500">⭐ {review.rating}/5</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;