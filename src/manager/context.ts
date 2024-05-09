import { createContext } from "react";
import type { SlotzEmitter } from "./events";
import type { IManager } from "./types";

export interface ISlotzContext {
	manager: IManager;
	bus: SlotzEmitter;
}

export const SlotzContext = createContext<ISlotzContext>(null!);
