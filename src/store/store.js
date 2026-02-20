import { create } from "zustand";
import { createAppSlice } from "./slices/appSlice";
import { createUserSlice } from "./slices/userSlice";
import { createDataSlice } from "./slices/dataSlice";

/**
 * Main Store
 * Uses the slice pattern to modularize state and actions.
 */
export const store = create((...a) => ({
  ...createAppSlice(...a),
  ...createUserSlice(...a),
  ...createDataSlice(...a),
}));