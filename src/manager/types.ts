import type React from "react";

export type Name = string | symbol;
export type Listener = (components: Component[]) => void;

export interface Fillable {
	name: Name;
	ref: symbol;
	children: React.ReactNode;
}

export interface Component {
	name: Name;
	fill: Fillable;
	children: React.ReactChild[];
}

export interface IManager {
	mount(): void;
	unmount(): void;
	/**
	 * Triggers once immediately, then each time the components change for a location
	 *
	 * name: String, fn: (components: Component[]) => void
	 */
	onComponentsChange(name: Name, fn: Listener): void;

	/**
	 * Removes previous listener
	 *
	 * name: String, fn: (components: Component[]) => void
	 */
	removeOnComponentsChange(name: Name, fn: Listener): void;
}
