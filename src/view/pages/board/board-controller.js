
import Chess           from 'chess.js';
import Caissa          from '../../caissa';
import { H }           from '../../services/helper';
// import { COLOR }       from '../../../extern/cm-chessboard/Chessboard';
import { MARKER_TYPE } from '../../../extern/cm-chessboard/Chessboard';
import { INPUT_EVENT_TYPE } from '../../../extern/cm-chessboard/Chessboard';

import Tools           from '../../tools/tools';
import DB from '../../services/database';

// basic controller, only controls decoration, buttons and flags
// moveInputMode: MOVE_INPUT_MODE.viewOnly,
// set to MOVE_INPUT_MODE.dragPiece or MOVE_INPUT_MODE.dragMarker for interactive movement

const DEBUG = true;

class Opponent {
    constructor(color, mode) {
        this.color = color;
        this.mode  = mode;
    }
    tomove (controller) {
        this.chessBoard   = controller.chessBoard;
        this.movedone     = controller.onmovedone.bind(controller);
        this.movestart    = controller.onmovestart.bind(controller);
        this.movecancel   = controller.onmovecancel.bind(controller);
        this.fen          = controller.chessBoard.getPosition();
        this.chess        = new Chess();
        this.chess.load(this.fen) && console.warn(this.fen);
        DEBUG && console.log('Opponent.tomove', this.color, this.fen);
    }
    towait (controller) {
        DEBUG && console.log('Opponent.towait', this.color, controller.chessBoard.getPosition());
    }
    dragHandler(event) {

        // DEBUG && console.log('dragHandler.event', this.color, event.type);

        let move, result;
        switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:

            this.movestart(event.square);
            return true;

        case INPUT_EVENT_TYPE.moveDone:

            move   = { from: event.squareFrom, to: event.squareTo };
            result = this.chess.move(move);

            if (result) {
                // DEBUG && console.log('dragHandler.legal: ',  this.color,  move, result);
                this.movedone(move);
            } else {
                console.log(this.chess.ascii());
                DEBUG && console.log('Opponent.illegal: ', this.color, move, result);
            }

            return !!result;

        case INPUT_EVENT_TYPE.moveCanceled:
            this.movecancel();
        }

    }

}

class BoardController {

    constructor (game, board) {

        this.mode      = game.mode;
        this.game      = game;
        this.board     = board;
        this.mode      = game.mode;
        this.chess     = new Chess();
        this.turn      = game.turn;
        // this.isRunning = false;
        this.validMoves = [];
        this.opponents  = {
            'w': new Opponent('w', this.mode[0]),
            'b': new Opponent('b', this.mode[0]),
            'n': { tomove: () => {}, towait: () => {} },
        };
        this.update();
    }
    update (chessBoard) {

        this.turn  = this.game.turn;
        this.fen   = Tools.Games.fen(this.game);
        this.chess.load(this.fen);
        this.tomove = (
            this.turn === -2 ? 'n' :
            this.turn  %   2 ? 'w' : 'b'
        );
        this.towait = (
            this.turn === -2 ? 'n' :
            this.turn  %   2 ? 'b' : 'w'
        );
        this.moves = this.chess.moves({verbose: true});

        if (chessBoard){
            this.chessBoard = chessBoard;
            this.updateFlags();
            this.updateButtons();
            this.updateMarker();
            this.updateArrows();
            this.listen();
        }

    }
    listen () {
        if (this.turn !== -2){

            const oppToMove   = this.opponents[this.tomove];
            const oppToWait   = this.opponents[this.towait];
            const dragHandler = oppToMove.dragHandler.bind(oppToMove);

            if (this.mode === 'x-x'){
                this.chessBoard.enableMoveInput(dragHandler, this.color);
            }

            oppToMove.tomove(this);
            oppToWait.towait(this);

            console.log('BoardController', 'towait:', this.towait, 'tomove:', this.tomove);
        }
    }
    // user clicks/touches board
    onfield (e) {
        const idx    = e.target.dataset.index;
        const square = Tools.Board.squareIndexToField(idx);
        const piece  = this.chessBoard.getPiece(square);
        console.log(idx, square, piece);
        this.validMoves = this.moves.filter( m => m.from === square || m.to === square );
        Caissa.redraw();
    }
    onmovecancel () {
        DEBUG && console.log('BoardController.onmovecancel');
    }
    onmovedone ( move ) {

        this.chess.move(move);
        const fullmove = this.chess.history({verbose: true}).slice(-1)[0];

        // check for first move of default
        if (this.game.uuid === 'default'){
            const pgn = this.chess.pgn().trim();
            const timestamp = Date.now();
            const game = H.create(this.game, {
                uuid:   H.hash(String(timestamp)),
                mode:   'x-x',
                turn :  0,
                pgn,
                timestamp,
            });
            Tools.Games.updateMoves(game);
            DB.Games.create(game, true);
            Caissa.route('/game/:turn/:uuid/', {turn: game.turn, uuid: game.uuid});

        } else {
            fullmove.fen   = this.chess.fen();
            fullmove.turn  = this.turn +1;
            this.game.moves.push(fullmove);
            this.game.turn = fullmove.turn;
            DB.Games.update(this.game.uuid, this.game, true);
            Caissa.route('/game/:turn/:uuid/', {turn: this.game.turn, uuid: this.game.uuid}, {replace: true});

        }

        DEBUG && console.log('BoardController.onmovedone', move);
    }
    onmovestart ( square ) {
        DEBUG && console.log('onmovestart', square);
    }

