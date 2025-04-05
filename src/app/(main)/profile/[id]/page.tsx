export default async function ProfileId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = await params;
  return (
    <div>
      <h1>Some profile with id: {id.id}</h1>
    </div>
  );
}
