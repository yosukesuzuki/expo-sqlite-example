export function builder(queryChar) {
  const queryStrings =
    "select * from items where word like '" + queryChar + "%'";
  // console.log(queryStrings);
  return queryStrings;
}
