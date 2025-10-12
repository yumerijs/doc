# Routing System

Routing is a fundamental part of any web framework. In Yumeri, unless using a websocket connection, page responses are returned after the command finishes execution.

## Register a route

~~~ts
ctx.route("/hello").action(async (session, params) => {
  session.body = "Hello, Yumeri!";
});
~~~

## Route patterns

- "/users/:id" matches "/users/1"
- "/users/:id+" matches multiple segments like "/users/1/2"
- "/users/:id*" matches zero or more segments
- "/users/:id?" makes the parameter optional

Use these patterns to capture variables in the path.

## Match order

Routes are evaluated in the order they are registered. Earlier ones match first.

~~~ts
ctx.route("/users/:id").action(handler1);
ctx.route("/users/:id").action(handler2);
// handler1 will run
~~~

Be careful with optional parameters that may swallow other routes.

