export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center">
      <p className="font-mono text-xs text-white/40">
        © {new Date().getFullYear()} Saliq Nisar — Built with Next.js, TypeScript
        &amp; CSS.
      </p>
    </footer>
  );
}
