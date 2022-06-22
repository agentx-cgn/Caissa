
/*
    https://github.com/hi-ogawa/Stockfish
    https://github.com/niklasf/stockfish.wasm
    https://github.com/niklasf/stockfish.js
    https://github.com/niklasf/stockfish.wasm/issues/16
    https://github.com/niklasf/stockfish.wasm/issues/6

    var stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');

    TypeError: asm.js type error: Disabled by debugger
    Asm.js optimizations aren't possible when the debugger is running.
    It will fallback to be executed as normal JS and can debugged that way.

*/

let mem;

const SystemService = {

    plattform:     navigator.platform,
    userAgent:     navigator.userAgent,
    threads:       navigator.hardwareConcurrency || 4,
    vendor:        navigator.vendor,
    touch :        'ontouchstart' in document.documentElement,
    fetch:         !!window.fetch,
    online:        true,
    languages:     navigator.languages.join('|'),
    vibration:     !!window.navigator.vibrate,
    localStorage : !!window.localStorage,
    serviceWorker: !!navigator.serviceWorker,
    storageEstimate: ( navigator.storage && navigator.storage.estimate )
        ? navigator.storage.estimate
        : NaN
    ,
    fullscreen : function () {
        return !!(document.fullscreenEnabled
            || document.mozFullScreenEnabled
            || document.webkitFullscreenEnabled
        );
    }(),
    wasm : function () {
        return typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    }(),
    is64bit : function is64Bit () {
        const x64 = ['x86_64', 'x86-64', 'Win64','x64', 'amd64', 'AMD64'];
        for (const substr of x64) if (navigator.userAgent.indexOf(substr) >= 0) return true;
        return navigator.platform === 'Linux x86_64' || navigator.platform === 'MacIntel' || navigator.platform === 'Linux aarch64' ;
    }(),
    BigInt : !!window.BigInt,

    screen: {
        width:         screen.width,
        height:        screen.height,
        aspect:        screen.width / screen.height,
        availWidth:    screen.availWidth,
        availHeight:   screen.availHeight,
        get innerWidth  () {return innerWidth;},
        get innerHeight () {return innerHeight;},
        colorDepth:    screen.colorDepth,
        pixelDepth:    screen.pixelDepth,
        orientation:  (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation,
        devicePixelRatio: window.devicePixelRatio,

        'safe-area-inset-top':      getComputedStyle(document.documentElement).getPropertyValue('--sat'),
        'safe-area-inset-right':    getComputedStyle(document.documentElement).getPropertyValue('--sar'),
        'safe-area-inset-bottom':   getComputedStyle(document.documentElement).getPropertyValue('--sab'),
        'safe-area-inset-left':     getComputedStyle(document.documentElement).getPropertyValue('--sal'),
    },

    Atomics:           typeof Atomics === 'object',
    SharedArrayBuffer: typeof SharedArrayBuffer === 'function',
    OffscreenCanvas:   typeof window.OffscreenCanvas === 'function',

    sharedMemory : function () {
        try {
            mem = new WebAssembly.Memory({shared: true, initial: 8, maximum: 16});
        } catch (e) {
            return false;
        }
        return true;
    }(),

    cloning : (function () {
        try {
            // You have to make sure nobody cares about these messages!
            window.postMessage(mem, '*');
        } catch (e) {
            return false;
        }
        return true;
    }()),

    growable : (function () {
        try {
            mem?.grow(8);
        } catch (e) {
            return false;
        }
        return true;
    }()),

    SharedMemory: (function () {
        try {
            if (mem?.buffer instanceof SharedArrayBuffer){
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }()),

    log () {
        const s = SystemService;
        console.log(
            'Info   :',
            'COR'          + navigator.hardwareConcurrency,
            'MEM'          + (navigator.deviceMemory      ? navigator.deviceMemory : '-'),
            'LS'           + (s.localStorage      ? '+' : '-'),
            'FS'           + (s.fullscreen        ? '+' : '-'),
            'SM'           + (s.SharedMemory      ? '+' : '-'),
            'SAB'          + (s.SharedArrayBuffer ? '+' : '-'),
            'WASM'         + (s.wasm              ? '+' : '-'),
            '64bit'        + (s.is64bit           ? '+' : '-'),
            'Atoms'        + (s.Atomics           ? '+' : '-'),
            'Clones'       + (s.cloning           ? '+' : '-'),
            'Growables'    + (s.growable          ? '+' : '-'),
            'OSCanvas'     + (s.OffscreenCanvas   ? '+' : '-'),
        );
    },

};

window.addEventListener('online',                () => SystemService.online = true);
window.addEventListener('offline',               () => SystemService.online = false);

SystemService.log();

export { SystemService };
