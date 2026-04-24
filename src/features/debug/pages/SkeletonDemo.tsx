import React from "react";
import { 
  Skeleton, 
  PageHeaderSkeleton, 
  ListItemSkeleton, 
  StatsGridSkeleton, 
  ContentSkeleton 
} from "../../../shared/ui";

const SkeletonDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-12 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Skeleton Primitives</h2>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-8">
          <div className="flex items-center gap-8">
            <div className="space-y-2">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Circles</p>
              <div className="flex gap-4">
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton variant="circle" width={48} height={48} />
                <Skeleton variant="circle" width={64} height={64} />
              </div>
            </div>
            <div className="space-y-2 flex-grow">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Text Lines</p>
              <div className="space-y-2">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="60%" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Rectangles / Cards</p>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton variant="rect" height={100} />
              <Skeleton variant="rect" height={100} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Page Header Layout</h2>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
          <PageHeaderSkeleton />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Stats Grid Layout</h2>
        <StatsGridSkeleton />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">List / Table Items</h2>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Full Page Composition</h2>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
          <ContentSkeleton />
        </div>
      </section>
    </div>
  );
};

export default SkeletonDemo;
