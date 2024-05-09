import mitt from "mitt";
import type React from "react";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Manager } from "../manager/Manager";
import { type ISlotzContext, SlotzContext } from "../manager/context";
import type { SlotzEmitter } from "../manager/events";

function createState(): ISlotzContext {
	const bus: SlotzEmitter = mitt();
	return {
		bus,
		manager: new Manager(bus),
	};
}

export const Provider: React.FC<PropsWithChildren> = ({ children }) => {
	const [state] = useState(createState);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		state.manager.mount();
		setMounted(true);
		return () => {
			state.manager.unmount();
		};
	}, [state.manager]);

	if (!mounted) {
		return null;
	}

	return (
		<SlotzContext.Provider value={state}>{children}</SlotzContext.Provider>
	);
};
