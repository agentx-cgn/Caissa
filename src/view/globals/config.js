import board_svg         from './../extern/cm-chessboard/chessboard-sprite.svg';
import {COLOR, MOVE_INPUT_MODE} from './../extern/cm-chessboard/Chessboard';

import pgn01 from './../../assets/games/1992-Fischer-Spassky.pgn';
import pgn02 from './../../assets/games/2020-noiv-BigRed2890.pgn';
import pgn03 from './../../assets/games/2020-playwithmachesst-noiv.pgn';
import pgn04 from './../../assets/games/2020.03.28-Ignazio62-noiv.pgn'; 
import pgn05 from './../../assets/games/2020.03.31-zeyad6-noiv.pgn'; 
import pgn06 from './../../assets/games/2020.04.02-noiv-CarlosHen.pgn'; 
import pgn07 from './../../assets/games/2020.04.03-njoly123-noiv.pgn'; 
import pgn08 from './../../assets/games/2020.04.03-noiv-Revaza_05.pgn'; 

console.log(board_svg);

export default {
    pgns: [pgn01, pgn02, pgn03, pgn04, pgn05, pgn06, pgn07, pgn08],
    games: [
        {value: null, view: 'Select a game...', data:''},
        {value: 0,    view: 'New game...', data: ''},
    ],
    analysis : {
        depth:     3,
        maxpv:     5,
        maxmate:   2,
        multipv:   3,
    },
    board: {
        position:               'start',        // set as fen, 'start' or 'empty'
        orientation:            COLOR.white,    // white on bottom
        style: {
            cssClass:           'gray',         // this is custom => analyzer.scss
            showCoordinates:    true,           // show ranks and files
            showBorder:         true,           // display a border around the board
        },
        sprite: {
            url:                board_svg ,     // pieces and markers are stored es svg in the sprite
            grid:               40,             // the sprite is tiled with one piece every 40px
            markers:            ['marker4', 'marker5'],
        },  
        responsive:             true,           // resizes the board on window resize, if true
        animationDuration:      100,            // pieces animation duration in milliseconds
        moveInputMode:          MOVE_INPUT_MODE.dragPiece, // set to MOVE_INPUT_MODE.dragPiece or MOVE_INPUT_MODE.dragMarker for interactive movement
    },
    fen_start: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    fen_empty: '8/8/8/8/8/8/8/8 w - - 0 1',
    flagTitles : {
        'n'  : 'a non-capture',
        'b'  : 'a pawn push of two squares',
        'e'  : 'an en passant capture',
        'c'  : 'a standard capture',
        'p'  : 'a promotion',
        'k'  : 'kingside castling',
        'q'  : 'queenside castling',
        'pc' : 'capture + promotion',
    },
    flagColorsWhite : {
        'n'  : '#eee',
        'b'  : 'darkred',
        'e'  : 'red',
        'c'  : 'darkred',
        'p'  : 'red',
        'k'  : 'darkgreen',
        'q'  : 'darkgreen',
        'pc' : 'orange',
    },
    flagColorsBlack : {
        'n'  : '#333',
        'b'  : 'darkred',
        'e'  : 'red',
        'c'  : 'darkred',
        'p'  : 'red',
        'k'  : 'darkgreen',
        'q'  : 'darkgreen',
        'pc' : 'orange',
    },

    fontPieces : {
        'wk': '♔',
        'wq': '♕',
        'wr': '♖',
        'wb': '♗',
        'wn': '♘',
        'wp': '♙',

        'bk': '♚',
        'bq': '♛',
        'br': '♜',
        'bb': '♝',
        'bn': '♞',
        'bp': '♟',
    },

};
