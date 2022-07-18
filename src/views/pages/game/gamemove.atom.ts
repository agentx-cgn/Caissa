
import m from 'mithril';

import { IAtomComponent, IEvent, IGameTree, IPgnMove } from '@app/domain';
import { AppConfig } from '@app/config';
import { App } from '@app/views';
import { H, DatabaseService as DB } from '@app/services';

const clampScale = function (game: IGameTree, cp: number): number {
    return H.scale(H.clamp(Math.abs(cp), 0.001, game.score.maxcp), 0, game.score.maxcp, 1, 20);
};

const calcWidth = function (game: IGameTree, move: IPgnMove): number {

    return 8;

    // var result = (
    //     !move.cp                             ? 0 :
    //     (move.moveNumber % 2 === 0 && move.cp) > 0 ? ~~clampScale(game, move.cp) :
    //     (move.moveNumber % 2 === 1 && move.cp) > 0 ? ~~clampScale(game, move.cp) :
    //     0
    // );
    // // console.log('calcwidth', move.turn, result, move.cp, state.score.maxcp);
    // return result;
};

interface IPlyAtomAttrs {
    game: IGameTree;
    player: string;
    move: IPgnMove;
    back: string;
}
const PlyTDAtom: IAtomComponent<IPlyAtomAttrs> = {
    view ( vnode ) {

        const { game, player, move, back } = vnode.attrs;

        if (!move) { return m('td', {colspan: 3}, 'huhuh'); }

        const width     = 16; //calcWidth(game, move);
        const piece     = 'w'; //AppConfig.pieces.font[move.piece];
        const onclick   = (e: IEvent) => {
            e.redraw = false;
            DB.Games.update(game.uuid, { turn: move.turn });
            App.route('/game/:uuid/:ply/', {ply: move.turn, uuid: game.uuid}, { replace: true });
        };

        const matetext  = 'mate text'; //move.mate ? '# in ' + Math.abs(move.mate) : '';

        const title     = 'some title'; //AppConfig.flagTitles[move.flags];
        const titlepv   = ''; // move.pv ? move.pv.split(' ').slice(0, 3).join(' ') : '';
        const titleline = ''; // move.pv ? move.cp || '' + ':' +  titlepv : '';
        const titlemate = ''; // move.mate && move.pv ? titlepv : '';
        const titleeval = ''; // matetext ? titlemate : titleline;

        return m('[', [
            m('td.gm-ply-pic-' + player + back, { onclick, title, 'data-turn': move.turn }, piece ),
            m('td.gm-ply-san-' + player + back, { onclick, title }, move.notation.notation ),
            m('td.gm-ply-val-' + player + back, { onclick, title: titleeval }, [
                matetext
                    ? m('div.gm-ply-mate-' + player, matetext)
                    : m('div.gm-ply-bar-'  + player, { style: 'width:' + width + 'px'} ),
            ]),
        ]);

    },
};
const PlySPAtom: IAtomComponent<IPlyAtomAttrs> = {
    view ( vnode ) {

        const { game, player, move, back } = vnode.attrs;

        // const piece     = Config.pieces.font[move.piece];
        const title     = 'some title'; // AppConfig.flagTitles[move.flags];
        const onclick   = (e: IEvent) => {
            e.redraw = false;
            DB.Games.update(game.uuid, { turn: move.turn });
            App.route('/game/:uuid/:ply/', {turn: move.turn, uuid: game.uuid}, { replace: true });
        };
        return m('span.mh1', {'data-turn': move.turn}, [
            // m('span.gm-ply-pic-' + player + back, { onclick, title }, piece ),
            m('span.gm-ply-san-' + player + back, { onclick, title }, move.notation.notation ),
        ]);
    },
};

interface IMoveRowAtomAttrs {
    game: IGameTree;
    num: number;
    white: { move: any, turn: number };
    black: { move: any, turn: number };
}
const MoveRowAtom: IAtomComponent<IMoveRowAtomAttrs> = {
    view (vnode) {
        const { game, num, white, black } = vnode.attrs;
        const bgw = ''; //white.move.turn !== game.turn ? '.bg-transparent' : '.bg-89b';
        const bgb = ''; //black.move.turn !== game.turn ? '.bg-transparent' : '.bg-89b';
        return m('tr.gm-move.trhover', [
            m('td.gm-move-space'),
            m('td.gm-move-num', num),
            m(PlyTDAtom, { game, back: bgw, move: white.move, player: 'w' }),
            m(PlyTDAtom, { game, back: bgb, move: black.move, player: 'b' }),
            m('td.gm-move-space'),
        ]);
    },

};

interface IMoveSpanAtomAttrs {
    game: IGameTree;
    num: number;
    white: { move: IPgnMove, turn: number };
    black: { move: IPgnMove, turn: number };
}
const MoveSpanAtom: IAtomComponent<IMoveSpanAtomAttrs> = {
    view (vnode) {
        const { game, num, white, black } = vnode.attrs;
        const bgw = ''; // white.move.turn !== game.turn ? '.bg-transparent' : '.bg-89b';
        const bgb = ''; // black.move.turn !== game.turn ? '.bg-transparent' : '.bg-89b';
        return m('span.gm-move', {style: 'padding-right: 8px' }, [
            m('span.gm-move-num', {style: 'font-weight: 800' }, num),
            m(PlySPAtom, { game, back: bgw, move: white.move, player: 'w' }),
            m(PlySPAtom, { game, back: bgb, move: black.move, player: 'b' }),
        ]);
    },

};

export {
    MoveRowAtom,
    MoveSpanAtom,
};
