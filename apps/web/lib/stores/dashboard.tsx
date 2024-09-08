import {create} from "zustand";

type DashboardState = {
    hasTrainerStaked: boolean;
    setHasTrainerStaked: (hasTrainerStaked: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    hasTrainerStaked: false,
    setHasTrainerStaked: (hasTrainerStaked: boolean) => set({hasTrainerStaked}),
}));