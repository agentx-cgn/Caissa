
import { Pool } from  "../../../extern/pool/index";
import { Chessboard, BORDER_TYPE, COLOR, MARKER_TYPE, INPUT_EVENT_TYPE } from "../../../extern/cm-chessboard/index";
import { Chess } from "../../../extern/cm-chess/index";

import { H, ToolsService as Tools } from '@app/services';
import { IEvent, TRival } from '@app/domain';

import { BoardController } from './controller.class';

const DEBUG = false;

type TColor = 'w' | 'b' | 'n';

class Opponent {

    private color: TColor;
    private rival: TRival;
    private chess: Chess;
    private engine: any;

    private fen: string = '';

    private initialization: Promise<void>;

    private slot: any;

    private controller: undefined | BoardController;


    constructor (color: TColor, rival: TRival) {

        this.color = color; // w, b, n
        this.rival  = rival;  // x, h, s,
        this.chess = new Chess();

        if (this.rival === 's'){

            this.initialization = new Promise((resolve) => {
                this.slot = Pool.request(1)[0];
                this.slot.engine.init()
                    .then( (engine: any) => {
                        return engine.isready();
                    })
                    .then( (engine: any) => {
                        return engine.ucinewgame();
                    })
                    .then( (engine: any) => {
                        this.engine = engine;
                        this.slot.name   = this.color;
                        DEBUG && console.log('Opponent.engine', this.color, this.rival, this.engine);
                        resolve();
                    })
                ;
            });

        } else {
            this.initialization = Promise.resolve();

        }

        DEBUG && console.log('Opponent.create', {color: this.color, rival: this.rival});
    }

    public destroy () {
        if (this.slot) {
            this.slot.idle = true;
            this.slot.name = '';
        }
        DEBUG && console.log('Opponent.destroy', {color: this.color, rival: this.rival});
    }

    public update (controller: BoardController) {
        this.controller = controller;
        this.fen        = Tools.Games.fen(controller.playtree);
        !this.chess.load(this.fen) && console.warn('Opponent.update.load.failed', this.fen);
    }
    public pause () {

    }
    public async domove (chessBoard: Chessboard, event?: IEvent) {

        // Stockfish
        if (this.rival === 's'){

            await this.initialization;
            await H.wait(300);
            await this.engine.position(this.fen);

            const answer   = await this.engine.go({depth: 4});

            if (!answer.bestmove){
                // eslint-disable-next-line no-debugger
                debugger;
            }

            const bestmove = answer.bestmove;
            return bestmove;

        // Human
        } else if (this.rival === 'h'){

            return new Promise(resolve => {

                let move, result;

                const dragHandler = (event: IEvent): any => {
                    switch (event.type) {
                    case INPUT_EVENT_TYPE.moveDone:

                        move   = { from: event.squareFrom, to: event.squareTo };
                        result = this.chess.move(move);

                        if (result) {
                            resolve(move);

                        } else {
                            DEBUG && console.log(this.chess.ascii());
                            DEBUG && console.warn('Opponent.illegal.move: ', this.color, move, result);
                        }

                        return !!result;

                    case INPUT_EVENT_TYPE.moveStart:
                            // this.controller.listener.onmovestart(event.square);
                        return true;
                    case INPUT_EVENT_TYPE.moveCanceled:
                        // this.controller.listener.onmovecancel();
                        return true;
                    }
                };

                chessBoard.enableMoveInput(dragHandler, this.color);

            });

        }

    }
    // dragHandler(event) {

    //     // DEBUG && console.log('dragHandler.event', this.color, event.type);

    //     let move, result;
    //     switch (event.type) {
    //     case INPUT_EVENT_TYPE.moveStart:
    //         this.controller.listener.onmovestart(event.square);
    //         return true;

    //     case INPUT_EVENT_TYPE.moveDone:

    //         move   = { from: event.squareFrom, to: event.squareTo };
    //         result = this.chess.move(move);

    //         if (result) {
    //             // DEBUG && console.log('dragHandler.legal: ',  this.color,  move, result);
    //             const fullmove = this.chess.history({verbose: true}).slice(-1)[0];
    //             const pgn = this.chess.pgn().trim();
    //             fullmove.fen = this.chess.fen();
    //             this.controller.listener.onmovedone(fullmove, pgn);

    //         } else {
    //             // DEBUG && console.log(this.chess.ascii());
    //             DEBUG && console.warn('Opponent.illegal.move: ', this.color, move, result);
    //         }

    //         return !!result;

    //     case INPUT_EVENT_TYPE.moveCanceled:
    //         this.controller.listener.onmovecancel();
    //     }

    // }

}

export { Opponent };
