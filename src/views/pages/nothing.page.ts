import m from 'mithril';

import { FactoryService } from '@app/services';

const NothingPage = FactoryService.create('Nothing', {

  view ( vnode ) {

    const { className } = vnode.attrs;

    return m('div.page.nothing', { className },
    );

  },

});

export { NothingPage };
