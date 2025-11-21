import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/* ============================================
   ENRICHMENT LIST SKELETON - Loading State
   ============================================ */

export function EnrichmentListSkeleton() {
  return (
    <div className="min-h-screen bg-surface-paper">
      {/* Page Header Skeleton */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton width={280} height={36} className="mb-2" />
              <Skeleton width={320} height={16} />
            </div>

            <div className="flex items-center gap-4">
              <Card className="border px-4 py-2">
                <Skeleton width={60} height={28} className="mb-1" />
                <Skeleton width={50} height={12} />
              </Card>
              <Card className="border px-4 py-2">
                <Skeleton width={60} height={28} className="mb-1" />
                <Skeleton width={70} height={12} />
              </Card>
              <Card className="border px-4 py-2">
                <Skeleton width={60} height={28} className="mb-1" />
                <Skeleton width={70} height={12} />
              </Card>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Skeleton */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-4">
          <Skeleton width={60} height={16} />
          <Skeleton width={100} height={36} />
          <Skeleton width={120} height={36} />
          <Skeleton width={120} height={36} />
          <Skeleton width={120} height={36} />
          <div className="ml-auto">
            <Skeleton width={320} height={40} />
          </div>
        </div>
        <div className="mt-4">
          <Skeleton width={180} height={16} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="px-8 pb-8">
        <Card className="bg-white border border-line shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-surface-paper border-b border-line">
            <div className="col-span-3">
              <Skeleton width={80} height={14} />
            </div>
            <div className="col-span-3">
              <Skeleton width={60} height={14} />
            </div>
            <div className="col-span-2">
              <Skeleton width={70} height={14} />
            </div>
            <div className="col-span-2">
              <Skeleton width={130} height={14} />
            </div>
            <div className="col-span-2">
              <Skeleton width={60} height={14} />
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-line">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-3 flex items-center">
                  <Skeleton width={160} height={18} />
                </div>
                <div className="col-span-3 flex items-center">
                  <Skeleton width={180} height={16} />
                </div>
                <div className="col-span-2 flex items-center">
                  <Skeleton width={90} height={24} />
                </div>
                <div className="col-span-2 flex items-center">
                  <Skeleton width={100} height={16} />
                </div>
                <div className="col-span-2 flex items-center">
                  <Skeleton width={80} height={16} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
