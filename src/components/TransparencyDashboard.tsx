import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Flame,
  BarChart3,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { civicStore } from "../services/store";

const COLORS = ["#059669", "#0284c7", "#f59e0b", "#8b5cf6", "#ec4899", "#64748b"];

export const TransparencyDashboard: React.FC = () => {
  const [stats, setStats] = useState(civicStore.getAggregatedStats());
  const [clusters, setClusters] = useState(civicStore.getClusters());

  useEffect(() => {
    return civicStore.subscribe(() => {
      setStats(civicStore.getAggregatedStats());
      setClusters(civicStore.getClusters());
    });
  }, []);

  const resolutionRate = Math.round((stats.resolved / Math.max(1, stats.total)) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Hero Transparency Statement */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Open Civic Governance & Public Accountability</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Jharkhand State Civic Grievance Transparency Index
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Real-time, unfiltered aggregated data on citizen grievances, department SLA compliance, and on-ground verified resolutions across all 24 districts.
        </p>
      </div>

      {/* Top 4 Key Benchmark Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered</span>
          <div className="text-3xl font-black text-slate-900">{stats.total}</div>
          <span className="text-xs text-slate-500">Across 24 Districts</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">On-Ground Resolved</span>
          <div className="text-3xl font-black text-emerald-700">{stats.resolved}</div>
          <span className="text-xs text-emerald-600 font-semibold">{resolutionRate}% Resolution Rate</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Avg Resolution Speed</span>
          <div className="text-3xl font-black text-blue-700">{stats.avgResolutionDays} Days</div>
          <span className="text-xs text-blue-600 font-medium">Against 7-day Target</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">SLA Compliance</span>
          <div className="text-3xl font-black text-amber-700">{stats.slaComplianceRate}%</div>
          <span className="text-xs text-amber-600 font-medium">Within Official Timelines</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Grievance Distribution by Sector</h3>
              <p className="text-xs text-slate-500">Top reported citizen pain points statewide</p>
            </div>
            <BarChart3 className="w-5 h-5 text-emerald-700" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryStats}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Reported Complaints" fill="#059669" radius={[4, 4, 0, 0]}>
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Workflow Resolution Health</h3>
              <p className="text-xs text-slate-500">Current lifecycle states of all tickets</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Resolved / Verified", value: stats.resolved },
                    { name: "In Progress", value: stats.inProgress },
                    { name: "Pending Triage", value: stats.pending },
                    { name: "Escalated", value: stats.escalated },
                  ]}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="#059669" />
                  <Cell fill="#0284c7" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#dc2626" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Resolved: {stats.resolved}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>In Progress: {stats.inProgress}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Pending: {stats.pending}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Escalated: {stats.escalated}</span>
            </div>
          </div>
        </div>
      </div>

      {/* District League Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              District SLA Compliance & Resolution Leaderboard
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by on-time resolution percentage and citizen satisfaction
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Updated Today
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3">District</th>
                <th className="px-5 py-3">Total Issues</th>
                <th className="px-5 py-3">Resolved</th>
                <th className="px-5 py-3">Active</th>
                <th className="px-5 py-3">SLA Compliance</th>
                <th className="px-5 py-3">AI Hotspots</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.districtStats.slice(0, 10).map((d, index) => (
                <tr key={d.district} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span>{d.district}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{d.totalIssues}</td>
                  <td className="px-5 py-3.5 font-bold text-emerald-700">{d.resolved}</td>
                  <td className="px-5 py-3.5 text-slate-600">{d.pending + d.inProgress}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${d.slaComplianceRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">{d.slaComplianceRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {d.hotspotsCount > 0 ? (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        {d.hotspotsCount} Hotspot
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
