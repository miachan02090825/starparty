const fs = require('fs');
const path = require('path');

function generateSidebarHtml(activePage) {
    function link(name, iconName, isActive, href) {
        let img = `images/menu/Property 1=icon_${iconName}${isActive ? '_o' : ''}.png`;
        if (name === 'Gacha') {
            img = `images/menu/Property 1=icon-gacha${isActive ? '_o' : ''}.png`;
        }
        const textColor = "text-[#ffffff]";
        const rect = isActive ? '<div class="absolute left-0 top-0 w-[4px] h-full bg-[#5063b0]"></div>' : '';
        
        return `
          <div class="sidebar-link relative flex items-center gap-[14px] py-0 px-[14px] cursor-pointer hover:bg-white/5 transition" onclick="window.location.href='${href}'" style="min-height: 38px;">
            ${rect}
            <div class="w-[26px] h-[26px] flex-shrink-0 flex items-center justify-center">
              <img src="${img}" class="w-full h-full object-contain" />
            </div>
            <div class="${textColor} font-['Nunito'] font-semibold text-[15px] nav-text whitespace-nowrap">${name}</div>
          </div>`;
    }

    const s1Items = [
        ['Home', 'home', 'index.html'],
        ['Games', 'game', 'game-info.html'],
        ['Character', 'Character', 'character.html'],
        ['Gacha', 'gacha', '#'],
        ['Shop', 'Shop', 'shop.html'],
        ['Rank', 'Rank', '#'],
        ['StarCards', 'StarCards', '#'],
        ['Play Ground', 'PlayGround', '#'],
        ['Daily Rewards', 'DailyRewards', '#'],
        ['Reward Center', 'RewardCenter', '#'],
        ['Achievement', 'Achievement', '#'],
        ['Inventory', 'Inventory', '#']
    ];
    
    const s2Items = [
        ['Action', 'Action', '#'],
        ['Match', 'Match', '#'],
        ['Puzzle', 'Puzzle', '#'],
        ['Multiplayer', 'Multiplayer', '#'],
        ['Others', 'Others', '#']
    ];
    
    const s1Html = s1Items.map(([n, i, h]) => link(n, i, n === activePage, h)).join('');
    const s2Html = s2Items.map(([n, i, h]) => link(n, i, n === activePage, h)).join('');
    
    return `<!-- ===================== SIDEBAR ===================== -->
    <aside id="sidebar" class="w-sidebar fixed top-0 left-0 bottom-0 z-[60] flex flex-col bg-gradient-to-r from-[#232a50] to-[#14162f] border-r border-[#1a1c35] overflow-x-hidden shrink-0 pt-3" style="--sidebar-w: 200px;">
      
      <!-- Top header for collapse (only visible when floating in tailwind layout) -->
      <div class="sidebar-header flex items-center justify-center w-full pb-3 mb-2 border-b border-[#384da1]/30 flex-shrink-0 md:hidden">
        <button class="w-[32px] h-[32px] hover:brightness-125 transition focus:outline-none flex-shrink-0" onclick="document.body.classList.toggle('sidebar-collapsed')">
            <img src="images/nav/game_other_btn_n.png" class="w-full h-full object-contain" alt="Toggle Menu">
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-1 pt-2 flex flex-col items-start w-full gap-1.5" style="overflow-x: hidden;">
        <div class="flex flex-col w-full gap-1.5">
            ${s1Html}
        </div>
        
        <div class="w-full h-[1px] bg-[#384da1] my-1"></div>
        
        <div class="flex flex-col w-full gap-1.5 pt-1">
            ${s2Html}
        </div>
      </nav>
      
      <!-- Ad Banners -->
      <div class="px-2 pb-4 pt-2 space-y-2 sidebar-banners-area">
        <div class="rounded-[17px] relative overflow-hidden cursor-pointer shadow-md w-[80%] mx-auto h-[85px] flex items-center justify-center hover:scale-[1.02] transition">
            <img src="images/banner.png" class="w-full h-auto object-cover">
        </div>
        <div class="rounded-[17px] relative overflow-hidden cursor-pointer shadow-md w-[80%] mx-auto h-[85px] flex items-center justify-center hover:scale-[1.02] transition">
            <img src="images/banner.png" class="w-full h-auto object-cover">
        </div>
      </div>
    </aside>`;
}

const files = ['character.html', 'game-info.html', 'shop.html'];

for (const fpath of files) {
    if (!fs.existsSync(fpath)) continue;
    let content = fs.readFileSync(fpath, 'utf-8');
    
    let pageName = 'Home';
    if (fpath.includes('character')) pageName = 'Character';
    if (fpath.includes('game')) pageName = 'Games';
    if (fpath.includes('shop')) pageName = 'Shop';
    
    let sIdx = content.indexOf('<!-- ===================== SIDEBAR ===================== -->');
    if (sIdx === -1) {
        sIdx = content.indexOf('<aside id="sidebar"');
        if (sIdx === -1) {
            console.log("Did not find sidebar in", fpath);
            continue;
        }
    }
    
    const eIdx = content.indexOf('</aside>', sIdx);
    if (eIdx === -1) {
        console.log("Did not find aside end in", fpath);
        continue;
    }
    
    const newSidebar = generateSidebarHtml(pageName);
    let newContent = content.substring(0, sIdx) + newSidebar + content.substring(eIdx + 8);
    
    newContent = newContent.replace('--sidebar-w, 188px', '--sidebar-w, 200px');
    
    fs.writeFileSync(fpath, newContent, 'utf-8');
    console.log("Updated", fpath);
}
