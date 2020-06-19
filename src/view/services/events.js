import { H }   from './helper';
import DB      from './database';
import Caissa  from '../caissa';
import System  from '../data/state';
import History from '../services/history';
import Factory from '../components/factory';
import Logger  from '../services/logger';

// https://developer.mozilla.org/en-US/docs/Web/Events

const DEBUG = false;

let deferredPrompt;
let lastWidth = 0;
let lastOrientation;

const Events = {

    listen () {
        window.addEventListener('load',                  Caissa.onload);
        window.addEventListener('beforeunload',          Events.onbeforeunload);
        window.addEventListener('online',                Events.ononline);
        window.addEventListener('offline',               Events.onoffline);
        window.addEventListener('resize',                Events.onresize);
        window.addEventListener('popstate',              History.onpopstate);
        window.addEventListener('hashchange',            History.onhashchange);
        window.addEventListener('deviceorientation',     Events.ondeviceorientation);
        document.addEventListener('beforeinstallprompt', Events.onbeforeinstallprompt);
        document.addEventListener('selectionchange',     Events.onselectionchange);
        document.addEventListener('dblclick',            H.eat);
        // ScreenOrientation.addEventListener('change',     Events.onscreenchange);
    },

    // ondeviceorientation (e) {
    //     // alpha, beta, gamma
    // },
    // onscreenchange (e) {
    //     DEBUG && console.log('onscreenchange', e);
    //     // Caissa.redraw();
    // },
    onresize () {

        const orientation = innerWidth > innerHeight ? 'landscape' : 'portrait';
        const needsRedraw = (
            (lastWidth <= 360 && innerWidth  > 360) ||
            (lastWidth  > 360 && innerWidth <= 360) ||
            (lastWidth  > 720 && innerWidth <= 720) ||
            (lastWidth <= 720 && innerWidth  > 720) ||
            lastOrientation !== orientation
        );
        Factory.onresize();
        needsRedraw && Caissa.redraw();

        lastWidth       = innerWidth;
        lastOrientation = orientation;

    },
    onbeforeinstallprompt (e) {

        DEBUG && console.log('onbeforeinstallprompt');
        Logger.log('events', 'onbeforeinstallprompt');

        const addBtn = document.querySelector('.a2hs-button');
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        addBtn.style.display = 'block';

        addBtn.addEventListener('click', () => {
            // hide our user interface that shows our A2HS button
            addBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    DEBUG && console.log('User accepted the A2HS prompt');
                } else {

                    DEBUG && console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });

    },
    // onpagehide () {
    //     // https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
    //     // never seen
    //     // console.log('Events.onpagehide', e.persisted, e);
    // },
    // onpageshow () {
    //     // happens long after reload
    //     // console.log('events.onpageshow', e.persisted, e);
    // },
    ononline () {
        DEBUG && console.log('ononline');
        System.online = true;
    },
    onoffline () {
        DEBUG && console.log('onoffline');
        System.online = false;
    },
    onbeforeunload () {
        DB.Usage.update('0', {lastend: Date.now()}, true);
        console.log('Bye...');
    },
    onselectionchange () {
        DEBUG && console.log('Selection', document.getSelection().toString());
    },
    onpopstate () {
        DEBUG && console.log('onpopstate');
    },
    hashchange (e) {
        DEBUG && console.log('hashchange', e.oldURL);
        DEBUG && console.log('hashchange', e.newURL);
    },
};

export { Events as default };
