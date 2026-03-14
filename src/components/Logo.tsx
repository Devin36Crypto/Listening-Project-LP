export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src="/prism-master-verified.webp?v=9999"
      alt="PRISM LOGO MASTER VERIFIED"
      className={`${className} rounded-lg shadow-lg`}
    />
  );
}
