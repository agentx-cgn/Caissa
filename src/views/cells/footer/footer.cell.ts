import m from 'mithril';

import './footer.cell.scss';
import { ICellComponent } from '@app/domain';

export const FooterCell: ICellComponent = {
  view ( vnode ) {

    const { className, style } = vnode.attrs;

    return m('cell-footer', { className, style }, 'FOOTER');

  },
};
