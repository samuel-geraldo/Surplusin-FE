export function AuthHeader({ showHelp = true }) {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between gap-4 bg-white px-4 py-[28px] sm:px-6 lg:px-7">
      <p className="whitespace-nowrap text-2xl font-extrabold leading-none tracking-[-0.64px] text-green-normal">
        SurplusIn
      </p>
      {showHelp && (
        <button
          type="button"
          className="text-[18px] font-medium leading-none text-[#0f172a] transition-colors hover:text-green-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-normal"
        >
          Bantuan
        </button>
      )}
    </header>
  );
}
