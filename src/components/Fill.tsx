import type React from "react";
import { useContext, useEffect, useRef } from "react";
import { SlotzContext } from "../manager/context";

export interface Props {
	name: string | symbol;
	children: React.ReactNode;
}

export const Fill: React.FC<Props> = (props) => {
	const { controller } = useContext(SlotzContext);
	const ref = useRef(Symbol("fill"));

	useEffect(() => {
		controller.mount({
			name: props.name,
			ref: ref.current,
			children: props.children,
		});
		return () => {
			controller.unmount({
				name: props.name,
				ref: ref.current,
			});
		};
	}, []);

	// updated
	useEffect(() => {
		controller.update({
			name: props.name,
			ref: ref.current,
			children: props.children,
		});
	});

	return null;
};
