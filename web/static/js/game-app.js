(() => {
    'use strict';

    const PAGE_SIZE = 15;
    let currentPage = 1;
    let totalPages = 1;

    // DOM elements
    const articleList = document.getElementById('articleList');
    const pagination = document.getElementById('pagination');
    const articleFrame = document.getElementById('articleFrame');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const currentDateEl = document.getElementById('currentDate');

    // Display current date in YYYY.MM.DD format
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    currentDateEl.textContent = `${yyyy}.${mm}.${dd}`;

    // Fetch articles
    async function fetchArticles(page) {
        articleList.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        try {
            const res = await fetch(`/chemistry-game-times/api/articles?page=${page}&limit=${PAGE_SIZE}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            currentPage = data.page;
            totalPages = data.total_pages;
            renderArticles(data.articles);
            renderPagination();
        } catch (err) {
            articleList.innerHTML = '<div class="article-item-empty">無法載入文章列表</div>';
        }
    }

    // Render article list
    function renderArticles(articles) {
        if (!articles || articles.length === 0) {
            articleList.innerHTML = '<div class="article-item-empty">目前沒有文章</div>';
            return;
        }

        articleList.innerHTML = articles.map(article => {
            const date = article.date || (() => { const d = new Date(article.created_at); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`; })();
            return `
                <div class="article-item" data-url="${escapeHtml(article.url)}" data-id="${article.id}">
                    <div class="article-item-title">${escapeHtml(article.title)}</div>
                    <div class="article-item-date">${date}</div>
                </div>
            `;
        }).join('');

        // Attach click events
        articleList.querySelectorAll('.article-item').forEach(item => {
            item.addEventListener('click', () => {
                articleList.querySelectorAll('.article-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const url = item.dataset.url;
                welcomeScreen.style.display = 'none';
                articleFrame.style.display = 'block';
                articleFrame.src = url;
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    // Render pagination
    function renderPagination() {
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        pagination.innerHTML = `
            <button class="pagination-btn" id="prevBtn" ${currentPage <= 1 ? 'disabled' : ''}>
                ‹ 上一頁
            </button>
            <span class="pagination-info">${currentPage} / ${totalPages}</span>
            <button class="pagination-btn" id="nextBtn" ${currentPage >= totalPages ? 'disabled' : ''}>
                下一頁 ›
            </button>
        `;

        document.getElementById('prevBtn')?.addEventListener('click', () => {
            if (currentPage > 1) fetchArticles(currentPage - 1);
        });
        document.getElementById('nextBtn')?.addEventListener('click', () => {
            if (currentPage < totalPages) fetchArticles(currentPage + 1);
        });
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Mobile sidebar toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Deep link: auto-load article from ?article=ID#fragment
    async function handleDeepLink() {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('article');
        if (!articleId) return;

        try {
            const res = await fetch(`/chemistry-game-times/api/articles/${encodeURIComponent(articleId)}`);
            if (!res.ok) return;
            const article = await res.json();

            welcomeScreen.style.display = 'none';
            articleFrame.style.display = 'block';

            const fragment = window.location.hash || '';
            articleFrame.src = article.url + fragment;
        } catch {
            // Ignore — fall through to normal view
        }
    }

    // Initial load
    handleDeepLink();
    fetchArticles(1);
})();
