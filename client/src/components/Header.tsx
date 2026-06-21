export function Header() {
  return (
    <header className="items-center flex lg:gap-[18px] gap-4 justify-between md:flex-col md:items-stretch">
      <div>
        <p className="text-[#14b8a6] text-xs font-bold uppercase tracking-normal">Private companion workspace</p>
        <h2 className="text-[clamp(24px,3vw,42px)] leading-[1.12] max-w-[780px] mt-0.5">Support, reflection, and gentle structure in one place.</h2>
      </div>
      <a className="items-center bg-[#bb5b46] rounded-lg text-white inline-flex font-bold min-h-[44px] p-2.5 md:justify-center md:w-full whitespace-nowrap" href="tel:988">
        988 crisis support
      </a>
    </header>
  )
}
