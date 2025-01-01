import { resolve } from 'path';
import fs from 'node:fs';

function extractVars(content) {
    const dateMatch = content.match(/- var date = "(.*)"/);
    const titleMatch = content.match(/- var title = "(.*)"/);
    return {
        date: dateMatch ? dateMatch[1] : 'Unknown Date',
        title: titleMatch ? titleMatch[1] : 'Untitled'
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

    links.sort((a, b) => new Date(b.date) - new Date(a.date));

    let pugContent = `
.list-group.list-group-flush(id="blog-list")
    `;

    links.forEach(({ date, title, fileName }) => {
        pugContent += ` 
    a.list-group-item.list-group-item-action.list-group-item-dark(href="/blog/${fileName}")  ${date} - ${title}
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
