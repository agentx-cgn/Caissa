


// import { Chessboard, BORDER_TYPE, COLOR, MARKER_TYPE, INPUT_EVENT_TYPE } from "../../../extern/cm-chessboard/index";
// import { Chess } from "../../../extern/cm-chess/index";

import { App } from '@app/views';
import { AppConfig } from '@app/config';
import { IBoard, IEvent, IPlayMove, IPlayTree } from '@app/domain';
import { DatabaseService as DB, H, $, ToolsService as Tools } from '@app/services';

import { Opponent }        from './opponent.class';
import { Proposer }        from './proposer.class';
import { ChessClockCell } from './chessclock.cell';

const DEBUG = false;

import { CM } from "CMGChess";

console.log("=>", CM.Chess.load("e2e4"));



/**
 * game modes:
 * a-a archived, game is finished, has no opponents, no timecontrol, can't be changed
 * x-x experimental, no timecontrol, accepts all input, default is x-x
 * [h|s]-[h|s] has opponents + timecontrol, is not finished, turn to a-a after finsish
 */

class BoardController {

  private isEvaluating: boolean = false;
  private isRunning:    boolean = false;

  public playtree: IPlayTree;
//   public static playtree: IPlayTree;
  private board: IBoard;

  private chessBoard: CM.IChessboard | undefined; //any;

  private ply: number;
  private color: string;

  private chess: CM.IChess;
  private clock: typeof ChessClockCell;


  private newmove: string;
  private bestmove: string;
  private ponder: string = '';
;
  private selectedSquare: string;
  private selectedPiece: string;
  private squareMoves: string[];
  private validMoves: string[];

  private illustrations: any;

  private tomove: 'n' | 'w' | 'b' = 'n';
  private towait: 'n' | 'w' | 'b' = 'n';

  private opponents: {
    w: Opponent,
    b: Opponent,
    n?: Opponent, // null opponent
  };

  private listener: {
    onmove:        ( candidate: string ) => void,
    onclockover:   ( whitebudget: number, blackbudget: number ) => void,
    onfieldselect: ( e: IEvent ) => void,
    ongameover:    ( msg: { reason: string, whitebudget: number, blackbudget: number} ) => void,
  };

  constructor (playtree: IPlayTree, board: IBoard) {

        this.destroy();

        this.isEvaluating   = false; // scoring moves
        this.isRunning     = false; // scoring moves

        this.playtree       = playtree;
        this.board          = board;
        this.chess          = new CM.Chess();
        this.clock          = ChessClockCell;

        this.newmove        = '';

        this.bestmove       = '';
        this.selectedSquare = '';
        this.selectedPiece  = '';
        this.squareMoves    = []; // all moves from or to selected square
        this.validMoves     = []; // these are all possible moves, for current color

        this.opponents      = {
            'w': new Opponent('w', this.playtree.rivals.w),
            'b': new Opponent('b', this.playtree.rivals.b),
        };
        this.listener = {
            onmove:        this.onmove.bind(this),
            onclockover:   this.onclockover.bind(this),
            onfieldselect: this.onfieldselect.bind(this),
            ongameover:    this.ongameover.bind(this),
        };

        this.ply    = this.playtree.ply;
        this.color  = this.chess.turn();

        this.update();
  }



    public destroy () {
      if (this.opponents){
        this.opponents.w && this.opponents.w.destroy();
        this.opponents.b && this.opponents.b.destroy();
      }
    }

    public updateChess () {

        if (this.ply === -2) {
            this.chess.load(AppConfig.fens.empty);

        } else if (this.ply === -1) {
            this.chess.load(AppConfig.fens.start);

        } else {
            if (this.playtree.over) {
                this.chess.load(this.playtree.moves[this.ply].fen);

            } else {
                this.chess.load_pgn(Tools.Games.pgnFromMoves(this.playtree, this.ply));

            }

        }

    }
    public update () {

        this.ply  = ~~this.playtree.ply;

        this.updateChess();

        // this.color  = this.chess.color();
        this.tomove = (
            this.ply === -2 ? 'n' :
            this.ply  %   2 ? 'w' : 'b'
        );
        this.towait = (
            this.ply === -2 ? 'n' :
            this.ply  %   2 ? 'b' : 'w'
        );

        // forget onfield clicks
        this.selectedSquare = '';
        this.selectedPiece  = '';
        this.squareMoves    = [];
        this.validMoves     = [];

        // actions have no moves, so update here too
        this.updateButtons();

        DEBUG && console.log('BoardController.update.out', {uuid: this.playtree.uuid, turn: this.ply, color: this.color});

    }

