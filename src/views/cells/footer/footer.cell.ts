import m from 'mithril';

import './footer.cell.scss';
import { IDefCellComponent } from '@app/domain';

export const FooterCell: IDefCellComponent = {
  view ( vnode ) {

    const { className, style } = vnode.attrs;

    return m('cell-footer', { className, style }, 'FOOTER');

  },
};
