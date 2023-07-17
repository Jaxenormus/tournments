import baseJs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

baseJs.extend(localizedFormat);
baseJs.extend(timezone);
baseJs.extend(advancedFormat);

export const dayjs = baseJs;
