import { create } from 'zustand'

type State = {
  // variant: number
  mainColor: string
  // setVariant: (n: number) => void
  setMainColor: (s: string) => void
}

const useStore = create<State>(set => ({
  // GETTERS
  // variant: 0,
  mainColor: '#051266',

  // SETTERS
  // setVariant: (variant) => {
  //   set({ variant })
  // },
  setMainColor: (mainColor) => {
    set({ mainColor });
  }
}))

export default useStore;