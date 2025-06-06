import { buttonVariants } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';

const pages = [1, 2, 3, 4, 5];
export default function PaginationTable() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href='#' className='border' />
        </PaginationItem>
        {pages.map((page) => {
          const isActive = page === 2;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={`#${page}`}
                isActive={page === 2}
                className={cn({
                  [buttonVariants({
                    variant: 'default',
                    className:
                      'hover:!text-muted-foreground text-muted-foreground !shadow-none',
                  })]: isActive,
                  border: !isActive,
                })}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext href='#' className='border' />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
