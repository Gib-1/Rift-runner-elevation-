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
            assert page.locator("#featureGuideList li").count()==35
            page.locator("#featuresBackBtn").tap()
            page.locator("#hangarBtn").tap()
            assert page.locator(".shopItem").count()==26
            page.locator("#hangarBackBtn").tap()
            page.locator("#achievementsBtn").tap()
            assert page.locator(".achievementItem").count()==7
            page.locator("#achievementsBackBtn").tap()
            page.locator("#settingsBtn").tap()
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
        browser.close()
finally:
    server.shutdown()
