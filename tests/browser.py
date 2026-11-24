"""Browser smoke tests for RIFT RUNNER Evolution 4.0 (isolated Chromium profiles)."""
import json
import shutil
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
server=ThreadingHTTPServer(("127.0.0.1",0),partial(SimpleHTTPRequestHandler,directory=str(root)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f"http://127.0.0.1:{server.server_port}/index.html"
screenshots=Path("screenshots")
screenshots.mkdir(exist_ok=True)
try:
    with sync_playwright() as playwright:
        browser=playwright.chromium.launch(executable_path=shutil.which("google-chrome") or shutil.which("chromium"),args=["--no-sandbox"])
        for width,height in ((844,390),(390,844)):
            context=browser.new_context(viewport={"width":width,"height":height},has_touch=True,accept_downloads=True)
            page=context.new_page()
            errors=[]
            page.on("pageerror",lambda error:errors.append(str(error)))
            page.goto(url,wait_until="domcontentloaded")
            assert "EVOLUTION 4.0" in page.locator(".kicker").inner_text()
            page.screenshot(path=screenshots/f"4.0-menu-{width}.png")
            page.locator("#featuresBtn").tap()
            assert page.locator("#featureGuideList li").count()==39
            page.locator("#featuresBackBtn").tap()
            page.locator("#hangarBtn").tap()
            assert page.locator(".shopItem").count()==36
            page.locator("#hangarBackBtn").tap()
            page.locator("#achievementsBtn").tap()
            assert page.locator(".achievementItem").count()==7
            page.locator("#achievementsBackBtn").tap()
            page.locator("#settingsBtn").tap()
            assert page.locator(".visualStyleCard").count()==5
            assert page.locator("#styleOption-normal").get_attribute("aria-checked")=="true"
            page.locator("#styleOption-cosmic").tap()
            assert page.locator("#visualPreviewName").inner_text()=="DARK COSMIC SCI-FI"
            page.locator("#styleOption-hybrid").tap()
            assert page.locator("#styleOption-hybrid").get_attribute("aria-checked")=="true"
            assert page.locator("#styleOption-cosmic").get_attribute("aria-checked")=="false"
            page.locator("#styleEnemiesBtn").tap()
            assert page.locator("#styleEnemiesBtn").get_attribute("aria-checked")=="true"
            assert page.locator("#styleEnemiesBtn .switchValue").inner_text()=="LINKED"
            for toggle in ("#styleArmorBtn","#styleEffectsBtn"):
                page.locator(toggle).tap()
                assert page.locator(toggle).get_attribute("aria-checked")=="false"
            stored=page.evaluate("JSON.parse(localStorage.getItem('riftrunner_options_v1'))")
            assert stored['visualStyle']=='hybrid'
            assert stored['styleEnemies'] and not stored['styleArmor'] and not stored['styleEffects']
            page.screenshot(path=screenshots/f"phase1-visual-settings-{width}.png")
            page.locator("#settingsBackBtn").tap()
            page.reload(wait_until="domcontentloaded")
            page.locator("#settingsBtn").tap()
            assert page.locator("#styleOption-hybrid").get_attribute("aria-checked")=="true"
            assert page.locator("#styleEnemiesBtn").get_attribute("aria-checked")=="true"
            assert page.locator("#styleArmorBtn").get_attribute("aria-checked")=="false"
            assert page.locator("#styleEffectsBtn").get_attribute("aria-checked")=="false"
            page.locator("#fxBtn").tap()
            page.locator("#zoomBtn").tap()
            assert "FAR" in page.locator("#zoomBtn").inner_text()
            page.locator("#settingsBackBtn").tap()
            legacy={"game":"rift-runner-evolution","formatVersion":1,"progress":{"cores":47,"best":19,"upgrades":{"armor":2}}}
            page.on("dialog",lambda dialog:dialog.accept())
            page.locator("#importSaveInput").set_input_files({"name":"legacy.json","mimeType":"application/json","buffer":json.dumps(legacy).encode()})
            page.wait_for_function("document.querySelector('#saveStatus').textContent.includes('Backup imported.')")
            with page.expect_download() as download:
                page.locator("#exportSaveBtn").tap()
            exported=json.loads(Path(download.value.path()).read_text())["progress"]
            assert (exported["cores"],exported["best"],exported["upgrades"]["armor"])==(47,19,2)
            page.locator("#startBtn").tap()
            page.wait_for_function("document.querySelector('#time').textContent !== '0:00'",timeout=10000)
            assert "DRONE" in page.locator("#battleMetrics").inner_text()
            for action in ("dashBtn","shieldBtn","gravBtn"):
                page.locator("#"+action).tap()
            page.screenshot(path=screenshots/f"4.0-game-{width}.png")
            page.locator("#pauseBtn").tap()
            assert page.locator("#resumeBtn").is_visible()
            page.locator("#pauseSettingsBtn").tap()
            assert page.locator("#styleOption-hybrid").get_attribute("aria-checked")=="true"
            page.locator("#settingsBackBtn").tap()
            assert page.locator("#resumeBtn").is_visible()
            page.locator("#resumeBtn").tap()
            assert not errors,errors
            context.close()
            print(f"Passed {width}x{height} browser menus, import/export, combat controls, and screenshots")
        # Render the short interlude in a real browser without putting test hooks in production code.
        preview_html=(root/"index.html").read_text()
        injection_point="showBalance();$('endlessBestLine').textContent='ENDLESS RECORD · '+meta.stats.bestEndless+' eliminations';\n})();"
        assert injection_point in preview_html
        preview_html=preview_html.replace(injection_point, """showBalance();$('endlessBestLine').textContent='ENDLESS RECORD · '+meta.stats.bestEndless+' eliminations';
        window.__triggerVoid=()=>{start();advanceWave(4);waveElapsed=24;wavePhase='clear';enemies=[];player.invuln=999;update(.02);waveSweepRemaining=.01;update(.02)};
        window.__finishVoid=()=>{voidRemaining=.01;update(.02)};
        window.__killMilestone=(threshold)=>{
          start('endless');player.invuln=999;player.droneCount=0;walls=[];enemies=[];
          spawnTimer=999;endlessHordeClock=999;endlessSupplyClock=999;
          kills=threshold-1;spawnEnemy('drone',180,0);killed(enemies.at(-1));enemies=[];
          releaseEndlessKillMilestones();updateHUD();
          return {bosses:enemies.filter(e=>e.boss&&!e.mini).length,
            minis:enemies.filter(e=>e.boss&&e.mini).length,
            pending:endlessMilestoneQueue.length,cap:endlessEnemyCap()};
        };
        })();""")
        for width,height in ((844,390),(390,844)):
            ctx=browser.new_context(viewport={"width":width,"height":height},has_touch=True)
            pg=ctx.new_page()
            errors=[]
            pg.on("pageerror",lambda error:errors.append(str(error)))
            pg.route(url,lambda route:route.fulfill(content_type="text/html",body=preview_html))
            pg.goto(url)
            pg.evaluate("__triggerVoid()")
            pg.wait_for_timeout(200)
            assert "VOID BREACH" in pg.locator("#areaTag").inner_text()
            assert pg.locator("#voidClock").is_visible()
            assert "35s LEFT" in pg.locator("#voidClock").inner_text()
            assert "THE VOID HEART" in pg.locator("#bossName").inner_text()
            pg.screenshot(path=screenshots/f"void-breach-{width}.png")
            pg.evaluate("__finishVoid()")
            pg.wait_for_timeout(180)
            assert "NEON RUINS" in pg.locator("#areaTag").inner_text()
            assert not pg.locator("#voidClock").is_visible()
            assert not errors, errors
            ctx.close()
        # A separate browser context verifies Endless never loads normal wave UI.
        for width,height in ((844,390),(390,844)):
            ctx=browser.new_context(viewport={"width":width,"height":height},has_touch=True)
            pg=ctx.new_page();errors=[]
            pg.on("pageerror",lambda error:errors.append(str(error)))
            pg.goto(url)
            assert pg.locator("#endlessBtn").is_visible()
            pg.screenshot(path=screenshots/f"endless-menu-{width}.png")
            pg.locator("#endlessBtn").tap()
            pg.wait_for_function("document.querySelector('#wave').textContent.includes('ENDLESS')")
            assert "ECLIPSE CITADEL" in pg.locator("#areaTag").inner_text()
            assert "2.5× XP" in pg.locator("#battleMetrics").inner_text()
            assert not pg.locator("#voidClock").is_visible()
            pg.wait_for_timeout(1900)
            assert "ENDLESS" in pg.locator("#wave").inner_text()
            pg.screenshot(path=screenshots/f"endless-game-{width}.png")
            pg.locator("#pauseBtn").tap()
            assert pg.locator("#resumeBtn").is_visible()
            pg.locator("#resumeBtn").tap()
            assert not errors,errors
            ctx.close()
            print(f"Passed {width}x{height} Endless arena, nonstop HUD, pause and screenshot checks")
        # Test-only hook validates each kill milestone and the 1,000-kill raid in Chromium.
        # Production index.html contains no test hooks.
        for width,height in ((844,390),(390,844)):
            ctx=browser.new_context(viewport={"width":width,"height":height},has_touch=True)
            pg=ctx.new_page();errors=[]
            pg.on("pageerror",lambda error:errors.append(str(error)))
            pg.route(url,lambda route:route.fulfill(content_type="text/html",body=preview_html))
            pg.goto(url)
            for threshold,expected in [(65,(0,1)),(115,(1,0)),(1000,(1,2))]:
                actual=pg.evaluate("n=>__killMilestone(n)",threshold)
                assert (actual["bosses"],actual["minis"])==expected,(threshold,actual)
                assert actual["pending"]==0
                assert actual["bosses"]+actual["minis"]<=actual["cap"]
            pg.screenshot(path=screenshots/f"endless-1000-kill-bosses-{width}.png")
            assert not errors,errors
            ctx.close()
            print(f"Passed {width}x{height} kill-triggered mini-boss, boss, and triple raid")
        # Phase 3: distinct common-enemy art, true Normal fallback, independent enemy toggle.
        # These hooks only modify the test-only HTML served in Playwright, never index.html.
        phase3_hook="""
        window.__phase3Smoke=(style,enabled)=>{
          start('endless');player.invuln=999;player.droneCount=0;player.aura=0;
          enemies=[];bullets=[];enemyBullets=[];beams=[];rings=[];walls=[];zones=[];wells=[];
          camera.x=0;camera.y=0;shake=0;timer=9;
          const basic=[...PHASE3_BASIC_TYPES];
          for(let i=0;i<basic.length;i++){
            spawnEnemy(basic[i],-104+(i%5)*52,-91+Math.floor(i/5)*79);
            const e=enemies[enemies.length-1];e.x=-104+(i%5)*52;e.y=-91+Math.floor(i/5)*79;e.guard=0;e.hitPulse=0;e.flash=0;
          }
          for(const kind of ['blinkblade','prismgun','ironclad','stormweaver','swarmcarrier','boss']){
            spawnEnemy(kind,350,350);
          }
          gameSettings.visualStyle=style;gameSettings.styleEnemies=enabled;
          const previous=drawStyledBasicEnemy;let draws=0;
          drawStyledBasicEnemy=(enemy,variant)=>{draws++;return previous(enemy,variant)};
          render();drawStyledBasicEnemy=previous;
          return {draws,styledKinds:basic.length,total:enemies.length,mode:runMode};
        };
        """
        assert preview_html.count("function frame(now)")==1
        phase3_html=preview_html.replace('function frame(now)',phase3_hook+'\nfunction frame(now)',1)
        for width,height in ((844,390),(390,844)):
            ctx=browser.new_context(viewport={"width":width,"height":height},has_touch=True)
            pg=ctx.new_page();errors=[]
            pg.on("pageerror",lambda error:errors.append(str(error)))
            pg.route(url,lambda route:route.fulfill(content_type="text/html",body=phase3_html))
            pg.goto(url)
            for style in ('normal','military','neon','cosmic','hybrid'):
                result=pg.evaluate("style=>window.__phase3Smoke(style,true)",style)
                assert result['styledKinds']==15,result
                assert result['draws']==(0 if style=='normal' else 15),result
                if style=='hybrid':pg.screenshot(path=screenshots/f"phase3-hybrid-basic-enemies-{width}.png")
                if style!='normal':
                    fallback=pg.evaluate("style=>window.__phase3Smoke(style,false)",style)
                    assert fallback['draws']==0,fallback
            assert not errors,errors
            ctx.close()
            print(f"Passed {width}x{height} Phase 3 common enemy renderer and toggle-off fallback")

        # Full-world art overhaul: ensure the entire page changes—not just a sprite swatch.
        for width,height in ((844,390),(390,844)):
            context=browser.new_context(viewport={"width":width,"height":height},has_touch=True)
            pg=context.new_page();errors=[]
            pg.on("pageerror",lambda error:errors.append(str(error)))
            pg.goto(url,wait_until="domcontentloaded")
            pg.locator("#settingsBtn").tap()
            assert pg.locator("#styleDemo").get_attribute("width")=="720"
            seen_panels=set(); seen_previews=set()
            for style in ("normal","military","neon","cosmic","hybrid"):
                pg.locator("#styleOption-"+style).tap()
                selected=pg.evaluate("document.documentElement.getAttribute('data-art-style')")
                assert selected==(None if style=="normal" else style),(style,selected)
                preview=pg.locator("#styleDemo").evaluate("c=>c.toDataURL()")
                assert len(preview)>1000
                seen_previews.add(preview)
                panel_color=pg.locator("#settings .panel").evaluate("el=>getComputedStyle(el).borderColor")
                seen_panels.add(panel_color)
                pg.screenshot(path=screenshots/f"full-world-style-settings-{style}-{width}.png")
            assert len(seen_panels)==5,seen_panels
            assert len(seen_previews)==5,"Five distinct scene previews expected"
            pg.locator("#styleEnemiesBtn").tap()
            assert pg.locator("#styleEnemiesBtn").get_attribute("aria-checked")=="true"
            for toggle in ("styleArmorBtn","styleEffectsBtn"):
                pg.locator("#"+toggle).tap()
                assert pg.locator("#"+toggle).get_attribute("aria-checked")=="false"
            pg.locator("#settingsBackBtn").tap()
            pg.reload(wait_until="domcontentloaded")
            assert pg.evaluate("document.documentElement.getAttribute('data-art-style')")=="hybrid"
            assert "HYBRID" in pg.locator("#menuArtTag").inner_text()
            pg.locator("#settingsBtn").tap()
            assert pg.locator("#styleEnemiesBtn").get_attribute("aria-checked")=="true"
            for toggle in ("styleArmorBtn","styleEffectsBtn"):
                assert pg.locator("#"+toggle).get_attribute("aria-checked")=="false"
                pg.locator("#"+toggle).tap()
            pg.locator("#settingsBackBtn").tap()
            pg.locator("#endlessBtn").tap()
            pg.wait_for_function("document.querySelector('#wave').textContent.includes('ENDLESS')")
            assert "HYBRID" in pg.locator("#hudArtTag").inner_text()
            pg.screenshot(path=screenshots/f"full-world-hybrid-endless-{width}.png")
            pg.locator("#pauseBtn").tap()
            pg.locator("#pauseSettingsBtn").tap()
            pg.locator("#styleOption-military").tap()
            assert pg.evaluate("document.documentElement.getAttribute('data-art-style')")=="military"
            pg.locator("#settingsBackBtn").tap()
            assert pg.locator("#resumeBtn").is_visible()
            pg.locator("#resumeBtn").tap()
            assert pg.locator("#hudArtTag").inner_text().upper()=="MILITARY SCI-FI"
            assert not errors,errors
            context.close()
            print(f"Passed {width}x{height} all five full-world styles, CSS palettes, preview art, persisted toggles and in-run switching")

        # Phase 4 gallery directly renders the SAME sprites used in combat, across styles.
        # Inspect a style switch after selecting Normal with enemy-art turned off.
        for width,height in ((844,390),(390,844)):
            context=browser.new_context(viewport={"width":width,"height":height},has_touch=True)
            pg=context.new_page();errors=[]
            pg.on("pageerror",lambda error:errors.append(str(error)))
            pg.goto(url)
            pg.locator("#settingsBtn").tap()
            assert pg.locator("[data-phase4-kind]").count()==5
            signatures={}
            for style in ("normal","military","neon","cosmic","hybrid"):
                pg.locator("#styleOption-"+style).tap()
                models=pg.locator("[data-phase4-kind]").evaluate_all("els=>els.map(el=>({kind:el.dataset.phase4Kind,signature:el.toDataURL().slice(0,1200),size:el.toDataURL().length}))")
                assert len(models)==5,models
                assert all(model["size"]>1200 for model in models),models
                signatures[style]=[model["signature"] for model in models]
                assert pg.locator("#styleEnemiesBtn").get_attribute("aria-checked")=="true"
                if style!="normal":assert pg.locator("#styleEnemiesBtn .switchValue").inner_text()=="LINKED"
                pg.locator("#phase4GalleryHeading").scroll_into_view_if_needed()
                pg.screenshot(path=screenshots/f"phase4-gallery-{style}-{width}.png")
            assert len({tuple(v) for v in signatures.values()})==5,"Each visual style must show distinct enemy models"
            pg.locator("#styleOption-normal").tap()
            pg.locator("#styleEnemiesBtn").tap()
            assert pg.locator("#styleEnemiesBtn").get_attribute("aria-checked")=="false"
            pg.locator("#styleOption-military").tap()
            assert pg.locator("#styleEnemiesBtn").get_attribute("aria-checked")=="true"
            assert not errors,errors
            context.close()
            print(f"Passed Phase 4 {width}x{height}: 5 real specialist previews × 5 themes, automatic enemy linking, Normal fallback")

        # Render in-game specialists and capture proof for four art styles and Normal.
        base_html=(root/"index.html").read_text()
        hook="""
        window.__phase4Encounter=(style,fx)=>{
          start('endless');player.invuln=999;player.droneCount=0;player.aura=0;
          enemies=[];bullets=[];enemyBullets=[];beams=[];rings=[];walls=[];zones=[];wells=[];
          camera.x=0;camera.y=0;shake=0;timer=10;
          gameSettings.visualStyle=style;gameSettings.styleEnemies=style!=='normal';
          gameSettings.fx=fx;gameSettings.styleEffects=fx!=='low';applyVisualTheme();
          const kinds=[...PHASE4_SPECIALISTS];
          for(let i=0;i<kinds.length;i++){
           spawnEnemy(kinds[i],-190+i*96,0);
           const e=enemies.at(-1);e.x=-190+i*96;e.y=0;e.r=types[kinds[i]].r*1.6;
           e.flash=0;e.teleport=.6;e.mineTimer=.4;e.shot=.2;e.guard=1;
           e.charge={windup:.3,vx:1,vy:0};
          }
          render();return {enemyKinds:enemies.map(e=>e.kind),hp:enemies.map(e=>e.hp)};
        };
        """
        assert base_html.count("function frame(now)")==1
        custom_html=base_html.replace("function frame(now)",hook+"\nfunction frame(now)",1)
        for width,height in ((844,390),(390,844)):
            ctx=browser.new_context(viewport={"width":width,"height":height},has_touch=True)
            pg=ctx.new_page();errs=[]
            pg.on("pageerror",lambda err:errs.append(str(err)))
            pg.route(url,lambda route:route.fulfill(content_type="text/html",body=custom_html))
            pg.goto(url)
            for style in ("normal","military","neon","cosmic","hybrid"):
                e=pg.evaluate("style=>window.__phase4Encounter(style,'balanced')",style)
                assert len(e["enemyKinds"])==5,e
                pg.screenshot(path=screenshots/f"phase4-combat-{style}-{width}.png")
            low=pg.evaluate("window.__phase4Encounter('neon','low')")
            assert len(low["enemyKinds"])==5
            assert not errs,errs
            ctx.close()
            print(f"Passed Phase 4 {width}x{height}: advanced enemy combat and warning animations, Normal, Low FX")
        browser.close()
finally:
    server.shutdown()
