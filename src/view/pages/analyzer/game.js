
import Config     from '../../globals/config';
import State      from '../../globals/state';
import Dispatcher from '../../globals/dispatcher';
import Tools      from './game-tools';

let state = State.game;

const fire = Dispatcher.connect({
    name: 'game',
    move (direction) {
        let 
            num = ~~state.pointer.substr(1),
            col = state.pointer[0],
            max = state.listMoves.length
        ;
        state.pointer = (
            col === 'w' && direction === 'next' ? 'b' +  num     :
            col === 'w' && direction === 'prev' ? 'b' + (num -1) :
            col === 'b' && direction === 'next' ? 'w' + (num +1) :
            col === 'b' && direction === 'prev' ? 'w' +  num     :
            console.log('WTF')
        );

        num = ~~state.pointer.substr(1);
        state.pointer = (
            num < 0   ? 'w0' :
            num > max ? 'b' + max:
            state.pointer
        );
        
        const fen = state.listMoves.find( m => m.pointer === state.pointer).fen;
        fire('board', 'fen', [fen]);
        state.htmlMoves = state.listMoves.reduce(Tools.combine, []).map(render);
        m.redraw();

        // console.log('game.pointer', pointer, 'max', max);//, listMoves[listMoves.length -1]);

    },
    moves (list) {
        state.listMoves = list,
        state.pointer   = Tools.lastMove(list);
        state.htmlMoves = state.listMoves.reduce(Tools.combine, []).map(render);
        m.redraw();
        // console.log('moves', pointer);
        // element.scrollIntoView(alignToTop) // false
    },
});

function render (moves, idx) {
    // { color: 'b', from: 'e5', to: 'f4', flags: 'c', piece: 'p', captured: 'p', san: 'exf4' }
    const 
        update = function (fen, newpointer) {
            fire('board', 'fen', [fen]);
            state.pointer   = newpointer;
            state.htmlMoves = state.listMoves.reduce(Tools.combine, []).map(render);
            m.redraw();
        },
        empty = {piece: '', fen:'', flags:{}, san:''},
        pcs   = Config.fontPieces,
        ft    = Config.flagTitles,
        fcw   = Config.flagColorsWhite,
        fcb   = Config.flagColorsBlack,

        w   = moves[0],
        pw  = pcs['w' + w.piece],
        cw  = function () {
            update(w.fen, 'w' + idx); 
        },

        b   = moves[1] || empty,
        pb  = pcs['b' + b.piece],
        cb  = function () {
            update(b.fen, 'b' + idx); 
        },

        bgw = 'w' + idx !== state.pointer ? '.bg-transparent' : '.bg-a78e8e',
        bgb = 'b' + idx !== state.pointer ? '.bg-transparent' : '.bg-a78e8e'
    ;

    return m('tr.trhover.pointer', [

        m('td.tr.fw8',   {style: `color: ${'#555'}`, title: ft[w.flags]}, idx +1 + '.'),

        m('td.tc' + bgw, {onclick: cw, style: `color: ${fcw[w.flags]}`, title: ft[w.flags]}, pw),
        m('td' + bgw,    {onclick: cw, style: `color: ${fcw[w.flags]}`, title: ft[w.flags]}, w.san),

        m('td.tc' + bgb, {onclick: cb, style: `color: ${fcb[b.flags]}`, title: ft[b.flags]}, pb),
        m('td' + bgb,    {onclick: cb, style: `color: ${fcb[b.flags]}`, title: ft[b.flags]}, b.san),

    ]);

}

export default {
    view( /*vnode*/ ) {
        return m('div.flex-auto.overflow-y-auto.w-100.pa1.mb2.mr2', 
            {style: 'flex-basis: 20px'}, [
                m('table.w-100.collapse', 
                    {style: 'width: 12rem'},
                    state.htmlMoves,
                ),
            ],
        );
    },
};
