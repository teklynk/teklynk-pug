import { resolve } from 'path';
import fs from 'node:fs';
import moment from 'moment';
import dateformat from './dateformat';

function extractVars(content) {
    const vars = {};
    const varRegex = /- var (\w+)\s*=\s*['"](.*?)['"]/g;
    let match;
    while ((match = varRegex.exec(content)) !== null) {
        vars[match[1]] = match[2];
    }
    return {
        date: vars.date || 'Unknown Date',
        title: vars.title || 'Untitled',
        description: vars.description || 'No description available.',
    };
}

function generateIndex() {
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
.list-group.list-group-flush(id="blog-list")
    `;

    links.forEach(({ date, title, fileName }) => {
        const formattedDate = dateformat(date);
        pugContent += ` 
    a.list-group-item.list-group-item-action.list-group-item-dark(href="/blog/${fileName}.html")  ${formattedDate} - ${title}
        `;
    });

    fs.writeFileSync(resolve(includesPath, 'blog-index.pug'), pugContent);
}

function generateRssFeed() {
    // These should be configured somewhere, e.g. in a config file or package.json
    const site_url = 'https://www.teklynk.com'; // Change this to your site's URL
    const site_title = 'Teklynk';
    const site_description = 'Passionate about crafting innovative solutions through web development, programming, and hands-on tinkering';


    const blogPath = resolve(__dirname, 'src/pages/blog');
    const publicPath = resolve(__dirname, 'public'); // Vite copies files from 'public' to the dist root.

    if (!fs.existsSync(blogPath)) {
        console.error(`${blogPath}: Does not exist`);
        return;
    }

    const pugFiles = fs.readdirSync(blogPath).filter(file => file.endsWith('.pug'));

    const posts = pugFiles.map(pugFile => {
        const filePath = resolve(blogPath, pugFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { date, title, description } = extractVars(fileContent);
        const fileName = pugFile.replace('.pug', '');
        if (fileName === 'index') return null;
        return { date, title, description, fileName };
    }).filter(Boolean);

    // Sort posts by date
    posts.sort((a, b) => moment(b.date).diff(moment(a.date)));

    const feedItems = posts.map(({ date, title, description, fileName }) => {
        const postUrl = `${site_url}/blog/${fileName}`;
        // RSS spec requires RFC 822 date format
        const pubDate = moment(date).utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ');
        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    }).join('');

    const rssContent = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${site_title}</title>
  <link>${site_url}</link>
  <description>${site_description}</description>
  <language>en-us</language>
  <lastBuildDate>${moment().utc().format('ddd, DD MMM YYYY HH:mm:ss ZZ')}</lastBuildDate>
  <atom:link href="${site_url}/rss.xml" rel="self" type="application/rss+xml" />
  ${feedItems}
</channel>
</rss>`;

    if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath);
    }
    fs.writeFileSync(resolve(publicPath, 'rss.xml'), rssContent.trim());
    console.log('RSS feed generated at public/rss.xml');
}

export default function vitePluginGenerateIndex() {
    return {
        name: 'vite-plugin-generate-index',
        enforce: 'pre',
        apply: 'build',
        buildStart() {
            generateIndex();
            generateRssFeed();
        }
    };
}
