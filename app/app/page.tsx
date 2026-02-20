import { requireUser } from "../../lib/auth";

export default async function AppPage() {
  const { userId } = await requireUser();

  return (
    <main>
      <h1>App Area</h1>
      <p>Signed in as {userId}</p>
    </main>
  );
}
