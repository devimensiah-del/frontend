import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ============================================
   SUBMISSIONS LIST SKELETON - Loading State
   ============================================ */

export function SubmissionsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center space-x-2">
        <Skeleton width={80} height={16} />
        <Skeleton width={10} height={16} />
        <Skeleton width={60} height={16} />
      </div>

      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton width={180} height={36} className="mb-2" />
          <Skeleton width={320} height={20} />
        </div>
        <Skeleton width={150} height={40} />
      </div>

      {/* Search Bar Skeleton */}
      <Card className="p-4">
        <Skeleton height={40} />
      </Card>

      {/* Table Skeleton */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton width={60} height={16} />
              </TableHead>
              <TableHead>
                <Skeleton width={140} height={16} />
              </TableHead>
              <TableHead>
                <Skeleton width={80} height={16} />
              </TableHead>
              <TableHead>
                <Skeleton width={120} height={16} />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton width={80} height={16} className="ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton width={80} height={16} />
                </TableCell>
                <TableCell>
                  <Skeleton width={180} height={16} />
                </TableCell>
                <TableCell>
                  <Skeleton width={90} height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton width={140} height={16} />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton width={100} height={32} className="ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Results Count Skeleton */}
      <div className="text-center">
        <Skeleton width={200} height={16} className="mx-auto" />
      </div>
    </div>
  );
}
