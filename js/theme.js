import { storage } from './storage.js';

export const theme = (() => {

    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    let theme = null;
    let isAuto = false;
    let observerLight = null;
    let observerDark = null;

    const toLight = (element) => {
        if (element.classList.contains('text-light')) {
            element.classList.remove('text-light');
            element.classList.add('text-dark');
        }

        if (element.classList.contains('btn-theme-light')) {
            element.classList.remove('btn-theme-light');
            element.classList.add('btn-theme-dark');
        }

        if (element.classList.contains('bg-dark')) {
            element.classList.remove('bg-dark');
            element.classList.add('bg-light');
        }

        if (element.classList.contains('bg-black')) {
            element.classList.remove('bg-black');
            element.classList.add('bg-white');
        }

        if (element.classList.contains('bg-theme-dark')) {
            element.classList.remove('bg-theme-dark');
            element.classList.add('bg-theme-light');
        }

        if (element.classList.contains('color-theme-black')) {
            element.classList.remove('color-theme-black');
            element.classList.add('color-theme-white');
        }

        if (element.classList.contains('btn-outline-light')) {
            element.classList.remove('btn-outline-light');
            element.classList.add('btn-outline-dark');
        }

        if (element.classList.contains('bg-cover-black')) {
            element.classList.remove('bg-cover-black');
            element.classList.add('bg-cover-white');
        }
    };

    const toDark = (element) => {
        if (element.classList.contains('text-dark')) {
            element.classList.remove('text-dark');
            element.classList.add('text-light');
        }

        if (element.classList.contains('btn-theme-dark')) {
            element.classList.remove('btn-theme-dark');
            element.classList.add('btn-theme-light');
        }

        if (element.classList.contains('bg-light')) {
            element.classList.remove('bg-light');
            element.classList.add('bg-dark');
        }

        if (element.classList.contains('bg-white')) {
            element.classList.remove('bg-white');
            element.classList.add('bg-black');
        }

        if (element.classList.contains('bg-theme-light')) {
            element.classList.remove('bg-theme-light');
            element.classList.add('bg-theme-dark');
        }

        if (element.classList.contains('color-theme-white')) {
            element.classList.remove('color-theme-white');
            element.classList.add('color-theme-black');
        }

        if (element.classList.contains('btn-outline-dark')) {
            element.classList.remove('btn-outline-dark');
            element.classList.add('btn-outline-light');
        }

        if (element.classList.contains('bg-cover-white')) {
            element.classList.remove('bg-cover-white');
            element.classList.add('bg-cover-black');
        }
    };

    const onLight = () => {
        theme.set('active', THEME_LIGHT);
        document.documentElement.setAttribute('data-bs-theme', THEME_LIGHT);

        const elements = document.querySelectorAll('.text-light, .btn-theme-light, .bg-dark, .bg-black, .bg-theme-dark, .color-theme-black, .btn-outline-light, .bg-cover-black');

        let countChange = 0;
        elements.forEach((el) => {
            el.addEventListener('transitionend', (e) => {
                if (el.isEqualNode(e.target) && (e.propertyName === 'background-color' || e.propertyName === 'color')) {
                    countChange += 1;

                    if (elements.length === countChange) {
                        // --bs-body-bg
                        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#ffffff');
                    }
                }
            });
        });

        elements.forEach((el) => {
            observerLight.observe(el);
        });
    };

    const onDark = () => {
        theme.set('active', THEME_DARK);
        document.documentElement.setAttribute('data-bs-theme', THEME_DARK);

        const elements = document.querySelectorAll('.text-dark, .btn-theme-dark, .bg-light, .bg-white, .bg-theme-light, .color-theme-white, .btn-outline-dark, .bg-cover-white');

        let countChange = 0;
        elements.forEach((el) => {
            el.addEventListener('transitionend', (e) => {
                if (el.isEqualNode(e.target) && (e.propertyName === 'background-color' || e.propertyName === 'color')) {
                    countChange += 1;

                    if (elements.length === countChange) {
                        // --bs-body-bg
                        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#000000');
                    }
                }
            });
        });

        elements.forEach((el) => {
            observerDark.observe(el);
        });
    };

    const isDarkMode = (onDark = null, onLight = null) => {
        const status = theme.get('active') === THEME_DARK;

        if (onDark && onLight) {
            return status ? onDark : onLight;
        }

        return status;
    };

    const change = () => {
        if (isDarkMode()) {
            onLight();
        } else {
            onDark();
        }
    };

    const showButtonChangeTheme = () => {
        if (!isAuto) {
            return;
        }

        document.getElementById('button-theme').style.display = 'block';
    };

    const init = () => {
        theme = storage('theme');

        observerLight = new IntersectionObserver((es, o) => {
            es.forEach((e) => {
                if (e.isIntersecting) {
                    toLight(e.target);
                }
            });

            es.forEach((e) => {
                if (!e.isIntersecting) {
                    toLight(e.target);
                }
            });

            o.disconnect();
        });

        observerDark = new IntersectionObserver((es, o) => {
            es.forEach((e) => {
                if (e.isIntersecting) {
                    toDark(e.target);
                }
            });

            es.forEach((e) => {
                if (!e.isIntersecting) {
                    toDark(e.target);
                }
            });

            o.disconnect();
        });

        if (!theme.has('active')) {
            theme.set('active', THEME_LIGHT);

            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme.set('active', THEME_DARK);
            }
        }

        switch (document.body.getAttribute('data-theme')) {
            case 'dark':
                theme.set('active', THEME_DARK);
                break;
            case 'light':
                theme.set('active', THEME_LIGHT);
                break;
            default:
                isAuto = true;
                break;
        }

        if (isDarkMode()) {
            onDark();
        } else {
            onLight();
        }

        const toggle = document.getElementById('darkMode');
        if (toggle) {
            toggle.checked = isDarkMode();

            if (!isAuto) {
                toggle.parentElement.remove();
            }
        }
    };

    return {
        change,
        init,
        isDarkMode,
        showButtonChangeTheme
    };
})();