import React from 'react';
import { useApp } from '../context/AppContext';
import { HousekeepingTask } from '../types';
import {
  CheckSquare,
  BedDouble,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  UserCheck
} from 'lucide-react';

export const HousekeepingView: React.FC = () => {
  const { housekeeping, rooms, updateHousekeepingStatus, toggleHousekeepingChecklist } = useApp();

  const todayStr = "2026-08-04";
  const todayTasks = housekeeping.filter(h => h.date === todayStr);

  const completedCount = todayTasks.filter(t => t.status === 'completed').length;
  const inProgressCount = todayTasks.filter(t => t.status === 'in_progress').length;
  const toDoCount = todayTasks.filter(t => t.status === 'to_do').length;

  return (
    <div className="space-y-4 pb-8">
      {/* Title Header - High Density Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#2D3436] text-white p-3.5 rounded-lg shadow-sm border border-stone-800">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Planning du Ménage & Propreté</h1>
          <p className="text-[11px] text-stone-300 mt-0.5">
            Suivez en temps réel la préparation des chambres, la désinfection, les draps et le contrôle qualité.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono font-bold">
          <span className="bg-emerald-900/80 text-emerald-100 px-2.5 py-1 rounded border border-emerald-700">
            ✔ {completedCount} Prête{completedCount > 1 ? 's' : ''}
          </span>
          <span className="bg-amber-900/80 text-amber-100 px-2.5 py-1 rounded border border-amber-700">
            ⏳ {inProgressCount} En cours
          </span>
          <span className="bg-sky-900/80 text-sky-100 px-2.5 py-1 rounded border border-sky-700">
            🧹 {toDoCount} À faire
          </span>
        </div>
      </div>

      {/* Housekeeping Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {todayTasks.map(task => {
          const completedItems = task.checklist.filter(c => c.completed).length;
          const totalItems = task.checklist.length;
          const progressPct = Math.round((completedItems / (totalItems || 1)) * 100);

          return (
            <div
              key={task.id}
              className="bg-white rounded-lg border border-stone-200 p-3.5 shadow-2xs hover:border-stone-300 transition space-y-3 text-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div className="flex items-center space-x-2">
                  <BedDouble className="w-4 h-4 text-stone-700" />
                  <h3 className="font-bold text-xs text-stone-900">{task.roomName}</h3>
                </div>

                <select
                  value={task.status}
                  onChange={e => updateHousekeepingStatus(task.id, e.target.value as HousekeepingTask['status'])}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded border cursor-pointer focus:outline-none ${
                    task.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                      : task.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-950 border-amber-300'
                      : 'bg-sky-50 text-sky-950 border-sky-300'
                  }`}
                >
                  <option value="to_do">🧹 À faire</option>
                  <option value="in_progress">⏳ En cours</option>
                  <option value="completed">✔ Prête / Inspection</option>
                </select>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-medium text-stone-600 mb-1">
                  <span>Progression :</span>
                  <span className="font-mono font-bold">{completedItems} / {totalItems} ({progressPct}%)</span>
                </div>
                <div className="w-full bg-stone-100 h-1.5 rounded overflow-hidden border border-stone-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progressPct === 100 ? 'bg-[#4A6741]' : 'bg-amber-600'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Interactive Checklist */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Tâches de contrôle :</p>
                <div className="space-y-1">
                  {task.checklist.map((item, idx) => (
                    <label
                      key={item.id}
                      className="flex items-center space-x-2 text-[11px] text-stone-800 p-1.5 rounded bg-stone-50 hover:bg-stone-100 border border-stone-200 cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleHousekeepingChecklist(task.id, idx)}
                        className="w-3.5 h-3.5 text-[#4A6741] rounded border-stone-300 focus:ring-[#4A6741] cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-stone-400' : 'font-medium'}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500">
                <span className="flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-stone-600" />
                  <span>Assigné à : <strong className="text-stone-800">{task.assignedTo}</strong></span>
                </span>
                {task.notes && <span className="italic truncate max-w-[180px] text-stone-600">{task.notes}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

};
