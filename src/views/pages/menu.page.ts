import m from 'mithril';
import './menu.page.scss';

import { MenuConfig, TMenuEntry } from '@app/config';
import { App } from '@app/views';
import { IEvent, IPageAttrs, IParams } from '@app/domain';
import { FactoryService } from '@app/services';
import { SectionTitleAtom, SpacerAtom, FlexListAtom, TextLeftAtom, FlexListMenuEntryAtom} from '@app/atoms';

const onclick  = (route: string, params: IParams) => {
  return (e: IEvent) => {
    e.redraw = false;
    App.route(route, params);
  };
};

const MenuPage = FactoryService.create<IPageAttrs>('Menu', {

  view ( vnode ) {

    const { className, style } = vnode.attrs;

    //TODO: only show 'Game', if at least one exists in DB

    return m('div.page.menu', { className, style },
      m(SectionTitleAtom, 'Menu'),
      m(SpacerAtom),
      m(FlexListAtom, MenuConfig
        .map( ( [route, entry, params, extras]: TMenuEntry ) => {
          return m(FlexListMenuEntryAtom, { onclick: onclick(route, params) }, [
            m(TextLeftAtom, [
              extras.img
                  ? m('img.menu', { src: extras.img, width: 22, height: 22 })
                  : m('i.menu.fa.' + extras.ifa)
              ,
              entry,
              m('div.menu.subline', extras.subline),
            ]),
          ]);
        }),
      ),
    );

  },

});

export { MenuPage };
