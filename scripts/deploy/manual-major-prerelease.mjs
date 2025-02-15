import {getCurrentVersion, gitAdd} from '@coveo/semantic-monorepo-tools';
import {commitVersionBump, tagExists, tagPackages} from '../git.mjs';
import {
  getPackageDefinitionFromPackageName,
  getPackagePathFromPackageDir,
  updatePackageVersionsAndDependents,
} from '../packages.mjs';
import {prereleaseSuffix} from '../prerelease.mjs';

/**
 * @typedef {import('../packages.mjs').PackageDefinition} PackageDefinition
 */

/**
 * @param {number} packageName
 * @param {number} major
 * @param {number} prerelease
 * @returns {Promise<string>}
 */
async function getNewMajorPrerelease(packageName, major, prerelease = 0) {
  const version = `${major}.0.0-${prereleaseSuffix}.${prerelease}`;
  if (await tagExists(`${packageName}@${version}`)) {
    return getNewMajorPrerelease(packageName, major, prerelease + 1);
  }
  return version;
}

/**
 * @param {PackageDefinition} packageDef
 */
async function getNewVersion(packageDef) {
  const version = getCurrentVersion(
    getPackagePathFromPackageDir(packageDef.packageDir)
  );
  return getNewMajorPrerelease(packageDef.name, version.major + 1);
}

/**
 * @param {PackageDefinition[]} packages
 */
async function locallyBumpVersions(packages) {
  /** @type {{ [packageDir: import('../packages.mjs').PackageDir]: string }} */
  const newVersions = {};
  for (const packageDef of packages) {
    newVersions[packageDef.packageDir] = await getNewVersion(packageDef);
  }
  await updatePackageVersionsAndDependents(newVersions);
}

/**
 * @param {string[]} args
 */
export async function main(args) {
  const packageNamesToBump = args.slice(2);
  if (!packageNamesToBump.length) {
    console.error('You must specify which packages to bump.');
    return;
  }
  const packages = packageNamesToBump.map(getPackageDefinitionFromPackageName);
  await locallyBumpVersions(packages);
  const updatedPackages = packageNamesToBump.map(
    getPackageDefinitionFromPackageName
  );
  await gitAdd('.');
  await commitVersionBump(updatedPackages);
  await tagPackages(updatedPackages);
}

main(process.argv);
