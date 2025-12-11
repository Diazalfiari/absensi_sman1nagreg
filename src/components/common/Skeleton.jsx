import React from 'react';

const Skeleton = ({ 
  variant = 'rectangular', 
  width = '100%', 
  height = '20px',
  className = '',
  count = 1,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-white/10 rounded';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const skeletonClass = `${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`;
  
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={skeletonClass} style={style}></div>
        ))}
      </div>
    );
  }

  return <div className={skeletonClass} style={style}></div>;
};

// Skeleton untuk Table Row
export const SkeletonTableRow = ({ columns = 5 }) => {
  return (
    <tr className="border-b border-white/10">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4">
          <Skeleton height="20px" />
        </td>
      ))}
    </tr>
  );
};

// Skeleton untuk Card
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`glass-panel p-6 ${className}`}>
      <Skeleton variant="rectangular" height="24px" width="60%" className="mb-4" />
      <Skeleton variant="rectangular" height="16px" width="80%" className="mb-2" />
      <Skeleton variant="rectangular" height="16px" width="70%" />
    </div>
  );
};

// Skeleton untuk Stat Card
export const SkeletonStatCard = () => {
  return (
    <div className="glass-panel p-6 border border-white/15">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" width="40px" height="40px" />
        <Skeleton variant="rectangular" width="60px" height="20px" />
      </div>
      <Skeleton variant="rectangular" height="32px" width="80px" className="mb-2" />
      <Skeleton variant="rectangular" height="16px" width="120px" />
    </div>
  );
};

// Skeleton untuk Table
export const SkeletonTable = ({ rows = 5, columns = 10 }) => {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-primary-700/80 via-primary-500/80 to-accent-500/70">
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-4">
                  <Skeleton height="16px" className="bg-white/20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <SkeletonTableRow key={rowIndex} columns={columns} />
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
        <Skeleton height="20px" width="200px" />
        <div className="flex items-center gap-2">
          <Skeleton height="36px" width="120px" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height="36px" width="36px" variant="rectangular" />
            ))}
          </div>
          <Skeleton height="36px" width="120px" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
