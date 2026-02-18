'use client';

import React, { useState } from 'react';
import { 
  FunnelIcon, 
  InboxArrowDownIcon,
  ChevronDownIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  PhoneIcon, CheckIcon
} from '@heroicons/react/24/solid';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const getBarColor = (month: string): string => {
  const group1 = ["Jan", "Apr", "Jul", "Oct"];
  const group2 = ["Feb", "May", "Aug", "Nov"];
  const group3 = ["Mar", "Jun", "Sep", "Dec"];

  if (group1.includes(month)) return "#CAA9FF";
  if (group2.includes(month)) return "#5A4FB5";
  if (group3.includes(month)) return "#C7FB00";

  return "#5A4FB5";
};

const BAR_COLORS = ["#CAA9FF", "#5A4FB5", "#C7FB00"];

import Topbar from '@/components/topbar/Topbar';
import { useSidebar } from '@/contexts/SidebarContext';
import { Icon } from "@iconify/react";
import FilterModal, { FilterState } from './FilterModal';

// Mock data
const monthlyLeadsData = [
  { month: 'Jan', leads: 150 },
  { month: 'Feb', leads: 230 },
  { month: 'Mar', leads: 180 },
  { month: 'Apr', leads: 290 },
  { month: 'May', leads: 320 },
  { month: 'Jun', leads: 280 },
  { month: 'Jul', leads: 310 },
  { month: 'Aug', leads: 340 },
  { month: 'Sep', leads: 380 },
  { month: 'Oct', leads: 420 },
  { month: 'Nov', leads: 450 },
  { month: 'Dec', leads: 480 }
];

const revenueData = [
  { month: 'Jan', estimation: 300, realization: 250 },
  { month: 'Feb', estimation: 350, realization: 320 },
  { month: 'Mar', estimation: 320, realization: 310 },
  { month: 'Apr', estimation: 400, realization: 380 },
  { month: 'May', estimation: 380, realization: 360 },
  { month: 'Jun', estimation: 420, realization: 400 },
  { month: 'Jul', estimation: 450, realization: 430 },
  { month: 'Aug', estimation: 440, realization: 420 },
  { month: 'Sep', estimation: 460, realization: 450 },
  { month: 'Oct', estimation: 480, realization: 470 },
  { month: 'Nov', estimation: 500, realization: 490 },
  { month: 'Dec', estimation: 520, realization: 510 }
];

const recentDealsData = [
  { id: 1, title: 'Branding Package Pl...', value: 'Rp 10.000.000' },
  { id: 2, title: 'New Campaign Setup', value: 'Rp 5.000.000' },
  { id: 3, title: 'Monthly Maintenanc...', value: 'Rp 10.000.000' },
  { id: 4, title: 'Website Revamp', value: 'Rp 10.000.000' },
  { id: 5, title: 'SEO Optimization', value: 'Rp 10.000.000' }
];

const pipelineStages = [
  { stage: 'Qualified', count: 2, percentage: 13 },
  { stage: 'Demo Sheduled', count: 2, percentage: 13 },
  { stage: 'Negotiation Started', count: 2, percentage: 13 },
  { stage: 'Contract Send', count: 2, percentage: 13 },
  { stage: 'Closing', count: 2, percentage: 13 }
];

const upcomingActivities = [
  { 
    id: 1, 
    type: 'meeting', 
    title: 'Weekly Team Sync', 
    time: 'Today at 03:00 - 2:00 PM | Online',
    date: '05/06/2025',
    status: 'Meet in progress'
  },
  { 
    id: 2, 
    type: 'call', 
    title: 'Client Presentation', 
    subtitle: '2nd Floor Meeting with Angela A',
    date: '08/06/2025',
    time: '09:00 - 10:00 PM'
  },
  { 
    id: 3, 
    type: 'call', 
    title: 'Client Presentation', 
    subtitle: 'Discussion about new project',
    date: '09/06/2025',
    time: '09:00 - 10:00 AM'
  },
  { 
    id: 4, 
    type: 'call', 
    title: 'Client Presentation', 
    subtitle: '2nd Floor Meeting with Angela A',
    date: '09/06/2025',
    time: '09:00 - 12:00 PM'
  }
];

