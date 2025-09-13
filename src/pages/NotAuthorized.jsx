export default function NotAuthorized() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold mb-2">Not Authorized</h1>
        <p className="text-slate-600">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}

