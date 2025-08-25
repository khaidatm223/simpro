export function Badge({ children, variant }: { children: React.ReactNode; variant?: string }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${
      variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'
    }`}>
      {children}
    </span>
  );
}
