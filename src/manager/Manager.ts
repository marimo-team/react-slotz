import { Children } from "react";
import type { SlotzEmitter } from "./events";
import type { Component, Fillable, IManager, Listener, Name } from "./types";

const Logger = console;

export interface FillRegistration {
	listeners: Listener[];
	components: Component[];
}

export interface Db {
	byName: Map<Name, FillRegistration>;
	byFill: Map<symbol, Component>;
}

export class Manager implements IManager {
	private _bus: SlotzEmitter;
	private _db: Db;

	constructor(bus: SlotzEmitter) {
		this._bus = bus;

		this.handleFillMount = this.handleFillMount.bind(this);
		this.handleFillUpdated = this.handleFillUpdated.bind(this);
		this.handleFillUnmount = this.handleFillUnmount.bind(this);

		this._db = {
			byName: new Map(),
			byFill: new Map(),
		};
	}

	public mount() {
		this._bus.on("fill-mount", this.handleFillMount);
		this._bus.on("fill-updated", this.handleFillUpdated);
		this._bus.on("fill-unmount", this.handleFillUnmount);
	}

	public unmount() {
		this._bus.off("fill-mount", this.handleFillMount);
		this._bus.off("fill-updated", this.handleFillUpdated);
		this._bus.off("fill-unmount", this.handleFillUnmount);
	}

	private handleFillMount({ fill }: { fill: Fillable }) {
		const children = Children.toArray(fill.children) as (
			| React.ReactElement<any>
			| number
			| string
		)[];
		const name = fill.name;
		const component: Component = { fill, children, name };

		// If the name is already registered
		const reg = this._db.byName.get(name);

		if (reg) {
			reg.components.push(component);

			// notify listeners
			reg.listeners.forEach((fn) => fn([...reg.components]));
		} else {
			this._db.byName.set(name, {
				listeners: [],
				components: [component],
			});
		}

		this._db.byFill.set(fill.ref, component);
	}

	private handleFillUpdated({ fill }: { fill: Fillable }) {
		// Find the component
		const component = this._db.byFill.get(fill.ref);

		// Get the new elements
		const newElements = Children.toArray(fill.children);

		if (component) {
			// replace previous element with the new one
			component.children = newElements as (
				| React.ReactElement<any>
				| number
				| string
			)[];

			// notify listeners
			const reg = this._db.byName.get(component.name);

			if (reg) {
				reg.listeners.forEach((fn) => fn([...reg.components]));
			} else {
				throw new Error("registration was expected to be defined");
			}
		} else {
			Logger.error("[handleFillUpdated] component was expected to be defined");
			return;
		}
	}

	private handleFillUnmount({
		fill,
	}: { fill: Pick<Fillable, "ref" | "name"> }) {
		const oldComponent = this._db.byFill.get(fill.ref);

		if (!oldComponent) {
			Logger.error("[handleFillUnmount] component was expected to be defined");
			return;
		}

		const name = oldComponent.name;
		const reg = this._db.byName.get(name);

		if (!reg) {
			throw new Error("registration was expected to be defined");
		}

		const components = reg.components;

		// remove previous component
		reg.components = components.filter((c) => c !== oldComponent);

		// Clean up byFill reference
		this._db.byFill.delete(fill.ref);

		if (reg.listeners.length === 0 && reg.components.length === 0) {
			this._db.byName.delete(name);
		} else {
			// notify listeners
			reg.listeners.forEach((fn) => fn([...reg.components]));
		}
	}

	/**
	 * Triggers once immediately, then each time the components change for a location
	 *
	 * name: String, fn: (components: Component[]) => void
	 */
	public onComponentsChange(name: Name, fn: Listener) {
		const reg = this._db.byName.get(name);

		if (reg) {
			reg.listeners.push(fn);
			fn(reg.components);
		} else {
			this._db.byName.set(name, {
				listeners: [fn],
				components: [],
			});
			fn([]);
		}
	}

	public getFillsByName(name: string): Fillable[] {
		const registration = this._db.byName.get(name);

		if (!registration) {
			return [];
		}
		return registration.components.map((c) => c.fill);
	}

	public getChildrenByName(
		name: string,
	): (React.ReactElement<any> | number | string)[] {
		const registration = this._db.byName.get(name);

		if (!registration) {
			return [];
		}
		return registration.components
			.map((component) => component.children)
			.reduce((acc, memo) => acc.concat(memo), []);
	}

	/**
	 * Removes previous listener
	 *
	 * name: String, fn: (components: Component[]) => void
	 */
	public removeOnComponentsChange(name: Name, fn: Listener) {
		const reg = this._db.byName.get(name);

		if (!reg) {
			throw new Error("expected registration to be defined");
		}

		const listeners = reg.listeners;
		listeners.splice(listeners.indexOf(fn), 1);
	}
}
