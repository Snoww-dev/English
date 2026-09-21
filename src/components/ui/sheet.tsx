"use client"

import type { ComponentProps } from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { cn } from "cn"
import { XIcon } from "lucide-react"

function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetPortal(props: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetBackdrop({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  ...props
}: SheetPrimitive.Popup.Props) {
  return (
    <SheetPortal>
      <SheetBackdrop />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-border bg-background shadow-2xl outline-none transition-transform duration-300 ease-out data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full sm:w-[85vw] sm:max-w-2xl lg:w-1/2",
          className
        )}
        {...props}
      >
        {children}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex shrink-0 items-start justify-between gap-3 border-b border-border p-4 sm:p-5", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-lg font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function SheetClose({ className, ...props }: SheetPrimitive.Close.Props) {
  return (
    <SheetPrimitive.Close
      data-slot="sheet-close"
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
      {...props}
    >
      <XIcon className="size-4" />
    </SheetPrimitive.Close>
  )
}

function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-body"
      className={cn("min-h-0 flex-1 overflow-y-auto p-4 sm:p-5", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetPortal,
  SheetBackdrop,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetBody,
}
