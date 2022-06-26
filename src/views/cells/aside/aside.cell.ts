import m from 'mithril';

import './aside.cell.scss';
import { ICellComponent } from '@app/domain';
import { SectionTitleAtom } from '@app/atoms';

export const AsideCell: ICellComponent = {
  view ( vnode ) {

    const { className, style } = vnode.attrs;

    return m('cell-aside', { className, style }, [
      m(SectionTitleAtom, { className: '', style: '', onclick: ()=> {} }, 'Analyzer'),
      m('engine-output', { className: '', style: 'height: 100%; width: 100%; background-color: yellow'  }, 'Engine output'),
    ]);

  },
};
