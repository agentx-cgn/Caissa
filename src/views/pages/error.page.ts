
import m from 'mithril';

import { FactoryService }  from '@app/services';
import { SpacerAtom, GrowSpacerAtom, SectionTitleAtom, FlexListTextCenterAtom, FlexListAtom, FlexListTextAtom } from '@app/atoms';

const ErrorPage = FactoryService.create('Error', {

  view ( vnode) {

    const { route } = vnode.attrs;

    return m('div.page.error', vnode.attrs, [
      m(SectionTitleAtom,  'Error' ),
      m(FlexListAtom, [
        m(SpacerAtom),
        m(FlexListTextAtom, `Route: ${route}` ),
        m(FlexListTextCenterAtom,    JSON.stringify(vnode.attrs) ),
        m(GrowSpacerAtom),
      ]),
    ]);

  },

});

export { ErrorPage };
