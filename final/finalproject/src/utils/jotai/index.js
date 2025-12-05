import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const loginIdState = atomWithStorage("loginIdState", "", sessionStroage);
export const loginLevelState = atomWithStorage("loginLevelState", "", sessionStroage);
export const accessTokenState = atomWithStorage("accessTokenState", "", sessionStroage);
export const refreshTokenState= atomWithStorage("refreshTokenState", "", sessionStroage);