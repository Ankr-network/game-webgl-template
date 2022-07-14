export const GetMethodByPath = (web3: any, path: string): Function => {
  const pathParts = path.split(".");

  let funct = web3 as Function;
  try {
    pathParts.forEach(name => funct = funct[name]);
  } catch (e) {
    throw new Error(`There is no method by path ${path}`);
  }

  return funct;
};
