import { create } from "zustand";

type Conquista = {
  tipo: string;
  tema?: string;
};

type ConquistaStore = {
  conquista: Conquista | null;
  mostrarConquista: (tipo: string, tema?: string) => void;
  limparConquista: () => void;
};

export const useConquistaStore = create<ConquistaStore>((set) => ({
  conquista: null,
  mostrarConquista: (tipo, tema) => {
    set({ conquista: { tipo, tema } });
    setTimeout(() => set({ conquista: null }), 5000);
  },
  limparConquista: () => set({ conquista: null }),
}));
