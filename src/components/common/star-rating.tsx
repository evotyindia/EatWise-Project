
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  className,
  iconClassName,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        // Calculate the fill percentage for each star without rounding
        const fillPercentage =
          Math.max(0, Math.min(1, rating - i)) * 100;

        return (
          <div key={i} className="relative flex-shrink-0" style={{ width: size, height: size }}>
            {/* The background, unfilled star */}
            <Star
              size={size}
              className={cn('text-gray-300 dark:text-gray-600', iconClassName)}
            />
            {/* The foreground, filled star, clipped to the fill percentage */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={size}
                className={cn('text-[color:var(--star)] fill-[color:var(--star)]', iconClassName)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