    public updateProposer () {

        const conditions  = { depth: 10, maxtime: 1 };
        const optBestmove = DB.Options.first['board-illustrations'].bestmove;

        // this.bestmove = '';
        // this.ponder   = '';

        if (!Proposer.enabled && optBestmove) {
            this.bestmove = '';
            this.ponder   = '';
            Proposer.start();

        } else if (Proposer.enabled && !optBestmove) {
            this.bestmove = '';
            this.ponder   = '';
            Proposer.stop();

        // } else {
        //     console.log('Proposer.nochange');

        }

        Proposer.enabled && Proposer.initialization
            .then( async () => {
                const result = await Proposer.propose(this.chess.fen(), conditions);
                this.bestmove = result.bestmove;
                this.ponder   = result.ponder;
                this.updateArrows();
            })
        ;

    }

    public updateButtons () {

        // button pairs are tri-state (play/pause, evaluate/spinner)
        // null  => .dn
        // false => .disabled
        // true  => .enabled

        const btns     = this.board.buttons;
        const lastTurn = this.playtree.moves.length -1;
        const rivals   = this.playtree.rivals;

        // always possible
        btns.rotate = true;

        // default
        btns.play  = false;
        btns.pause = null;

        // game with timecontrol and not empty board
        // if ( rivals !== 'h-h' && rivals !== 'x-x' && this.ply > -2 ){
        if ( this.ply > -2 ){

            btns.play       = true;
            btns.pause      = null;

            if ( this.clock.isTicking() ) {
                btns.play       = null;
                btns.pause      = true;
            }

        }

        // eval / spinner
        btns.spinner   = this.isEvaluating ? true : null;
        btns.evaluate  = this.isEvaluating ? false : lastTurn > 0 && !this.isRunning;

        // game moves navigation
        btns.backward  = this.ply > 0;
        btns.left      = this.ply > -2;
        btns.right     = this.ply < lastTurn;
        btns.forward   = this.ply < lastTurn;

        DB.Boards.update(this.board.uuid, { buttons: btns }, true);
        //TODO: When is a game terminated?
        DEBUG && console.log('BoardController.updateButtons', 'btn.play', btns.play);
    }

    public ongameover ( msg: { reason: string, whitebudget: number, blackbudget: number } ) {

        console.log('BoardController.ongameover', msg);

        this.playtree.over = true;

        if (msg.reason === 'timeout'){
            // App.redraw();

        } else if (msg.reason === 'rules') {
            // App.redraw();

        }
        // this.opponents[this.tomove].destroy();
        // this.opponents[this.towait].destroy();
        this.destroy();
        this.clock.stop();

    }

    public onclockover (whitebudget: number, blackbudget: number) {
        this.ongameover({ reason: 'timeout', whitebudget, blackbudget});
    }

    // Button Actions
    public play () {

        DEBUG && console.log('BoardController.play.clicked');

        if (this.clock.isPaused()) {
            this.clock.continue();
        } else {
            this.clock.start(this.playtree.timecontrol, this.listener.onclockover);
        }

        ( async () => {
            this.opponents[this.towait]?.pause();
            const move = await this.opponents[this.tomove]?.domove(this.chessBoard);
            this.listener.onmove(move);
        })();

        App.redraw();

    }
    public pause () {
        DEBUG && console.log('BoardController.pause.clicked');
        this.opponents[this.tomove]!.pause();
        this.opponents[this.towait]!.pause();
        this.clock.pause();
        App.redraw();
    }
    public rotate () {
        const orientation = this.board.orientation === 'w' ? 'b' : 'w';
        DB.Boards.update(this.playtree.uuid, { orientation });
        App.redraw();
    }
    // public evaluate () {

    //     this.isEvaluating = true;
    //     evaluate(this.playtree, () => {
    //         this.isEvaluating = false;
    //         App.redraw();
    //     });

    // }

    public interpreteDiff (diff: number | string) {
        const ply = this.playtree.ply;
        return (
            diff === '0' ? 0 :
            diff === 'e' ? this.playtree.moves.length -1 :
            ply === -2 && diff < 0  ? -2 :
            ply === this.playtree.moves.length -1 && diff > 0  ? this.playtree.moves.length -1 :
            ply + parseInt(String(diff), 10)
        );
    }

    public step (diff: number | string) {
        const turn = this.interpreteDiff(diff);
        DB.Games.update(this.playtree.uuid, { turn });
        App.route('/game/:uuid/:ply/', { turn, uuid: this.playtree.uuid }, { replace: true });
    }

