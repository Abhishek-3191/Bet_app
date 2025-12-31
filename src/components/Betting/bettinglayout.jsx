import { Outlet } from "react-router-dom";

export default function BettingLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg p-4 flex justify-between">
        <h1 className="text-xl font-bold">Betting App</h1>
      </nav>

      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
