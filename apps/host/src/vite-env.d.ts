/// <reference types="vite/client" />

declare module "remoteProducts/App" {
    import { ComponentType } from "react";
    import { RemoteAppProps } from "@micro/shared-types";
    const App: ComponentType<RemoteAppProps>;
    export default App;
}

declare module "remoteAccount/App" {
    import { ComponentType } from "react";
    import { RemoteAppProps } from "@micro/shared-types";
    const App: ComponentType<RemoteAppProps>;
    export default App;
}
