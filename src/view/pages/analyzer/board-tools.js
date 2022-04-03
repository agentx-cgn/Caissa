
import Chess    from  'chess.js';
import {MARKER_TYPE} from '../../extern/cm-chessboard/Chessboard';

export default {

    isValid (chess, move) {
        const chess1 = new Chess();
        chess1.load(chess.fen());
        const result = chess1.move(move);
        return result ? chess1.fen() : '';
    },

    updateMarker (chess, chessBoard, marker) {

        const validSquares = chess.moves({verbose: true});
        const markerType = chess.turn() === 'w' ? MARKER_TYPE.rectwhite : MARKER_TYPE.rectblack;
    
        chessBoard.removeMarkers( null, null);
    
        if (marker.attack){
            validSquares.forEach( square => {
                chessBoard.addMarker(square.to, markerType);
            });
        }

    },

    updateArrows (chess, chessBoard, state) {

        // const validSquares = chess.moves({verbose: true});
        
        const lasts = chess.history({verbose: true}).slice(-2);

        chessBoard.removeArrows( null);

        if (state.arrows.bestmove){
            const bm = state.bestmove.move;
            const po = state.bestmove.ponder;
            if (bm.from && po.from){
                chessBoard.addArrow(bm.from, bm.to, {class: 'bestmove'});
                chessBoard.addArrow(po.from, po.to, {class: 'ponder'});
            }
        }
    
        if (state.arrows.pinned){
            chessBoard.addArrow('c1', 'c8', {class: 'pinned'});
        }
    
        if (state.arrows.last){
            lasts.forEach( m => {
                chessBoard.addArrow(m.from, m.to, {class: m.color === 'w' ? 'last-white' : 'last-black'});
            });
        }

        if (state.arrows.test){
            chessBoard.addArrow('e2', 'e4', {class: 'test'} );
            chessBoard.addArrow('f2', 'h4', {class: 'test'} );
            chessBoard.addArrow('d2', 'c4', {class: 'test'} );
            chessBoard.addArrow('c2', 'a3', {class: 'test'} );
            chessBoard.addArrow('d7', 'd5', {class: 'test'} );
            chessBoard.addArrow('c7', 'c5', {class: 'test'} );

            chessBoard.addArrow('g7', 'g8', {class: 'test'} );
            chessBoard.addArrow('g7', 'h8', {class: 'test'} );
            chessBoard.addArrow('g7', 'h7', {class: 'test'} );
            chessBoard.addArrow('g7', 'h6', {class: 'test'} );
            chessBoard.addArrow('g7', 'g6', {class: 'test'} );
            chessBoard.addArrow('g7', 'f6', {class: 'test'} );
            chessBoard.addArrow('g7', 'f7', {class: 'test'} );
            chessBoard.addArrow('g7', 'f8', {class: 'test'} );

            // chessBoard.addArrow('f2', 'g4', ARROW_TYPE.test);
            // validSquares.forEach( square => {
            //     chessBoard.addArrow(square.from, square.to, arrowType);
            // });
        }

    },

    // full list of moves in current game
    fullHistory (chess) {

        const chess1 = new Chess();

        return chess.history({verbose: true}).map(move => {
            chess1.move(move);
            move.fen = chess1.fen();
            return move;
        });

    },

    // return game state as colors and boolean
    flags (chess) {
        return {
            turn:                    chess.turn(),
            game_over:               chess.game_over(),
            in_check:                chess.in_check(),
            check_mate:              chess.in_checkmate(),
            in_draw:                 chess.in_draw(),
            in_stalemate:            chess.in_stalemate(),
            insufficient_material:   chess.insufficient_material(),
            in_threefold_repetition: chess.in_threefold_repetition(),
        };
    },
    
};
