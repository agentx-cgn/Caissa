import m from 'mithril';

import './content.cell.scss';

import { ToolbarCell } from '../toolbar/toolbar.cell';
import { ChessboardCell } from '../board/board.cell';
import { ICellComponent } from '@app/domain';
import { SectionTitleAtom } from '@app/atoms';

export const ContentCell: ICellComponent = {
  view ( ) {

    return m('cell-content', [
      m(SectionTitleAtom, { title: 'Content', description: 'description' }, 'Content'),
      m(ToolbarCell,      { className: '', style: '' } ),
      m(ToolbarCell,      { className: '', style: '' } ),
      m(ChessboardCell,   { className: '', style: '' } ),
      m(ToolbarCell,      { className: '', style: '' } ),
      m(ToolbarCell,      { className: '', style: '' } ),
    ]);

  },

};
