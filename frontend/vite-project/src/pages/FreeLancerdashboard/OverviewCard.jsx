import Card from '../../components/ui/Card';
import React from "react";
import { Briefcase, DollarSign, CheckCircle } from "lucide-react";

const ICONS = {
  projects: Briefcase,
  earnings: DollarSign,
  completed: CheckCircle,
};

export default function OverviewCard({ type, title, value }) {
  const Icon = ICONS[type] || Briefcase;
  
  return (
    <Card className="p-4 flex items-center space-x-4 shadow-md rounded-lg bg-white">
      <Icon className="w-10 h-10 text-blue-600" />
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </Card>
  );
}
