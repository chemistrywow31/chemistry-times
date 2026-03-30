(() => {
    'use strict';

    const PAGE_SIZE = 15;
    let currentPage = 0;
    let totalPages = 1;
    let allArticles = [];
    let isLoading = false;
    // Init language: query string > localStorage > default
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const savedLang = localStorage.getItem('chemistrytimes-lang');
    let currentLang = (urlLang === 'en' || urlLang === 'zh-tw') ? urlLang
        : (savedLang === 'en' || savedLang === 'zh-tw') ? savedLang
        : 'zh-tw';

    // DOM elements
    const articleList = document.getElementById('articleList');
    const pagination = document.getElementById('pagination');
    const articleFrame = document.getElementById('articleFrame');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const currentDateEl = document.getElementById('currentDate');
    const sidebar = document.getElementById('sidebar');
    const langToggle = document.getElementById('langToggle');
    const langLabel = document.getElementById('langLabel');
    const themeToggle = document.getElementById('themeToggle');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebarExpandBtn = document.getElementById('sidebarExpandBtn');
    const scrollFadeTop = document.getElementById('scrollFadeTop');
    const scrollFadeBottom = document.getElementById('scrollFadeBottom');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');

    // --- Language Toggle ---
    function switchLang() {
        currentLang = currentLang === 'zh-tw' ? 'en' : 'zh-tw';
        const label = currentLang === 'zh-tw' ? 'EN' : '中';
        if (langLabel) langLabel.textContent = label;

        // Toggle lang on shell body for sidebar titles
        document.body.dataset.lang = currentLang;
        localStorage.setItem('chemistrytimes-lang', currentLang);

        // Update query string
        const url = new URL(window.location);
        url.searchParams.set('lang', currentLang);
        history.replaceState(history.state, '', url);

        // Update navbar date + issue language
        updateNavbarDate();
        const activeItem = articleList?.querySelector('.article-item.active');
        if (activeItem) updateIssueNumber(activeItem.dataset.id);

        // Send to article iframe
        if (articleFrame && articleFrame.contentWindow) {
            articleFrame.contentWindow.postMessage(
                { type: 'lang-switch', lang: currentLang },
                '*'
            );
        }
    }

    // Listen for messages from iframes
    window.addEventListener('message', (e) => {
        if (e.data?.type === 'ruffle-loaded') {
            setTimeout(() => {
                const flashArea = document.querySelector('.pet-flashlight-area');
                if (flashArea && isDark()) {
                    flashArea.classList.add('ready');
                    setTimeout(() => setPetLight(true), 100);
                }
            }, 1500);
        }
        if (e.data?.type === 'section-change' && e.data.section) {
            const url = new URL(window.location);
            url.hash = e.data.section;
            history.replaceState(history.state, '', url);
        }
    });

    // Apply initial language
    document.body.dataset.lang = currentLang;
    if (langLabel) langLabel.textContent = currentLang === 'zh-tw' ? 'EN' : '中';

    if (langToggle) langToggle.addEventListener('click', switchLang);

    // --- Theme Toggle with View Transition ---
    const iframeThemeMask = document.getElementById('iframeThemeMask');
    const iconSun = themeToggle?.querySelector('.icon-sun');
    const iconMoon = themeToggle?.querySelector('.icon-moon');

    function isDark() {
        return document.documentElement.dataset.theme === 'dark';
    }

    function updateThemeIcon() {
        if (!iconSun || !iconMoon) return;
        iconSun.style.display = isDark() ? 'none' : 'block';
        iconMoon.style.display = isDark() ? 'block' : 'none';
    }

    function applyTheme(dark) {
        if (dark) {
            document.documentElement.dataset.theme = 'dark';
        } else {
            delete document.documentElement.dataset.theme;
        }
        localStorage.setItem('chemistrytimes-theme', dark ? 'dark' : 'light');
        updateThemeIcon();

        // Update iframe mask color
        if (iframeThemeMask) {
            iframeThemeMask.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
        }

        // Flashlight + pet tank light: delay on dark, hide on light
        const flashArea = document.querySelector('.pet-flashlight-area');
        if (flashArea) {
            if (dark) {
                flashArea.classList.remove('ready');
                setPetLight(false);
                setTimeout(() => {
                    flashArea.classList.add('ready');
                    setTimeout(() => setPetLight(true), 100);
                }, 1500);
            } else {
                flashArea.classList.remove('ready');
                setPetLight(false);
            }
        }
    }

    async function toggleTheme() {
        const goingDark = !isDark();

        // Show mask over iframe with current theme color before transition
        if (iframeThemeMask) {
            iframeThemeMask.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
            iframeThemeMask.classList.add('active');
        }

        // Fallback if View Transition API not supported or reduced motion preferred
        if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            applyTheme(goingDark);
            if (articleFrame?.contentWindow) {
                articleFrame.contentWindow.postMessage({ type: 'theme-switch', theme: goingDark ? 'dark' : 'light' }, '*');
            }
            setTimeout(() => {
                if (iframeThemeMask) iframeThemeMask.classList.remove('active');
            }, 100);
            return;
        }

        // Calculate ripple origin from toggle button center
        const rect = themeToggle.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const right = window.innerWidth - rect.left;
        const bottom = window.innerHeight - rect.top;
        const maxRadius = Math.hypot(Math.max(rect.left, right), Math.max(rect.top, bottom));

        // Start view transition
        const transition = document.startViewTransition(() => {
            applyTheme(goingDark);
        });

        await transition.ready;

        // Switch iframe theme behind the mask during animation
        if (articleFrame?.contentWindow) {
            articleFrame.contentWindow.postMessage({ type: 'theme-switch', theme: goingDark ? 'dark' : 'light' }, '*');
        }

        // Animate the ripple expand from toggle button
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration: 500,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)',
            }
        );

        await transition.finished;

        // Remove mask after animation completes
        if (iframeThemeMask) iframeThemeMask.classList.remove('active');
    }

    // --- Pet Tank Flashlight ---
    const petLightSwitch = document.getElementById('petLightSwitch');
    const petTankWrapper = document.querySelector('.pet-tank-wrapper');
    const petTank = document.querySelector('.pet-tank');
    let petLightOn = false;

    function setPetLight(on) {
        if (!petTankWrapper || !petTank) return;
        petLightOn = on;
        if (on) {
            petTankWrapper.classList.add('lights-on');
            setTimeout(() => petTank.classList.add('lights-on'), 100);
        } else {
            petTankWrapper.classList.remove('lights-on');
            petTank.classList.remove('lights-on');
        }
    }

    if (petLightSwitch) {
        petLightSwitch.addEventListener('click', () => {
            setPetLight(!petLightOn);
        });
    }

    // Init theme from localStorage
    const savedTheme = localStorage.getItem('chemistrytimes-theme');
    if (savedTheme === 'dark') {
        applyTheme(true);
    }
    updateThemeIcon();

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // --- Display Current Date (bilingual) ---
    const now = new Date();
    const navbarIssue = document.getElementById('navbarIssue');

    function updateNavbarDate() {
        if (!currentDateEl) return;
        if (currentLang === 'zh-tw') {
            currentDateEl.textContent = now.toLocaleDateString('zh-TW', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
            });
        } else {
            currentDateEl.textContent = now.toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
            });
        }
    }
    updateNavbarDate();

    // --- Utility Functions ---
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    // --- Fetch Articles (Infinite Scroll) ---
    async function fetchMore() {
        if (isLoading || currentPage >= totalPages) return;
        isLoading = true;

        const nextPage = currentPage + 1;

        // Show spinner
        if (allArticles.length === 0 && articleList) {
            articleList.innerHTML = '<div class="loading"><div class="spinner"></div></div><div id="pagination"></div>';
        } else if (pagination) {
            pagination.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        }

        try {
            const res = await fetch(`/chemistry-times/api/articles?page=${nextPage}&limit=${PAGE_SIZE}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            currentPage = data.page;
            totalPages = data.total_pages;
            const newArticles = data.articles || [];
            allArticles = allArticles.concat(newArticles);
            renderArticles(allArticles);
        } catch {
            if (allArticles.length === 0 && articleList) {
                articleList.innerHTML = '<div class="article-item-empty">無法載入文章列表</div><div id="pagination"></div>';
            }
        } finally {
            const paginationEl = document.getElementById('pagination');
            if (paginationEl) paginationEl.innerHTML = '';
            isLoading = false;

            // If sentinel is still visible within the sidebar, keep loading
            if (currentPage < totalPages && paginationEl && articleList) {
                const listRect = articleList.getBoundingClientRect();
                const sentinelRect = paginationEl.getBoundingClientRect();
                if (sentinelRect.top < listRect.bottom + 200) {
                    fetchMore();
                }
            }
        }
    }

    // --- Render Article List (Sidebar) ---
    function renderArticles(articles) {
        if (!articleList) return;

        if (!articles || articles.length === 0) {
            articleList.innerHTML = '<div class="article-item-empty">目前沒有文章</div><div id="pagination"></div>';
            return;
        }

        // Determine currently active article
        const params = new URLSearchParams(window.location.search);
        const activeId = params.get('article');

        let html = '';
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            const date = article.date || formatDate(article.created_at);
            const isActive = activeId && article.id === activeId;
            const titleEN = article.title_en ? escapeHtml(article.title_en) : escapeHtml(article.title);
            html += `
                <div class="article-item${isActive ? ' active' : ''}"
                     data-url="${escapeHtml(article.url)}"
                     data-id="${escapeHtml(article.id)}"
                     data-title="${escapeHtml(article.title)}"
                     tabindex="0"
                     role="button"
                     aria-label="Read: ${escapeHtml(article.title)}">
                    <div class="article-item-title">
                        <span class="lang-zh-tw">${escapeHtml(article.title)}</span>
                        <span class="lang-en">${titleEN}</span>
                    </div>
                    <div class="article-item-date">${date}</div>
                </div>
            `;
        }

        // Keep the pagination sentinel inside the list
        html += '<div id="pagination"></div>';
        articleList.innerHTML = html;

        // Attach click/keyboard events
        articleList.querySelectorAll('.article-item').forEach(item => {
            item.addEventListener('click', () => openArticle(item));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openArticle(item);
                }
            });
        });

        // Re-observe the pagination sentinel
        const newPagination = document.getElementById('pagination');
        if (newPagination) observer.observe(newPagination);

        // Update scroll fades
        updateScrollFades();
    }

    // --- Open Article ---
    function openArticle(item) {
        const url = item.dataset.url;
        const id = item.dataset.id;

        // Set iframe src and show it
        if (articleFrame) {
            const sep = url.includes('?') ? '&' : '?';
            const cacheBust = Math.floor(Date.now() / 3600000); // hourly
            articleFrame.src = url + sep + 'lang=' + currentLang + (isDark() ? '&theme=dark' : '') + '&_v=' + cacheBust;
            articleFrame.classList.add('visible');
        }

        // Hide welcome screen
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
        }

        // Set active class on sidebar item
        if (articleList) {
            articleList.querySelectorAll('.article-item').forEach(el => {
                el.classList.remove('active');
            });
        }
        item.classList.add('active');

        // Update issue number in navbar
        updateIssueNumber(id);

        // Update URL
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('article', id);
        history.pushState({ articleId: id }, '', newUrl);

        // Close mobile sidebar if open
        closeMobileSidebar();
    }

    function updateIssueNumber(articleId) {
        if (!navbarIssue) return;
        // Issue number = total articles - index (oldest = #001, newest = highest)
        const idx = allArticles.findIndex(a => a.id === articleId);
        if (idx === -1) {
            navbarIssue.textContent = '';
            return;
        }
        const issueNum = allArticles.length - idx;
        const padded = String(issueNum).padStart(3, '0');
        if (currentLang === 'zh-tw') {
            navbarIssue.textContent = '第 ' + padded + ' 期';
        } else {
            navbarIssue.textContent = 'Issue #' + padded;
        }
    }

    // --- Close Article (back to welcome) ---
    function closeArticle() {
        if (articleFrame) {
            articleFrame.src = '';
            articleFrame.classList.remove('visible');
        }

        if (welcomeScreen) {
            welcomeScreen.style.display = '';
        }

        // Remove active class from all items
        if (articleList) {
            articleList.querySelectorAll('.article-item').forEach(el => {
                el.classList.remove('active');
            });
        }

        // Clear issue number
        if (navbarIssue) navbarIssue.textContent = '';

        // Clear URL article param
        const newUrl = new URL(window.location);
        newUrl.searchParams.delete('article');
        history.replaceState({}, '', newUrl);
    }

    // --- Browser Back/Forward ---
    window.addEventListener('popstate', () => {
        const params = new URLSearchParams(window.location.search);
        if (!params.has('article')) {
            closeArticle();
        } else {
            // If navigating forward to an article, try to open it
            const articleId = params.get('article');
            const item = articleList
                ? articleList.querySelector(`.article-item[data-id="${CSS.escape(articleId)}"]`)
                : null;
            if (item) {
                // Open without pushing new history
                if (articleFrame) {
                    const popSep = item.dataset.url.includes('?') ? '&' : '?';
                    const popCache = Math.floor(Date.now() / 3600000);
                    articleFrame.src = item.dataset.url + popSep + 'lang=' + currentLang + (isDark() ? '&theme=dark' : '') + '&_v=' + popCache;
                    articleFrame.classList.add('visible');
                }
                if (welcomeScreen) welcomeScreen.style.display = 'none';
                if (articleList) {
                    articleList.querySelectorAll('.article-item').forEach(el => el.classList.remove('active'));
                }
                item.classList.add('active');
            }
        }
    });

    // --- Escape Key ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (articleFrame && articleFrame.classList.contains('visible')) {
                closeArticle();
                // Push state so back button works
                const newUrl = new URL(window.location);
                newUrl.searchParams.delete('article');
                history.pushState({}, '', newUrl);
            }
        }
    });

    // --- Sidebar Collapse/Expand ---
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', () => {
            if (sidebar) sidebar.classList.add('collapsed');
        });
    }

    if (sidebarExpandBtn) {
        sidebarExpandBtn.addEventListener('click', () => {
            if (sidebar) sidebar.classList.remove('collapsed');
        });
    }

    // --- Mobile Sidebar ---
    function openMobileSidebar() {
        if (sidebar) sidebar.classList.add('mobile-open');
        if (mobileOverlay) mobileOverlay.classList.add('open');
    }

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (mobileOverlay) mobileOverlay.classList.remove('open');
    }

    if (mobileSidebarToggle) mobileSidebarToggle.addEventListener('click', openMobileSidebar);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileSidebar);

    // --- Scroll Fade Indicators ---
    function updateScrollFades() {
        if (!articleList || !scrollFadeTop || !scrollFadeBottom) return;

        const hasOverflow = articleList.scrollHeight > articleList.clientHeight;

        if (!hasOverflow) {
            scrollFadeTop.classList.remove('visible');
            scrollFadeBottom.classList.remove('visible');
            return;
        }

        if (articleList.scrollTop > 0) {
            scrollFadeTop.classList.add('visible');
        } else {
            scrollFadeTop.classList.remove('visible');
        }

        if (articleList.scrollTop + articleList.clientHeight < articleList.scrollHeight) {
            scrollFadeBottom.classList.add('visible');
        } else {
            scrollFadeBottom.classList.remove('visible');
        }
    }

    if (articleList) {
        articleList.addEventListener('scroll', updateScrollFades);
    }
    window.addEventListener('resize', updateScrollFades);

    // --- Infinite Scroll Observer ---
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            fetchMore();
        }
    }, {
        root: articleList,
        rootMargin: '200px'
    });

    if (pagination) observer.observe(pagination);

    // --- Deep Link ---
    async function handleDeepLink() {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('article');
        if (!articleId) return;

        try {
            const res = await fetch(`/chemistry-times/api/articles/${encodeURIComponent(articleId)}`);
            if (!res.ok) return;
            const article = await res.json();

            const fragment = window.location.hash || '';
            if (articleFrame) {
                const sep = article.url.includes('?') ? '&' : '?';
                const cacheBust = Math.floor(Date.now() / 3600000);
                articleFrame.src = article.url + sep + 'lang=' + currentLang + (isDark() ? '&theme=dark' : '') + '&_v=' + cacheBust + fragment;
                articleFrame.classList.add('visible');
            }
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
            }

            // Set active sidebar item + issue number after articles load
            const waitForArticles = setInterval(() => {
                if (allArticles.length > 0) {
                    clearInterval(waitForArticles);
                    const activeItem = articleList?.querySelector(`.article-item[data-id="${CSS.escape(articleId)}"]`);
                    if (activeItem) activeItem.classList.add('active');
                    updateIssueNumber(articleId);
                }
            }, 100);
        } catch {
            // Ignore — fall through to normal view
        }
    }

    // --- Initial Load ---
    handleDeepLink();
    fetchMore().then(() => {
        // Show latest issue number by default, or the deep-linked article's issue
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('article');
        if (articleId) {
            updateIssueNumber(articleId);
        } else if (allArticles.length > 0) {
            // Show total count as latest issue number
            const padded = String(allArticles.length).padStart(3, '0');
            if (navbarIssue) {
                navbarIssue.textContent = currentLang === 'zh-tw'
                    ? '第 ' + padded + ' 期'
                    : 'Issue #' + padded;
            }
        }
    });
})();
