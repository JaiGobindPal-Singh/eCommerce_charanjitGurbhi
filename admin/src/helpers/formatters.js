export function formatNumber(amount) {
  return new Intl.NumberFormat("en-IN").format(amount);
}