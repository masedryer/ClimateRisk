"use client";
// components/ui/Sidebar.jsx
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-4 h-screen">
      <nav>
        <ul className="space-y-2">
          <li><Link href="/docs/introduction" className="text-white">Introduction</Link></li>
          <li><Link href="/docs/another-page" className="text-white">Another Page</Link></li>
          <li>
            <details className="group">
              <summary className="text-white cursor-pointer">Advanced</summary>
              <ul className="ml-4 mt-2">
                <li><Link href="/docs/advanced/satori" className="text-gray-300">Satori</Link></li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
