export function numberFormat(value) {
  const param = {};
  const k = 1000;
  const sizes = ['千', '万', '亿', '万亿'];
  let i;
  if (value < k) {
    param.value = value;
    param.unit = '';
  } else {
    i = Math.floor(Math.log(value) / Math.log(k));

    param.value = (value / Math.pow(k, i)).toFixed(2);
    param.unit = sizes[i];
  }
  return param;
}
