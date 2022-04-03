/*

https://sagegerard.com/mithril-router-cleanup.html
    Rejecting the promise makes Mithril fall back to the default route. 
    State via import in any module od pass down as attrs.

*/ 

import System       from  './globals/system';

import Analyzer        from './pages/analyzer/analyzer';
import Splash          from './components/splash/splash';
import Start           from './pages/start';
import Logs            from './pages/logs/logs';
import Options         from './pages/options/options';

// report x64, wasm
System.log();

let counter_splash = 0;

function loadSpinner() {
    let $splashDiv = document.getElementById('splash');
    if (!$splashDiv) {
        $splashDiv = document.createElement('div');
        $splashDiv.setAttribute('id', 'splash');
        const $root = document.body.querySelector('#root');
        $root.appendChild($splashDiv);
    }
    m.render($splashDiv, m(Splash));
}
function hideSpinner() {
    let $splashDiv = document.getElementById('splash');
    if ($splashDiv) {
        m.render($splashDiv, null);
    }
}

const DefaultRoute = '/analyzer';
const Routes = {
    '/splash': {
        render: function() {
            return m(Splash);
        },
    },
    '/options': {
        render: function() {
            return m(Options);
        },    
    },
    '/logs': {
        render: function() {
            return m(Logs);
        },    
    },
    '/analyzer': {
        render: function() {
            return m(Analyzer);
        },    
    },
    '/start': {
        onmatch() {
            if (!counter_splash) {
                // Show Loader until the promise has been resolved or rejected.
                counter_splash += 1;
                loadSpinner();
                return new Promise((resolve /*, reject */) => {
                    //Fetch all necessary data here
                    setTimeout(function() {
                        //m.render($root, null);
                        resolve();
                    }, 200);
                }).catch((/* e */) => {
                    // In case of server error we can show the maintenance page.
                    return Options;
                });
            } else {
                return undefined; //new Promise.resolve();
            }
        },
        render(vnode) {
            hideSpinner();
            if (typeof vnode.tag === 'function') {
                //If onmatch returns a component or a promise that resolves to a component, comes here.
                return vnode;
            }
            return m(Start);
        },
    },
};

export { Routes, DefaultRoute };
