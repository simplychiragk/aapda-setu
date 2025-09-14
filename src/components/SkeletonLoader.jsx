import React from 'react';

export const CardSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 w-full skeleton dark:skeleton-dark"></div>
    <div className="mt-4 space-y-2">
      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded skeleton dark:skeleton-dark"></div>
      <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4 skeleton dark:skeleton-dark"></div>
    </div>
  </div>
);

export const ListSkeleton = ({ items = 3, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-12 w-12 skeleton dark:skeleton-dark"></div>
          <div className="flex-1 space-y-2">
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded skeleton dark:skeleton-dark"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3 skeleton dark:skeleton-dark"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const ChartSkeleton = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 w-full skeleton dark:skeleton-dark"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 4, className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="bg-gray-200 dark:bg-gray-700 h-4 rounded skeleton dark:skeleton-dark"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);