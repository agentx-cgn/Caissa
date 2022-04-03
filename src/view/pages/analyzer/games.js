// https://github.com/spacejack/mithril-select

import mithrilSelect    from 'mithril-select';

import Dispatcher       from './../../globals/dispatcher';
import Parser           from './../../globals/parser/pgn';
import State            from './../../globals/state';
import Config           from './../../globals/config';

const pgns = Config.pgns.map( (pgn, idx) => {
    return { value: idx +1, view: Parser.get(pgn, 'game', 'New Game...'), data: pgn };
});

const options = Config.games.concat(pgns);

const fire = Dispatcher.connect({ name: 'games' });

const state = State.games;

export default {
    oninit: function( /* vnode */ ){
        // console.log('games.onupdate');
        // setTimeout( () => {
        // fire('board', 'load', [pgn05]);
        // fire('board', 'init');
        // },500);
    },
    view( /*vnode*/ ) {

        return m(mithrilSelect, {

            options,
            class:   'sel-game',  // A CSS class to add to the root element of the select
            initialValue: state.value,
            onchange: (value) => {

                console.log('mithrilSelect.onchange.val:', value);
                
                state.value = value;
                
                const pgn = (value != null) ? options.find(c => c.value === value).data : '';
                
                if (pgn === ''){
                    fire('board', 'reset');
                } else {
                    fire('board', 'load', [pgn]);
                }

            },

        });

    },
};
