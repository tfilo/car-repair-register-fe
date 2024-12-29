import { defineConfig } from 'cypress';
import coverage from '@cypress/code-coverage/task.js';

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
