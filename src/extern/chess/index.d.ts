
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/chess.js/index.d.ts
// https://stackoverflow.com/questions/30357634/how-do-i-use-namespaces-with-typescript-external-modules

declare module "CMGChess" {

  import { Pgn as _pgn } from '../cm-pgn/index';

  import { Chess as _chess } from '../cm-chess/index';
  import {
    ChessBoard as _chessboard,
    BORDER_TYPE as _border_type,
    COLOR as _color,
    INPUT_EVENT_TYPE as _input_event_type,
    SQUARE_SELECT_TYPE as _square_select_type,
    MARKER_TYPE as  _marker_type,
    PIECE as _piece,
  } from '../cm-chessboard/index';


  export { CM };

  namespace CM {

    export const BORDER_TYPE = _border_type;
    export const COLOR = _color;
    export const INPUT_EVENT_TYPE = _input_event_type;
    export const SQUARE_SELECT_TYPE = _square_select_type;
    export const MARKER_TYPE = _marker_type;
    export const PIECE = _piece;

    export interface IMove  {
      ply?: number;
      fen?: string;
      san?: string;
    };

    export interface IChess {
      new(fen?: string): IChess;
      load(pgn: any): void;
      turn(): string;
      move(move: string, props: any): IMove | null;
      load_pgn(pgn: string): void;
      fen(): string;
      ascii(): string
      pgn(): string;
      game_over(): boolean;
      moves(props: any): string[];
    };

    export const Chess: IChess = _chess;

    export class ChessBoard extends _chessboard {
      constructor(context, props){
        super(context, props);
      }
      removeMarkers(){
        // super.removeMarkers();
      }
      removeMarker(marker: Marker){
        // super.removeMarker(marker);
      }
    }

    export const Chessboard = _chessboard;

    export interface IChessboard {
      removeMarkers: (square: Square | null, type: MARKER_TYPE) => void,
      removeMarker: (square: Square) => void,
      removeArrows: (className: string) => void,
      addMarker: (square: any, type: MARKER_TYPE) => void,
      addArrow: (from: string, to: string, props: any) => void,
      getPiece: (square: Square) => Piece | null,
    }

  }

}
