export function Button({ children, onClick, variant }: { children: React.ReactNode; onClick?: () => void; variant?: string }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${variant === 'secondary' ? 'bg-gray-200 text-gray-800' : 'bg-blue-500 text-white'}`}>
      {children}
    </button>
  );
}
