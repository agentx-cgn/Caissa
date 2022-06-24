
// TODO: https://www.npmjs.com/package/idb

import * as ls from 'local-storage';

import { H }   from '../helper.service';
import { TableFactory }   from './table.factory';
import { IDatabase, TTableNames, TDump } from './database.types';

const SCHEME = '2022-06-22a';

const tables = 'Boards Games Options Usage'.split(' ') as TTableNames[];

const DB: IDatabase =  {

    scheme:   SCHEME,

    Boards:   TableFactory('Boards'),
    Games:    TableFactory('Games'),
    Options:  TableFactory('Options'),
    Usage:    TableFactory('Usage'),

    dump  () {
      const dump = JSON.stringify(DB.all(), null, 2);
      return dump.replace(/\\"/g, '\'');
    },

    all   (): TDump {
      return {
        Scheme:  ls.get('scheme'),
        Usage:   ls.get('Usage'),
        Options: ls.get('Options'),
        Boards:  ls.get('Boards'),
        Games:   ls.get('Games'),
      };
    },
    reset () {

      console.log('Info   :', 'Caissa first use, resetting DB...', 'scheme', DB.scheme);

      ls.clear();
      ls.set('scheme', DB.scheme);
      tables.forEach(tablename => {
        DB[tablename] = TableFactory(tablename);
      });


    },
    persist () {
      tables.forEach(tablename => {
        DB[tablename].persist(true);
      });
      console.log('DB.persisted', (DB.size() / 1024).toFixed(2) + ' KB');
    },

    size () {

      let total = 0, len, key;

      for(key in localStorage){
        // eslint-disable-next-line no-prototype-builtins
        if(!localStorage.hasOwnProperty(key)){continue;}
        len = ((localStorage[key].length + key.length) * 2);
        total += len;
        // console.log(key.substr(0,50) + ' = '+ (_xLen/1024).toFixed(2)+' KB');
      }

      return total;

    },

    init () {

      try {
        // if (!SystemService.localStorage) {
        //   console.error('Info   :', 'BE', 'localStorage not available');
        // }

        const test = ls.get('Usage');

        // eslint-disable-next-line no-constant-condition
        if ( !test || false ) {
          DB.reset();

        } else {

          if (DB.scheme !== ls.get('scheme')){
            console.warn('WARN   :', 'New Scheme detected, please reset DB');
          }

          // tables.forEach(tablename => {
          //     DB[tablename] = TableFactory(
          //         tablename,
          //         dumps[tablename],
          //         Config.tableTemplates[tablename],
          //     );
          // });

          const usage   = DB.Usage.first;
          const options = DB.Options.first;
          const ago     = H.msecs2human(Date.now() - usage.lastend);

          usage.usage    += 1;
          usage.laststart = Date.now();
          DB.Usage.update('0', {usage: usage.usage, laststart: Date.now()});

          if (navigator.storage && navigator.storage.estimate){
            Promise.all([navigator.storage.estimate(), navigator.storage.persisted()])
              .then( ([estimate, persisted]) => {
                  console.log('Info   :', 'DB', {quota: estimate.quota, usage: estimate.usage, persisted});
              })
            ;
          } else {
            console.log('Info   :', 'DB', {quota: NaN, usage: NaN});
          }

          console.log('Info   :', 'DB', DB.scheme, DB.Games.length, 'games', 'user:', options.user.name, 'usage:', usage.usage, 'last:', ago, 'ago');

        }

      } catch (e) {
        console.error('DB.init.error', e);

      }

    },

};

DB.init();

export { DB as DatabaseService };