const quarterSummary = [
  { label: 'Total Deal', value: 'Rp 10.000.000', icon: 'check', color: 'bg-purple-100' },
  { label: 'Average Size', value: 'Rp 10.000.000', icon: 'wallet', color: 'bg-purple-100' },
  { label: 'Revenue', value: 'Rp 10.000.000', icon: 'chart', color: 'bg-lime-100' }
];

const leadsSourceData = [
  { name: 'Website', value: 25, color: '#F1FF92' },
  { name: 'Ads/campaign', value: 17, color: '#E3FF53' },
  { name: 'Referral', value: 17, color: '#C7FB00' },
  { name: 'Offline', value: 17, color: '#8AB500' },
  { name: 'Sosial Media', value: 24, color: '#688902' },
];

export default function Dashboard({ realLeads = [] }: { realLeads?: any[] }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [from, setFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeActivityTab, setActiveActivityTab] = useState('Call');
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    stage: [],
    currency: [],
    priority: [],
    label: [],
    clientType: [],
    ownership: 'All Leads'
  });
  
  // ✅ PERBAIKAN: Tambahkan semua property yang dibutuhkan
  const stats = {
    totalPipeline: realLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0),
    totalPipelineChange: 5,
    activeDeals: realLeads.filter(l => !["WON", "LOST"].includes(l.pipelineStatus)).length,
    activeDealsChange: 3,
    avarageDeals: 15000000,
    avarangeDealsChange: 3,
    totalWon: realLeads.filter(l => l.pipelineStatus === "WON").length,
    totalWonChange: 10,
    totalLost: realLeads.filter(l => l.pipelineStatus === "LOST").length,
    totalLostChange: -3,
    totalLeads: realLeads.length,
    totalLeadsChange: 5,
    activeLeads: realLeads.filter(l => !["WON", "LOST"].includes(l.pipelineStatus)).length,
    activeLeadsChange: 3
  };

  // Pipeline Overview Data Asli
  const realPipelineStages = [
    { stage: 'Qualified', count: realLeads.filter(l => l.pipelineStatus === "QUALIFIED").length },
    { stage: 'Negotiation', count: realLeads.filter(l => l.pipelineStatus === "NEGOTIATION").length },
    { stage: 'Won', count: realLeads.filter(l => l.pipelineStatus === "WON").length },
  ];

  const handleExport = () => {
    alert('Export functionality');
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    console.log('Applied Filters:', filters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F5]">
      {/* Topbar */}
      <div className="bg-[#F0F2F5] px-5 border-b border-gray-200">
        <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-[#F0F2F5] px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-l font-bold text-gray-900">Dashboard</h1>
            <p className="text-[10px] text-gray-500 mt-0.5">Showing data from current month</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-[#828382] hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="w-3.5 h-3.5" />
                <span>Filters</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Export */}
            <div className="relative">
              <button onClick={() => setIsExportOpen(!isExportOpen)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-400 rounded-full text-xs font-medium text-[#828382] hover:bg-gray-50 transition-colors">
                <InboxArrowDownIcon className="w-3.5 h-3.5 text-[#828382]" />
                <span>Export</span>
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>

              {isExportOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsExportOpen(false)} />
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
                    <button onClick={() => { handleExport(); setIsExportOpen(false); }} className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50">Export as CSV</button>
                    <button onClick={() => setIsExportOpen(false)} className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50">Export as Excel</button>
                    <button onClick={() => setIsExportOpen(false)} className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50">Export as PDF</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
          {/* Total Pipeline */}
          <div className="bg-gradient-to-br bg-[#5A4FB5] rounded-md p-2.5 text-white items-center text-center shadow-sm">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon icon="ph:money-wavy-fill" className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">Total Pipeline</span>
            </div>

            <div className="text-lg font-bold">
              Rp {stats.totalPipeline.toLocaleString("id-ID")}
            </div>

            <div className="flex items-center gap-1 text-[10px] mt-1.5 justify-center" style={{ color: "#4ADB8B" }}>
              <Icon icon="streamline:graph-arrow-increase" className="w-3 h-3" />
              +{stats.totalPipelineChange}%
            </div>
          </div>

          {/* Active Deals */}
          <div className="bg-gradient-to-br bg-[#5A4FB5] rounded-md p-2.5 text-white items-center text-center shadow-sm">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon icon="solar:card-bold" className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">Active Deals</span>
            </div>

            <div className="text-lg font-bold">{stats.activeDeals}</div>

            <div className="flex items-center gap-1 text-[10px] mt-1.5 justify-center" style={{ color: "#4ADB8B" }}>
              <Icon icon="streamline:graph-arrow-increase" className="w-3 h-3" />
              +{stats.activeDealsChange}%
            </div>
          </div>

          {/* Avarange Deals */}
          <div className="bg-gradient-to-br bg-[#5A4FB5] rounded-md p-2.5 text-white items-center text-center shadow-sm">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Icon icon="chart-bar-solid" className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium">Avarange Deals</span>
            </div>

            <div className="text-lg font-bold">
              Rp {stats.avarageDeals.toLocaleString("id-ID")}
            </div>

            <div className="flex items-center gap-1 text-[10px] mt-1.5 justify-center" style={{ color: "#4ADB8B" }}>
              <Icon icon="streamline:graph-arrow-increase" className="w-3 h-3" />
              +{stats.avarangeDealsChange}%
            </div>
          </div>
        </div>

        {/* KPI Cards - Bottom Row */}
        <div className="bg-[#F0F2F5] rounded-lg border-b border-gray-400 mb-4">
          <div className="grid grid-cols-4 divide-x divide-gray-400">
            {/* Total Won */}
            <div className="p-3 flex items-center justify-center gap-3 text-center">
              <div className="w-4 h-4 bg-[#257047] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>

              <span className="text-[12px] font-medium text-gray-700 whitespace-nowrap">
                Total Won
              </span>

              <span className="text-lg font-bold text-gray-900">
                {stats.totalWon}
              </span>

              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#257047]">
                <Icon icon="streamline:graph-arrow-increase" className="w-3 h-3" />
                +{stats.totalWonChange}%
              </span>
            </div>

            {/* Total Lost */}
            <div className="p-3 flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-[#AA130A]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414z" clipRule="evenodd" />
              </svg>

              <span className="text-[12px] font-medium text-gray-700 whitespace-nowrap">
                Total Lost
              </span>

              <span className="text-lg font-bold text-gray-900">
                {stats.totalLost}
              </span>

              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#AA130A]">
                <ArrowTrendingDownIcon className="w-3 h-3"/>
                {stats.totalLostChange}%
              </span>
            </div>

            {/* Total Leads */}
            <div className="p-3 flex items-center justify-center gap-3">
              <Icon icon="mage:globe-fill" className="w-3.5 h-3.5 text-[#5198CB]" />
              <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap">
                Total Leads
              </span>

              <span className="text-lg font-bold text-gray-900">
                {stats.totalLeads}
              </span>

              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#257047]">
                <Icon icon="streamline:graph-arrow-increase" className="w-3 h-3" />
                +{stats.totalLeadsChange}%
              </span>
            </div>

            {/* Active Leads */}
            <div className="p-3 flex items-center justify-center gap-3">
              <Icon icon="fa7-solid:users" className="w-3.5 h-3.5 text-[#C7FB00]" />
              <span className="text-[11px] font-medium text-gray-700 whitespace-nowrap">
                Active Leads
              </span>

              <span className="text-lg font-bold text-gray-900">
                {stats.activeLeads}
              </span>

              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-[#257047]">
                <Icon icon="streamline:graph-arrow-increase" className="w-3 h-3" />
                +{stats.activeLeadsChange}%
              </span>
            </div>
          </div>
        </div>

        {/* Main Content: 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 text-center mb-3">
                Total Leads by Months
              </h3>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyLeadsData}>
                  <CartesianGrid stroke="#8F8F8F" strokeOpacity={0.2} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#8F8F8F" }}
                    axisLine={{ stroke: "#8F8F8F" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 500]}
                    ticks={[0, 100, 200, 300, 400, 500]}
                    tick={{ fontSize: 10, fill: "#8F8F8F" }}
                    axisLine={{ stroke: "#8F8F8F" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 6,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                    {monthlyLeadsData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Area Chart */}
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <h3 className="text-sm font-medium text-center text-gray-800 mb-4">
                Estimation Revenue by Months
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="realisationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C7FB00" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="estimationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5A4FB5" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical
                    horizontal={false}
                    stroke="#8F8F8F"
                    strokeOpacity={0.15}
                  />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#8F8F8F" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#8F8F8F" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                    }}
                  />

                  <Legend
                    content={() => (
                      <div className="flex justify-center gap-6 mt-3 text-[12px]">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#5A4FB5]" />
                          <span className="text-black">Estimation</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#5A4FB5]" />
                          <span className="text-black">Realisation</span>
                        </div>
                      </div>
                    )}
                  />

                  <Area
                    type="monotone"
                    dataKey="realization"
                    stroke="#5A4FB5"
                    strokeWidth={2}
                    fill="url(#realisationGradient)"
                    dot={false}
                    activeDot={false}
                  />

                  <Area
                    type="monotone"
                    dataKey="estimation"
                    stroke="#5A4FB5"
                    strokeWidth={2.5}
                    fill="url(#estimationGradient)"
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Tables */}
            <div className="grid grid-cols-2 gap-4">
              {/* Recent Deals */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-200 text-center">
                  <h3 className="text-sm font-medium text-gray-800">
                    Recent Deals
                  </h3>
                  <p className="text-[10px] text-gray-700 mt-0.5">
                    Your most recently updated deals
                  </p>
                </div>

                <div className="p-3 space-y-2 flex-1">
                  {recentDealsData.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-center justify-between p-2 rounded-md border border-gray-300 hover:border-[#5A4FB0] transition-colors"
                    >
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {deal.title}
                        </p>
                        <p className="text-xs font-semibold text-gray-900 mt-0.5">
                          {deal.value}
                        </p>
                      </div>
                      
                      <button className="text-[10px] text-[#828382] hover:text-[#5A4FB0] flex items-center gap-0.5">
                        view 
                        <Icon icon="flowbite:arrow-right-outline" className="w-2.5 h-2.5 text-[#828382]" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200">
                  <button className="w-full py-2 bg-[#5A4FB0] text-white rounded-lg text-xs font-medium hover:bg-[#4A3F90]">
                    View All
                  </button>
                </div>
              </div>

              {/* Pipeline Overview */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="p-4 border-b border-gray-200 text-center">
                  <h3 className="text-sm font-medium text-gray-800">
                    Pipeline Overview
                  </h3>
                  <p className="text-[10px] text-gray-700 mt-0.5">
                    Distribution deals across stage
                  </p>
                </div>

                <div className="p-2 space-y-3 flex-1">
                  {pipelineStages.map((stage, index) => (
                    <div
                      key={index}
                      className="px-3 py-2.5 border border-gray-300 rounded-lg hover:border-[#5A4FB0] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-900">
                          {stage.stage}
                        </p>
                        <p className="text-xs font-semibold text-gray-900 ">
                          {stage.count} deals ({stage.percentage}%)
                        </p>
                      </div>

                      <div className="mt-0.5">
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-[#CAA9FF] h-2 rounded-full"
                            style={{ width: `${stage.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-200">
                  <button className="w-full py-2 bg-[#5A4FB0] text-white rounded-lg text-xs font-medium hover:bg-[#4A3F90]">
                    View All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-4">
              <h3 className="text-[13px] font-medium text-center text-gray-900 mb-4">
                Upcoming Activities
              </h3>

              <div className="flex justify-between border-b border-gray-200 mb-6 px-2">
                {['Meeting', 'Call', 'E-mail', 'Invoice'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveActivityTab(tab)}
                    className={`pb-2 px-1 text-[11px] font-semibold transition-all relative ${
                      activeActivityTab === tab 
                      ? 'text-gray-900 border-b-2 border-[#5A4FB0]' 
                      : 'text-gray-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <p className="text-[13px] font-medium text-gray-900 mb-4">Today Activities</p>
                
                <div className="bg-[#5A4FB0] rounded-2xl flex items-stretch overflow-hidden shadow-sm">
                  <div className="w-12 flex items-center justify-center">
                    <Icon icon="fa6-solid:users" className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 bg-[#F9F5FF] rounded-2xl p-4 m-0"> 
                    <h4 className="text-sm font-bold text-gray-900">Weekly Team Sync</h4>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Today at 01:00 – 03.00 PM | Online
                    </p>
                    
                    <div className="border-b border-gray-300 my-3"></div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Icon icon="fa6-solid:user" className="w-3 h-3 text-black" />
                        <span className="text-[10px] text-black">PIC: Dedinda Okta</span>
                      </div>
                      
                      <button className="bg-[#9753F9] text-white text-[9px] px-3 py-1.5 rounded-full font-medium hover:bg-[#8246d8] transition-colors">
                        View Location
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[13px] font-medium text-gray-900 mb-4">Upcoming</p>
                <div className="space-y-4">
                  {upcomingActivities.slice(1, 4).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#EBE9FE] rounded-xl flex items-center justify-center">
                          <Icon icon="fa6-solid:calendar-days" className="w-4 h-4 text-[#5A4FB0]" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{activity.title}</p>
                          <p className="text-[10px] text-gray-500">you have meeting with Angela A. Tomorrow</p>
                        </div>
                      </div>
                      <span className="bg-[#EBE9FE] text-gray-700 text-[10px] font-medium px-3 py-1 rounded-lg">
                        09.30 – 12.00 PM
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full mt-8 py-3.5 bg-[#5A4FB0] text-white rounded-xl text-sm font-medium hover:bg-[#4A3F90] transition-shadow shadow-md">
                View All
              </button>
            </div>

            {/* Leads Source Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Leads Source Breakdown</h3>
              <div className="flex items-center justify-center mb-3">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={leadsSourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                    >
                      {leadsSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {leadsSourceData.map((source, index) => (
                  <div key={index} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.color }}></div>
                    <span className="text-[10px] text-gray-700">{source.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quarter Summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Quarter Summary</h3>
              <div className="space-y-2">
                <div className="rounded-lg p-3 flex items-center gap-3 border border-gray-200">
                  <div className="w-10 h-10 bg-[#CAA9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-4 h-4 text-[#5A4FB0] " />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Rp 10.000.000</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Total Deal</p>
                  </div>
                </div>

                <div className="rounded-lg p-3 flex items-center gap-3 border border-gray-200">
                  <div className="w-10 h-10 bg-[#CAA9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="solar:card-bold" className="w-4 h-4 text-[#5A4FB0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Rp 10.000.000</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Averange size</p>
                  </div>
                </div>

                <div className="rounded-lg p-3 flex items-center gap-3 border border-gray-200">
                  <div className="w-10 h-10 bg-[#D1FB20] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon icon="streamline:graph-arrow-increase" className="w-4 h-4 text-grayy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Rp 10.000.000</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">Revenue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onApply={handleApplyFilters}
      />
    </div>
  );
}