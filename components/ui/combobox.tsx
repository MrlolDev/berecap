"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  list,
  listName,
  updateValue,
  baseValue,
  inputChange,
  full = false,
}: {
  list: { label: string; value: string; icon?: React.ReactNode }[];
  listName: string;
  updateValue?: (value: string) => void;
  baseValue?: string;
  inputChange?: (value: string) => void;
  full?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  let value = baseValue || "";
  let setValue = updateValue || (() => {});
  let [v, setV] = React.useState(baseValue || "");

  if (!updateValue) {
    console.log("Combobox: baseValue or updateValue not provided");
    value = v;
    setValue = setV;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit justify-between"
        >
          {value ? (
            <span className="flex flex-row items-center">
              <span className="mr-2">
                {list.find((l) => l.value.toLowerCase() === value)?.icon &&
                  list.find((l) => l.value.toLowerCase() === value)?.icon}
              </span>
              {list.find((l) => l.value.toLowerCase() === value)?.label}
            </span>
          ) : (
            `Select ${listName}...`
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-full p-0 ${full ? "min-w-[40vw]" : ""}`}>
        <Command>
          <CommandInput
            placeholder={`Search ${listName}...`}
            onInput={async (e) => {
              inputChange && inputChange(e.currentTarget.value);
            }}
            onFocus={() => setOpen(true)}
          />
          <CommandEmpty>No {listName} found.</CommandEmpty>
          <CommandGroup>
            {list.map((l) => (
              <CommandItem
                key={l.value}
                value={l.value}
                onSelect={async (currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className="flex flex-row items-center gap-2 cursor-pointer w-full"
              >
                {value === l.value ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <span className=" mr-2">{l.icon && l.icon}</span>
                )}

                {l.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
