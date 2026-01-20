import { resolve } from 'path';
import fs from 'node:fs';
import moment from 'moment';
import dateformat from './dateformat';

function extractVars(content) {
    const vars = {};
    const varRegex = /- var (\w+)\s*=\s*(["'])(.*?)\2/g;
    let match;
    while ((match = varRegex.exec(content)) !== null) {
        vars[match[1]] = match[3];
    }
    return {
        date: vars.date || 'Unknown Date',
        title: vars.title || 'Untitled',
        description: vars.description || 'No description available.',
    };
}

function generateList() {
    const blogPath = resolve(__dirname, 'src/pages/blog')
    const pugFiles = fs.readdirSync(blogPath).filter(file => file.endsWith('.pug'));
    const includesPath = resolve(__dirname, 'src/includes');

    if (!fs.existsSync(blogPath)) {
        console.error(`${blogPath}: Does not exist`);
        return
    }

    const links = pugFiles.map(pugFile => {
        const filePath = resolve(blogPath, pugFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { date, title } = extractVars(fileContent);
        const fileName = pugFile.replace('.pug', '');
        if (fileName === 'index') return null;
        return { date, title, fileName };
    }).filter(Boolean);

    // Sort links by date using moment for date comparison
    links.sort((a, b) => moment(b.date).diff(moment(a.date)));

    let pugContent = `
ul(id="blog-list")
    `;

    // Generate content for all posts
    for (const { date, title, fileName } of links) {
        const formattedDate = dateformat(date);
        pugContent += ` 
    li
        a(href="/blog/${fileName}.html") ${formattedDate} - ${title}
        `;
    }

    fs.writeFileSync(resolve(includesPath, 'blog-index.pug'), pugContent.trim());

    // Generate content for recent posts (up to 5)
    let pugContentRecent = `
ul(id="blog-list-recent")
    `;

    const recentLinks = links.slice(0, 3);
    for (const { date, title, fileName } of recentLinks) {
        const formattedDate = dateformat(date);
        pugContentRecent += ` 
    li
        a(href="/blog/${fileName}.html") ${formattedDate} - ${title}
        `;
    }

    pugContentRecent += ` 
    li
        a(href="/blog/") All blog posts
        `;

    fs.writeFileSync(resolve(includesPath, 'blog-recent.pug'), pugContentRecent.trim());
}

export default function vitePluginGenerateBlogList() {
    return {
        name: 'vite-plugin-generate-blog-list',
        enforce: 'pre',
        apply: 'build',
        buildStart() {
            generateList();
        }
    };
}
