// export const formatMoney = (amount: number) => {
//   return amount.toLocaleString("it-IT", { style: "currency", currency: "VND" });
// };
export const formatMoney = (str: string) => {
  return str
    .split("")
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ".") + prev;
    });
};