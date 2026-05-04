import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar'
import WithNavBar from 'components/WithNavBar';
import { useRouter } from 'next/router';
import BreadCrumb from 'components/BreadCrumb';

// Dummy tasks for demo purposes
const DUMMY_TASKS = [
    { date: new Date(), title: 'Team standup', list: 'Work' },
    { date: new Date(), title: 'Buy groceries', list: 'Personal' },
    { date: new Date(Date.now() + 86400000), title: 'Project deadline', list: 'Work' },
    { date: new Date(Date.now() + 2 * 86400000), title: 'Doctor appointment', list: 'Personal' },
    { date: new Date(Date.now() + 4 * 86400000), title: 'Design review', list: 'Work' },
];

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export default function CalenderPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const router = useRouter();

    const tasksOnSelected = DUMMY_TASKS.filter((t) => isSameDay(t.date, selectedDate));
    const datesWithTasks = DUMMY_TASKS.map((t) => t.date);

    return (
        <WithNavBar>
            <div className="flex flex-col items-center min-h-screen bg-[#E5E1DE] pb-32">
                <div className="w-full max-w-md px-4 pt-6">
                    <h1 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Calendar</h1>

                    <div className="rounded-2xl overflow-hidden shadow-md border border-black bg-white">
                        <Calendar
                            onChange={(val) => setSelectedDate(val as Date)}
                            value={selectedDate}
                            tileClassName={({ date }) =>
                                datesWithTasks.some((d) => isSameDay(d, date))
                                    ? 'has-task'
                                    : null
                            }
                        />
                    </div>

                    <div className="mt-6">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">
                            Tasks for{' '}
                            {selectedDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </h2>

                        {tasksOnSelected.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-black shadow-sm">
                                No tasks for this day
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {tasksOnSelected.map((task, i) => (
                                    <li
                                        key={i}
                                        className="bg-white rounded-2xl border border-black px-5 py-3 shadow-sm flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-700">{task.title}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{task.list}</p>
                                        </div>
                                        <span className="text-xs bg-[#EC683E] text-white px-2 py-1 rounded-full">
                                            {task.list}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile bottom nav */}
            <div className="block md:hidden fixed bottom-12 w-full z-10 flex justify-around items-center">
                <div className="bg-[#EC683E] rounded-[500px] border border-black py-1 px-1 flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="flex justify-center gap-1.5 bg-[#E5E1DE] rounded-[500px] py-2.5 ps-3 pe-5 border border-black"
                    >
                        ← Back
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .react-calendar {
                    width: 100%;
                    border: none;
                    font-family: inherit;
                }
                .react-calendar__tile {
                    padding: 10px 6px;
                    font-size: 14px;
                }
                .react-calendar__tile--active {
                    background: #EC683E !important;
                    border-radius: 8px;
                    color: white;
                }
                .react-calendar__tile--now {
                    background: #f0ddd7;
                    border-radius: 8px;
                }
                .has-task {
                    position: relative;
                }
                .has-task::after {
                    content: '';
                    display: block;
                    width: 5px;
                    height: 5px;
                    background: #EC683E;
                    border-radius: 50%;
                    margin: 2px auto 0;
                }
            `}</style>
        </WithNavBar>
    );
}