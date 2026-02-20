import { requireAdmin } from "../../lib/auth";

export default async function AdminPage() {
  const { userId } = await requireAdmin();

  return (
    <main>
      <h1>Admin Area</h1>
      <p>Signed in admin {userId}</p>
    </main>
  );
}
