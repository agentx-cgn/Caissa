import m from 'mithril';

import './content.cell.scss';

import { ICellContentComponent } from '@app/domain';
import { SectionTitleAtom } from '@app/atoms';

export const ContentCell: ICellContentComponent = {
  view ( ) {

    return m('cell-content', [
      m(SectionTitleAtom, { title: 'Content', description: 'description' }, 'Content'),
      m('div', 'This is ContentCell'),
      // m(ToolbarCell,      { className: '', style: '' } ),
      // m(ToolbarCell,      { className: '', style: '' } ),
      // m(BoardCell,        { className: '', style: '' } ),
      // m(ToolbarCell,      { className: '', style: '' } ),
      // m(ToolbarCell,      { className: '', style: '' } ),
    ]);

  },

};
