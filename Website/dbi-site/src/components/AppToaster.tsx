"use client";

import { Toaster } from "sonner";
import "sonner/dist/styles.css";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast: "font-sans",
        },
      }}
    />
  );
}
