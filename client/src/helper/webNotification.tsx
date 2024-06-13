import axios from 'axios';

async function regSw() {
    if ('serviceWorker' in navigator) {
        let url = '/sw.js';
        const reg = await navigator.serviceWorker.register(url, { scope: '/' });
        console.log('service config is', { reg });
        return reg;
    }
    throw Error('serviceworker not supported');
}

async function subscribe(serviceWorkerReg: any) {
    let subscription = await serviceWorkerReg.pushManager.getSubscription();
    console.log({ subscription });
    if (subscription === null) {
        subscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
    }
    axios.post('http://localhost:3001/subscribe', subscription);
}

export { regSw, subscribe };
