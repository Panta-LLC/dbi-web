"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { Presentation } from "./types";

type FormModalShellProps = {
  presentation: Presentation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
};

const overlayClass = "fixed inset-0 z-[100] bg-black/50";

function dialogContentClass(presentation: Presentation): string {
  const base =
    "fixed z-[101] max-h-[min(90vh,680px)] overflow-y-auto rounded-xl bg-white p-6 shadow-lg outline-none focus:outline-none";

  if (presentation.mode === "dialog") {
    return `${base} left-1/2 top-1/2 w-[min(100vw-2rem,32rem)] -translate-x-1/2 -translate-y-1/2`;
  }

  if (presentation.mode === "slide") {
    const transition = "transition-transform duration-300 ease-out";
    if (presentation.edge === "bottom") {
      return `${base} bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl rounded-b-none ${transition} data-[state=closed]:translate-y-full data-[state=open]:translate-y-0`;
    }
    if (presentation.edge === "top") {
      return `${base} top-0 left-0 right-0 max-h-[90vh] rounded-b-2xl rounded-t-none ${transition} data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0`;
    }
    if (presentation.edge === "left") {
      return `${base} bottom-0 left-0 top-0 w-[min(100vw-1rem,28rem)] max-w-[100vw] rounded-l-none rounded-r-xl ${transition} data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0`;
    }
    return `${base} bottom-0 right-0 top-0 w-[min(100vw-1rem,28rem)] max-w-[100vw] rounded-r-none rounded-l-xl ${transition} data-[state=closed]:translate-x-full data-[state=open]:translate-x-0`;
  }

  return base;
}

export function FormModalShell({
  presentation,
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
}: FormModalShellProps) {
  const heading = title ?? "Contact";
  const lead = description;

  if (presentation.mode === "popover") {
    return (
      <Popover.Root open={open} onOpenChange={onOpenChange}>
        <Popover.Trigger asChild>{trigger}</Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            side={presentation.side ?? "bottom"}
            align={presentation.align ?? "center"}
            sideOffset={8}
            className="z-[101] w-[min(calc(100vw-2rem),24rem)] max-h-[min(90vh,560px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg outline-none"
          >
            <div className="mb-4 pr-8">
              <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
              {lead ? <p className="mt-1 text-sm text-slate-600">{lead}</p> : null}
            </div>
            {children}
            <Popover.Close
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClass} />
        <Dialog.Content className={dialogContentClass(presentation)}>
          <div className="mb-4 pr-8">
            <Dialog.Title className="text-xl font-semibold text-slate-900">{heading}</Dialog.Title>
            {lead ? (
              <Dialog.Description className="mt-1 text-sm text-slate-600">{lead}</Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">
                Fill out the fields and submit to send your message.
              </Dialog.Description>
            )}
          </div>
          {children}
          <Dialog.Close
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
