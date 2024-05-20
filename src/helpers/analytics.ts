const badgeIconClasses: Record<any, any> = {
  "+": "fi fi-rr-arrow-small-right -rotate-45",
  "-": "fi fi-rr-arrow-small-right rotate-45",
};

export const getDecimals = (value: number) => {
  return value < 1000 ? 0 : 2;
};

export enum TABS {
  ANALYTICS = "pills-analytics",
  HOLIDAY = "pills-holiday",
  JOBS = "pills-jobs",
  BLOG = "pills-news",
}

export type TabOption = TABS.ANALYTICS | TABS.HOLIDAY | TABS.JOBS | TABS.BLOG;

export function generateSuffix(num: number) {
  if (num >= 1000000) {
    return "M";
  } else if (num >= 1000) {
    return "K";
  } else {
    return "";
  }
}

export const createStatData = ({
  label,
  colorClass,
  percentageSign,
  percentage,
  counterStart,
  totalCount,
  prefix,
  duration,
  decimal,
  seperator,
  linkType,
  link,
  linkUrl,
  widgetIconClass,
}: any) => {
  return {
    label,
    badgeClass: colorClass,
    badgeIconClass: badgeIconClasses[percentageSign] || "",
    percentage: `${percentageSign}${percentage}`,
    counterStart: counterStart || 0,
    counterEnd: totalCount || 0,
    prefix: prefix || "",
    suffix: generateSuffix(totalCount || 0),
    duration: duration || 4,
    decimal: decimal || ".",
    decimals: getDecimals(totalCount) || 0,
    seperator: seperator || ",",
    linkType,
    link,
    linkUrl,
    widgetIconBg: `${colorClass}-bg`,
    widgetIconClass: widgetIconClass,
    widgetIconColor: colorClass,
  };
};

export const createJobStat = (totalCount: number) =>
  createStatData({
    label: "Jobs",
    colorClass: "info",
    percentageSign: "+",
    percentage: 40.56,
    totalCount,
    linkType: "section",
    link: "See details",
    linkUrl: TABS.JOBS,
    widgetIconClass: "fi fi-rr-umbrella-beach",
  });

export const createNewsStat = (totalCount: number) =>
  createStatData({
    label: "Blogs",
    colorClass: "success",
    percentageSign: "+",
    percentage: 23.48,
    totalCount,
    linkType: "section",
    link: "See details",
    linkUrl: TABS.BLOG,
    widgetIconClass: "fi fi-rr-radio",
  });
