import m from 'mithril';

import 'tachyons/css/tachyons.min.css';
import './app.scss';

import { H } from './services/helper.service';
import { App } from './views/app';
import { RoutesConfig, DefaultRoute } from './config/routes.config';

const DEBUG = false;

try {

    const $root = document.body.querySelector('app-root');
    const Routes: m.RouteDefs = H.transform(RoutesConfig, App.resolver);

    // setup routes + strategy and wire up mithril app to DOM
    m.route.prefix = '#!';
    m.route($root!, DefaultRoute, Routes);

    // make App available in console
    window.App    = App;
    window.onload = App.onload;


} catch (e) {
    console.error('index.js', e);

}

DEBUG && console.log('Info   :', 'index.js loaded after', Date.now() - window.t0, 'msecs');
