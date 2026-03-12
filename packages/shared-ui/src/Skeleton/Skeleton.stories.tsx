import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, StatCardSkeleton, ProductCardSkeleton, FormSkeleton } from "./Skeleton";

const meta: Meta = {
    title: "Components/Skeleton",
    tags: ["autodocs"],
};

export default meta;

export const Base: StoryObj = {
    render: () => (
        <div className="w-64 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
        </div>
    ),
};

export const StatCard: StoryObj = {
    render: () => (
        <div className="grid gap-4 sm:grid-cols-2">
            <StatCardSkeleton />
            <StatCardSkeleton />
        </div>
    ),
};

export const ProductCard: StoryObj = {
    render: () => (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
        </div>
    ),
};

export const Form: StoryObj = {
    render: () => (
        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6">
            <FormSkeleton fields={4} />
        </div>
    ),
};
