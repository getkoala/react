# @getkoala/react

Koala SDK hooks for React.

## Install

```sh
yarn add @getkoala/react

# install peer dependencies if not already installed
yarn add react react-dom
```

## Recommended Usage

```tsx
import React from "react";
import ReactDOM from "react-dom";
import ko from "@getkoala/react";

// Load the Koala SDK immediately
ko.init("<your Koala public API key>");

function App() {
  const [ready, setReady] = React.useState(false);

  // Pseudocode to exemplify getting the logged-in user
  const user = useCurrentUser();

  React.useEffect(() => {
    if (user) {
      ko.identify(user.email, { name: user.name });
    }
  }, [user]);

  React.useEffect(() => {
    ko.ready(() => setReady(true));
  }, []);

  return <div>{ready ? "Ready" : "Loading"}</div>;
}

ReactDOM.render(
  <App />
  document.getElementById("root")
);
```

## Alternative usage

You can also use KoalaProvider to load the SDK and the useKoala hook if necessary, though you should be able to do everything you need using the recommended usage instead.

```tsx
import React from "react";
import ReactDOM from "react-dom";
import { KoalaProvider, useKoala } from "@getkoala/react";

function App() {
  // You can start using `koala` immediately, but it will asynchronously
  // load in the background. The `ready` flag will indicate when it has
  // it has loaded, if you need to do something after.
  // While loading, `koala` will buffer method calls and execute them
  // after it has finished loaded.
  const { koala, ready } = useKoala();

  // Pseudocode to exemplify getting the logged-in user
  const user = useCurrentUser();

  React.useEffect(() => {
    if (user) {
      koala.identify({ email: user.email, name: user.name });
    }
  }, [koala, user]);

  return <div>{ready ? "Ready" : "Loading"}</div>;
}

ReactDOM.render(
  <KoalaProvider publicApiKey="<your Koala public API key>">
    <App />
  </KoalaProvider>,
  document.getElementById("root")
);
```
