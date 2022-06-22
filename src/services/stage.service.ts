import { $ } from './helper.service';
import { SystemService as System } from './system.service';
import { HistoryService as History } from './history.service';
import { IEvent } from '@app/domain';

const DEBUG = false;

const abs = Math.abs;
let threshold = innerWidth / 3;

let touch = { selektor: '', time: NaN, down: { x: NaN, y: NaN }, diff: { x: NaN, y: NaN } };
let slideLeft: HTMLElement | null, slideRight: HTMLElement | null; // may get moved
let endEvent = 'transitionend';
let width: number;

const StageService = {
    listen () {
        if (System.touch){
            document.addEventListener('touchstart', StageService.down,  false);
            document.addEventListener('touchmove',  StageService.move,  false);
            document.addEventListener('touchend',   StageService.end,   false);
            DEBUG && console.log('StageService.listening');
        }
    },
    remove () {
        document.removeEventListener('touchstart', StageService.down,  false);
        document.removeEventListener('touchmove',  StageService.move,  false);
        document.removeEventListener('touchend',   StageService.end,   false);
        DEBUG && console.log('StageService.removed');
    },
    pause () {
        touch.selektor = '';
    },
    init (pageWidth: number) {
        // next frame
        setTimeout ( () => {
            slideLeft       = $('div.slide.left');
            slideRight      = $('div.slide.right');
            touch.selektor  = 'div.slide.center';
            width           = pageWidth;
            threshold       = innerWidth / 4;
            DEBUG && console.log('StageService.init', pageWidth);
        });
    },
    down (e: TouchEvent & IEvent) {
        if (touch.selektor && (e.target as Element).closest(touch.selektor)){
            touch.time   = Date.now();
            touch.down.x = e.touches[0].clientX;
            touch.down.y = e.touches[0].clientY;
            touch.diff.x = 0;
            touch.diff.y = 0;
            DEBUG && console.log('touch.down', touch.selektor);
        }
    },
    onafterback () {
        slideLeft?.removeEventListener(endEvent, StageService.onafterback);
        History.goback();
    },
    onafterfore () {
        slideRight?.removeEventListener(endEvent, StageService.onafterfore);
        History.gofore();
    },
    move  (e: TouchEvent) {

        if (touch.down.x || touch.down.y) {

            const x = e.touches[0].clientX;
            const y = e.touches[0].clientY;

            touch.diff.x = touch.down.x - x;
            touch.diff.y = touch.down.y - y;

            // console.log('StageService.move', History.canBack, touch.diff.x, threshold);

            if (abs(touch.diff.x) > 3 * abs(touch.diff.y)){

                if (slideLeft && History.canBack && touch.diff.x < 0){
                    if (abs(touch.diff.x) > threshold){
                        slideLeft.addEventListener(endEvent, StageService.onafterback);
                        slideLeft.classList.add('page-slide', 'trans-center');
                    } else {
                        slideLeft.style.transform = 'translateX(' + abs(touch.diff.x) + 'px)';
                    }
                }

                if (slideRight && History.canFore && touch.diff.x > 0){
                    if (abs(touch.diff.x) > threshold){
                        slideRight.addEventListener(endEvent, StageService.onafterfore);
                        slideRight.classList.add('page-slide', 'trans-center');
                    } else {
                        slideRight.style.transform = 'translateX(' + ( 2 * width - abs(touch.diff.x) ) + 'px)';
                    }
                }

            }

        }

    },

    end () {

        if (touch.selektor) {

            touch.down = { x: NaN, y: NaN };
            touch.diff = { x: NaN, y: NaN };

            if (slideLeft){
                slideLeft.addEventListener(endEvent, function onEnd () {
                    slideLeft?.removeEventListener(endEvent, onEnd);
                    slideLeft?.classList.remove('page-slide');
                });
                slideLeft.classList.add('trans-left', 'page-slide');
            }
            if (slideRight){
                slideRight.addEventListener(endEvent, function onEnd () {
                    slideRight?.removeEventListener(endEvent, onEnd);
                    slideRight?.classList.remove('page-slide');
                });
                slideRight.classList.add('trans-right', 'page-slide');
            }

            DEBUG && console.log('StageService.ended', touch.selektor);

        }

    },

};

export { StageService };
