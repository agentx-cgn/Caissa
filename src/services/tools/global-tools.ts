
import { AppConfig }  from '@app/config';
import { IDifficulties, TDifficulty } from '@app/domain';
import { H }   from '../helper.service';

const globaltools = {

    // m.buildPathname
    interpolate (route: string, params: string) {
        let target = route;
        H.each(params, (key: string, val: any) => {
            target = target.replace(':' + key, val);
        });
        return target;
    },

    // matches depth to string with ranges
    resolveDifficulty (value: number): string {

        const diffs: IDifficulties = AppConfig.plays.difficulties;

        let hit    = diffs['0'] as string;
        let result = hit;

        H.range(0, 31).forEach( num => {
            hit    = diffs[String(num) as TDifficulty] ? diffs[String(num)  as TDifficulty] : hit;
            result = ~~num <= value ? hit : result;
        });

        return result;

    },

};

export { globaltools };
