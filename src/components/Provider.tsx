import React from "react";
import type { PropsWithChildren } from "react";
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
	const [state] = React.useState(() => {
		const res = createState(controller);
		res.manager.mount();
		return res;
	});
	// Unmount the manager when the component is unmounted
	React.useEffect(() => {
		return () => {
			state.manager.unmount();
		};
	}, []);

	return (
		<SlotzContext.Provider value={state}>{children}</SlotzContext.Provider>
	);
};
