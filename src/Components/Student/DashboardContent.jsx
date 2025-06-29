import React from 'react';
import StudentStatsCards from './StudentStatsCards';
import StudentCalendar from './StudentCalendar';

const DashboardContent = ({ stats, setActiveTab, setCounsellingOption }) => (
  <>
    <StudentStatsCards stats={stats} />
    <div className="mt-8">
      <StudentCalendar onGoToMyCounselling={() => {
        if (setActiveTab) setActiveTab('counselling');
        if (setCounsellingOption) setCounsellingOption('my');
      }} />
    </div>
  </>
);

export default DashboardContent; 