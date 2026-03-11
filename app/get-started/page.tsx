import { SignUp } from "@clerk/nextjs";

export default function GetStarted() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#111111] px-6">
      <SignUp />
    </div>
  );
}
