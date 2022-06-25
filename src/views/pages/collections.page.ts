
import m from 'mithril';

import { IPageAttrs, IParams } from '@app/domain';
import { H, FactoryService, ProviderService }  from '@app/services';
import { YScrollAtom, SectionTitleAtom, FlexListHeaderAtom, FlexListAtom, FlexListProviderAtom } from '@app/atoms';

const CollectionsPage = FactoryService.create<IPageAttrs>('Collections', {

  async onmatch (route: string, params: IParams): Promise<boolean> {

    console.log('CollectionsPage.onmatch', route, params);

    await H.wait(200);

    return Promise.resolve(true);

  },

  view ( vnode) {

    const { options, className, style } = vnode.attrs;

    return m('div.page.collections', { className, style }, [
      m(SectionTitleAtom, options.title ),
      m(FlexListHeaderAtom, `lore ipsum dolor sit amet, consectetur adipiscing elit.` ),
      m(YScrollAtom,
        m(FlexListAtom, [
          ...ProviderService.collections.map( ( collection ) => {
            const provider = ProviderService.createProvider(collection);
            return m(FlexListProviderAtom, { provider });
          })
        ]
        )
      ),
    ]);

  },

});

export { CollectionsPage };
