import { resolve } from 'path';
import fs from 'node:fs';
import moment from 'moment';

function extractVars(content) {
    const vars = {};
    const varRegex = /- var (\w+)\s*=\s*(?:(["'])(.*?)\2|(\[.*?\]))/g;
    let match;
    while ((match = varRegex.exec(content)) !== null) {
        if (match[4]) {
            try {
                vars[match[1]] = JSON.parse(match[4].replace(/'/g, '"'));
            } catch (e) {
                vars[match[1]] = [];
            }
        } else {
            vars[match[1]] = match[3];
        }
    }
    return {
        date: vars.date || 'Unknown Date',
        title: vars.title || 'Untitled',
        description: vars.description || 'No description available.',
        thumbnail: vars.thumbnail || '',
        gitHubUrl: vars.gitHubUrl || '',
        skills: vars.skills || []
    };
}

function generateList() {
    const portfolioPath = resolve(__dirname, 'src/pages/portfolio')
    const pugFiles = fs.readdirSync(portfolioPath).filter(file => file.endsWith('.pug'));
    const includesPath = resolve(__dirname, 'src/includes');

    if (!fs.existsSync(portfolioPath)) {
        console.error(`${portfolioPath}: Does not exist`);
        return
    }

    const links = pugFiles.map(pugFile => {
        const filePath = resolve(portfolioPath, pugFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { date, title, description, thumbnail, gitHubUrl, skills } = extractVars(fileContent);
        const fileName = pugFile.replace('.pug', '');
        if (fileName === 'index') return null;
        return { date, title, description, thumbnail, fileName, gitHubUrl, skills };
    }).filter(Boolean);

    // Sort links by date using moment for date comparison
    links.sort((a, b) => moment(b.date).diff(moment(a.date)));

    let pugContent = `
.row
    `;

    // Generate content for all portfolio items
    for (const { date, title, description, thumbnail, fileName, gitHubUrl, skills } of links) {
        let skillsHtml = '';
        if (Array.isArray(skills) && skills.length > 0) {
            skillsHtml = `ul.list-inline\n` + skills.sort().map(skill => `                    li.list-inline-item.badge.bg-secondary-dark.shadow-sm.p-2.m-1.fs-6 ${skill}`).join('\n');
        }

        pugContent += ` 
    .col-md-6.col-lg-4.mb-4
        .card.h-100.shadow-sm
            ${thumbnail ? `a.hover-zoom(href="/portfolio/${fileName}.html")
                img.card-img-top(src="${thumbnail}" alt="${title}")` : ''}
            .card-body
                h2.card-title.mt-0 ${title}
                p.card-text ${description}
                ${skillsHtml}
            .card-footer.d-flex.justify-content-between.align-items-center.h-40px
                a.btn.btn-link.p-0.m-0(href="/portfolio/${fileName}.html", target="_self") Read More
                ${gitHubUrl ? `a.p-0.m-0.fs-4(href="${gitHubUrl}", target="_blank", title="Check it out on GitHub"): i.fab.fa-github` : ''}
        `;
    }

    fs.writeFileSync(resolve(includesPath, 'portfolio-index.pug'), pugContent.trim());
}

export default function vitePluginGeneratePortfolioList() {
    return {
        name: 'vite-plugin-generate-portfolio-list',
        enforce: 'pre',
        apply: 'build',
        buildStart() {
            generateList();
        }
    };
}
