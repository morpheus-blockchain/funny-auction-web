

export const toFixed = (v, d) => {
  const num = Number(v).toFixed(d + 1);
  return num.slice(0, num.length - 1);
}
