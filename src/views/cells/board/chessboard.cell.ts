
import m from 'mithril';

// import "node_modules/cm-chessboard/assets/styles/cm-chessboard.css";
// import { Chessboard } from "node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js";
// import { Chessboard } from "cm-chessboard/src/cm-chessboard/Chessboard.js";
// import { CheckBoard } from "../../../extern/cm-chessboard/index";
import { Chessboard } from "../../../extern/cm-chessboard/index";
// import { CheckBoard } from "Chessboard.js";

// import './aside.cell.scss';
import { ICellComponent } from '@app/domain';

const $ = document.querySelector.bind(document);


// const DEBUG = true;

let chessBoard;


const ChessboardCell: ICellComponent = {

  // onresize : Tools.Board.resize,

  oncreate (  ) {

      // const { board } = vnode.attrs;

      chessBoard = new Chessboard( $('div.chessboard'), {
          position: "empty", // set as fen, "start" or "empty"
          // orientation: COLOR.white, // white on bottom
          responsive: true, // resizes the board based on element size
          animationDuration: 300, // pieces animation duration in milliseconds. Disable all animation with `0`.
          style: {
              cssClass: "default", // set the css theme of the board, try "green", "blue" or "chess-club"
              showCoordinates: true, // show ranks and files
              // borderType: BORDER_TYPE.none, // "thin" thin border, "frame" wide border with coordinates in it, "none" no border
              aspectRatio: 1, // height/width of the board
              // moveFromMarker: MARKER_TYPE.frame, // the marker used to mark the start square
              // moveToMarker: MARKER_TYPE.frame, // the marker used to mark the square where the figure is moving to
          },
          sprite: {
              url: "static/chessboard/chessboard-sprite.svg", // pieces and markers are stored in a sprite file
              size: 40, // the sprite tiles size, defaults to 40x40px
              cache: true // cache the sprite
          },
        }
      );

      chessBoard.initialization.then( () => {
        //   chessBoard.disableContextInput();
        //   Tools.Board.resize(innerWidth, innerHeight);
        //   chessBoard.view.handleResize();
        //   chessBoard.setOrientation(board.orientation);
      });

  },
  view (  ) {
      return m('div.chessboard');
  },
  onupdate (  ) {

      // const { board, controller } = vnode.attrs;

      // controller.stopListening(chessBoard);
      // chessBoard.view.handleResize();
      // chessBoard.setOrientation(board.orientation);

      // DEBUG && console.log('ChessBoard.onupdate.out', !!chessBoard,  !!board, vnode);

  },
//   onafterupdates () {

//       // DEBUG && console.log('ChessBoard.onafterupdates.in', vnode);
//       // const { board, controller } = vnode.attrs;

//       // chessBoard
//       //     .setPosition(board.fen, true)
//       //     .then( () => {
//       //         controller.onafterupdates(chessBoard);
//       //     })
//       // ;

//   },

  onbeforeremove (  ) {

      // const { controller } = vnode.attrs;
      // const $chessboard = $$('div.chessboard'); // vnode.dom

      // $chessboard.removeEventListener('mousedown', controller.listener.onmousedown);
      // $chessboard.removeEventListener('touchdown', controller.listener.ontouchdown);

      // return chessBoard.destroy().then( () => {
      //     chessBoard = undefined;
      //     DEBUG && console.log('chessboard.destroyed');
      // });

  },
};

export { ChessboardCell };
