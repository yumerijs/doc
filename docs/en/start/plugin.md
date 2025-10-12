# Plugin System

> Important: Yumeri is under rapid iteration. Always refer to the latest code on GitHub: https://github.com/yumerijs/yumeri

## Overview

As a modular Web application platform, almost everything in Yumeri is done via plugins. The plugin system is the core that enables flexible composition of features.

## What is a plugin

A plugin is typically an npm package prefixed with "yumeri-plugin-", for example "yumeri-plugin-console".

## Built‑in plugins

- yumeri-plugin-console: console utilities, logging and debugging
- yumeri-plugin-echo: echo output for testing and demos

## Configure plugins

Declare plugins in your app "config.yml" and restart Yumeri.

Example:

~~~yaml
plugins:
  yumeri-plugin-console:
    level: info
  my-custom-plugin:
    enabled: true
~~~

## Best practices

- Keep plugins small and focused
- Use clear naming and versioning
- Provide typed options and validation

