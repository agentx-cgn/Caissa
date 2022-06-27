import m from 'mithril';
import './board.cell.scss';

import { ICellComponent } from '@app/domain';
import { ChessboardCell } from './chessboard.cell';

export const BoardCell: ICellComponent = {

  view ( vnode ) {

    const { className } = vnode.attrs;

    return  m('cell-board', [
      m('cell-board-sizer'),
      m('cell-board-evaluation', { className }, 'E'),
      m('cell-board-container', { className },
        m(ChessboardCell),
      ),
    ]);

  }

};
