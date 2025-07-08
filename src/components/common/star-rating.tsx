
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
        const fillPercentage = Math.max(0, Math.min(1, rating - i)) * 100;

        return (
          <div key={i} className="relative flex-shrink-0" style={{ width: size, height: size }}>
            {/* Background star (unfilled part) */}
            <Star
              size={size}
              className={cn('text-transparent fill-gray-300 dark:fill-gray-600', iconClassName)}
            />
            {/* Foreground star (filled part), clipped to the percentage */}
            <div
              className="absolute top-0 left-0 h-full overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <Star
                size={size}
                className={cn('text-transparent fill-star', iconClassName)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
