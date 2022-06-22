
import * as ls from 'local-storage';
import { IObj } from '@app/domain';
import { AppConfig, OptionsConfig }  from '@app/config';
import { ITable, TTableNames, TRow, TTableTemplates } from './database.types';
import { H }   from './../helper.service';

const DEBUG = false;

const dumps  = {
    Usage:   [{uuid: '0', laststart: Date.now(), lastend: Date.now(), usage: 0}],
    Options: [H.clone(OptionsConfig)],
    Boards : [H.clone(AppConfig.templates.board, { uuid: 'default' })],
    Games :  [H.clone(AppConfig.templates.default)],
};

const templates: TTableTemplates = {
    Usage:   {uuid: '0', laststart: Date.now(), lastend: Date.now(), usage: 0},
    Options: H.clone({}),
    // Boards : H.clone(AppConfig.templates.board),
    // Games :  H.clone(AppConfig.templates.default),
    Boards : H.clone({}),
    Games :  H.clone({}),
};

const TableFactory = function (tablename: TTableNames): ITable {

    const dump = dumps[tablename];
    const rowTemplate = templates[tablename];

    let self: ITable, cache: TRow[], interval: number, isDirty = true;
    let data: TRow[] = ls.get(tablename);

    if (!data){
        ls.set<TRow[]>(tablename, dump);
        cache = dump;
        DEBUG && console.log('TAB.' + tablename, 'initialized', cache);

    } else {
        cache = data;
        DEBUG && console.log('TAB.' + tablename, 'loaded', cache);

    }

    function runUpdates () {
        interval = window.setInterval( () => {
            if (isDirty){
                self.persist(true);
            }
        // }, 60_000); //AppConfig.database.updateInterval || 60 * 1000);
        }, AppConfig.database.updateInterval || 60 * 1000);
    }
    runUpdates();

    return self = H.clean({
        dump () {
            console.log(JSON.stringify(ls.get(tablename), null, 2));
        },
        toggleUpdates () {
            interval ? clearInterval(interval) : runUpdates();
        },
        get length () {
            return cache.length;
        },
        get list () {
            return cache;
        },
        get first () {
            return cache[0] || undefined;
        },
        exists (uuid: string) {
            return !!cache.find( row => row.uuid === uuid );
        },
        find (uuid: string) {
            return cache.find( row => row.uuid === uuid ) || undefined;
        },
        filter (fn: () => boolean) {
            return cache.filter(fn);
        },
        clear (force=true) {
            const length = cache.length;
            cache = dump;
            self.persist(force);
            DEBUG && console.log('TAB.' + tablename, 'cleared, with', length, 'rows');
        },
        create (row: TRow, force=false) {
            cache.push(row);
            self.persist(force);
            DEBUG && console.log('TAB.' + tablename, 'created', row.uuid, force);
            return row;
        },
        createget (uuid: string, template={}, force=false) {
            let row = self.find(uuid);
            if (row === undefined) {
                row = H.clone(rowTemplate, template);
                row.uuid = uuid;
                cache.push(row);
                self.persist(force);
            }
            DEBUG && console.log('TAB.' + tablename, 'createget', uuid, H.shrink(row));
            return row;
        },
        delete (what: string | (()=>boolean), force=true) {

            if (typeof what === 'function'){
                self.filter(what).forEach( row => {
                    self.delete(row.uuid, false);
                });
                self.persist(force);

            } else if (typeof what === 'string'){
                const idx = cache.findIndex( row => row.uuid === what);
                if (idx > -1) {
                    cache.splice(idx, 1);
                    self.persist(force);
                } else {
                    throw `ERROR ! DB.${tablename}.delete failed. ${what} not found`;
                }
                DEBUG && console.log('TAB.' + tablename, 'deleted', what.toString());
            }
        },
        update (uuid: string, diff: IObj, force=false) {
            const row  = self.find(uuid);
            if (row !== null) {
                // must keep outside references working
                Object.assign(row, diff);
                H.deepassign([row, diff]);
                self.persist(force);
            } else {
                throw `ERROR ! Table.${tablename}.update failed. ${uuid} not found`;
            }
            DEBUG && console.log('TAB.' + tablename, 'updated', force ? 'force': '', uuid, H.shrink(diff));
            return row;
        },
        persist (force) {
            if ( force ) {
                if (ls.set(tablename, cache)){
                    isDirty = false;
                    // DEBUG && console.log('TAB.' + tablename, 'saved', cache.length, 'rows');
                } else {
                    throw `ERROR ! Table.${tablename}.persist failed`;
                }
            } else {
                isDirty = true;
            }
        },

    } as ITable);

};

export { TableFactory, ITable };
