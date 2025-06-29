// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900 border-t border-zinc-800 mt-12 px-6 py-6 text-sm text-zinc-400">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>&copy; {new Date().getFullYear()} Glitch Club. All rights reserved.</p>
        <p>Made with ❤️ by Lambda</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:text-pink-400 transition">About</Link>
          <Link href="/team" className="hover:text-pink-400 transition">Team</Link>
          <Link href="/blogs" className="hover:text-pink-400 transition">Blogs</Link>
          <Link href="/projects" className="hover:text-pink-400 transition">Projects</Link>
        </div>
      </div>
    </footer>
  );
}
