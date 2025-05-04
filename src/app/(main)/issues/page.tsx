import { IssuesContent } from '~/components/shared/issue-content';

export const dynamic = 'force-dynamic'; // This page should always be revalidated

export default function Issues() {
  return <IssuesContent />;
}
