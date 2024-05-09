import type { Emitter } from "mitt";
import type { Fillable } from "./types";

export type SlotzEmitter = Emitter<{
	"fill-mount": {
		fill: Fillable;
	};
	"fill-updated": {
		fill: Fillable;
	};
	"fill-unmount": {
		fill: Fillable;
	};
}>;
