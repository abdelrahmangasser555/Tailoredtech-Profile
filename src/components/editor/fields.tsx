"use client"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode
  htmlFor?: string
  hint?: string
}) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <Label
        htmlFor={htmlFor}
        className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/45"
      >
        {children}
      </Label>
      {hint ? (
        <span className="font-mono text-[9px] tracking-wide text-white/25">
          {hint}
        </span>
      ) : null}
    </div>
  )
}

export function CompactInput({
  label,
  hint,
  prefix,
  className,
  ...props
}: React.ComponentProps<"input"> & {
  label: string
  hint?: string
  prefix?: string
}) {
  const id = props.id ?? props.name
  return (
    <div className={cn("min-w-0", className)}>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <InputGroup className="h-9 rounded-none border-white/15 bg-white/[0.03] has-[[data-slot=input-group-control]:focus-visible]:border-accent has-[[data-slot=input-group-control]:focus-visible]:ring-accent/25">
        {prefix ? (
          <InputGroupAddon>
            <InputGroupText className="font-mono text-[10px] text-white/35">
              {prefix}
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
        <InputGroupInput
          id={id}
          className="text-sm text-white placeholder:text-white/25"
          {...props}
        />
      </InputGroup>
    </div>
  )
}

export function CompactTextarea({
  label,
  hint,
  className,
  rows = 3,
  ...props
}: React.ComponentProps<"textarea"> & {
  label: string
  hint?: string
}) {
  const id = props.id ?? props.name
  return (
    <div className={cn("min-w-0", className)}>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <InputGroup className="h-auto rounded-none border-white/15 bg-white/[0.03] has-[[data-slot=input-group-control]:focus-visible]:border-accent has-[[data-slot=input-group-control]:focus-visible]:ring-accent/25">
        <InputGroupTextarea
          id={id}
          rows={rows}
          className="min-h-[4.5rem] text-sm text-white placeholder:text-white/25"
          {...props}
        />
      </InputGroup>
    </div>
  )
}

export function CompactSelect({
  label,
  hint,
  options,
  value,
  onValueChange,
  className,
  placeholder = "Select…",
}: {
  label: string
  hint?: string
  options: readonly { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  className?: string
  placeholder?: string
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          size="sm"
          className="h-9 w-full rounded-none border-white/15 bg-white/[0.03] text-white focus-visible:border-[#D4FF00] focus-visible:ring-[#D4FF00]/25"
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          position="popper"
          className="rounded-none border-white/15 bg-[#0A0A0A] text-[#f5f5f0]"
        >
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-none focus:bg-white/10 focus:text-white"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export function CompactCheck({
  label,
  checked,
  onCheckedChange,
  className,
}: {
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  className?: string
}) {
  return (
    <label
      className={cn(
        "inline-flex h-9 cursor-pointer items-center gap-2 border border-white/15 bg-white/[0.03] px-2.5 text-xs text-white/70 transition hover:border-white/25",
        className
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="border-white/30 data-checked:border-accent data-checked:bg-accent data-checked:text-accent-foreground"
      />
      <span className="font-mono text-[10px] tracking-[0.12em] uppercase">
        {label}
      </span>
    </label>
  )
}

export function FieldGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>{children}</div>
  )
}
