import GoBack from "../action-components/GoBack";
import { Button } from "../ui/button";

const AccessDenied = () => {
  return (
    <main className="min-h-[92vh] flc-center gap-2">
      <h1 className="text-4xl font-semibold">Access Denied !</h1>
      <p className="text-muted-foreground">
        You dont have access to this page.
      </p>
      <div className="flex flex-row flex-wrap gap-2">
        <Button>Send join request</Button>
        <GoBack />
      </div>
    </main>
  );
};

export default AccessDenied;
