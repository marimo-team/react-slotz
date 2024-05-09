import type React from "react";
import { useContext, useEffect, useRef } from "react";
import { SlotzContext } from "../manager/context";

export interface Props {
	name: string | symbol;
	children: React.ReactNode;
}

export const Fill: React.FC<Props> = (props) => {
	const { bus } = useContext(SlotzContext);
	const ref = useRef(Symbol("fill"));

	useEffect(() => {
		// mount
		bus.emit("fill-mount", {
			fill: {
				name: props.name,
				ref: ref.current,
				children: props.children,
			},
		});

		return () => {
			// unmount
			bus.emit("fill-unmount", {
				fill: {
					name: props.name,
					ref: ref.current,
					children: props.children,
				},
			});
		};
	}, []);

	// updated
	useEffect(() => {
		bus.emit("fill-updated", {
			fill: {
				name: props.name,
				ref: ref.current,
				children: props.children,
			},
		});
	});

	return null;
};
