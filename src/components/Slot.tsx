import React, { useContext, useEffect, useState } from "react";
import { SlotzContext } from "../manager/context";
import type { Component } from "../manager/types";

export interface Props {
	/**
	 * The name of the component. Use a symbol if you want to be 100% sure the Slot
	 * will only be filled by a component you create
	 */
	name: string | symbol;

	/**
	 * Props to be applied to the child Element of every fill which has the same name.
	 *
	 *  If the value is a function, it must have the following signature:
	 *    (target: Fill, fills: Fill[]) => void;
	 *
	 *  This allows you to access props on the fill which invoked the function
	 *  by using target.props.something()
	 */
	childProps?: { [key: string]: any };

	children?: React.ReactNode | ((items: React.ReactNode[]) => React.ReactNode);
}

export interface State {
	components: Component[];
}

export function useSlot(
	name: string | symbol,
	childProps?: { [key: string]: any },
): React.ReactNode[] {
	const [components, setComponents] = useState<Component[]>([]);
	const { manager } = useContext(SlotzContext);

	useEffect(() => {
		manager.onComponentsChange(name, setComponents);
		return () => {
			manager.removeOnComponentsChange(name, setComponents);
		};
	}, [name]);

	return components.flatMap((component, index) => {
		const { children } = component;

		return children.map((child, index2) => {
			if (typeof child === "number" || typeof child === "string") {
				throw new Error("Only element children will work here");
			}
			return React.cloneElement(child, {
				key: index.toString() + index2.toString(),
				...childProps,
			});
		});
	});
}

export const Slot: React.FC<Props> = (props) => {
	const elements = useSlot(props.name, props.childProps);

	if (typeof props.children === "function") {
		const element = props.children(elements);

		if (React.isValidElement(element) || element === null) {
			return element;
		}
		throw new Error(
			"Slot rendered with function must return a valid React Element.",
		);
	}

	return elements;
};
