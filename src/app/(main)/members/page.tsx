import { TeamsContent } from '~/components/shared/teams-content';

export const dynamic = 'force-dynamic';

interface SearchParams {
  source?: string;
}

export default async function Members({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searches = await searchParams;
  console.log('searchParams', searches.source);
  return <TeamsContent source={searches.source ?? ''} />;
}
