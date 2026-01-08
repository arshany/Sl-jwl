import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.metavision.aqim',
    appName: 'أقم',
    webDir: 'dist/public',
    server: {
        androidScheme: 'https'
    }
};

export default config;