    // called from board.onupdate
    public stopListening (chessBoard: IBoard) {
        // chessBoard.disableMoveInput();
        $('div.chessboard')!.removeEventListener('mousedown',  this.listener.onfieldselect);
        $('div.chessboard')!.removeEventListener('touchstart', this.listener.onfieldselect);
    }
    public startListening () {

        // No pieces, no moves either
        if (this.ply === -2){ return; }

        const $chessboard = $('div.chessboard');
        const oppToMove   = this.opponents[this.tomove];
        const oppToWait   = this.opponents[this.towait];

        // if mobile div might not exist yet
        if ($chessboard){
            $('div.chessboard')!.addEventListener('mousedown', this.listener.onfieldselect);
            $('div.chessboard')!.addEventListener('touchdown', this.listener.onfieldselect);
        }

        // updates opps with position/fen
        oppToMove!.update(this);
        oppToWait!.update(this);

        const isExperiment = this.playtree.rivals.b === '*' || this.playtree.rivals.w === '*';

        if (this.clock.isTicking() || isExperiment){
            ( async () => {
                this.opponents[this.towait]!.pause();
                const move = await this.opponents[this.tomove]!.domove(this.chessBoard);
                this.listener.onmove(move);
            })();
        }

        DEBUG && console.log('BoardController.startListening.out', { rivals: this.playtree.rivals, tomove: this.tomove });

    }

    public onfieldselect (e: any) {

        const idx    = e.target.dataset.index;
        const square = Tools.Board.squareIndexToField(idx);

        if (idx) {
            this.selectedSquare = square !== this.selectedSquare ? square : '';
            this.selectedPiece  = this.chessBoard?.getPiece(this.selectedSquare) || '';
            this.updateIllustration();

            DEBUG && console.log('BoardController.onfieldselect.out', {
                square: this.selectedSquare, piece: this.selectedPiece,
            });
        }

    }

    // Opponent sends move
    public onmove ( candidate: string ) {

        const move = this.chess.move(candidate, { sloppy: true });

        if (!move) {
            console.warn('BoardController.onmove.illegal', { candidate, move });
            console.log(this.chess.ascii());
            // eslint-disable-next-line no-debugger
            debugger;

        } else {

            move.fen = this.chess.fen();
            move.ply = this.ply +1;
            let pgn  = this.chess.pgn().trim();

            // if first move of default, create new game + board and reroute to
            if (this.playtree.uuid === 'default'){

                const timestamp = Date.now();
                const uuid = H.hash(String(timestamp));
                const game = H.clone(this.playtree, {
                    uuid, pgn, timestamp,
                    rivals: { b: '*', w: '*' },
                    turn :  0,
                });

                Tools.Games.updateMoves(game);
                DB.Games.create(game, true);
                DB.Boards.create(Object.assign({}, AppConfig.templates.board, { uuid }));
                App.route('/game/:uuid/:ply/', { ply: game.ply, uuid: game.uuid });

            // update move with turn, game with move and reroute to next turn
            } else {

                if (move.ply < this.playtree.moves.length) {
                    // throw away all moves after this new one
                    this.playtree.moves.splice(this.ply +1);
                }

                this.playtree.ply = move.ply;
                this.newmove   = move.san || '';
                this.playtree.moves.push(move as IPlayMove);

                DB.Games.update(this.playtree.uuid, this.playtree, true);
                App.route('/game/:uuid/:ply/', {turn: this.playtree.ply, uuid: this.playtree.uuid}, {replace: true});

            }

        }

        DEBUG && console.log('BoardController.onmove.out', move, candidate);

    }

    // comes with with every redraw, after move was animated
    public onafterupdates (chessBoard: any) {

        this.chessBoard = chessBoard;

        // if clock and move => 'press' clock
        if (this.newmove && this.clock.isTicking()){

            this.color === 'w' && this.clock.whiteclick();
            this.color === 'b' && this.clock.blackclick();
            this.playtree.timecontrol = this.clock.state().timecontrol;

        }

        // mark move as done
        this.newmove  = '';

        //
        // this.bestmove = '';

        this.updateButtons();
        this.updateIllustration();
        this.updateProposer();

        if (!this.playtree.over && this.chess.game_over()) {
            this.ongameover({
                reason        : 'rules',
                whitebudget: NaN,
                blackbudget: NaN,
                // over          : this.chess.game_over(),
                // checkmate     : this.chess.in_checkmate(),
                // draw          : this.chess.in_draw(),
                // stalemate     : this.chess.in_stalemate(),
                // insufficient  : this.chess.insufficient_material(),
                // repetition    : this.chess.in_threefold_repetition(),
            });

        } else {
            this.startListening();

        }


        DEBUG && console.log('BoardController.onafterupdates.out', { color: this.color });

    }

