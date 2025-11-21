import React from "react";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/* ============================================
   WAR ROOM SKELETON - Loading State
   ============================================ */

export function WarRoomSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--surface-paper)] p-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton width={280} height={32} className="mb-2" />
            <Skeleton width={180} height={16} />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton width={120} height={40} />
            <Skeleton width={120} height={40} />
            <Skeleton width={140} height={40} />
          </div>
        </div>
      </div>

      {/* Split Panel Layout */}
      <div className="grid grid-cols-2 gap-6 h-[calc(100vh-180px)]">
        {/* Left Panel - Editor Skeleton */}
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width={120} height={24} />
            <Skeleton width={100} height={32} />
          </div>

          <div className="space-y-6">
            {/* SWOT Section */}
            <div>
              <Skeleton width={100} height={20} className="mb-3" />
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-gray-50">
                  <Skeleton width={80} height={18} className="mb-2" />
                  <SkeletonText lines={3} />
                </Card>
                <Card className="p-4 bg-gray-50">
                  <Skeleton width={80} height={18} className="mb-2" />
                  <SkeletonText lines={3} />
                </Card>
                <Card className="p-4 bg-gray-50">
                  <Skeleton width={100} height={18} className="mb-2" />
                  <SkeletonText lines={3} />
                </Card>
                <Card className="p-4 bg-gray-50">
                  <Skeleton width={80} height={18} className="mb-2" />
                  <SkeletonText lines={3} />
                </Card>
              </div>
            </div>

            {/* PESTEL Section */}
            <div>
              <Skeleton width={120} height={20} className="mb-3" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-3 bg-gray-50">
                    <Skeleton width={100} height={16} className="mb-2" />
                    <Skeleton width="100%" height={12} />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Right Panel - Preview Skeleton */}
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width={140} height={24} />
            <Skeleton width={80} height={28} />
          </div>

          <div className="space-y-6">
            {/* Company Info */}
            <div>
              <Skeleton width={200} height={28} className="mb-2" />
              <Skeleton width={150} height={16} />
            </div>

            {/* Preview Sections */}
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton width={140} height={20} />
                <Card className="p-4 bg-gray-50">
                  <SkeletonText lines={4} />
                </Card>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex items-center justify-between mt-6">
        <Skeleton width={100} height={40} />
        <div className="flex items-center space-x-3">
          <Skeleton width={140} height={40} />
          <Skeleton width={160} height={40} />
        </div>
      </div>
    </div>
  );
}
