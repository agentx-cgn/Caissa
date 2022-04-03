import Tools      from './analysis-tools';
import Stockfish  from '../../globals/stockfish';
import Dispatcher from '../../globals/dispatcher';
import State        from '../../globals/state';
import H          from './../../globals/helper';

const state = State.analysis;

const oninit = function( /* vnode */ ){

    state.fen      = State.chess.fen,
    state.moves    = [];
    state.mates    = [];
    state.bestmove.move   = '*';
    state.bestmove.ponder = '*';
    state.turn     = Tools.parseFen(state.fen, 'turn');

    // This connects the engine to receive dispatcher events
    Stockfish.ask('stop');
    Stockfish.ask('setoption name UCI_AnalyseMode value true');
    Stockfish.ask(`setoption name multiPV value ${state.multipv}`); // max 500
    Stockfish.ask('uci');
    Stockfish.ask('ucinewgame');
    Stockfish.ask('position fen ' + state.fen);
    setTimeout( () => Stockfish.ask('go depth ' + state.depth), 100);

};


const fire = Dispatcher.connect({ 
    
    name: 'analysis',

    // prepare for new game
    // check with Object.assign and Config
    reset () {
        state.lines    = [];
        state.moves    = [];
        state.mates    = [];
        state.bestmove.move   = '*';
        state.bestmove.ponder = '*';
        state.maxpv = Math.max(state.multipv, state.depth);
        Stockfish.ask('stop'); 
        Stockfish.ask('ucinewgame'); 
        Stockfish.ask('setoption name multiPV value ' + state.multipv); 
        Stockfish.ask('setoption name Clear Hash'); 
    },

    // change engine parameter
    option (what, diff) {
        if (what === 'depth') {
            state.depth = (state.depth > 0) ? state.depth + diff : 0;
        } else if (what === 'multipv'){
            state.multipv = (state.multipv > 0) ? state.multipv + diff : 0;
        }
        state.moves    = [];
        state.mates    = [];
        state.bestmove.move   = '*';
        state.bestmove.ponder = '*';
        state.maxpv = Math.max(state.multipv, state.depth);
        Stockfish.ask('setoption name multiPV value ' + state.multipv); 
        Stockfish.ask('setoption name Clear Hash'); 
        setTimeout( () => fire('stockfish', 'ask', `go depth ${state.depth}` ), 100);
    },
    fen (fen) {
        state.fen      = fen;
        state.turn     = Tools.parseFen(fen, 'turn');
        state.moves    = [];
        state.mates    = [];
        state.bestmove.move   = '*';
        state.bestmove.ponder = '*';
        m.redraw();
        fire('stockfish', 'ask', 'stop' );
        fire('stockfish', 'ask', 'position fen ' + fen );
        setTimeout( () => fire('stockfish', 'ask', `go depth ${state.depth}` ), 100);
    },
    analyze (line) {
        interpret(line);
        m.redraw();
    },
    log (what){
        switch (what) {
        case 'options' :
            console.log(state.options);
            break;
        }
    },
});

const collectors = {
    option (tokens) {
        let [key, value] = Tools.parseOption(tokens);
        state.options[key] = value;
    },
    readyok () {
        state.status = 'readyok';
    },
    uciok () {
        state.status = 'uciok';

    },
};

function interpret (line) {

    const 
        ignore  = ['Unknown'],
        collect = ['option', 'readyok', 'uciok'],
        process = ['Stockfish.js', 'id', 'Legal', 'info', 'bestmove'],
        tokens  = line.split(' '),
        first   = tokens[0],
        rest    = tokens.slice(1)
    ;

    if (ignore.includes(first) || line.length === 0){
        // moves.unshift(m('div', '** ' + first + ' / ' + rest.join('|')));
        state.lines.unshift(line);
        return;

    // options, readyok, uciok
    } else if (collect.includes(first)){
        collectors[first](rest);
        return;
    
    } else if (first === 'Stockfish.js'){
        Tools.processors.credits(tokens, state);

    // id, info, Legal, bestmove => status
    } else if (process.includes(first)){
        Tools.processors[first](rest, state);

    // ready, uciok
    } else {
        if (Tools.formatters[first]) {
            state.moves.unshift(Tools.formatters[first](rest));
        } else {
            state.moves.unshift(m('div.pl1.fw8', '** ' + first + rest));
        }

    }

    // lines.unshift(line);

}

export default {    
    oninit,
    view( /*vnode*/ ) {

        const format = Tools.formatters;

        return [
            
            m('div.flex.flex-column.w-100.f5.overflow-x-hidden', 
                {style: 'flex-basis: content; flex-shrink: 0; margin-top: 42px; background-color: #999'}, 
                [
                    // m('div', format.credits(state)),
                    // m('div', format.fen(state)),
                    m('div', format.info(state)),
                    m('div', format.bestmove(state)),
                ].concat(
                    H.range(state.maxpv)
                        .map(n => m('div', format.move(state, n)))
                        .filter( n => n),
                ).concat(
                    H.range(state.maxmate)
                        .map(n => m('div', format.mate(state, n)))
                        .filter( n => n),
                ),

            ),

            // m('div.w-100.flex.flex-column.flex-auto',
            //     {style:' margin-bottom: 4px; background: #888; overflow: hidden'},
            //     [

            //         // m('div.overflow-y-auto.f5', 
            //         //     {style: 'max-width: 100%; flex-shrink: 1; max-height: 50%;'},
            //         //     [moves],
            //         // ),

            //         m('div.overflow-y-auto.fnm.f7', 
            //             {style: 'max-width: 100%; flex-shrink: 1; max-height: 100%; color: white'},
            //             [
            //                 state.lines.slice(0, 30).map( line => {
            //                     return m('div', line);
            //                 }),
            //             ],
            //         ),

            //     ],

            // ),

        ];

    },
};

