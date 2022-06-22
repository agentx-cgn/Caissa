/* eslint-disable @typescript-eslint/no-explicit-any */

import { all as mergeAll } from 'deepmerge';
import { IObj } from '@app/domain';

const H = {

  cssvar ( name: string ): string {

    const isSameDomain = (styleSheet: any) => {
      if (!styleSheet.href) {
        return true;
      }
      return styleSheet.href.indexOf(window.location.origin) === 0;
    };

    const isStyleRule = (rule: any) => rule.type === 1;

    const getCSSCustomPropIndex = () =>
      [...document.styleSheets]
        .filter(isSameDomain)
        .reduce( (finalArr: any[], sheet) =>
          finalArr.concat(
            [...sheet.cssRules].filter(isStyleRule).reduce((propValArr: any[], rule: any) => {
              const props = [...rule.style]
                .map((propName: string) => [
                  propName.trim(),
                  (rule.style as any).getPropertyValue(propName).trim()
                ])
                .filter(([propName]) => propName.indexOf("--") === 0)
              ;
              return [...propValArr, ...props];
            }, [])
          ),
        []
      )
    ;

    return getCSSCustomPropIndex().find(([propName]) => propName === name)[1] || '';

  },

  deepassign: mergeAll,

  deepcopy (obj: IObj){
    return JSON.parse(JSON.stringify(obj));
  },

  deepclean(obj: IObj) {
    for (let name of Object.getOwnPropertyNames(obj)) {
      const value = obj[name];
      if(typeof value === 'object') {
        H.deepclean(value);
      }
    }
    Object.setPrototypeOf(obj, null);
    return obj;
  },

  range (st: number, ed: number, sp: number): number[] {
    var i, r=[] as number[], al=arguments.length;
    if(al===0){return r;}
    if(al===1){ed=st;st=0;sp=1;}
    if(al===2){sp=1;}
    for(i=st;i<ed;i+=sp){r.push(i);}
    return r;
  },

  clone (...args: IObj[]) {
    const obj   = H.deepassign([ {}, ...args ]);
    const clone = H.deepcopy(obj);
    H.deepclean(clone);
    return clone;
  },

  clean (obj: any) {
    Object.setPrototypeOf(obj, null);
    return obj;
  },

  // removes all props, so refs will continue to work
  clear (obj: IObj) {
    Object.keys(obj).forEach( prop => delete obj[prop] );
    return obj;
  },

  // creates new object and removes prototype
  create (...args: IObj[]): IObj {
    const obj = !args.length ? {} : Object.assign.apply(null, [ {}, ...args ]);
    Object.setPrototypeOf(obj, null);
    return obj;
  },

  deepFreezeCreate (...args: IObj[]) {

    const obj = !args.length ? {} : Object.assign.apply(null, [ {}, ...args ]);
    const propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self
    for (let name of propNames) {
        const value = obj[name];
        if(value && typeof value === 'object') {
            Object.setPrototypeOf(value, null);
            Object.freeze(value);
        }
    }

    Object.setPrototypeOf(obj, null);
    Object.freeze(obj);

    return obj;

  },

  transform (obj: any, fn: (key: string, value: any) => any): any {

    const out = H.create();

    Object.keys(obj).forEach( (prop: string) => {
      out[prop] = fn( prop, obj[prop] );
    });

    return out;

  },

  // removes all undefined props & prototype, improves debugging readabilty
  strip (obj: any) {
    const copy = H.create(obj);
    Object.entries(copy).forEach( entry => {
      const [key] = entry;
      if (typeof copy[key] === 'undefined'){
        delete copy[key];
      }
    });
    return copy;
},

  // very short log version of obj
  shrink (obj: any): string {
    return JSON.stringify(H.strip(obj)).replace(/"/g, '').slice(0, 140);
  },

  eat (e: Event) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  },

  msecs2human (milliseconds: number) {

    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number: number): string {
        return (number > 1) ? 's' : '';
    }

    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks?
    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    const seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }

    return 'less than a second'; //'just now' //or other string you like;

  },

};

const $ = document.querySelector.bind(document);

export { H, $ };
