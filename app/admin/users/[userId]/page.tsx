import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default async function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  return (
    <PagePlaceholder
      title={`Admin • User ${userId}`}
      description="User detail placeholder for profile, permissions, and account actions."
    />
  );
}
