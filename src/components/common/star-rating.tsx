
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
<<<<<<< HEAD
=======
  variant?: 'good' | 'bad';
>>>>>>> finalprotest
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  className,
  iconClassName,
<<<<<<< HEAD
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
=======
  variant = 'good',
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const partialStarPercentage = Math.round((rating - fullStars) * 100);
  const emptyStars = maxRating - Math.ceil(rating);

  const starColor = variant === 'good' ? 'fill-star' : 'fill-star-bad';

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {/* Full Stars */}
      {Array.from({ length: fullStars }, (_, i) => (
        <Star
          key={`full-${i}`}
          size={size}
          className={cn('text-transparent', starColor, iconClassName)}
        />
      ))}

      {/* Partial Star */}
      {partialStarPercentage > 0 && (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          {/* Background star (unfilled part) */}
          <Star
            size={size}
            className={cn('text-transparent fill-gray-300 dark:fill-gray-600', iconClassName)}
          />
          {/* Foreground star (filled part), clipped to the percentage */}
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${partialStarPercentage}%` }}
          >
            <Star
              size={size}
              className={cn('text-transparent', starColor, iconClassName)}
            />
          </div>
        </div>
      )}

      {/* Empty Stars */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className={cn('text-transparent fill-gray-300 dark:fill-gray-600', iconClassName)}
>>>>>>> finalprotest
        />
      ))}
    </div>
  );
}
