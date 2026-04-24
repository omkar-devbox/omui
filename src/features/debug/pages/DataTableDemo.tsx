import React, { useState } from "react";
import { DataTable } from "../../../shared/ui";
import { LayoutGrid, List, Pencil, Trash2 } from "lucide-react";
import { cn } from "../../../shared/utils/cn";

const mockApplications = [
  { id: "APP-001", student: "Arjun Mehta", dept: "CS", cgpa: 9.2, status: "Offered", company: "Google" },
  { id: "APP-002", student: "Priya Sharma", dept: "IT", cgpa: 8.8, status: "Shortlisted", company: "Microsoft" },
  { id: "APP-003", student: "Rohan Gupta", dept: "ECE", cgpa: 8.5, status: "In Review", company: "Amazon" },
  { id: "APP-004", student: "Ananya Iyer", dept: "CS", cgpa: 9.5, status: "Offered", company: "Meta" },
  { id: "APP-005", student: "Vikram Singh", dept: "ME", cgpa: 7.9, status: "Shortlisted", company: "Tesla" },
  { id: "APP-006", student: "Sanya Malhotra", dept: "IT", cgpa: 8.6, status: "Rejected", company: "Netflix" },
  { id: "APP-007", student: "Kabir Bakshi", dept: "EE", cgpa: 8.2, status: "In Review", company: "Apple" },
];

const DataTableDemoPage: React.FC = () => {
  const [layout, setLayout] = useState<"table" | "card">("table");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
            DataTable Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Highly reusable, performant data table with advanced features and dual layout support.
          </p>
        </div>
        <div className="flex gap-4 items-center">
           <div className="flex bg-white dark:bg-[#0b0f1a] border border-gray-100 dark:border-gray-800 rounded-xl p-1 gap-1 shadow-sm">
              <button 
                onClick={() => setLayout("table")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${layout === "table" ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-y-[-1px]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <List size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Table View</span>
              </button>
              <button 
                onClick={() => setLayout("card")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${layout === "card" ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 translate-y-[-1px]' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
              >
                <LayoutGrid size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Card View</span>
              </button>
           </div>
           <div className="px-5 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl text-xs font-black text-blue-600 dark:text-blue-400">
             {mockApplications.length} APPLICATIONS
           </div>
        </div>
      </header>
      
      <div className={cn(
        "bg-white dark:bg-[#0b0f1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden transition-all",
        layout === "table" ? "h-[650px]" : "h-fit"
      )}>
        <DataTable
          title="Recruitment Pipeline"
          data={mockApplications}
          cardLayout={layout === "card"}
          getRowId={(row) => row.id}
          columns={[
            {
              key: "student",
              label: "Student",
              sortable: true,
              filterable: true,
              filterType: "text",
              width: 250,
              render: (row) => (
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-900/20">
                    {row.student.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-slate-100 font-semibold tracking-tight">{row.student}</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">{row.id}</span>
                  </div>
                </div>
              ),
            },
            {
              key: "company",
              label: "Company",
              sortable: true,
              filterable: true,
              filterType: "text",
              width: 180,
              render: (row) => (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-gray-700 dark:text-slate-200 font-medium">{row.company}</span>
                </div>
              )
            },
            {
              key: "dept",
              label: "Branch",
              filterable: true,
              filterType: "select",
              filterOptions: [
                { label: "CS", value: "CS" },
                { label: "IT", value: "IT" },
                { label: "ECE", value: "ECE" },
                { label: "ME", value: "ME" },
                { label: "EE", value: "EE" },
              ],
              width: 120,
              render: (row) => (
                <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-[10px] font-bold rounded border border-gray-200 dark:border-slate-700">
                  {row.dept}
                </span>
              )
            },
            {
              key: "cgpa",
              label: "CGPA",
              sortable: true,
              filterable: true,
              filterType: "range",
              width: 150,
              render: (row) => (
                <div className="flex flex-col gap-1.5 flex-1 min-w-[80px]">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-400 dark:text-slate-400 uppercase tracking-tighter">Score</span>
                    <span className="text-blue-500 dark:text-blue-400">{row.cgpa}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                      style={{ width: `${((row.cgpa as number) / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ),
              footerRender: (data) => {
                const avg =
                  data.reduce((acc, curr) => acc + (curr.cgpa as number), 0) /
                  data.length;
                return (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-black">
                      Avg CGPA
                    </span>
                    <span className="text-blue-400 font-bold">
                      {avg.toFixed(2)}
                    </span>
                  </div>
                );
              },
            },
            {
              key: "status",
              label: "Hiring Status",
              filterable: true,
              filterType: "select",
              filterOptions: [
                { label: "Offered", value: "Offered" },
                { label: "Shortlisted", value: "Shortlisted" },
                { label: "In Review", value: "In Review" },
                { label: "Rejected", value: "Rejected" },
              ],
              width: 180,
              render: (row) => {
                const statusConfig = (
                  {
                    Offered:
                      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-100 dark:border-emerald-400/20",
                    Shortlisted:
                      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-400/10 border-blue-100 dark:border-blue-400/20",
                    "In Review":
                      "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-100 dark:border-amber-400/20",
                    Rejected:
                      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 border-rose-100 dark:border-rose-400/20",
                  } as Record<string, string>
                )[row.status] ||
                  "text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-400/10 border-gray-200 dark:border-slate-500/20";

                return (
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${statusConfig}`}
                  >
                    {row.status}
                  </div>
                );
              },
              footerRender: (data) => (
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-black">
                    Offered
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {data.filter((d) => d.status === "Offered").length}
                  </span>
                </div>
              ),
            },
            {
              key: "actions",
              label: "Actions",
              width: 120,
              pinned: "right",
              render: (row) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => console.log("Edit", row.id)}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all active:scale-90 border border-gray-200 dark:border-slate-700 hover:border-blue-500 shadow-sm"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => console.log("Delete", row.id)}
                    className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-rose-600 dark:hover:bg-rose-600 text-gray-500 dark:text-slate-400 hover:text-white dark:hover:text-white transition-all active:scale-90 border border-gray-200 dark:border-slate-700 hover:border-rose-500 shadow-sm"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ),
            },
          ]}
          renderFooter={() => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    Last Updated
                  </span>
                  <span className="text-xs text-slate-300">Just now</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                    Data Source
                  </span>
                  <span className="text-xs text-slate-300 italic">
                    Production DB-01
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20">
                  Bulk Actions
                </button>
                <button className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-all active:scale-95">
                   Settings
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default DataTableDemoPage;
