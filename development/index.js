import { WindowFrameHost, WindowFrameChild } from "../lib/windowframe-lib";

const env_type = new URLSearchParams(window.location.search).get("type") ?? "";

if (env_type == "child") {
    console.log("Entrato child.");
    const wfc = new WindowFrameChild("http://localhost:8888");
    wfc.addEventListener("response", (event) => { console.log("gestito evento", event) });
    wfc.postEvent("loaded");

} else {
    console.log("Entrato parent.");
    const frame = document.getElementById("frame");
    frame.src = "http://localhost:8888?type=child"
    const wfh = new WindowFrameHost(frame, "http://localhost:8888");
    wfh.addEventListener("loaded", () => { wfh.postEvent("response", typeof 1)});
}