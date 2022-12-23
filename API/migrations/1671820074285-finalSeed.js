/**
 * Make any changes you need to make to the database here
 */
async function up() {
  // Write migration here
  const seeder = require("./finalSeed.js");
  await seeder();
}

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down() {
  // Write migration here
}

module.exports = { up, down };
