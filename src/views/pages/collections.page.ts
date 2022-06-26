
import m from 'mithril';

import { FactoryService, ProviderService }  from '@app/services';
import { YScrollAtom, SectionTitleAtom, FlexListHeaderAtom, FlexListAtom } from '@app/atoms';
import { FlexListProviderCell } from '@app/cells';

const CollectionsPage = FactoryService.create('Collections', {

  // async onmatch (route: string, params: IParams, data: IPageData): Promise<boolean> {

  //   console.log('CollectionsPage.onmatch', route, params);

  //   await H.wait(200);

  //   return Promise.resolve(true);

  // },

  view ( vnode) {

    const { options, className, style } = vnode.attrs;

    return m('div.page.collections', { className, style }, [
      m(SectionTitleAtom, options.title ),
      m(FlexListHeaderAtom, `lore ipsum dolor sit amet, consectetur adipiscing elit.` ),
      m(YScrollAtom,
        m(FlexListAtom, [
          ...ProviderService.collections.map( ( collection ) => {
            const provider = ProviderService.createProvider(collection);
            return m(FlexListProviderCell, { className: '', style: '', provider });
          })
        ]
        )
      ),
    ]);

  },

});

export { CollectionsPage };