    updateFlags () {
        const flags = this.board.flags;
        const chess = this.chess;
        flags.turn  = this.turn === -2 ? null : chess.turn();
        flags.over  = chess.game_over();
        flags.chck  = chess.in_check();
        flags.mate  = chess.in_checkmate();
        flags.draw  = chess.in_draw();
        flags.stal  = chess.in_stalemate();
        flags.insu  = chess.insufficient_material();
        flags.repe  = chess.in_threefold_repetition();
        // DEBUG && console.log('BoardController.updateFlags.turn', flags.turn);

    }
    updateButtons () {
        const btn       = this.board.buttons;
        const canplay   = !this.isRunning && this.mode !== 'h-h';
        const canpause  =  this.isRunning && this.mode !== 'h-h';
        btn.rotate      = true;
        btn.backward    = this.turn > 0;
        btn.forward     = this.turn < this.game.moves.length -1;
        btn.left        = this.turn > -2;
        btn.right       = this.turn < this.game.moves.length -1;
        btn.play        = canplay;
        btn.pause       = canpause;
        btn.evaluate    = this.game.moves.length > 0 && !this.isRunning;
        // DEBUG && console.log('BoardController.updateButtons', 'btn.play', btn.play);
    }
    updateArrows () {

        const lasts = this.game.moves.slice(-2);

        this.chessBoard.removeArrows( null );

        if (this.board.illustrations.valid){
            this.validMoves.forEach( move => {
                this.chessBoard.addArrow(move.from, move.to, {class: 'arrow validmove'});
            });
        }

        if (this.board.illustrations.last){
            lasts.forEach( m => {
                this.chessBoard.addArrow(m.from, m.to, {class: m.color === 'w' ? 'arrow last-white' : 'arrow last-black'});
            });
        }

        if (this.board.illustrations.test){
            this.chessBoard.addArrow('e2', 'e4', {class: 'arrow test'} );
            this.chessBoard.addArrow('f2', 'h4', {class: 'arrow test'} );
            this.chessBoard.addArrow('d2', 'c4', {class: 'arrow test'} );
            this.chessBoard.addArrow('c2', 'a3', {class: 'arrow test'} );
            this.chessBoard.addArrow('d7', 'd5', {class: 'arrow test'} );
            this.chessBoard.addArrow('c7', 'c5', {class: 'arrow test'} );

            this.chessBoard.addArrow('g7', 'g8', {class: 'arrow test'} );
            this.chessBoard.addArrow('g7', 'h8', {class: 'arrow test'} );
            this.chessBoard.addArrow('g7', 'h7', {class: 'arrow test'} );
            this.chessBoard.addArrow('g7', 'h6', {class: 'arrow test'} );
            this.chessBoard.addArrow('g7', 'g6', {class: 'arrow test'} );
            this.chessBoard.addArrow('g7', 'f6', {class: 'arrow test'} );
            this.chessBoard.addArrow('g7', 'f7', {class: 'arrow test'} );
            this.chessBoard.addArrow('g7', 'f8', {class: 'arrow test'} );
        }

    }
    updateMarker () {

        // const validSquares = this.chess.moves({verbose: true});
        const markerType   = this.turn === 'w' ? MARKER_TYPE.rectwhite : MARKER_TYPE.rectblack;

        this.chessBoard.removeMarkers( null, null);

        if (this.board.illustrations.attack){
            this.validMoves.forEach( square => {
                this.chessBoard.addMarker(square.to, markerType);
            });
        }

        // DEBUG && console.log('BoardController.updateMarker');

    }

}

        // chess.put({ type: chess.PAWN, color: chess.BLACK }, 'a5')
        // chess.put({ type: 'k', color: 'w' }, 'h1')
        // chess.remove('h1')

        // if (action === 'add') {
        //     const type = piece[1], color = piece[0];
        //     chess.put({ type, color}, field);
        //     chessBoard.setPosition(chess.fen(), true);

export default BoardController;
