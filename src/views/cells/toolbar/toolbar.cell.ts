import m from 'mithril';

import './toolbar.cell.scss';

import { ICellComponent } from '@app/domain';

export const ToolbarCell: ICellComponent = {
  view ( vnode ) {

    const { className, style } = vnode.attrs;

    return m('cell-toolbar', { className, style }, 'TOOLBAR');

  },
};
