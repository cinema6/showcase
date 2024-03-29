module.exports = {
    src_folders: [
        'test/e2e/src'
    ],
    output_folder: 'reports',
    custom_commands_path: '',
    custom_assertions_path: '',
    page_objects_path: 'test/e2e/page_objects/',
    globals_path: 'test/e2e/helpers/globals.js',
    selenium: {
        start_process: true,
        server_path:
          './node_modules/selenium-standalone/.selenium/selenium-server/2.53.0-server.jar',
        log_path: '',
        host: '127.0.0.1',
        port: 4444,
        cli_args: {
            'webdriver.chrome.driver':
      './node_modules/selenium-standalone/.selenium/chromedriver/2.22-x64-chromedriver',
            'webdriver.ie.driver':
      './node_modules/selenium-standalone/.selenium/iedriver/2.53.0-x64-IEDriverServer.exe'
        }
    },
    test_workers: {
        enabled: false,
        workers: 'auto'
    },
    test_settings: {
        default: {
            launch_url: 'http://localhost:9000',
            selenium_port: 4444,
            selenium_host: 'localhost',
            silent: true,
            screenshots: {
                enabled: false,
                path: ''
            },
            desiredCapabilities: {
                browserName: 'firefox',
                javascriptEnabled: true,
                acceptSslCerts: true
            },
            globals: {
            }
        },
        saucelabs: {
            launch_url: 'https://apps-staging.reelcontent.com/',
            selenium_host: 'ondemand.saucelabs.com',
            selenium_port: 80,
            /*global process*/
            /*eslint no-undef: "error"*/
            username: process.env.SAUCE_USERNAME,
            access_key: process.env.SAUCE_KEY,
            use_ssl: false,
            silent: true,
            output: true,
            screenshots: {
                enabled: true,
                on_failure: true,
                path: './test/e2e/error'
            },
            desiredCapabilities: {
                platform: 'Windows 10',
                name: 'e2e-tests',
                browserName: 'chrome'
            },
            globals: {
                waitForConditionTimeout: 40000,
                email: 'c6e2etester@gmail.com'
            },
            selenium: {
                start_process: false
            },
            test_workers: {
                enabled: true,
                workers: 'auto'
            }
        },
        staging: {
            launch_url: 'https://apps-staging.reelcontent.com/',
            selenium_host: 'localhost',
            selenium_port: 4444,
            use_ssl: false,
            silent: true,
            output: true,
            desiredCapabilities: {
                name: 'e2e-tests',
                browserName: 'firefox'
            },
            globals: {
                email: 'c6e2etester@gmail.com'
            },
            selenium: {
                start_process: true
            },
            test_workers: {
                enabled: true,
                workers: 'auto'
            }
        }
    }
};
