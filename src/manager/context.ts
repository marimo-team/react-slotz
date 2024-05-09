import { createContext } from "react";
import type { SlotzController } from "./events";
import type { IManager } from "./types";

export interface ISlotzContext {
	manager: IManager;
	controller: SlotzController;
}

export const SlotzContext = createContext<ISlotzContext>(null!);