    public updateIllustration () {

        const squareFilter  = (move: any) =>  move.from === this.selectedSquare || move.to === this.selectedSquare;

        this.illustrations  = DB.Options.first['board-illustrations'];
        this.validMoves     = this.chess.moves({verbose: true});
        this.squareMoves    = this.validMoves.filter(squareFilter);

        // DEBUG && console.log('BoardController.updateIllustration', {
        //     square: this.selectedSquare, piece: this.selectedPiece, color: this.color, turn: this.ply, moves: this.squareMoves.length,
        // });

        // chessboard on page w/ dn has height 0
        // if (this.chessBoard && this.chessBoard?.view.height && this.playtree.ply !== -2){
        if (this.chessBoard) {

            // this.chessBoard?.removeArrows( null );

            // keep internal markers (move, emphasize)
            this.chessBoard?.removeMarkers( null, CM.MARKER_TYPE.rectwhite);
            this.chessBoard?.removeMarkers( null, CM.MARKER_TYPE.rectblack);
            this.chessBoard?.removeMarkers( null, CM.MARKER_TYPE.selectedmoves);
            this.chessBoard?.removeMarkers( null, CM.MARKER_TYPE.selectednomoves);

            this.updateArrows();
            this.updateMarker();

        }
    }
    public updateArrows () {

        const illus = this.illustrations;

        // if (arrows.bestmoves){
        //     const bm = state.bestmove.move;
        //     const po = state.bestmove.ponder;
        //     if (bm.from && po.from){
        //         chessBoard.addArrow(po.from, po.to, {class: 'arrow ponder'});
        //         chessBoard.addArrow(bm.from, bm.to, {class: 'arrow bestmove', onclick: function () {
        //             fire('board', 'move', [[arrows.bestmove.move]]);
        //         }});
        //     }
        // }


        if (illus.bestmove && this.bestmove){

            const from = this.bestmove.slice(0, 2);
            const to   = this.bestmove.slice(2, 4);

            this.chessBoard?.removeArrows('arrow bestmove');
            this.chessBoard?.addArrow(from, to, {class: 'arrow bestmove'});

        } else {
            this.chessBoard?.removeArrows('arrow bestmove');
        }

        if (illus.validmoves){
            this.chessBoard?.removeArrows('arrow validmove');
            this.squareMoves.forEach( (move: any) => {
                this.chessBoard?.addArrow(move.from, move.to, {class: 'arrow validmove'});
            });

        } else {
            this.chessBoard?.removeArrows('arrow validmove');

        }

        if (illus.lastmove){
            this.chessBoard?.removeArrows('arrow lastmove white');
            this.chessBoard?.removeArrows('arrow lastmove black');
            const lastmove = this.playtree.moves[this.ply];
            if (lastmove) {
                this.chessBoard?.addArrow(
                    lastmove.from, lastmove.to,
                    { class: lastmove.color === 'w' ? 'arrow lastmove white' : 'arrow lastmove black' },
                );
            }
        } else {
            this.chessBoard?.removeArrows('arrow lastmove white');
            this.chessBoard?.removeArrows('arrow lastmove black');

        }

        if (illus.test){
            this.chessBoard?.addArrow('e2', 'e4', {class: 'arrow test'} );
            this.chessBoard?.addArrow('f2', 'h4', {class: 'arrow test'} );
            this.chessBoard?.addArrow('d2', 'c4', {class: 'arrow test'} );
            this.chessBoard?.addArrow('c2', 'a3', {class: 'arrow test'} );
            this.chessBoard?.addArrow('d7', 'd5', {class: 'arrow test'} );
            this.chessBoard?.addArrow('c7', 'c5', {class: 'arrow test'} );

            this.chessBoard?.addArrow('g7', 'g8', {class: 'arrow test'} );
            this.chessBoard?.addArrow('g7', 'h8', {class: 'arrow test'} );
            this.chessBoard?.addArrow('g7', 'h7', {class: 'arrow test'} );
            this.chessBoard?.addArrow('g7', 'h6', {class: 'arrow test'} );
            this.chessBoard?.addArrow('g7', 'g6', {class: 'arrow test'} );
            this.chessBoard?.addArrow('g7', 'f6', {class: 'arrow test'} );
            this.chessBoard?.addArrow('g7', 'f7', {class: 'arrow test'} );
            this.chessBoard?.addArrow('g7', 'f8', {class: 'arrow test'} );

        } else {
            this.chessBoard?.removeArrows('arrow test');

        }

    }
    public updateMarker () {

        // marker need to be implemented/referenced in
        // Config.board, MARKER_TYPE and cm-chessboard/chessboard-sprite.svg

        const illus = this.illustrations;

        if (illus.heatmap) {
            //
        }

        if (this.selectedSquare){
            if (this.squareMoves.length){
                this.chessBoard?.addMarker(this.selectedSquare, CM.MARKER_TYPE.selectedmoves);
            } else {
                this.chessBoard?.addMarker(this.selectedSquare, CM.MARKER_TYPE.selectednomoves);
            }
        }

        if (illus.attack){
            this.validMoves.forEach( (square: any) => {
                this.chessBoard?.addMarker(square.to, this.color === 'w' ? CM.MARKER_TYPE.rectwhite : CM.MARKER_TYPE.rectblack);
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

//TODO: Class no longer needed
// const Controller = new BoardController();

export { BoardController };
