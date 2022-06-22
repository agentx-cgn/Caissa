import m from 'mithril';

import { IDefComponent, IEvent,  IPage,  IPageAttrs,  IParams, IRouteOptions, TRouteConfig  } from '@app/domain';
import { AppConfig, OptionsConfig as Options} from '@app/config';
import { RoutesConfig } from '../config/routes.config';

import { H, $,
  SystemService as System,
  DatabaseService as DB,
  LoggerService as Logger,
  EventsService,
  HistoryService,
} from '@app/services';

const DEBUG = false;

let redraws = 0; // that's a counter

// available in console as window.Caissa
const App = {

    // available for debugging
    // H, DB, ECOS, System,
    H, DB, System,

    Env: '',

    reset () {
      DB.reset();
      App.route('/menu/');
      location.reload();
    },

    //
    dumpDB () {
      const dump = JSON.stringify({
          DB:      DB.all(),
          SYSTEM:  System,
          CONFIG:  AppConfig,
          OPTIONS: Options,
      }, null, 2).replace(/\\"/g, '\'');

      const body = document.body;
      body.style.whiteSpace   = 'pre';
      body.style.background   = 'white';
      body.style.overflow     = 'auto';
      body.style.color        = 'black';
      body.style.fontFamily   = 'monospace';
      document.body.innerText = dump;
  },

    // signal from index.js
    start (env: string | undefined) {

        // App.Env = env[0].toUpperCase() + env.substring(1);

        Logger.log('caissa', 'onafterImport');
        // DEBUG && console.log('Info   :', env, 'loaded imports after', Date.now() - window.t0, 'msecs');

        EventsService.listen();
    },

    //from loader screen, //TODO: needed here?
    // closeLoader () {
        // document.body.removeChild($('loader-container'));
    // },

    // onComponentCreated : function (comp) {
    //     offset += 16;
    //     setTimeout( function () {
    //         const $msgs = $$('loader-screen .messages');
    //         $msgs.innerHTML += '<br>' + comp.name;
    //     }, offset);
    // },

    // == window.onload
    onload () {

        Logger.log('caissa', 'onload');

        const t = Date.now() - window.t0;

        t > 2000
            ? console.warn('Warn   :', '... done after', t, 'msecs', '\n')
            : console.log ('Info   :', '... done after', t, 'msecs', '\n')
        ;

        // take over error handling
        window.onerror = function (...args) {
            const [message, source, lineno, colno, error] = args;
            if ((message as string).includes('Uncaught')) return;
            console.warn('Error :', arguments);
        };
        window.onunhandledrejection = function (e) {
            e.preventDefault();
            console.warn('Error :', e.type, e.reason, e);
        };

        EventsService.listen();

        console.log(' ');

    },

    redraw (e:IEvent|undefined=undefined) {
        DEBUG && console.log(' ');
        e && (e.redraw = false);
        HistoryService.prepare('',  {}, {redraw: true});
        m.redraw();
    },

    // wrapper for m.route.set
    route ( route: string, params: IParams={}, options: IRouteOptions={replace:false} ) {

        DEBUG && console.log(' ');
        DEBUG && console.log('%App.route.in %s %s %s', 'color:darkred; font-weight: 800', route, H.shrink(params), H.shrink(options) );

        const cfgRoute = RoutesConfig[route];

        if (cfgRoute) {
            HistoryService.prepare(route, params, options);
            m.route.set(route, params, { title: cfgRoute[3].title, ...options });

        } else {
            console.error('caissa.route.error', route, params, options);

        }

    },

  resolver (route: string, routeConfig: TRouteConfig): m.RouteResolver {

    const routePage = routeConfig[1];

    return {
      onmatch ( params: IParams ) {

        try {

          if (DEBUG) {
            redraws && console.log(' ');
            const target  = m.buildPathname(route, params);
            const current = HistoryService.isCurrent(target) ? 'current' : 'new';
            console.log('%App.onmatch.in %s %s ', 'color:darkblue; font-weight: 800', target, current);
          }

          HistoryService.prepare(route, params);

        } catch (e) {console.log(JSON.stringify(e), e);}

      },
      render ( vnode ) {

        if (DEBUG){
          const target  = m.buildPathname(route, vnode.attrs);
          const current = HistoryService.isCurrent(target) ? 'current' : 'new';
          const style   = 'color:darkorange; font-weight: 800';
          console.log('%App.render.in %s %s', style, target, current);
        }

        HistoryService.finalize(route, vnode.attrs, routePage);

        return m(App.comp, { route, params: vnode.attrs });
      },
    };

  },

  comp : {

    view ( vnode ) {

      const { route, params } = vnode.attrs;
      const [ layout, page, center, pageOptions ] = RoutesConfig[route];

      if ( DEBUG ) {
        const target = m.buildPathname(route, params);
        const style  = 'color:darkgreen; font-weight: 800';
        console.log('%App.view.in %s %s', style, target, HistoryService.animation);
      }

      //TODO: this is actually dynamic
      document.title = pageOptions.title;

      return m(layout, { route, params, page, center } );

    },

  } as IDefComponent,

};

export { App };
