import React from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/* ============================================
   SUBMISSION DETAIL SKELETON - Loading State
   ============================================ */

export function SubmissionDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton width={80} height={16} />
        <Skeleton width={10} height={16} />
        <Skeleton width={60} height={16} />
        <Skeleton width={10} height={16} />
        <Skeleton width={100} height={16} />
      </div>

      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton width={250} height={36} className="mb-2" />
          <Skeleton width={200} height={20} />
        </div>
        <div className="flex items-center space-x-3">
          <Skeleton width={100} height={28} />
          <Skeleton width={90} height={40} />
        </div>
      </div>

      {/* Accordion Sections Skeleton */}
      <div className="space-y-4">
        {/* Section 1 - Submission Data */}
        <Card className="border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton width="150px" height={24} />
              </div>
              <Skeleton width={100} height={16} />
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4 bg-gray-50">
                <Skeleton width={180} height={20} className="mb-3" />
                <div className="space-y-3">
                  <SkeletonText lines={4} />
                </div>
              </Card>
              <Card className="p-4 bg-gray-50">
                <Skeleton width={180} height={20} className="mb-3" />
                <div className="space-y-3">
                  <SkeletonText lines={4} />
                </div>
              </Card>
            </div>
          </div>
        </Card>

        {/* Section 2 - Enrichment */}
        <Card className="border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton width="220px" height={24} />
              </div>
              <Skeleton width={80} height={16} />
            </div>
          </div>
        </Card>

        {/* Section 3 - Analysis */}
        <Card className="border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton width="200px" height={24} />
              </div>
              <Skeleton width={140} height={16} />
            </div>
          </div>
        </Card>
      </div>

      {/* Status Message Skeleton */}
      <Card className="p-4 bg-blue-50">
        <div className="flex items-start space-x-3">
          <Skeleton variant="circle" width={20} height={20} />
          <div className="flex-1 space-y-2">
            <Skeleton width="250px" height={20} />
            <Skeleton width="100%" height={16} />
          </div>
        </div>
      </Card>
    </div>
  );
}
