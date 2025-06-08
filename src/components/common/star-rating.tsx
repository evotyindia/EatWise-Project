
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
      {Array.from({ length: maxRating }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700',
            iconClassName
          )}
        />
      ))}
    </div>
  );
}
