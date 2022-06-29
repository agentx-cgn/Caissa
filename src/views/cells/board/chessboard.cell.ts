
import m from 'mithril';
import { Chessboard, BORDER_TYPE, COLOR, MARKER_TYPE, INPUT_EVENT_TYPE } from "../../../extern/cm-chessboard/index";
// import './chessboard.cell.scss';

import { ICellComponent } from '@app/domain';

const $ = document.querySelector.bind(document);

const DEBUG = true;

let chessBoard: any;
let $chessBoard: Element;

const listener = () => {

  const $board  = $('cell-board') as HTMLElement;
  const $eval   = $('cell-board-evaluation') as HTMLElement;
  const $chessboard = $('div.chessboard')  as HTMLElement;

  if ($board && $eval && $chessboard) {
    const rect    = $board.getBoundingClientRect();
    $chessboard.style.width  = `${rect.width -24}px`;
    $chessboard.style.height = `${rect.width -24}px`;
    $eval.style.minHeight = `${rect.width -24}px`;
  }

};

interface IChessBoardAttrs {
  game: any;
  board: any;
  controller: any;
}
interface IChessBoardState {
  onafterupdate: ( attrs: IChessBoardAttrs ) => void;
}

const ChessboardCell: ICellComponent<IChessBoardAttrs> & IChessBoardState = {

  // onresize : Tools.Board.resize,

  oncreate ( vnode ) {

    DEBUG && console.log('ChessBoard.oncreate.in');

    window.removeEventListener('resize', listener);
    window.addEventListener('resize', listener);

    const { board } = vnode.attrs;

    $chessBoard = vnode.dom;

    chessBoard = new Chessboard( $('div.chessboard'), {
      position: "start",                   // set as fen, "start" or "empty"
      orientation: COLOR.white,            // white on bottom
      responsive: true,                    // resizes the board based on element size
      animationDuration: 300,              // pieces animation duration in milliseconds. Disable all animation with `0`.
      style: {
        cssClass: "green",                // set the css theme of the board, try "green", "blue" or "chess-club"
        showCoordinates: true,             // show ranks and files
        borderType: BORDER_TYPE.thin,     // "thin" thin border, "frame" wide border with coordinates in it, "none" no border
        aspectRatio: 1,                    // height/width of the board
        moveFromMarker: MARKER_TYPE.frame, // the marker used to mark the start square
        moveToMarker: MARKER_TYPE.frame,   // the marker used to mark the square where the figure is moving to
      },
      sprite: {
        url: "static/chessboard/chessboard-sprite.svg", // pieces and markers are stored in a sprite file
        size: 40,                          // the sprite tiles size, defaults to 40x40px
        cache: true                        // cache the sprite
      },
    });

    chessBoard.enableMoveInput((event: any) => {
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
            console.log(`moveStart: ${event.square}`);
            // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
            return true;
        case INPUT_EVENT_TYPE.moveDone:
            console.log(`moveDone: ${event.squareFrom}-${event.squareTo}`);
            // return true, if input is accepted/valid, `false` takes the move back
            return true;
        case INPUT_EVENT_TYPE.moveCanceled:
            console.log(`moveCanceled`);
            return false; //??
        default:
          return false;
      }
    }, COLOR.white);

      // console.log(chessBoard);
      listener();
      // chessBoard.disableContextInput();
      // chessBoard.setOrientation('w'); //board.orientation);


    //   chessBoard.initialization.then( () => {
    //     //   chessBoard.disableContextInput();
    //     //   Tools.Board.resize(innerWidth, innerHeight);
    //     //   chessBoard.view.handleResize();
    //     //   chessBoard.setOrientation(board.orientation);
    //   });

  },
  view ( vnode ) {

    DEBUG && console.log('ChessBoard.view.in');

    const { game, board, controller } = vnode.attrs;
      return m('div.chessboard',
        m.fragment( {
          oncreate: () => setTimeout(() => ChessboardCell.onafterupdate({ game, board, controller }), 100),
          onupdate: () => setTimeout(() => ChessboardCell.onafterupdate({ game, board, controller }), 100)
      }, [m('div.dn')]),
    );
  },

  onbeforeupdate ( vnode, oldnode ) {
    console.log('ChessBoard.onbeforeupdate.in', vnode, oldnode);
  },
  onupdate ( vnode ) {

    DEBUG && console.log('ChessBoard.onupdate.in', vnode.attrs);

      const { board, controller } = vnode.attrs;

      // controller.stopListening(chessBoard);
      // chessBoard.view.handleResize();
      // chessBoard.setOrientation('w'); //board.orientation);

      DEBUG && console.log('ChessBoard.onupdate.out', !!chessBoard,  !!board, vnode);

  },
  onafterupdate ( attrs ) {

      DEBUG && console.log('ChessBoard.onafterupdate.in', attrs);
      // const { game, board, controller } = attrs;

      chessBoard
          // .setPosition(board.fen, true)
          .setPosition('start', true)
          .then( () => {
              // controller.onafterupdates(chessBoard);
          })
      ;

  },

  onbeforeremove ( vnode ) {

    DEBUG && console.log('ChessBoard.onbeforeremove.in');

    const { controller } = vnode.attrs;
      // const $chessboard = $$('div.chessboard'); // vnode.dom

      // $chessboard.removeEventListener('mousedown', controller.listener.onmousedown);
      // $chessboard.removeEventListener('touchdown', controller.listener.ontouchdown);

      chessBoard.destroy();
      chessBoard = undefined;
      DEBUG && console.log('chessboard.destroyed');

  },

  onremove (  ) {

    DEBUG && console.log('ChessBoard.onremove.in');

  },

};

export { ChessboardCell };
