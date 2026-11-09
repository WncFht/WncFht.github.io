import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { resolveTimezone } from "./resolveTimezone.ts";

dayjs.extend(utc);
dayjs.extend(timezone);

/** Use the same validated timezone for publication policy, bylines and archives. */
export function dateInTimezone(value: dayjs.ConfigType, zone: string) {
  return dayjs(value).tz(resolveTimezone(zone));
}
