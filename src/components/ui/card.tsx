export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`border rounded-lg p-4 shadow-sm ${className || ''}`}>{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) { return <div className="mb-2">{children}</div>; }
export function CardContent({ children }: { children: React.ReactNode }) { return <div>{children}</div>; }
export function CardTitle({ children }: { children: React.ReactNode }) { return <h3 className="font-semibold">{children}</h3>; }
