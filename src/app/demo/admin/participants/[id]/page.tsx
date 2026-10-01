import { ParticipantDetail } from "@/features/admin/dashboard";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ParticipantDetail id={id} />;
}
