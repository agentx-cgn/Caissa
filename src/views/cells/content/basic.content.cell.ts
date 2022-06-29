import m from 'mithril';

import './basic.content.cell.scss';

import { ICellContentComponent } from '@app/domain';
import { SectionTitleAtom } from '@app/atoms';

export const ContentCellBasic: ICellContentComponent = {
  view ( ) {

    return m('cell-content-basic', [
      m(SectionTitleAtom, { title: 'Content', description: 'description' }, 'Content'),
      m('div', 'This is ContentCellBasic'),
      // m(ToolbarCell,      { className: '', style: '' } ),
      // m(ToolbarCell,      { className: '', style: '' } ),
      // m(ContentCellBoard,        { className: '', style: '' } ),
      // m(ToolbarCell,      { className: '', style: '' } ),
      // m(ToolbarCell,      { className: '', style: '' } ),
    ]);

  },

};
