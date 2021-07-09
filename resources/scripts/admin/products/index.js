const { render } = wp.element;
// const { registerStore } = wp.data;

// import store from "./store";
// registerStore("presto-player/settings", store);

/**
 * App
 */
import App from "./app";

/**
 * Render
 */
render(<App />, document.getElementById("app"));
