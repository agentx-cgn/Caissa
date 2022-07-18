export {
  Pgn
} from './pgn';

export interface IPgn {
  new(pgnstr: string, props: any): IPgn;
  render: void;
  history: string[];
  header: string[];
}
