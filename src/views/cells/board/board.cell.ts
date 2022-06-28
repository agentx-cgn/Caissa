import m from 'mithril';
import './board.cell.scss';

import { ICellContentComponent } from '@app/domain';
import { ChessboardCell } from './chessboard.cell';
import { SectionTitleAtom } from '@app/atoms';
import { ToolbarCell } from '../toolbar/toolbar.cell';

export const BoardCell: ICellContentComponent = {

  view ( vnode ) {

    const { route, params, options } = vnode.attrs;

    return m('cell-content-board', [
      m(SectionTitleAtom, { title: 'Content', description: 'description' }, 'Content'),
      m(ToolbarCell,      { className: '', style: '' } ),
      m(ToolbarCell,      { className: '', style: '' } ),
      m('cell-board', { route, params, options }, [
        m('cell-board-sizer'),
        m('cell-board-evaluation', { className: '' }, 'E'),
        m('cell-board-container', { className: '' },
          m(ChessboardCell),
        ),
      ]),
      m(ToolbarCell,      { className: '', style: '' } ),
      m(ToolbarCell,      { className: '', style: '' } ),
    ]);

    // m(ToolbarCell,      { className: '', style: '' } ),
    // m(ToolbarCell,      { className: '', style: '' } ),
    // m(BoardCell,        { className: '', style: '' } ),
    // m(ToolbarCell,      { className: '', style: '' } ),
    // m(ToolbarCell,      { className: '', style: '' } ),

    // return  m('cell-board', [
    //   m('cell-board-sizer'),
    //   m('cell-board-evaluation', { className }, 'E'),
    //   m('cell-board-container', { className },
    //     m(ChessboardCell),
    //   ),
    // ]);

  }

};
