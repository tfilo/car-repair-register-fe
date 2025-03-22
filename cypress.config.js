import { defineConfig } from 'cypress';
import coverage from '@cypress/code-coverage/task.js';
import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';

const executeSqlFile = async (filepath) => {
    const client = new Client({
        user: 'evidence',
        password: 'evidence123',
        host: 'localhost',
        port: '5432',
        database: 'evidence'
    });
    const sql = fs.readFileSync(filepath, 'utf8');
    await client
        .connect()
        .then(async () => {
            await new Promise((resolve, reject) => {
                client.query(sql, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
            await client.end();
        })
        .catch((err) => {
            console.error('Connecting to database failed', err);
        });
};

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173',
        setupNodeEvents(on, config) {
            coverage(on, config);
            on('before:browser:launch', async (browser, launchOptions) => {
                if (browser.family === 'firefox') {
                    launchOptions.preferences['network.proxy.testing_localhost_is_secure_when_hijacked'] = true;
                }
                return launchOptions;
            });
            on('task', {
                async 'db:seed'() {
                    await executeSqlFile('./cypress/data/cleanup-db.sql');
                    await executeSqlFile('./cypress/data/init-db.sql');
                    return null;
                }
            });
            return config;
        }
    },
    reporter: 'mocha-junit-reporter',
    reporterOptions: {
        mochaFile: 'cypress/results/[suiteName].xml',
        jenkinsMode: true,
        jenkinsClassnamePrefix: 'Test'
    }
});
