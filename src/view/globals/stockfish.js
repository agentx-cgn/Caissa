
import Worker     from 'worker-loader!./../../worker/stockfish.asm';

import Dispatcher from  './dispatcher';
import Logger     from './logger';
import State      from './state';

let worker  = null;
let batch   = '';
let DEBUG   = State.stockfish.debug;

const initialize = function initialize () {

    if ( worker ){ worker.terminate(); }
    worker = new Worker();

    worker.onerror        = e => console.warn('stockfish.error', e);
    worker.onmessageerror = e => console.warn('stockfish.messageerror', e);
    worker.onmessage      = e => {

        if (batch) {
            fire('analysis', 'analyze', ['readyok ' + batch + ' / ' + e.data]);
            batch = '';
            DEBUG && Logger.log('stockfish', e.data);
            
        } else {
            fire('analysis', 'analyze', [e.data]);
            DEBUG && Logger.log('stockfish', e.data);
    
        }

    };

};

const postMessage = function (msg) {

    const
        tokens = msg.split(' '),
        first  = tokens[0],
        silent = ['ucinewgame', 'position']
    ;

    if (silent.includes(first)){
        batch = first;
        worker.postMessage(msg);
        worker.postMessage('isready');

    } else {
        worker.postMessage(msg);

    }
     

};

initialize();

const fire = Dispatcher.connect({ 
    name: 'stockfish',
    ask: postMessage,
}, false);

export default {
    ask: worker.postMessage.bind(worker),
    reset () {
        initialize();
        fire('analysis', 'clear');
    },
};
