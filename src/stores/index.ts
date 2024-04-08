import { atom } from "recoil";
import { StateSnapshot } from "react-virtuoso";

export const keyStore = atom<number>({
  key: "key",
  default: 0,
});

export const snapshotStore = atom<StateSnapshot | undefined>({
  key: "snapshot",
  default: undefined,
});
