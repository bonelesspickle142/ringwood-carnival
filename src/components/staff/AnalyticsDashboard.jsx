import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Camera, Calendar, BookOpen, CheckCircle2, Clock, BarChart2 } from "lucide-react";

function StatCard({ icon: Icon, label, value, color = "text-primary" }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted flex-shrink-0">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-foreground font-heading leading-tight">{value ?? "—"}</p>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("getAnalytics", {});
      setData(res.data);
    } catch (e) {
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-border">
        <BarChart2 className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground text-sm">Analytics unavailable</p>
      </div>
    );
  }

  const photosByDay = data.photos_by_day ? Object.entries(data.photos_by_day) : [];
  const maxPhotos = Math.max(...photosByDay.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      {/* Key stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Calendar} label="Events" value={data.events_count} color="text-primary" />
        <StatCard icon={BookOpen} label="Programmes Sold" value={data.programme_purchases} color="text-secondary" />
        <StatCard icon={Camera} label="Photos Submitted" value={data.photos_total} color="text-primary" />
        <StatCard icon={CheckCircle2} label="Photos Approved" value={data.photos_approved} color="text-secondary" />
      </div>

      {/* Photo moderation status */}
      <div>
        <h3 className="font-heading font-bold text-muted-foreground text-xs mb-3 uppercase tracking-wide">Photo Status</h3>
        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm font-heading font-semibold text-foreground">Pending Review</span>
            </div>
            <span className="text-sm font-bold text-foreground">{data.photos_pending}</span>
          </div>
        </div>
      </div>

      {/* Photos per day chart */}
      {photosByDay.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-muted-foreground text-xs mb-3 uppercase tracking-wide">Photo Submissions — Last 7 Days</h3>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-end gap-2 h-24">
              {photosByDay.map(([day, count]) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-primary rounded-t-md transition-all duration-500"
                    style={{ height: `${Math.max((count / maxPhotos) * 80, count > 0 ? 4 : 0)}px` }}
                  />
                  <span className="text-[9px] text-muted-foreground text-center leading-tight">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



      <p className="text-xs text-muted-foreground text-center">Auto-refreshes every 30 seconds</p>
    </div>
  );
}