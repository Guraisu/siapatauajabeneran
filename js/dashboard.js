import { like } from './like.js';
import { util } from './util.js';
import { admin } from './admin.js';
import { theme } from './theme.js';
import { offline } from './offline.js';
import { comment } from './comment.js';
import { pagination } from './pagination.js';

document.addEventListener('DOMContentLoaded', () => {
    theme.init();
    admin.init();
    offline.init();
    pagination.init();

    window.util = util;
    window.like = like;
    window.admin = admin;
    window.theme = theme;
    window.comment = comment;
    window.pagination = pagination;
});