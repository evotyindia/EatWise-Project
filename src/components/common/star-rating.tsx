
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
  variant?: 'good' | 'bad';
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  className,
  iconClassName,
  variant = 'good',
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const partialStarPercentage = Math.round((rating - fullStars) * 100);
  const emptyStars = maxRating - Math.ceil(rating);



  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {/* Full Stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className={cn('fill-current', variant === 'good' ? 'text-star' : 'text-star-bad', iconClassName)}
        />
      ))}

      {/* Partial Star */}
      {partialStarPercentage > 0 && (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          {/* Background star (outline) */}
          <Star
            size={size}
            className={cn('text-muted-foreground', iconClassName)}
          />
          {/* Foreground star (filled part), clipped to the percentage */}
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${partialStarPercentage}%` }}
          >
            <Star
              size={size}
              className={cn('fill-current', variant === 'good' ? 'text-star' : 'text-star-bad', iconClassName)}
            />
          </div>
        </div>
      )}

      {/* Empty Stars */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className={cn('text-muted-foreground', iconClassName)}
        />
      ))}
    </div>
  );
}
