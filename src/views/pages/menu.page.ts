import m from 'mithril';
import './menu.page.scss';

import { MenuConfig, TMenuEntry } from '@app/config';
import { App } from '@app/views';
import { IEvent, IPageAttrs, IParams } from '@app/domain';
import { FactoryService } from '@app/services';
import { SectionTitleAtom, SpacerAtom, FlexListAtom, TextLeftAtom, FlexListMenuEntryAtom, NothingAtom} from '@app/atoms';

const onclick  = (route: string, params: IParams) => {
  return route !== 'BACK'
    ? (e: IEvent) => {
      e.redraw = false;
      App.route(route, params);
    }
    : App.onback
  ;
};

const createMenuEntry = ( [route, label, params, extras]: TMenuEntry) => {
  return m(FlexListMenuEntryAtom, { onclick: onclick(route, params) }, [
    m(TextLeftAtom, [
      extras.img
        ? m('img.menu', { src: extras.img, width: 22, height: 22 })
        : m('i.menu.fa.' + extras.ifa)
      ,
      label,
      m('div.menu.subline', extras.subline),
    ]),
  ]);
};

const MenuPage = FactoryService.create<IPageAttrs>('Menu', {

  view ( vnode ) {

    const { route, options, className, style } = vnode.attrs;

    const pageTitle = options.title;
    const menuList  = MenuConfig[route];

    return m('div.page.menu', { className, style },
      m(SectionTitleAtom, pageTitle),
      m(SpacerAtom),
      m(FlexListAtom, [
        ...menuList.map( ( menuEntry: TMenuEntry ) => {
          return createMenuEntry(menuEntry);
        }),
        route !== '/start/'
          ? createMenuEntry(['BACK', '', {}, {}] as TMenuEntry)
          : m(NothingAtom)
      ]),
    );

  },

});

export { MenuPage };
