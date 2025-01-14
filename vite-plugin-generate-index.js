import { resolve } from 'path';
import fs from 'node:fs';
import moment from 'moment';
import dateformat from './dateformat';

function extractVars(content) {
    const dateMatch = content.match(/- var date = "(.*)"/);
    const titleMatch = content.match(/- var title = "(.*)"/);
    const draftMatch = content.match(/- var draft = "(.*)"/);
    return {
        date: dateMatch ? dateMatch[1] : 'Unknown Date',
        title: titleMatch ? titleMatch[1] : 'Untitled',
        draft: draftMatch ? draftMatch[1] : ''
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
        const { date, title, draft } = extractVars(fileContent);
        const fileName = pugFile.replace('.pug', '');
        if (fileName === 'index') return null;
        if (draft === 'true') return null;
        return { date, title, draft, fileName };
    }).filter(Boolean);

    // Sort links by date using moment for date comparison
    links.sort((a, b) => moment(b.date).diff(moment(a.date)));

    let pugContent = `
.list-group.list-group-flush(id="blog-list")
    `;

    links.forEach(({ date, title, fileName }) => {
        const formattedDate = dateformat(date);
        pugContent += ` 
    a.list-group-item.list-group-item-action.list-group-item-dark(href="/blog/${fileName}")  ${formattedDate} - ${title}
        `;
    });

    fs.writeFileSync(resolve(includesPath, 'blog-index.pug'), pugContent);
}

export default function vitePluginGenerateIndex() {
    return {
        name: 'vite-plugin-generate-index',
        buildStart() {
            generateIndex();
        }
    };
}
