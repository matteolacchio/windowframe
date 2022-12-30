class EventDispatcher {
    #callback = null;
    #event_listeners = new Array();
    #filterIncomingEvent = null;
    #peer_origin = null;
    #target = null;

    constructor(option) {
        this.#peer_origin = option.peer_origin;
        this.#target = option.target;
        this.#filterIncomingEvent = option.filterIncomingEvent;
        this.#callback = (event) => { this.#handleIncomingMessage.apply(this, [event]) };
        window.addEventListener("message", this.#callback);
    }
    #handleIncomingMessage(event) {
        if (!this.#filterIncomingEvent(event)) {
            return;
        }

        if (typeof event.data != "string" && !(event.data instanceof String)) {
            return;
        }

        event = JSON.parse(event.data || {});

        if (!event.isWindowFrame) {
            return;
        }

        const length = this.#event_listeners.length;
        for (let i = length - 1; i >= 0; i--) {
            const event_listener = this.#event_listeners[i];
            if (event_listener.event == event.event) {
                try {
                    if (typeof event_listener.callback != "function" && !(event_listener.callback instanceof Function)) {
                        throw "Wrong type for callback parameter";
                    }

                    event_listener.callback(event.data);
                } catch (error) {
                    console.error(
                        "Error in listener for " + event.event + " event: " + error
                    );
                }
            }
        }
    }

    /* Funzione centralizzata per invio messaggi al core --> utilizzo: this.$emitToCore('nome_evento', { campo_a: 10, campo_b: true, ...}) */
    postEvent(event, data) {
        const serialized_message = JSON.stringify({
            event: event.toString(),
            data: data,
            isWindowFrame: true,
        });
        this.#target.postMessage(serialized_message, this.#peer_origin);
    };

    /* Funzione centralizzata per aggiungere/rimuovere listener messaggi 
     * core --> utilizzo: this.$addCoreEventListener('nome_evento', callback),
     * this.$removeCoreEventListener('nome_evento', callback) */
    addEventListener(event, callback) {
        if (!event || !callback) {
            return;
        }
        this.#event_listeners.push({ event: event, callback: callback });
    };

    removeEventListener(event, callback) {
        const length = this.#event_listeners.length;
        for (let i = length - 1; i >= 0; i--) {
            const event_listener = this.#event_listeners[i];
            if (
                event_listener.event == event &&
                event_listener.callback == callback
            ) {
                this.#event_listeners.splice(i, 1);
            }
        }
    };

    destroy() {
        window.removeEventListener("message", this.#callback);
    }
}

export class WindowFrameHost extends EventDispatcher {
    constructor(iframenode, arg_origin = "*") {
        super({
            peer_origin: arg_origin,
            target: iframenode.contentWindow,
            filterIncomingEvent: (event) => { return event.source.frameElement == iframenode }
        });

    }
}

export class WindowFrameChild extends EventDispatcher {
    #allowed_host_origin = null;

    constructor(arg_origin) {
        const host_origin = new URL(document.referrer).origin;
        super({
            peer_origin: arg_origin,
            target: window.parent,
            filterIncomingEvent: (event)=>{return event.origin == host_origin}
        });
        this.#allowed_host_origin = arg_origin;

        if (!this.#matchOrigin(host_origin)) {
            throw "Host origin is not allowed: " + host_origin;
        }
    }

    /* Determino il dominio in cui risiede il core. Questo passaggio è importante per abilitare la comunicazione tra iframe in maniera sicura */
    #matchOrigin(origin) {
        const escapeRegex = (origin) =>
            origin.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
        return new RegExp(
            "^" + (this.#allowed_host_origin || "").split("*").map(escapeRegex).join(".*") + "$"
        ).test(origin);
    }
}