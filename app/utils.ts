import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import duration from "dayjs/plugin/duration.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import updateLocale from "dayjs/plugin/updateLocale.js";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few sec.",
    m: "1 min.",
    mm: "%d min.",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

export const formatters = {
  date: (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date),

  bytes: (bytes: number, decimals = 2) => {
    if (!+bytes) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },

  hertz: (hz: number, decimals = 2) => {
    if (!+hz) return "0 Hz";

    const k = 1000; // The scaling factor for Hertz is 1000
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Hz", "kHz", "MHz", "GHz", "THz", "PHz", "EHz", "ZHz", "YHz"];

    const i = Math.floor(Math.log(hz) / Math.log(k));

    return `${parseFloat((hz / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  },

  timeAgo: (date: Date, options?: Intl.RelativeTimeFormatOptions) => {
    const relativeTimeFormat = new Intl.RelativeTimeFormat("en-US", {
      numeric: "auto",
      ...(options || {}),
    });

    const DIVISIONS: {
      amount: number;
      name: Intl.RelativeTimeFormatUnit;
    }[] = [
      { amount: 60, name: "seconds" },
      { amount: 60, name: "minutes" },
      { amount: 24, name: "hours" },
      { amount: 7, name: "days" },
      { amount: 4.34524, name: "weeks" },
      { amount: 12, name: "months" },
      { amount: Number.POSITIVE_INFINITY, name: "years" },
    ];

    let duration = (date.valueOf() - new Date().valueOf()) / 1000;
    for (let i = 0; i < DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        return relativeTimeFormat.format(Math.round(duration), division.name);
      }
      duration /= division.amount;
    }
  },

  price: (price: number | bigint | string, options?: Intl.NumberFormatOptions) => {
    let opts: Intl.NumberFormatOptions = {
      style: "currency",
      currency: "USD",
      ...(options || {}),
    };

    // Convert the price to a number for comparison
    const numericPrice = typeof price === "string" ? parseFloat(price) : Number(price);

    // Check if the price is less than 1 and not zero, then adjust minimumFractionDigits
    if (numericPrice > 0 && numericPrice < 1) {
      opts.minimumFractionDigits = Math.max(2, -Math.floor(Math.log10(numericPrice)));
    } else {
      opts.minimumFractionDigits = 0;
    }

    return new Intl.NumberFormat("en-US", opts).format(numericPrice);
  },
};

export function openGraphTags(
  pageName: string | null,
  description: string,
  socialTitle: string,
  socialDescription: string,
) {
  const qs = new URLSearchParams();
  qs.append("title", socialTitle);
  qs.append("description", socialDescription);
  return [
    { title: pageName },
    { name: "description", content: description },
    { property: "og:title", content: socialTitle },
    { property: "og:description", content: socialDescription },
    { property: "og:site_name", content: "JetKVM" },
    {
      property: "og:image",
      content: `https://jetkvm.com/og.jpg`,
    },
    { property: "og:type", content: "website" },
    { name: "twitter:title", content: pageName },
    { name: "twitter:description", content: socialDescription },
    { name: "twitter:creator", content: "@jetkvm" },
    { name: "twitter:domain", content: "jetkvm.com" },
    { name: "twitter:site", content: "@jetkvm" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:image",
      content: `https://jetkvm.com/og.jpg`,
    },
  ];
}
