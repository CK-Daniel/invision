import React from 'react';
import { cn } from '@/utils';

export function LoadingGrid() {
  return (
    <div
      dir="ltr"
      data-orientation="horizontal"
      className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'flex flex-col gap-4 rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden',
            'animate-pulse'
          )}
        >
          <div className="aspect-video bg-muted" />
          <div className="flex flex-col gap-2 p-4">
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
