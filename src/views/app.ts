import m from 'mithril';

import { IDefComponent, IEvent, IParams, IRouteOptions, TPageOptions, TRouteConfig  } from '@app/domain';
import { AppConfig, OptionsConfig as Options} from '@app/config';

import { RoutesConfig } from './routes';

import { H,
  SystemService as System,
  DatabaseService as DB,
  LoggerService as Logger,
  EventsService,
  HistoryService,
} from '@app/services';

const DEBUG = true;

let redraws = 0; // that's a counter

// available in console as window.Caissa
const App = {

  // available for debugging
  // H, DB, ECOS, System,
  H, DB, System,

  Env: '',

  onback: HistoryService.onback,
  onfore: HistoryService.onfore,
  canBack: HistoryService.canBack,
  canFore: HistoryService.canFore,

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
  start (env: string | undefined) {

    // App.Env = env[0].toUpperCase() + env.substring(1);

    Logger.log('caissa', 'onafterImport');
    // DEBUG && console.log('Info   :', env, 'loaded imports after', Date.now() - window.t0, 'msecs');

    EventsService.listen();
  },

  // == window.onload
  onload () {

    Logger.log('caissa', 'onload');

    const t = Date.now() - window.t0;

    t > 2000
      ? console.warn('Warn   :', '... loaded after', t, 'msecs', '\n')
      : console.log ('Info   :', '... loaded after', t, 'msecs', '\n')
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
    HistoryService.prepare('',  {}, {} as TPageOptions, {redraw: true});
    m.redraw();
  },

  // wrapper for m.route.set
  route ( route: string, params: IParams={}, routeOptions: IRouteOptions={replace:false} ) {

    DEBUG && console.log(' ');
    DEBUG && console.log('%cApp.route.in %s %s %s', 'color:darkred; font-weight: 800', route, H.shrink(params), H.shrink(routeOptions) );

    const cfgRoute = RoutesConfig[route];

    if (cfgRoute) {
      HistoryService.prepare(route, params, {} as TPageOptions, routeOptions);
      m.route.set(route, params, routeOptions);

    } else {
      console.warn('caissa.route.error', route, params, routeOptions);
      m.route.set('/404/', {}, { ...routeOptions});

    }

  },

  resolver (route: string, routeConfig: TRouteConfig): m.RouteResolver {

    const [ layout, page, center, options ] = routeConfig;

    return {
      onmatch ( params: IParams ) {

        try {

          if (DEBUG) {
            redraws && console.log(' ');
            const target  = m.buildPathname(route, params);
            const current = HistoryService.isCurrent(target) ? 'current' : 'new';
            console.log('%cApp.onmatch.in %s %s ', 'color:darkblue; font-weight: 800', target, current);
          }

          HistoryService.prepare(route, params, options);

        } catch (e) {console.log(JSON.stringify(e), e);}

      },
      render ( vnode ) {

        if (DEBUG){
          const target  = m.buildPathname(route, vnode.attrs);
          const current = HistoryService.isCurrent(target) ? 'current' : 'new';
          const style   = 'color:darkorange; font-weight: 800';
          console.log('%cApp.render.in %s %s', style, target, current);
        }

        HistoryService.finalize(route, vnode.attrs, options, page);

        return m(App.comp, { route, params: vnode.attrs, options });
      },
    };

  },

  comp : {

    view ( vnode ) {

      const { route, params, options } = vnode.attrs;
      const [ layout, page, center ] = RoutesConfig[route];

      if ( DEBUG ) {
        const target = m.buildPathname(route, params);
        const style  = 'color:darkgreen; font-weight: 800';
        console.log('%cApp.view.in %s %s', style, target, HistoryService.animation);
      }

      //TODO: this is actually dynamic
      document.title = options.title;

      return m(layout, { route, params, options, page, center } );

    },

  } as IDefComponent,

};

export { App };
