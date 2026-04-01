const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf-8');

const sIdx = indexHtml.indexOf('<aside id="sidebar"');
const eIdx = indexHtml.indexOf('</aside>', sIdx) + 8;
const newSidebar = indexHtml.substring(sIdx, eIdx);

const files = ['character.html', 'game-info.html', 'shop.html'];

for (const fpath of files) {
    if (!fs.existsSync(fpath)) continue;
    let content = fs.readFileSync(fpath, 'utf-8');
    
    let startIdx = content.indexOf('<!-- ===================== SIDEBAR ===================== -->');
    if (startIdx === -1) {
        startIdx = content.indexOf('<aside id="sidebar"');
    }
    
    let endIdx = content.indexOf('</aside>', startIdx);
    if (endIdx === -1) {
        console.log("Could not find </aside> in", fpath);
        continue;
    }
    endIdx += 8;
    
    let pName = 'Home';
    if (fpath.includes('character')) pName = 'Character';
    if (fpath.includes('game')) pName = 'Games';
    if (fpath.includes('shop')) pName = 'Shop';
    
    // De-activate Home manually
    let customSidebar = newSidebar.replace(
        'class="sidebar-link active flex items-center gap-3 px-3 py-[8px] bg-[#2a2d5e]/40 rounded-lg"><img src="./assets/images/icons/icon_home_o.png"',
        'class="sidebar-link flex items-center gap-3 px-3 py-[8px] text-[#ffffff]"><img src="./assets/images/icons/icon_home.png"'
    );
    
    // Activate current page manually
    if (pName === 'Character') {
        customSidebar = customSidebar.replace('class="sidebar-link flex items-center gap-3 px-3 py-[8px] text-[#ffffff]"><img src="./assets/images/icons/icon_Character.png"', 'class="sidebar-link active flex items-center gap-3 px-3 py-[8px] bg-[#2a2d5e]/40 rounded-lg"><img src="./assets/images/icons/icon_Character_o.png"');
    } else if (pName === 'Games') {
        customSidebar = customSidebar.replace('class="sidebar-link flex items-center gap-3 px-3 py-[8px] text-[#ffffff]"><img src="./assets/images/icons/icon_game.png"', 'class="sidebar-link active flex items-center gap-3 px-3 py-[8px] bg-[#2a2d5e]/40 rounded-lg"><img src="./assets/images/icons/icon_game_o.png"');
    } else if (pName === 'Shop') {
        customSidebar = customSidebar.replace('class="sidebar-link flex items-center gap-3 px-3 py-[8px] text-[#ffffff]"><img src="./assets/images/icons/icon_Shop.png"', 'class="sidebar-link active flex items-center gap-3 px-3 py-[8px] bg-[#2a2d5e]/40 rounded-lg"><img src="./assets/images/icons/icon_Shop_o.png"');
    }
    
    // Reconstruct
    let newContent = content.substring(0, startIdx) + '<!-- ===================== SIDEBAR ===================== -->\n    ' + customSidebar + content.substring(endIdx);
    
    // Fix any var(--sidebar-w, 200px) from previous script back to 188px
    newContent = newContent.replace(/--sidebar-w, 200px/g, '--sidebar-w, 188px');
    
    fs.writeFileSync(fpath, newContent, 'utf-8');
    console.log("Restored", fpath);
}
