import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <SignInButton mode="modal"/>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>

    </div>
  );
}
