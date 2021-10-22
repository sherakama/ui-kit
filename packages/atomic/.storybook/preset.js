function managerEntries(entry = []) {
  return [...entry, require.resolve('./addon-atomic')];
}

module.exports = {managerEntries};
