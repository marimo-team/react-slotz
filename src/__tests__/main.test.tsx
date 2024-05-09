import React from "react";
import { act, create } from "react-test-renderer";
import { expect, it } from "vitest";
import { Fill, Provider, Slot, SlotzController } from "..";

class Toolbar extends React.Component<any, any> {
	static Item = ({ label }: { label: string }) => (
		<Fill name="Toolbar.Item">
			<button type="button">{label}</button>
		</Fill>
	);

	render() {
		return (
			<nav>
				<Slot name="Toolbar.Item" />
			</nav>
		);
	}
}

class Footer extends React.Component<any, any> {
	static Item = ({ href, label }: { href: string; label: string }) => (
		<Fill name="Footer.Item">
			<a href={href}>{label}</a>
		</Fill>
	);

	render() {
		return (
			<footer>
				<Slot name="Footer.Item" />
			</footer>
		);
	}
}

it("Fills the a simple slot", () => {
	const Feature = () => <Toolbar.Item label="Home 1" />;

	let fillComponent;
	act(() => {
		fillComponent = create(
			<Provider>
				<div>
					<Toolbar />
					<Feature />
				</div>
			</Provider>,
		);
	});

	expect(fillComponent).toMatchInlineSnapshot(`
		<div>
		  <nav>
		    <button
		      type="button"
		    >
		      Home 1
		    </button>
		  </nav>
		</div>
	`);
});

it("Fills the appropriate slot", () => {
	class Feature extends React.Component<any, any> {
		render() {
			return (
				<div>
					<Toolbar.Item label="Home 2" />
					<Toolbar.Item label="About" />
					<Footer.Item label="Twitter" href="twitter.com/reactjs" />
				</div>
			);
		}
	}

	let fillComponent;
	act(() => {
		fillComponent = create(
			<Provider>
				<div>
					<Toolbar />
					<Footer />
					<Feature />
				</div>
			</Provider>,
		);
	});

	expect(fillComponent).toMatchInlineSnapshot(`
		<div>
		  <nav>
		    <button
		      type="button"
		    >
		      Home 2
		    </button>
		    <button
		      type="button"
		    >
		      About
		    </button>
		  </nav>
		  <footer>
		    <a
		      href="twitter.com/reactjs"
		    >
		      Twitter
		    </a>
		  </footer>
		  <div />
		</div>
	`);
});

it("allows slots to render null", () => {
	const Extensible = () => {
		return (
			<Slot name="Slot">
				{(items: any) => {
					return null;
				}}
			</Slot>
		);
	};

	const Insertion = () => (
		<Fill name="Slot">
			<span>Hello world!</span>
		</Fill>
	);

	let tree;
	act(() => {
		tree = create(
			<Provider>
				<div>
					<Extensible />
					<Insertion />
				</div>
			</Provider>,
		);
	});

	expect(tree).toMatchInlineSnapshot("<div />");
});

it("Replaces the contents of the slot with the matching fill when the slot's `name` property changes", () => {
	class DynamicToolbar extends React.Component<any, any> {
		// This example is contrived, but it covers Slot's componentWillReceiveProps
		static Active = ({ label }: { label: string }) => (
			<Fill name="DynamicToolbar.Active">
				<button type="button" aria-selected>
					{label}
				</button>
			</Fill>
		);

		static Inactive = ({ label }: { label: string }) => (
			<Fill name="DynamicToolbar.Inactive">
				<span>{label}</span>
			</Fill>
		);

		render() {
			return (
				<nav>
					<Slot name={this.props.name} />
				</nav>
			);
		}
	}

	class Feature extends React.Component<any, any> {
		render() {
			return (
				<>
					<DynamicToolbar.Active label="Home 1" />
					<DynamicToolbar.Inactive label="Home 1" />
				</>
			);
		}
	}

	let fillComponent: any;
	act(() => {
		fillComponent = create(
			<Provider>
				<div>
					<DynamicToolbar name="DynamicToolbar.Active" />
					<Feature />
				</div>
			</Provider>,
		);
	});

	expect(fillComponent).toMatchInlineSnapshot(`
		<div>
		  <nav>
		    <button
		      aria-selected={true}
		      type="button"
		    >
		      Home 1
		    </button>
		  </nav>
		</div>
	`);

	act(() => {
		fillComponent.update(
			<Provider>
				<div>
					<DynamicToolbar name="DynamicToolbar.Inactive" />
					<Feature />
				</div>
			</Provider>,
		);
	});

	expect(fillComponent).toMatchInlineSnapshot(`
    <div>
      <nav>
        <span>
          Home 1
        </span>
      </nav>
    </div>
  `);
});

it("can update a slot's children manually", () => {
	const controller = new SlotzController();
	const ref = Symbol("Toolbar.Item");

	let fillComponent: any;
	act(() => {
		fillComponent = create(
			<Provider controller={controller}>
				<div>
					<Toolbar />
				</div>
			</Provider>,
		);
	});

	act(() => {
		controller.mount({
			name: "Toolbar.Item",
			ref: ref,
			children: <button type="button">Home 1</button>,
		});
	});

	expect(fillComponent).toMatchInlineSnapshot(`
		<div>
		  <nav>
		    <button
		      type="button"
		    >
		      Home 1
		    </button>
		  </nav>
		</div>
	`);

	act(() => {
		controller.update({
			name: "Toolbar.Item",
			ref: ref,
			children: <button type="button">Home 2</button>,
		});
	});

	expect(fillComponent).toMatchInlineSnapshot(`
		<div>
		  <nav>
		    <button
		      type="button"
		    >
		      Home 2
		    </button>
		  </nav>
		</div>
	`);

	act(() => {
		controller.unmount({
			name: "Toolbar.Item",
			ref: ref,
		});
	});

	expect(fillComponent).toMatchInlineSnapshot(`
		<div>
		  <nav />
		</div>
	`);
});
