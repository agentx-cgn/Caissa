
import Chess  from 'chess.js';
import { H }  from '../../services/helper';
import Tools  from '../../tools/tools';
import Pool   from '../../services/engine/pool';

import { INPUT_EVENT_TYPE } from '../../../extern/cm-chessboard/Chessboard';
import { H } from '@app/services';
import { IEvent } from '@app/domain';

const DEBUG = false;

type TColor = 'w' | 'b' | 'n';
type TMode  = 'x' | 'h' | 's';

class Opponent {

    private color: TColor;
    private mode:  TMode;
    private chess: Chess;
    private engine: any;

    private initialization: Promise<void>;

    private slot: any;


    constructor (color: TColor, mode: TMode) {

        this.color = color; // w, b, n
        this.mode  = mode;  // x, h, s,
        this.chess = new Chess();

        if (this.mode === 's'){

            this.initialization = new Promise((resolve) => {
                this.slot = Pool.request(1)[0];
                this.slot.engine.init()
                    .then( engine => {
                        return engine.isready();
                    })
                    .then( engine => {
                        return engine.ucinewgame();
                    })
                    .then( engine => {
                        this.engine = engine;
                        this.slot.name   = this.color;
                        DEBUG && console.log('Opponent.engine', this.color, this.mode, this.engine);
                        resolve();
                    })
                ;
            });

        } else {
            this.initialization = Promise.resolve();

        }

        DEBUG && console.log('Opponent.create', {color: this.color, mode: this.mode});
    }

    public destroy () {
        if (this.slot) {
            this.slot.idle = true;
            this.slot.name = '';
        }
        DEBUG && console.log('Opponent.destroy', {color: this.color, mode: this.mode});
    }

    public update (controller) {
        this.controller = controller;
        this.fen        = Tools.Games.fen(controller.game);
        !this.chess.load(this.fen) && console.warn('Opponent.update.load.failed', this.fen);
    }
    public pause () {

    }
    public async domove (chessBoard) {

        if (this.mode === 's'){

            await this.initialization;
            await H.sleep(300);
            await this.engine.position(this.fen);

            const answer   = await this.engine.go({depth: 4});

            if (!answer.bestmove){
                // eslint-disable-next-line no-debugger
                debugger;
            }

            const bestmove = answer.bestmove;
            return bestmove;


        } else if (this.mode === 'x'){

            return new Promise(resolve => {

                let move, result;

                const dragHandler = (event: IEvent) => {
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
