const { join, parse } = require('path');
const { existsSync, writeFile } = require('fs');
const mkdirp = require('mkdirp');
const ora = require('ora');
const { minify } = require('html-minifier');
const serverSetup = require('./serverSetup');
const pageRender = require('./pageRender');
const oraTemplate = require('./oraTemplate');

module.exports = async (
    sourceDir,
    files,
    {
        destDir = `${sourceDir}_prerender`,
        proxyTable = [],
        navigationTimeout = 30000,
        resourceInterception = [],
    } = {},
) => {
    try {
        const { server, port } = await serverSetup(sourceDir, proxyTable);
        try {
            await Promise.all(
                files.map(
                    file =>
                        new Promise(async (resolve, reject) => {
                            const spinner = ora(oraTemplate()).start();

                            try {
                                const content = await pageRender(
                                    `http://localhost:${port}${file}`,
                                    {
                                        navigationTimeout,
                                        resourceInterception,
                                    },
                                );

                                const { base, dir } = parse(file);
                                const destFileDir = join(destDir, dir);

                                !existsSync(destFileDir) &&
                                    mkdirp.sync(destFileDir);
                                writeFile(
                                    join(destFileDir, base),
                                    minify(content, {
                                        collapseWhitespace: true,
                                        removeComments: true,
                                    }),
                                    error => {
                                        if (error) {
                                            spinner.fail(
                                                oraTemplate('Failed', file),
                                            );
                                            return reject(
                                                'Could not write file: ' +
                                                    file +
                                                    '\n' +
                                                    error,
                                            );
                                        }
                                        spinner.succeed(
                                            oraTemplate('Successful', file),
                                        );
                                        resolve();
                                    },
                                );
                            } catch (error) {
                                spinner.fail(oraTemplate('Failed', file));
                                throw new Error(error);
                            }
                        }),
                ),
            );

            server.stop();
        } catch (error) {
            throw new Error(error);
        }
    } catch (error) {
        throw new Error(error);
    }
};
