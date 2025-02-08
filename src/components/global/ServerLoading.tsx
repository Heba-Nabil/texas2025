export default function ServerLoading({ locale }: { locale: string }) {
  return (
    <div className="flex-center fixed inset-0 z-[100] h-screen w-full bg-white/60">
      <img
        src={
          locale === "ar"
            ? "/images/Texas-Icon-ar.gif"
            : "/images/Texas-Icon.gif"
        }
        alt="loading"
        width={112}
        height={112}
        className="aspect-square size-28 max-w-full object-contain"
      />
    </div>
  );
}
