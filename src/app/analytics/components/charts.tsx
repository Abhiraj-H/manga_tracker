"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']

const GENRE_DATA = [
  { name: 'Action', value: 400 },
  { name: 'Fantasy', value: 300 },
  { name: 'Romance', value: 300 },
  { name: 'Comedy', value: 200 },
  { name: 'Horror', value: 100 },
]

export function AnalyticsCharts({ activityData }: { activityData: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Activity Chart */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        <h3 className="text-xl font-bold text-white mb-6">Reading Activity</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fff" opacity={0.1} vertical={false} />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="chapters" fill="#c084fc" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Genre Distribution */}
      <div className="glass-panel p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <h3 className="text-xl font-bold text-white mb-6">Genre Distribution</h3>
        <div className="h-[300px] w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <PieChart>
              <Pie
                data={GENRE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {GENRE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-extrabold text-white">5</span>
            <span className="text-xs text-zinc-400">Fav Genres</span>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {GENRE_DATA.map((genre, i) => (
            <div key={genre.name} className="flex items-center justify-between text-sm">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                 <span className="text-zinc-300">{genre.name}</span>
               </div>
               <span className="text-white font-bold">{Math.round((genre.value / 1300) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
