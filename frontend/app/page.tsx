import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>IRCTC</h1>
      <p>Next.js frontend initialized.</p>
      <Link href="/login">Sign in</Link>
    </main>
  );
}
