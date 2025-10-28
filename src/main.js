import './assets/scss/styles.scss'
import 'bootstrap'
import 'prismjs'
import 'prismjs/components/prism-json'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'
import moment from 'moment'

window.moment = moment;

window.main = true;

const topNav = document.querySelector("#topNav");
const navMain = document.querySelector('#nav-main');
const scrollTopButton = document.querySelector('.scrollTop');
const body = document.body;

// Use a single scroll event listener for all scroll-related events
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (topNav) {
        topNav.classList.toggle("shadow", scrollY >= 40);
    }

    const isScrolledPastNav = scrollY > 60;

    if (scrollTopButton) {
        scrollTopButton.classList.toggle('hide', !isScrolledPastNav);
    }

    if (body) {
        body.classList.toggle('pt-5', isScrolledPastNav);
        body.classList.toggle('pt-0', !isScrolledPastNav);
    }

    if (navMain) {
        navMain.classList.toggle('fixed-top', isScrolledPastNav);
        navMain.classList.toggle('shadow', isScrolledPastNav);
        navMain.classList.toggle('static-top', !isScrolledPastNav);
    }
});

// Blog search
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const list = document.getElementById('blog-list');
        if (!list) {
            return;
        }
        const items = list.getElementsByTagName('li');

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // 3 character limit
            if (filter.length < 3) {
                item.style.display = "";
                continue;
            }

            const txtValue = item.textContent || item.innerText;
            if (txtValue.toLowerCase().includes(filter)) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        }
    });
}

if (scrollTopButton) {
    scrollTopButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor behavior
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}