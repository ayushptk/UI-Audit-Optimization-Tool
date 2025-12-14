const BASE_URL = "http://127.0.0.1:8000";

export async function fetchDashboardStats(token) {
    const res = await fetch(`${BASE_URL}/api/dashboard/stats`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) throw new Error("Failed to fetch dashboard stats");

    return res.json();
}
