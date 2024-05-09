import React, { useState } from "react";
import { type PropsWithChildren, useEffect } from "react";
import { Manager } from "../manager/Manager";
import { type ISlotzContext, SlotzContext } from "../manager/context";
import { SlotzController } from "../manager/events";

function createState(controller?: SlotzController): ISlotzContext {
	const con = controller || new SlotzController();
	return {
		controller: con,
		manager: new Manager(con.bus),
	};
}

interface ProviderProps {
	/**
	 * Optionally pass a custom controller
	 * Useful for using outside of React
	 */
	controller?: SlotzController;
}

export const Provider: React.FC<PropsWithChildren<ProviderProps>> = ({
	controller,
	children,
}) => {
	const [state] = useState(() => createState(controller));
	const [mounted, setMounted] = React.useState(false);

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
