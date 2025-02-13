import Link from "next/link";
import GameRender from "@/components/GameRender/GameRender";

export default function Game() {
  return (
    <>
      <GameRender />
      {/* <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Link
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:mt-20"
          href="/"
        >
          Go To Main
        </Link>
      </div> */}
    </>
  );
}
