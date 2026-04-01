import os
import re

def generate_sidebar_html(active_page):
    def link(name, icon_name, is_active, href):
        img = f"images/menu/Property 1=icon_{icon_name}{'_o' if is_active else ''}.png"
        text_color = "text-[#ffffff]" if is_active else "text-[#ffffff]"
        # active border on left
        rect = '<div class="absolute left-0 top-0 w-[4px] h-full bg-[#5063b0]"></div>' if is_active else ''
        
        if name == 'Gacha': img = f"images/menu/Property 1=icon-gacha{'_o' if is_active else ''}.png"
        
        return f"""
          <div class="sidebar-link relative flex items-center gap-[14px] py-0 px-[14px] cursor-pointer hover:bg-white/5 transition" onclick="window.location.href='{href}'" style="min-height: 38px;">
            {rect}
            <div class="w-[26px] h-[26px] flex-shrink-0 flex items-center justify-center">
              <img src="{img}" class="w-full h-full object-contain" />
            </div>
            <div class="{text_color} font-['Nunito'] font-semibold text-[15px] nav-text whitespace-nowrap">{name}</div>
          </div>"""

    s1_items = [
        ('Home', 'home', 'index.html'),
        ('Games', 'game', 'game-info.html'),
        ('Character', 'Character', 'character.html'),
        ('Gacha', 'gacha', '#'),
        ('Shop', 'Shop', 'shop.html'),
        ('Rank', 'Rank', '#'),
        ('StarCards', 'StarCards', '#'),
        ('Play Ground', 'PlayGround', '#'),
        ('Daily Rewards', 'DailyRewards', '#'),
        ('Reward Center', 'RewardCenter', '#'),
        ('Achievement', 'Achievement', '#'),
        ('Inventory', 'Inventory', '#')
    ]
    
    s2_items = [
        ('Action', 'Action', '#'),
        ('Match', 'Match', '#'),
        ('Puzzle', 'Puzzle', '#'),
        ('Multiplayer', 'Multiplayer', '#'),
        ('Others', 'Others', '#')
    ]
    
    s1_html = "".join(link(n, i, n==active_page, h) for n, i, h in s1_items)
    s2_html = "".join(link(n, i, n==active_page, h) for n, i, h in s2_items)
    
    sidebar = f"""<!-- ===================== SIDEBAR ===================== -->
    <aside id="sidebar" class="w-sidebar fixed top-0 left-0 bottom-0 z-[60] flex flex-col bg-gradient-to-r from-[#232a50] to-[#14162f] border-r border-[#1a1c35] overflow-x-hidden shrink-0 pt-3" style="--sidebar-w: 200px;">
      
      <!-- Top header for collapse (only visible when floating in tailwind layout) -->
      <div class="sidebar-header flex items-center justify-center w-full pb-3 mb-2 border-b border-[#384da1]/30 flex-shrink-0 md:hidden">
        <button class="w-[32px] h-[32px] hover:brightness-125 transition focus:outline-none flex-shrink-0" onclick="document.body.classList.toggle('sidebar-collapsed')">
            <img src="images/nav/game_other_btn_n.png" class="w-full h-full object-contain" alt="Toggle Menu">
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto py-1 pt-2 flex flex-col items-start w-full gap-1.5" style="overflow-x: hidden;">
        <div class="flex flex-col w-full gap-1.5">
            {s1_html}
        </div>
        
        <div class="w-full h-[1px] bg-[#384da1] my-1"></div>
        
        <div class="flex flex-col w-full gap-1.5 pt-1">
            {s2_html}
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
    </aside>"""
    return sidebar

def process():
    for fpath in ['character.html', 'game-info.html', 'shop.html']:
        if not os.path.exists(fpath): continue
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        page_name = 'Home'
        if 'character' in fpath: page_name = 'Character'
        if 'game' in fpath: page_name = 'Games'
        if 'shop' in fpath: page_name = 'Shop'
        
        # We start from <!-- ===================== SIDEBAR ===================== --> or <aside id="sidebar"
        s_idx = content.find('<!-- ===================== SIDEBAR ===================== -->')
        if s_idx == -1:
            s_idx = content.find('<aside id="sidebar"')
            if s_idx == -1:
                print("Did not find sidebar in", fpath)
                continue
            
        e_idx = content.find('</aside>', s_idx)
        if e_idx == -1:
            print("Did not find aside end in", fpath)
            continue
            
        new_sidebar = generate_sidebar_html(page_name)
        new_content = content[:s_idx] + new_sidebar + content[e_idx+8:]
        
        # Update styling vars
        new_content = new_content.replace('--sidebar-w, 188px', '--sidebar-w, 200px')
        
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated", fpath)

process()
