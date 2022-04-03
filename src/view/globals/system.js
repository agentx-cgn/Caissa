
/*
    https://github.com/niklasf/stockfish.wasm
    https://github.com/niklasf/stockfish.js
    https://github.com/niklasf/stockfish.wasm/issues/16
    https://github.com/niklasf/stockfish.wasm/issues/6

    var stockfish = new Worker(wasmSupported ? 'stockfish.wasm.js' : 'stockfish.js');

    TypeError: asm.js type error: Disabled by debugger
    Asm.js optimizations aren't possible when the debugger is running. 
    It will fallback to be executed as normal JS and can debugged that way.

*/

function is64Bit () {                                                   
    const x64 = ['x86_64', 'x86-64', 'Win64','x64', 'amd64', 'AMD64'];            
    for (const substr of x64) if (navigator.userAgent.indexOf(substr) >= 0) return true;
    return navigator.platform === 'Linux x86_64' || navigator.platform === 'MacIntel';
}


var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

var sharedMemory = true;
try {
    var mem = new WebAssembly.Memory({shared: true, initial: 8, maximum: 16});
} catch (e) {
    sharedMemory = false;
}

// Structured cloning
var cloning = true;
try {
    // You have to make sure nobody cares about these messages!
    window.postMessage(mem, '*');
} catch (e) {
    cloning = false;
}   

// Growable shared memory (optional)
var growable = true;
try {
    mem.grow(8);
} catch (e) {
    growable = false;
}

export default {
    log () {
        console.log(
            'Info  :', 
            'wasm',    wasmSupported, 
            '64bit',   is64Bit(),
            'Atomics', typeof Atomics === 'object',
            'SharedMemory',      sharedMemory,
            'SharedArrayBuffer', typeof SharedArrayBuffer === 'function',
            // 'Shared memory', mem.buffer instanceof SharedArrayBuffer,
            'Cloning',  cloning,
            'Growable', growable,
        );
    },
};
