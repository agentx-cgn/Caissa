
export {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TArgs = any;

declare global {

    interface Window {
        t0: number;
        OffscreenCanvas: any;
        App: any
    }

    interface OffscreenCanvas {}

    interface console {
        log: (...args: TArgs[]) => void;
        info: (...args: TArgs[]) => void;
        warn: (...args: TArgs[]) => void;
        error: (...args: TArgs[]) => void;
    }

    interface Document {
        mozFullScreenEnabled: boolean;
        webkitRequestFullScreen: boolean;
        webkitFullscreenEnabled: boolean;
    }

    interface Navigator {
        onLine: boolean;
        deviceMemory; number;

    }

    interface Screen {
        mozOrientation: string;
        msOrientation: string;
        left: number;
        top: number;
    }

}
