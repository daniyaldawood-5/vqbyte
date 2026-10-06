import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Users, ShoppingCart, RefreshCw, BarChart2, TrendingUp } from "lucide-react"

export function HeroDashboardMockup() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Dashboard container styling based on Enterprise minimalism */}
      <Card className="border-border/50 shadow-xl shadow-slate-200/50 bg-white">
        <CardHeader className="pb-4 border-b border-border/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0078a8]" />
              Connected Operations Dashboard
            </CardTitle>
            <Badge variant="outline" className="text-xs bg-slate-50 text-slate-600 border-border/50 font-medium">
              Live Sync
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/40">
          
          {/* Mini Line Chart */}
          <Card className="border-border/50 bg-white shadow-sm overflow-hidden">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-semibold text-slate-800 flex justify-between">
                Sales Performance
                <TrendingUp className="w-4 h-4 text-[#137a52]" />
              </CardTitle>
              <CardDescription className="text-xs">Last 7 days vs previous period</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-0">
              <div className="h-28 flex items-end gap-1.5 pb-0 mt-4">
                {[40, 30, 60, 50, 80, 70, 95].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#0078a8]/10 rounded-t-sm overflow-hidden flex items-end">
                    <div className="w-full bg-[#0078a8]" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mini Bar Chart */}
          <Card className="border-border/50 bg-white shadow-sm">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-sm font-semibold text-slate-800 flex justify-between">
                Inventory Turnover
                <BarChart2 className="w-4 h-4 text-[#06a8e6]" />
              </CardTitle>
              <CardDescription className="text-xs">Top moving categories</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="space-y-4 mt-3">
                {[
                  { label: "Electronics", val: 85 },
                  { label: "Apparel", val: 65 },
                  { label: "Home Goods", val: 45 }
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#06a8e6] rounded-full" style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed */}
          <Card className="col-span-1 md:col-span-2 border-border/50 bg-white shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-border/50 bg-slate-50/50">
              <CardTitle className="text-sm font-semibold text-slate-800">Recent System Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">ERP Sync Completed</p>
                    <p className="text-[13px] text-slate-500 truncate">Inventory quantities updated across 3 branches.</p>
                  </div>
                  <div className="text-xs font-medium text-slate-400">Just now</div>
                </div>
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">3 New CRM Leads</p>
                    <p className="text-[13px] text-slate-500 truncate">Assigned to sales team via WhatsApp.</p>
                  </div>
                  <div className="text-xs font-medium text-slate-400">12m ago</div>
                </div>
                <div className="flex items-center gap-4 p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">High-Value POS Order</p>
                    <p className="text-[13px] text-slate-500 truncate">Order #4092 processed at Downtown branch.</p>
                  </div>
                  <div className="text-xs font-medium text-slate-400">1h ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
