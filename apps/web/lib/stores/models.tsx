import {create} from 'zustand';

type ModelStoreState = {
    filter: "all" | "training" | "completed";
}