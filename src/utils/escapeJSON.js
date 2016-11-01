function escapeJSON(string) {
  const str = string.replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');

  return str;
}

export default escapeJSON;
