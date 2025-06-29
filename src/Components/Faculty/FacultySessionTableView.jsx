import React from 'react';
import FacultySessionsTable from './FacultySessionsTable';

const FacultySessionTableView = ({ sessions, setSessions, formatDateTime }) => (
  <div className="space-y-6">
    <FacultySessionsTable sessions={sessions} setSessions={setSessions} formatDateTime={formatDateTime} />
  </div>
);

export default FacultySessionTableView; 