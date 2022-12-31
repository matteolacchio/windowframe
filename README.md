# WindowFrame
WindowFrame is a simple iframe-based JS library to provide a basic Pub-Sub messaging model for web components, both in same-origin and cross-origin scenarios.

Iframes are useful both for context isolation (especially between cross-origin web components) and complex multi-framework web apps.

My dear friend [Davide](https://github.com/Davide397408) and I developed this library to avoid cloning the same lines of code all over our projects, and decided to make it open source.

---

## Usage
WindowFrame is freely available on [NPM](https://www.npmjs.com/package/@matteolacchio/windowframe):
```Bash
npm install @matteolacchio/windowframe
```

Once installed in your project, simply import it:
```JavaScript
import { WindowFrameHost, WindowFrameChild } from '@matteolacchio/windowframe';
```
### Example
```JavaScript
//  Parent.js
import { WindowFrameHost } from '@matteolacchio/windowframe';

const wfh = new WindowFrameHost(document.getElementById("my-iframe"), "https://my-child.org");

wfh.addEventListener("loaded", (payload) => { 
    console.log(payload);           //  Expecting: 'Hello from child!';
    wfh.postEvent("response", 'Hello from parent!');
});
```

```JavaScript
//  Child.js
import { WindowFrameChild } from '@matteolacchio/windowframe';

const wfc = new WindowFrameChild("https://my-parent.net");

wfc.addEventListener("response", (payload) => { 
    console.log(payload);           //  Expecting: 'Hello from parent!';
});

wfc.postEvent("loaded", 'Hello from child!');
```

---

## API
Messaging features are exposed by `WindowFrameHost` and `WindowFrameChild` class instances.
Needless to say, `WindowFrameHost` should be used by the parent window, while `WindowFrameChild` by the child one.

### Constructors
`WindowFrameHost(iframe_node, iframe_origin)`:
* `iframe_node`: reference to the iframe node you want to communicate to. To support multiple iframes, please create multiple `WindowFrameHost` instances.
* `iframe_origin`: child iframe origin, which can either be:
    * `<protocol>://<domain><port>` format, e.g. `https://www.example.com:443`
    * `*` if any origin is allowed

`WindowFrameChild(host_origin)`:
* `host_origin`: allowed origin pattern for the host. Wildcards can be used, for instance  `http://localhost:*`

### Methods
Constructors aside, both classes share the same messaging methods:

`postEvent(event, data)`:
* `event`: string representing the event name.
* `data`: any JSON-serializable payload to be sent to the peer.

`addEventListener(event, callback)`:
* `event`: string representing the event name to listen to.
* `callback`: callback function to trigger. If the triggering event has a payload, it will be de-serialized and passed to the callback as its first argument.

`removeEventListener(event, callback)`:
* `event`: string representing the event name to remove the associated callback function from.
* `callback`: callback function to remove.

`destroy()`: no arguments, it will clean up all native event listeners for the current instance.

---

## Changelog
* **v0.0.3**: Fixed a major bug in cross-origin environments, added documentation.
* **v0.0.2 (DO NOT USE)!**: Changed bundled library name to `index.js` for more straightforward imports.
* **v0.0.1 (DO NOT USE)!**: First working version of WindowFrame ✨.