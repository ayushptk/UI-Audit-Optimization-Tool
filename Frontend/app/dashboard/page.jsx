'use client';

import RevenueAnalyticsChart from "../components/dashboard/revenuechart";
import StatsCard from "../components/dashboard/statscard";

export default function DashboardPage() {
    return (
        <div className="">
            
           <StatsCard />
           <RevenueAnalyticsChart />
        </div>
    );
}
