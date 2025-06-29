import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getStudentRegisteredCounsels } from '../../Services/counselService';

// Placeholder: scheduled session dates (YYYY-MM-DD)
const scheduledDates = [
  '2024-06-10',
  '2024-06-14',
  '2024-06-18',
];

function isScheduled(dateStr) {
  return scheduledDates.includes(dateStr);
}

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const StudentCalendar = ({ onGoToMyCounselling }) => {
  const today = new Date();
  const [displayedYear, setDisplayedYear] = useState(today.getFullYear());
  const [displayedMonth, setDisplayedMonth] = useState(today.getMonth());
  const [counselMap, setCounselMap] = useState({}); // { 'YYYY-MM-DD': [time, ...] }

  useEffect(() => {
    const fetchCounsels = async () => {
      const result = await getStudentRegisteredCounsels();
      if (result.success && Array.isArray(result.data)) {
        const map = {};
        result.data.forEach(counsel => {
          if (counsel.startTime) {
            const dateObj = new Date(counsel.startTime);
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push(timeStr);
          }
        });
        setCounselMap(map);
      } else {
        setCounselMap({});
      }
    };
    fetchCounsels();
  }, [displayedYear, displayedMonth]);

  const days = daysInMonth(displayedYear, displayedMonth);
  const monthName = new Date(displayedYear, displayedMonth).toLocaleString('default', { month: 'long' });

  // Get the weekday of the 1st day of the month (0=Sun, 6=Sat)
  const firstDay = new Date(displayedYear, displayedMonth, 1).getDay();

  // Build calendar grid (7x6)
  const calendarCells = [];
  let cellCount = 0;
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`}></div>);
    cellCount++;
  }
  for (let d = 1; d <= days; d++) {
    const dateStr = `${displayedYear}-${String(displayedMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday =
      d === today.getDate() &&
      displayedMonth === today.getMonth() &&
      displayedYear === today.getFullYear();
    const counselTimes = counselMap[dateStr] || [];
    calendarCells.push(
      <div
        key={d}
        className={`relative flex flex-col items-center justify-center h-12 w-24 min-w-[96px] rounded-lg border border-gray-200 bg-white transition-all duration-150
          ${isToday ? 'border-2 border-blue-500 bg-blue-50' : 'hover:bg-gray-100'}
        `}
      >
        <span className={`text-base font-medium ${isToday ? 'text-blue-700' : 'text-gray-900'}`}>{d}</span>
        {counselTimes.length > 0 && (
          <div className="mt-1 flex flex-col items-center w-full">
            <span
              className="text-xs font-semibold text-orange-600 bg-orange-50 rounded px-2 py-0.5 mt-0.5 w-fit cursor-pointer hover:bg-orange-200 transition"
              onClick={() => onGoToMyCounselling && onGoToMyCounselling()}
              title="Go to My Counselling"
            >
              {counselTimes[0]}
            </span>
            {counselTimes.length > 1 && (
              <span
                className="text-xs font-semibold text-orange-600 bg-orange-50 rounded px-2 py-0.5 mt-0.5 w-fit cursor-pointer hover:bg-orange-200 transition"
                onClick={() => onGoToMyCounselling && onGoToMyCounselling()}
                title="Go to My Counselling"
              >
                +{counselTimes.length - 1} more
              </span>
            )}
          </div>
        )}
      </div>
    );
    cellCount++;
  }
  // Fill remaining cells to make a 7x6 grid
  while (cellCount < 42) {
    calendarCells.push(<div key={`empty-end-${cellCount}`}></div>);
    cellCount++;
  }

  const handlePrevMonth = () => {
    setDisplayedMonth(prev => {
      if (prev === 0) {
        setDisplayedYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  const handleNextMonth = () => {
    setDisplayedMonth(prev => {
      if (prev === 11) {
        setDisplayedYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl w-full mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button className="p-2 rounded hover:bg-gray-100 text-gray-500" onClick={handlePrevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-lg font-bold text-gray-800">{monthName} {displayedYear}</span>
        <button className="p-2 rounded hover:bg-gray-100 text-gray-500" onClick={handleNextMonth}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-bold text-gray-400 text-center uppercase tracking-wider py-1">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendarCells}
      </div>
    </div>
  );
};

export default StudentCalendar; 