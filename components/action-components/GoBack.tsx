"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const GoBack = () => {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      onClick={() => {
        router.back();
      }}
    >
      Go back
    </Button>
  );
};

export default GoBack;
