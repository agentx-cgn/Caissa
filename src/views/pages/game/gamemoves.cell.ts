import { ICellComponent, IGameTree } from '@app/domain';
import { IPgnMove } from '@mliebelt/pgn-parser';
import m from 'mithril';

import { MoveRowAtom, MoveSpanAtom } from './gamemove.atom';

function renderMoves (game: IGameTree) {

    // // eslint-disable-next-line no-debugger
    // debugger;

    return !game.moves.length
        ? m('div', 'no moves yet') //TODO: needs some css love
        : game.moves.map((_move: IPgnMove, i: number, moves: IPgnMove[]) => {
            return m(MoveRowAtom, {
                game,
                num: 17,
                white: { move: moves[i], turn: i },
                // black: { move: moves[i+1] || { piece: '', fen: '', flags: {}, san: '', cp: 0}, turn: i+1 },
                black: { move: moves[i+1], turn: i+1 },
            });
        })

        // : game.moves
        //     // turns list of moves [white, black, white,...] into
        //     // list of pairs of plies [[white, black], [white, black],...]
        //     .reduce( (acc, val) => {
        //         val.turn === 'w' ? (acc.push( [ val ] )) : (acc[acc.length -1].push( val ));
        //         return acc;
        //     }, [] )
        //     .map( (move, idx) => {
        //         return innerWidth >= 720
        //             // and then map to table rows <tr><td>white</td><td<black...
        //             ? m(MoveRowAtom, {
        //                 game,
        //                 num:   idx +1,
        //                 white: { move: move[0] },
        //                 black: { move: move[1] || {piece: '', fen: '', flags: {}, san: '', cp: 0} },
        //             })
        //             // or inlined as <span>
        //             : m(MoveSpanAtom, {
        //                 game,
        //                 num:   idx +1,
        //                 white: { move: move[0] },
        //                 black: { move: move[1] || {piece: '', fen: '', flags: {}, san: '', cp: 0} },
        //             })
        //         ;
        //     })

    ;

}

interface IGameMovesCellAttrs {
    game: IGameTree;
}

const GameMovesCell: ICellComponent<IGameMovesCellAttrs> = {

    view ( vnode ) {

        const { game } = vnode.attrs;

        return innerWidth >= 720

            // Desktop, two columns
            ? m('div.gm-moves.flex-shrink',
                m('div.mv2',
                    m('table.w-100.collapse', renderMoves(vnode.attrs.game)),
                ),
            )
            // mobile, floating
            : m('div.gm-moves',
                m('div.ma2', renderMoves(game)),
            )
        ;
    },

};

export { GameMovesCell };
