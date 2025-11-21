import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

/* ============================================
   ENRICHMENT EDITOR SKELETON - Loading State
   ============================================ */

export function EnrichmentEditorSkeleton() {
  return (
    <div className="min-h-screen bg-surface-paper pb-20">
      {/* Breadcrumb Header Skeleton */}
      <header className="bg-white border-b border-line">
        <div className="px-8 py-4">
          <div className="flex items-center gap-2">
            <Skeleton width={80} height={14} />
            <span className="text-text-secondary">›</span>
            <Skeleton width={120} height={14} />
            <span className="text-text-secondary">›</span>
            <Skeleton width={150} height={14} />
          </div>

          <div className="mt-3">
            <Skeleton width={250} height={28} className="mb-2" />
            <Skeleton width={350} height={16} />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <div className="px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel: Submission Summary Skeleton */}
          <div className="col-span-4">
            <Card className="bg-white">
              <CardHeader>
                <Skeleton width={180} height={20} className="mb-2" />
                <Skeleton width={240} height={14} />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Section 1 */}
                <div>
                  <Skeleton width={160} height={12} className="mb-3" />
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton width={100} height={14} />
                        <Skeleton width={150} height={14} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2 */}
                <div>
                  <Skeleton width={120} height={12} className="mb-3" />
                  <Skeleton width="100%" height={60} />
                </div>

                {/* Section 3 */}
                <div>
                  <Skeleton width={140} height={12} className="mb-3" />
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton width={100} height={14} />
                        <Skeleton width={150} height={14} />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Enrichment Form Skeleton */}
          <div className="col-span-8 space-y-6">
            {/* Card 1 */}
            <Card className="bg-white">
              <CardHeader>
                <Skeleton width={200} height={20} className="mb-2" />
                <Skeleton width={280} height={14} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Skeleton width={140} height={12} className="mb-2" />
                  <Skeleton width="100%" height={80} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                  </div>
                  <div>
                    <Skeleton width={140} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="bg-white">
              <CardHeader>
                <Skeleton width={180} height={20} className="mb-2" />
                <Skeleton width={260} height={14} />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton width={160} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="bg-white">
              <CardHeader>
                <Skeleton width={160} height={20} className="mb-2" />
                <Skeleton width={240} height={14} />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <Skeleton width={140} height={12} className="mb-2" />
                    <Skeleton width="100%" height={60} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton (Sticky Footer) */}
      <div className="bg-white border-t border-line px-6 py-4 fixed bottom-0 left-0 right-0">
        <div className="flex items-center justify-between gap-4">
          <Skeleton width={100} height={16} />
          <div className="flex items-center gap-3">
            <Skeleton width={140} height={40} />
            <Skeleton width={100} height={40} />
            <Skeleton width={180} height={40} />
            <Skeleton width={140} height={40} />
          </div>
        </div>
      </div>
    </div>
  );
}
