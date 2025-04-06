// components/ui/toaster.tsx
'use client';

import { Toaster as Sonner } from 'sonner';

export const Toaster = () => {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        className: 'font-sans',
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      }}
    />
  );
};