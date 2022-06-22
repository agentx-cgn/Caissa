import m from 'mithril';

import { FactoryService } from '@app/services';
import { IPageAttrs } from '@app/domain';
import { SectionTitleAtom, SpacerAtom } from '@app/atoms';

const NothingPage = FactoryService.create<IPageAttrs>('Nothing', {

  view ( vnode ) {

    const { className } = vnode.attrs;

    return m('div.page.nothing', { className },
      m(SectionTitleAtom, 'Nothing'),
      m(SpacerAtom),
    );

  },

});

export { NothingPage };
