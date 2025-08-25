export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${props.className || ''}`} />;
}
