
import m from 'mithril';

import { IPageAttrs } from '@app/domain';
import { CollectionsConfig } from '@app/config';
import { FactoryService }  from '@app/services';
import { YScrollAtom, SectionTitleAtom, FlexListHeaderAtom, FlexListAtom, FlexListCollectionAtom } from '@app/atoms';

const CollectionsPage = FactoryService.create<IPageAttrs>('Collections', {

  view ( vnode) {

    const { options, className, style } = vnode.attrs;

    return m('div.page.collections', { className, style }, [
      m(SectionTitleAtom, options.title ),
      m(FlexListHeaderAtom, `lore ipsum dolor sit amet, consectetur adipiscing elit.` ),
      m(YScrollAtom,
        m(FlexListAtom, [
          ...CollectionsConfig.map( ( collection ) => {
            return m(FlexListCollectionAtom, { collection });
          })
        ]
        )
      ),
    ]);

  },

});

export { CollectionsPage };
