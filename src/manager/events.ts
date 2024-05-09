import type { Emitter } from "mitt";
import mitt from "mitt";
import type { Fillable } from "./types";

export type SlotzEmitter = Emitter<{
	"fill-mount": {
		fill: Fillable;
	};
	"fill-updated": {
		fill: Fillable;
	};
	"fill-unmount": {
		fill: Pick<Fillable, "ref" | "name">;
	};
}>;

/**
 * Controller for managing Fill components
 */
export class SlotzController {
	public bus: SlotzEmitter = mitt();

	mount(fill: Fillable) {
		this.bus.emit("fill-mount", { fill });
	}
	unmount(fill: Pick<Fillable, "ref" | "name">) {
		this.bus.emit("fill-unmount", { fill });
	}
	update(fill: Fillable) {
		this.bus.emit("fill-updated", { fill });
	}
}
