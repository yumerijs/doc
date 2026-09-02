# Session API

## Class Definition

```typescript
export class Session {
    public ip: string;
    public cookie: Record<string, string>;
    public query: Record<string, string> | undefined;
    public sessionid: string;
    public status: number;
    
    /**
     * Send response content
     * @param content Response body
     * @param type Response type, must be 'plain' or 'html'
     */
    public respond(content: any, type: 'plain' | 'html'): void;
    
    public setMime(mimeType: string): void;
}
```

## Methods

### respond(content: any, type: 'plain' | 'html'): void

Sends the response content. This is the **recommended** way to set the response body.

**Note**: The `type` parameter only specifies the basic format (plain text or HTML). It does not replace the `setMime` method for fine-grained control.

```typescript
session.respond('Hello World', 'plain');
```

## Best Practices

**Do not** assign values directly to `session.body`. Always use `session.respond()` to ensure the framework handles the response correctly across different platforms.
