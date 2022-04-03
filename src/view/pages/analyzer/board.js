
import './../../extern/cm-chessboard/cm-chessboard.css';
import {Chessboard, COLOR, INPUT_EVENT_TYPE} from '../../extern/cm-chessboard/Chessboard';

import Chess        from  'chess.js';
import Tools        from './board-tools';
import State        from '../../globals/state';
import Config       from '../../globals/config';
import Dispatcher   from '../../globals/dispatcher';

const state = State.board;

let 
    chess      = new Chess(),
    chessBoard = null
;

const board = {
    name: 'board',
    reset () {
        fire('analysis', 'reset');
        chess.reset();
        chessBoard.setPosition(chess.fen(), true);
        fire('game',     'moves',  [[]]);
        fire('status',   'update', [Tools.flags(chess)]);
        Tools.updateMarker(chess, chessBoard, state.marker);
        Tools.updateArrows(chess, chessBoard, state.arrows);
        fire('analysis', 'fen', chess.fen());
    },
    // init () {
    //     chessBoard.removeMarkers(null, null);
    //     fire('game',   'moves',  [[]]);
    //     fire('status', 'update', [Tools.flags(chess)]);
    //     board.fen(Config.fen_start);
    // },
    load (pgn) {
        state.pgn = pgn;
        state.orientation = COLOR.white;
        !chess.load_pgn(pgn) && console.warn('board.load.failed', pgn);
        chessBoard.setOrientation(COLOR.white);
        chessBoard.removeMarkers(null, null);
        chessBoard.removeArrows(null);
        fire('analysis', 'reset');
        fire('game',     'moves',  [Tools.fullHistory(chess)]);
        board.fen(chess.fen());
    },
    fen (fen) {
        state.fen = fen;
        !chess.load(fen) && console.warn('board.fen.failed', fen);
        chessBoard.setPosition(fen, true);
        Tools.updateMarker(chess, chessBoard, state.marker);
        Tools.updateArrows(chess, chessBoard, state);
        fire('analysis', 'fen', fen);
        fire('status',   'update', [Tools.flags(chess)]);
    },
    bestmove (bestmove) {
        state.bestmove = bestmove;
        Tools.updateArrows(chess, chessBoard, state);
    },

    show (what, data) {
        if (what === 'moves'){
            const chess1 = new Chess();
            // const moves = data.split(' ');
            !chess1.load(chess.fen()) && console.warn('board.fen.failed', data);
            data.forEach( move => chess1.move(move, { sloppy: true }));
            // chess1.move(data, { sloppy: true });
            chessBoard.setPosition(chess1.fen(), false);
            // console.log('old', chess.fen(), data);
            // console.log('new', chess1.fen());

        } else if (what === 'fen'){
            chessBoard.setPosition(data, false);

        }

    },
    move (moves) {
        moves.forEach( move => chess.move(move, { sloppy: true }));
        state.fen = chess.fen();
        chessBoard.setPosition(chess.fen(), true);
        Tools.updateMarker(chess, chessBoard, state.marker);
        Tools.updateArrows(chess, chessBoard, state);
        fire('game',     'moves',  [Tools.fullHistory(chess)]);
        fire('analysis', 'fen',    chess.fen());
        fire('status',   'update', [Tools.flags(chess)]);
    },
    rotate () {
        state.orientation = chessBoard.getOrientation() === COLOR.white ? COLOR.black : COLOR.white;
        chessBoard.setOrientation(state.orientation);
    },
    mark (what) {
        
        if (state.marker[what] !== undefined ) state.marker[what] =  !state.marker[what];
        if (state.arrows[what] !== undefined ) state.arrows[what] =  !state.arrows[what];

        Tools.updateMarker(chess, chessBoard, state.marker);
        Tools.updateArrows(chess, chessBoard, state);

    },
    // undo () {
    //     chess.undo();
    //     fire('board',  'fen',    [chess.fen()]);
    //     fire('status', 'update', [Tools.flags(chess)]);
    // },

};
const fire = Dispatcher.connect(board, true);

function inputHandler(event) {

    let move, result;

    // console.log('event', event);
    switch (event.type) {
    case INPUT_EVENT_TYPE.moveStart:
        // console.log(`moveStart: ${event.square}`);
        return true;

    case INPUT_EVENT_TYPE.moveDone:

        move   = {from: event.squareFrom, to: event.squareTo};
        result = Tools.isValid(chess, move);
        
        if (Tools.isValid(chess, move)) {
            board.move([move]);
        } else {
            console.log('illegal: ', move, result);
        }
        
        return !!result;
    
    case INPUT_EVENT_TYPE.moveCanceled:
        // console.log('moveCanceled');
    }
}

function resize() {

    const 
        $board  = document.querySelector('#board'),
        $parent = document.querySelector('div.section-center'),
        size = ($parent.offsetHeight -40 - 14) + 'px'
    ;

    // TODO: Make this work for portrait
    $parent.style.width = $parent.offsetHeight + 'px';
    $board.style.width  = $board.style.height = size; 
    $board.style.marginTop  = '40px'; 

}

export default {
    onremove: function( /* vnode */ ) {
        chessBoard.destroy();
        window.removeEventListener('resize', resize);
    },
    oncreate: function( /* vnode */ ) {

        resize();
        window.addEventListener('resize', resize);

        chessBoard = new Chessboard(
            document.getElementById('board'),
            Config.board,
        );

        chessBoard.setPosition(state.fen, true);
        chessBoard.enableMoveInput(inputHandler);
        chessBoard.setOrientation(state.orientation);

        Tools.updateArrows(chess, chessBoard, state);
        Tools.updateMarker(chess, chessBoard, state.marker);

    },
    view( /*vnode*/ ) {
        return (
            <div class="w-100 h-100 pa1 mh1 mb1 flex-auto">
                <div id="board"></div>
            </div>
        );
    },

};
