# Use as a Dependency

Yumeri can be used as an embedded framework inside your Node.js app.

## Install

~~~bash
npm install yumeri
# or
yarn add yumeri
~~~

## Minimal usage

~~~ts
import { Core, Loader, Context } from "yumeri";
import * as server from "yumeri-plugin-server";

const loader = new Loader(); // loader has no special role here
const serverConfig = { port: 8080, host: "0.0.0.0" };
const core = new Core(loader, serverConfig);
const ctx = new Context(core, "MyAPP");

core.runCore();
~~~

Expected log:

~~~text
YYYY/MM/DD HH:mm:ss [I] server Yumeri Server listening on 0.0.0.0:8080
~~~

## Register routes

Without plugins, use your Context to register routes just like in a plugin:

~~~ts
ctx.route("/hello").action(async (session, _) => {
  session.body = "Hello, Yumeri!";
});
~~~

Open "/hello" to see the response.

## Multiple servers

You can run multiple Core instances to serve multiple apps:

~~~ts
const loader = new Loader();
// First core
const core1 = new Core(loader, { port: 8080, host: "0.0.0.0" });
const ctx1 = new Context(core1, "MyAPP1");
core1.runCore();
ctx1.route("/hello").action(async (session, _) => {
  session.body = "Hello, Yumeri!";
});

// Second core
const core2 = new Core(loader, { port: 8081, host: "0.0.0.0" });
const ctx2 = new Context(core2, "MyAPP2");
core2.runCore();
ctx2.route("/hello").action(async (session, _) => {
  session.body = "Hello, Yumeri2!";
});
~~~

