import type { UserProfile } from "@micro/shared-types";

export const MOCK_PROFILE: UserProfile = {
    id: "u-1",
    fullName: "Fada Arzimanli",
    email: "fada.arzimanli@gmail.com",
    role: "admin",
    bio: "Frontend engineer focused on building scalable web applications.",
    avatarUrl: undefined,
    marketingEmails: true,
    stats: {
        orders: 24,
        reviews: 7,
        wishlist: 13,
    },
    recentActivity: [
        { action: "Purchased", item: "Wireless Headphones", date: "2 days ago" },
        { action: "Reviewed", item: "Mechanical Keyboard", date: "1 week ago" },
        { action: "Added to wishlist", item: "Smart Watch", date: "2 weeks ago" },
        { action: "Purchased", item: "4K Webcam", date: "1 month ago" },
    ],
};
