# Slotz

Teleport React components to anywhere in the react-tree.

> Modernized from [react-slot-fill](https://github.com/camwest/react-slot-fill)

## Installation

```bash
npm install @marimo-team/react-slotz
# or
pnpm install @marimo-team/react-slotz
```

## Example

```tsx
// slotz.js
const Toolbar = () => {
  return (
    <nav>
      <Slot name="Toolbar.Item" />
    </nav>
  );
};
Toolbar.Item = ({ label }: { label: string }) => (
  <Fill name="Toolbar.Item">
    <button>{label}</button>
  </Fill>
);

const Footer = () => {
  return (
    <footer>
      <Slot name="Footer.Item" />
    </footer>
  );
};
Footer.Item = ({ href, label }: { href: string; label: string }) => (
  <Fill name="Footer.Item">
    <a href={href}>{label}</a>
  </Fill>
);

// my-page.js
const Feature = () => {
  return (
    <div>
      <Toolbar.Item label="Home 2" />
      <Toolbar.Item label="About" />
      <Footer.Item label="Twitter" href="twitter.com/reactjs" />
    </div>
  );
};

const MyPage = () => {
  return (
    <Provider>
      <div className="main">
        <Toolbar />
        <Footer />
        <Feature />
      </div>
    </Provider>
  );
};

// HTML
<div className="main">
  <nav>
    <button>Home 2</button>
    <button>About</button>
  </nav>
  <footer>
    <a href="twitter.com/reactjs">Twitter</a>
  </footer>
  <div />
</div>;
```
