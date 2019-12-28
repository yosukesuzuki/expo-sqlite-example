export function builder(queryChar) {
  const queryStrings =
    "select * from items_with_freq where word like '" + queryChar + "%'";
  // console.log(queryStrings);
  return queryStrings;
}
