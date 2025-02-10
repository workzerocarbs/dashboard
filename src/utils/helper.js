/**
 * Formats an ISO date string into a 12-hour time format with AM/PM.
 *
 * @param {string | Date} date - The ISO date string or Date object to format (e.g., "2025-02-01T19:36:43.000000Z").
 * @returns {string} The formatted time in 12-hour format with AM/PM (e.g., "7:36 PM").
 *
 * @example
 * formattedDateTime("2025-02-01T19:36:43.000000Z"); // "7:36 PM"
 * formattedDateTime(new Date()); // Current time in 12-hour format
 */
export function formattedDateTime(date) {
  const isoDate = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "IST",
  }).format(isoDate);
}

/**
 * Formats an ISO date string into "DDth MMM YYYY at HH:MM AM/PM".
 *
 * @param {string | Date} date - The ISO date string or Date object to format (e.g., "2025-02-01T19:36:43.000000Z").
 * @returns {string} The formatted date string (e.g., "01st Feb 2025 at 03:48 PM").
 *
 * @example
 * formattedFullDateTime("2025-02-01T19:36:43.000000Z"); // "01st Feb 2025 at 07:36 PM"
 * formattedFullDateTime(new Date()); // Current formatted date and time
 */
export function formattedFullDateTime(date) {
  const isoDate = new Date(date);

  const day = isoDate.getDate();
  const month = isoDate.toLocaleString("en-US", {
    month: "short",
    timeZone: "IST",
  });
  const year = isoDate.getFullYear();

  // Format the day with the appropriate suffix (st, nd, rd, th)
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || [11, 12, 13].includes(day % 100) ? 0 : day % 10
  ];

  // Format time in 12-hour format
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "IST",
  }).format(isoDate);

  return `${String(day).padStart(2, "0")}${suffix} ${month} ${year} at ${time}`;
}

/**
 * Formats a number into a currency string based on the given currency code.
 *
 * @param {number} amount - The amount to format as currency (e.g., 399.00).
 * @param {string} currencyCode - The currency code (e.g., 'USD', 'EUR', 'INR').
 * @returns {string} The formatted currency string (e.g., "$399.00", "€399.00", "₹399.00").
 *
 * @example
 * formatCurrency(399.00, "USD"); // "$399.00"
 * formatCurrency(399.00, "EUR"); // "€399.00"
 * formatCurrency(399.00, "INR"); // "₹399.00"
 */
export function formatCurrency(amount, currencyCode = "INR") {
  const formattdAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);

  return formattdAmount;
}
