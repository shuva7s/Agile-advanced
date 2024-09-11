import GoBack from "../action-components/GoBack";

const InvalidIds = () => {
  return (
    <main className="min-h-[92vh] flc-center gap-2">
      <h1>ERROR: Invalid IDs</h1>
      <p className="text-muted-foreground">
        Error fetching your profile credentials
      </p>
      <GoBack />
    </main>
  );
};

export default InvalidIds;
