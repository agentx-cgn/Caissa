import m from 'mithril';

import { IDefComponent, IEvent } from '@app/domain';
import { App } from '@app/views';

// const $ = document.querySelector.bind(document);

const NavigationCell: IDefComponent =  {

  view ( ) {

    // const { route } = vnode.attrs;

    // // const navi     = PagesConfig[route].navi;
    // const clicker  = (route: string, params: IParams ) => {
    //   return (e: IEvent) => {
    //     e.redraw = false;
    //     ($('#toggle-mobile-menu') as HTMLInputElement).checked = false;
    //     App.route(route, params);
    //     // return H.eat(e);
    //     return false;
    //   };
    // };

    const onmenu = (e: IEvent) => {
      e.redraw = false;
      App.route('/start/');
    };

      return m('nav', [

        // hamburger
        // m('label', {for:'toggle-mobile-menu', 'aria-label':'Menu'},
        m('label', {'aria-label':'Menu', onclick: onmenu},
          m('i.hamburger.fa.fa-bars '),
          m('h1.home.f4.fiom.white.pl3.di', 'Caissa'),
        ),

        // toggle, needs id for label
        // m('input[type=checkbox]', {id: 'toggle-mobile-menu', oninput: (e: IEvent) => {
        //   e.redraw = false;
        //   if ((e.target as HTMLInputElement).checked) {
        //     BackdropCell.show( () => {
        //       ($('#toggle-mobile-menu') as HTMLInputElement).checked = false;
        //     });
        //   }
        // }}),

          // m('ul', Array.from(MenuConfig[route]).map( ([route, entry, params]) => {
          //   return m('li', {
          //     onclick: clicker(route, params),
          //     class: route.startsWith('navi') ? 'selected' : 'unselected'}, entry)
          //   ;
          // })),
              // m('li.unselected', m('a.link', {target:'_blank', href: 'https://github.com/agentx-cgn/caissa'}, 'SOURCE')),
              // m('li.unselected', m('a.link', {target:'_blank', href: 'https://caissa.js.org/'}, 'LIVE')),

          // ]),

      ]);
  },

};

export { NavigationCell };
