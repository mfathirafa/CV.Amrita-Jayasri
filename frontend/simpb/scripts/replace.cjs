const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.jsx') && f !== 'NotificationBell.jsx' && f !== 'Dashboard.jsx');

let replacedCount = 0;

files.forEach(file => {
    const filePath = path.join(srcDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Simple regex to match the static bell button
    const bellRegex = /<button className="relative text-gray-500 hover:text-gray-800 transition-colors">[\s\S]*?<Bell className="w-5 h-5" \/>[\s\S]*?<\/button>/;

    if (bellRegex.test(content)) {
        content = content.replace(bellRegex, '<NotificationBell onNavigate={onNavigate || handleNavigation} />');
        
        if (!content.includes('NotificationBell from')) {
            const lines = content.split('\n');
            let lastImportIndex = 0;
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('import ')) {
                    lastImportIndex = i;
                }
            }
            lines.splice(lastImportIndex + 1, 0, "import NotificationBell from './NotificationBell';");
            content = lines.join('\n');
        }
        
        fs.writeFileSync(filePath, content);
        console.log('Updated ' + file);
        replacedCount++;
    }
});

console.log('Total files updated: ' + replacedCount);
