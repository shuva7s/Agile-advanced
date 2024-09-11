import CreateOrJoinButton from "@/components/action-components/CreateOrJoinButton";
import ProjectsContainer from "@/components/shared/ProjectsContainer";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default async function rootPage() {
  return (
    <main>
      <SignedIn>
        <div className="min-h-screen">
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <CreateOrJoinButton actionType="create" />
            <CreateOrJoinButton actionType="join" />
          </div>
          <section>
            <div className="flex flex-row justify-between items-center gap-6 py-3 my-3">
              <h2 className="font-semibold text-2xl">Hosted by You</h2>
            </div>
            <ProjectsContainer type={"hosted"} />
          </section>
          <section>
            <div className="flex flex-row justify-between items-center gap-6 py-3 my-3">
              <h2 className="font-semibold text-2xl">Working on</h2>
            </div>
            <ProjectsContainer type={"working"} />
          </section>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex flex-col gap-4 justify-center items-center">
          <p className="font-semibold text-4xl">Agile</p>
          <p className="text-xl text-muted-foreground">
            Manage Your Projects With Ease
          </p>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
    </main>
  );
}
