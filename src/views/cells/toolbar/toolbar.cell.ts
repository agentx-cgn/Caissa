import m from 'mithril';

import './toolbar.cell.scss';

import { IDefCellComponent, IDefComponent } from '@app/domain';

export const ToolbarCell: IDefCellComponent = {
  view ( vnode ) {

    const { className, style } = vnode.attrs;

    return m('cell-toolbar', { className, style }, 'TOOLBAR');

  },
};
