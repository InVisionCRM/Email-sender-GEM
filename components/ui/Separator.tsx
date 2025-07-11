import React from 'react';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('shrink-0 bg-white/10 h-[1px] w-full', className)}
    {...props}
  />
));
Separator.displayName = 'Separator';

export { Separator };