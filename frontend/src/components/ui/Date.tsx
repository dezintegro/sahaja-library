import { parseISO, format } from 'date-fns';
import {FC} from "react";

export const Date = ( dateString: string ) => {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}
