# Introduction to Yumeri

> Important: Yumeri is evolving rapidly and APIs may change. Always refer to the latest code on GitHub: https://github.com/yumerijs/yumeri

## What is Yumeri

Yumeri is a next‑generation modular Web application platform built on Node.js. Through a well‑designed plugin system, Yumeri offers high extensibility and flexibility, enabling developers to quickly build modular Web apps.

## Name Origin

“Yumeri” comes from the Japanese ゆめり, meaning Yumeli, the OC FireGuo set for his bot. In the Flweb Team lineup, Yumeri stands for open source and sharing, so all projects named Yumeri (including Yumerijs, Yumeri Chat, Yumeri Bot) carry the team’s open and open‑source spirit.

## Design Philosophy

Yumeri focuses on modularity and extensibility. With the plugin system, features are highly decoupled. Developers can freely compose modules by need, which helps collaboration and maintenance.

### Key Features

1. Modular architecture: clear separation between core and extensions via plugins.
2. Plugin‑driven: most operations are implemented as plugins, providing powerful extensibility.
3. Command system: unlike real‑time bot commands, page responses are returned after command execution completes unless using websocket connections.
4. TypeScript support: written in TypeScript for type‑safety and better DX.

## Framework Structure

Main parts:

1. Core module (core): base features and APIs, the heart of the framework.
2. Loader: loads and manages plugins, bridging core and plugins.
3. Plugin system: plugins are npm packages with prefix . Built‑in basics include:
   - yumeri-plugin-console: console plugin
   - yumeri-plugin-echo: (testing) echo output plugin
   - yumeri-plugin-server: server plugin

## Use Cases

Great for building modular, extensible Web apps, from simple sites to complex applications.

## License

Open source under MIT. Free to use and redistribute for commercial use with original authorship indicated. Community contributions are encouraged.

