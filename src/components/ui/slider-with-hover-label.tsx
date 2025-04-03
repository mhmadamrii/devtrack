'use client';

import * as React from 'react';

import { Badge } from '~/components/ui/badge';
import * as SliderPrimitive from '@radix-ui/react-slider';

// export function SliderWithHoverLabel({
//   currentProgress,
//   onProgressChange,
// }: {
//   currentProgress: number[];
//   onProgressChange: React.Dispatch<React.SetStateAction<number[]>>;
// }) {
//   return (
//     <div className='relative w-full flex flex-col items-center'>
//       <SliderPrimitive.Root
//         defaultValue={currentProgress}
//         max={100}
//         step={1}
//         onValueChange={onProgressChange}
//         className='relative flex w-full touch-none select-none items-center'
//       >
//         <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
//           <SliderPrimitive.Range className='absolute h-full bg-primary' />
//         </SliderPrimitive.Track>

//         <SliderPrimitive.Thumb className='group block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'>
//           {/* Sticky label */}
//           <Badge className='scale-0 group-hover:scale-100 transition-transform absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -top-4'>
//             {currentProgress}%
//           </Badge>
//         </SliderPrimitive.Thumb>
//       </SliderPrimitive.Root>
//     </div>
//   );
// }

export const SliderWithHoverLabel = React.memo(
  ({
    currentProgress,
    onProgressChange,
  }: {
    currentProgress: number[];
    onProgressChange: React.Dispatch<React.SetStateAction<number[]>>;
  }) => {
    return (
      <div className='relative w-full flex flex-col items-center'>
        <SliderPrimitive.Root
          defaultValue={currentProgress}
          max={100}
          step={1}
          onValueChange={onProgressChange}
          className='relative flex w-full touch-none select-none items-center'
        >
          <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'>
            <SliderPrimitive.Range className='absolute h-full bg-primary' />
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb className='group block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'>
            {/* Sticky label */}
            <Badge className='scale-0 group-hover:scale-100 transition-transform absolute left-1/2 -translate-x-1/2 -translate-y-1/2 -top-4'>
              {currentProgress}%
            </Badge>
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
      </div>
    );
  },
);
