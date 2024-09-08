"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterModesEnum, FilterModesUnion } from "@/lib/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterModelsProps {
  filter: FilterModesUnion;
  setFilter: (filter: FilterModesUnion) => void;
}

export default function FilterModels({ filter, setFilter }: FilterModelsProps) {
  const filters = Object.values(FilterModesEnum);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} className="w-32 rounded-full">
          Filter <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={filter}
          onValueChange={(value) => setFilter(value as FilterModesUnion)}
        >
          {filters.map((filter) => (
            <DropdownMenuRadioItem key={filter} value={filter}>
              {filter}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
