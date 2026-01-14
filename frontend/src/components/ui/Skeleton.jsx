/**
 * Skeleton - Professional loading placeholder component
 * 
 * Uses CSS shimmer animation for a polished loading state.
 * Matches the dark theme of EduVerse.
 */

import PropTypes from 'prop-types';

// Base skeleton with shimmer animation
export function Skeleton({ className = '', ...props }) {
  return (
    <div 
      className={`skeleton bg-[#1a1a1a] ${className}`}
      {...props}
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
};

// Text skeleton - single line
export function SkeletonText({ width = '100%', className = '' }) {
  return (
    <Skeleton 
      className={`h-4 rounded ${className}`}
      style={{ width }}
    />
  );
}

SkeletonText.propTypes = {
  width: PropTypes.string,
  className: PropTypes.string,
};

// Card skeleton - for roadmap cards
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`p-5 bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-5/6 rounded" />
      </div>
    </div>
  );
}

SkeletonCard.propTypes = {
  className: PropTypes.string,
};

// Roadmap card skeleton - matches AiRoadmap card style
export function SkeletonRoadmapCard() {
  return (
    <div className="p-4 bg-[#0f0f0f] border border-[#1f1f1f] rounded-lg animate-pulse">
      <Skeleton className="w-5 h-5 rounded mb-3" />
      <Skeleton className="h-4 w-3/4 rounded mb-2" />
      <Skeleton className="h-3 w-1/2 rounded" />
    </div>
  );
}

// Grid of skeleton cards
export function SkeletonGrid({ count = 6, columns = 6 }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[6]} gap-3`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRoadmapCard key={i} />
      ))}
    </div>
  );
}

SkeletonGrid.propTypes = {
  count: PropTypes.number,
  columns: PropTypes.number,
};

// Avatar skeleton
export function SkeletonAvatar({ size = 40 }) {
  return (
    <Skeleton 
      className="rounded-full shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

SkeletonAvatar.propTypes = {
  size: PropTypes.number,
};

// Button skeleton
export function SkeletonButton({ width = 100, height = 40 }) {
  return (
    <Skeleton 
      className="rounded-[16px]"
      style={{ width, height }}
    />
  );
}

SkeletonButton.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Skeleton;
