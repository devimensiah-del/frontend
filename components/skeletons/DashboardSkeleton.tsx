import React from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/* ============================================
   DASHBOARD SKELETON - Loading State
   ============================================ */

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Page Header Skeleton */}
      <div>
        <Skeleton width="200px" height={36} className="mb-2" />
        <Skeleton width="400px" height={20} />
      </div>

      {/* Accordion Sections Skeleton */}
      <div className="space-y-4">
        {/* Section 1 - Submission Data */}
        <Card className="border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circle" width={32} height={32} />
              <Skeleton width="150px" height={24} />
            </div>
          </div>
          <div className="px-6 py-6 space-y-4">
            <SkeletonText lines={3} />
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Skeleton height={100} />
              <Skeleton height={100} />
            </div>
          </div>
        </Card>

        {/* Section 2 - Enrichment */}
        <Card className="border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circle" width={32} height={32} />
              <Skeleton width="220px" height={24} />
            </div>
          </div>
        </Card>

        {/* Section 3 - Analysis */}
        <Card className="border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circle" width={32} height={32} />
              <Skeleton width="200px" height={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Message Skeleton */}
      <Card className="p-4 bg-blue-50">
        <div className="flex items-start space-x-3">
          <Skeleton variant="circle" width={20} height={20} />
          <div className="flex-1 space-y-2">
            <Skeleton width="200px" height={20} />
            <Skeleton width="100%" height={16} />
          </div>
        </div>
      </Card>
    </div>
  );
}
