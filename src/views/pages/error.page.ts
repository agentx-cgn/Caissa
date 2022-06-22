
import m from 'mithril';

import { FactoryService }  from '@app/services';
import { SpacerAtom, GrowSpacerAtom, SectionTitleAtom, FlexListTextCenterAtom, FlexListAtom } from '@app/atoms';
import { IPageAttrs } from '@app/domain';

const ErrorPage = FactoryService.create<IPageAttrs>('Error', {

  view ( vnode) {

    return m('div.page.error', vnode.attrs, [
      m(SectionTitleAtom,  'Error' ),
      m(FlexListAtom, [
        m(SpacerAtom),
        m(FlexListTextCenterAtom,    JSON.stringify(vnode.attrs) ),
        m(GrowSpacerAtom),
      ]),
    ]);

  },

});

export { ErrorPage };
