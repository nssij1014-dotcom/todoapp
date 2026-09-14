import { getSessionUser } from "@/lib/session";
import Dashboard from "@/components/dashboard/Dashboard";
import LoginScreen from "@/components/auth/LoginScreen";

export default async function Home() {
  const user = await getSessionUser();
  if (!user) return <LoginScreen />;
  return <Dashboard />;
}
