import { dto } from './dto.js';
import { storage } from './storage.js';
import { progress } from './progress.js';
import { request, HTTP_POST, HTTP_GET } from './request.js';

export const session = (() => {

    let session = null;

    const getToken = () => session.get('token');

    const login = (body) => {
        return request(HTTP_POST, '/api/session')
            .body(body)
            .send(dto.tokenResponse)
            .then((res) => {
                if (res.code === 200) {
                    session.set('token', res.data.token);
                }

                return res;
            })
            .then((res) => res.code === 200, () => false);
    };

    const logout = () => {
        session.unset('token');
    };

    const isAdmin = () => {
        return (getToken() ?? '.').split('.').length === 3;
    };

    const guest = () => {
        progress.add();
        return request(HTTP_GET, '/api/config')
            .token(document.body.getAttribute('data-key'))
            .send()
            .then(async (res) => {
                if (res.code !== 200) {
                    progress.invalid('request');
                    return;
                }

                const config = storage('config');
                for (let [key, value] of Object.entries(res.data)) {
                    config.set(key, value);
                }

                session.set('token', document.body.getAttribute('data-key'));
                progress.complete('request');
            }).catch(() => {
                progress.invalid('request');
            });
    };

    const init = () => {
        session = storage('session');
    };

    return {
        init,
        guest,
        login,
        logout,
        isAdmin,
        getToken,
    };
})();