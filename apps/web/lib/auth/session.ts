import { useWalletStore } from "@/lib/stores/wallet";

const { wallet } = useWalletStore();
export const isUserAuthenticated: boolean = wallet ? true : false;
