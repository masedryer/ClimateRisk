"use client";

// app/docs/page.jsx
import Link from "next/link";

export default function Docs() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Documentation</h1>
      <p>Welcome to the documentation section.</p>

      <ul className="mt-4 space-y-2">
        <li><Link href="/docs/introduction" className="text-blue-400">Introduction</Link></li>
        <li><Link href="/docs/another-page" className="text-blue-400">Another Page</Link></li>
        <li><Link href="/docs/advanced/satori" className="text-blue-400">Satori (Advanced)</Link></li>
      </ul>
    </div>
  );
}
