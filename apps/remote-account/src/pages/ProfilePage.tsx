import { Link } from "react-router-dom";
import { ShoppingCart, Star, Heart, Settings } from "lucide-react";
import { Card, StatCard, StatCardSkeleton, Badge, Skeleton, ErrorState } from "@micro/shared-ui";
import { useProfileQuery } from "@/queries/profile.queries";
import { ACCOUNT_ROUTES } from "@/constants/routes";
import { Avatar } from "@/components/display";

interface Props {
    basePath: string;
}

function ProfileSkeleton() {
    return (
        <div className="space-y-6">
            <Card padding="lg">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                    <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="mx-auto h-7 w-48 sm:mx-0" />
                        <Skeleton className="mx-auto h-4 w-36 sm:mx-0" />
                        <Skeleton className="mx-auto h-5 w-16 rounded-full sm:mx-0" />
                    </div>
                </div>
                <div className="divide-border border-border mt-6 grid grid-cols-3 divide-x border-t pt-5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="px-4 text-center"
                        >
                            <Skeleton className="mx-auto h-7 w-10" />
                            <Skeleton className="mx-auto mt-1 h-3 w-14" />
                        </div>
                    ))}
                </div>
            </Card>
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
            <Card>
                <Skeleton className="mb-4 h-5 w-32" />
                <ul className="space-y-3">
                    {[0, 1, 2].map((i) => (
                        <li
                            key={i}
                            className="flex items-center justify-between"
                        >
                            <Skeleton className="h-4 w-2/3" />
                            <Skeleton className="h-3 w-20" />
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}

export function ProfilePage({ basePath }: Props) {
    const { data: profile, isLoading, isError, error, refetch } = useProfileQuery();
    const settingsPath = `${basePath}${ACCOUNT_ROUTES.SETTINGS}`;

    if (isLoading || !profile) return <ProfileSkeleton />;

    if (isError) {
        return (
            <ErrorState
                title="Failed to load profile"
                message={error instanceof Error ? error.message : "Could not load your profile."}
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <Card padding="lg">
                <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                    <Avatar name={profile.fullName} />

                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-foreground text-2xl font-bold tracking-tight">{profile.fullName}</h1>
                        <p className="text-foreground-muted text-sm">{profile.email}</p>
                        <div className="mt-1.5">
                            <Badge
                                variant="accent"
                                className="capitalize"
                            >
                                {profile.role}
                            </Badge>
                        </div>
                    </div>

                    <Link
                        to={settingsPath}
                        className="border-border text-foreground-muted hover:border-primary hover:bg-muted hover:text-foreground shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                    >
                        Edit profile
                    </Link>
                </div>

                <div className="divide-border border-border mt-6 grid grid-cols-3 divide-x border-t pt-5">
                    <div className="px-4 text-center">
                        <p className="text-foreground text-2xl font-bold">{profile.stats.orders}</p>
                        <p className="text-foreground-muted text-xs">Orders</p>
                    </div>
                    <div className="px-4 text-center">
                        <p className="text-foreground text-2xl font-bold">{profile.stats.reviews}</p>
                        <p className="text-foreground-muted text-xs">Reviews</p>
                    </div>
                    <div className="px-4 text-center">
                        <p className="text-foreground text-2xl font-bold">{profile.stats.wishlist}</p>
                        <p className="text-foreground-muted text-xs">Saved</p>
                    </div>
                </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    label="Orders"
                    value={profile.stats.orders}
                    delta="All time"
                    deltaType="negative"
                    icon={
                        <ShoppingCart
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    }
                />
                <StatCard
                    label="Reviews"
                    value={profile.stats.reviews}
                    delta="Product reviews"
                    deltaType="positive"
                    icon={
                        <Star
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    }
                />
                <StatCard
                    label="Saved"
                    value={profile.stats.wishlist}
                    delta="Saved products"
                    deltaType="neutral"
                    icon={
                        <Heart
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    }
                />
            </div>

            <Card>
                <h2 className="text-foreground mb-4 font-semibold">Recent Activity</h2>
                <ul className="divide-border divide-y">
                    {profile.recentActivity.map((activity) => (
                        <li
                            key={`${activity.action}-${activity.item}`}
                            className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0"
                        >
                            <span className="text-foreground">
                                <strong className="font-medium">{activity.action}</strong>{" "}
                                <span className="text-foreground-muted">{activity.item}</span>
                            </span>
                            <span className="text-foreground-muted shrink-0 pl-4 text-xs">{activity.date}</span>
                        </li>
                    ))}
                </ul>
            </Card>

            <div className="grid gap-4">
                <Link
                    to={settingsPath}
                    className="hover:border-primary/30 border-border bg-surface shadow-card hover:shadow-card-hover flex items-center gap-4 rounded-xl border p-5 transition-all"
                >
                    <div className="bg-accent flex h-10 w-10 items-center justify-center rounded-lg">
                        <Settings
                            className="text-accent-foreground h-5 w-5"
                            aria-hidden="true"
                        />
                    </div>
                    <div>
                        <p className="text-foreground font-medium">Account settings</p>
                        <p className="text-foreground-muted text-xs">Manage your profile and preferences</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
