const BASE_URL = "https://fastapi-backend-s1rw.onrender.com";

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

export async function deleteAudit(id, token) {
    const res = await fetch(`${BASE_URL}/api/audit/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    });

    if (!res.ok) throw new Error("Failed to delete audit");
    return true;
}

