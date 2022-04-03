
import Dispatcher      from './../../globals/dispatcher';

const fire = Dispatcher.connect({name: 'commands'});

// const fen0 = 'N7/P3pk1p/3p2p1/r4p2/8/4b2B/4P1KP/1R6 w - - 0 34';

export default {

    view( /*vnode*/ ) {

        const btnSelektor = 'a.f5.link.ml1.dib.near-black.pointer.ahover-w.mh2.pointer';

        return (
            m('',[

                m('div.pa1.ml5.dib.v-mid.mt2', [
                    // m(btnSelektor, {onclick: () => fire('board',     'reset' )},          'reset'),
                    // m(btnSelektor, {onclick: () => fire('board',     'init'  )},          'init'),
                    m(btnSelektor, {onclick: () => fire('board',     'rotate')},          'rotate'),

                    m(btnSelektor, {onclick: () => fire('board',     'mark', 'attack' )}, 'attack'),
                    m(btnSelektor, {onclick: () => fire('board',     'mark', 'test' )}, 'test'),
                    m(btnSelektor, {onclick: () => fire('board',     'mark', 'last' )}, 'last'),
                    m(btnSelektor, {onclick: () => fire('board',     'mark', 'pinned' )}, 'pinned'),

                    m(btnSelektor, {onclick: () => fire('game',      'move', 'prev'  )},  '<'),
                    m(btnSelektor, {onclick: () => fire('game',      'move', 'next'  )},  '>'),
                ]),

                m('div.pa1.ml5.dib.v-mid.mt2', [
    
                    m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'reset' )},                 'reset'),
                    m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'isready' ) },              'isready'),
                    m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'stop' )},                  'stop'),
                    m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'uci' ) },                  'uci'),
                    m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'ucinewgame' ) },           'ucinewgame'),
                    // m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'position fen ' + fen0 )},  'fen'),
                    // m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'go depth 5' )},            'go depth 5'),
                    // m(btnSelektor, {onclick: () => fire('stockfish', 'ask', 'd' )},                     'display'),

                    // m(btnSelektor, {onclick: () => fire('analysis', 'log', 'options'  )},  'opts'),
    
                ]),
    
            ])
        );  

    },
};
