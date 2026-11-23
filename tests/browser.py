"""Run with Playwright and Chromium installed. Uses disposable browser profiles."""
import json
import statistics
import shutil
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SimpleHTTPRequestHandler, directory=str(root)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}"
shots = Path("screenshots")
shots.mkdir(exist_ok=True)
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(executable_path=shutil.which("google-chrome") or shutil.which("chromium"), args=["--no-sandbox"])
    for width, height in [(844, 390), (390, 844)]:
        context = browser.new_context(viewport={"width": width, "height": height}, has_touch=True)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(url)
        page.screenshot(path=shots / f"menu-{width}.png")
        page.locator("#hangarBtn").tap()
        assert page.locator(".shopItem").count() == 26
        page.locator("#hangarBackBtn").tap()
        page.locator("#achievementsBtn").tap()
        assert page.locator(".achievementItem").count() == 7
        page.locator("#achievementsBackBtn").tap()
        page.locator("#settingsBtn").tap()
        page.locator("#fxBtn").tap()
        if width < height:
            page.locator("#cameraBtn").tap()
        page.locator("#settingsBackBtn").tap()
        page.locator("summary").tap()
        fixture = {"game":"rift-runner-evolution","formatVersion":1,"progress":{"cores":47,"best":19,"upgrades":{"armor":2}}}
        page.on("dialog", lambda dialog: dialog.accept())
        page.locator("#importSaveInput").set_input_files({"name":"legacy.json","mimeType":"application/json","buffer":json.dumps(fixture).encode()})
        page.wait_for_function("document.querySelector('#saveStatus').textContent.includes('Backup imported.')")
        with page.expect_download() as download:
            page.locator("#exportSaveBtn").tap()
        restored = json.loads(Path(download.value.path()).read_text())["progress"]
        assert (restored["cores"],restored["best"],restored["upgrades"]["armor"]) == (47,19,2)
        page.locator("#startBtn").tap()
        page.wait_for_function("document.querySelector('#time').textContent !== '0:00'")
        zone = page.locator("#moveZone").bounding_box()
        x, y = int(zone["x"]+80), int(zone["y"]+70)
        cdp = context.new_cdp_session(page)
        for event,points in [("touchStart",[{"x":x,"y":y}]),("touchMove",[{"x":x+35,"y":y+12}])]:
            cdp.send("Input.dispatchTouchEvent",{"type":event,"touchPoints":points})
        stick = page.locator("#stick").bounding_box()
        assert abs(stick["x"]+stick["width"]/2-x)<3 and abs(stick["y"]+stick["height"]/2-y)<3
        cdp.send("Input.dispatchTouchEvent",{"type":"touchEnd","touchPoints":[]})
        for button in ["dashBtn","shieldBtn","gravBtn"]:
            page.locator("#"+button).tap()
        page.wait_for_timeout(900)
        page.screenshot(path=shots / f"mission-{width}.png")
        page.locator("#pauseBtn").tap()
        assert page.locator("#resumeBtn").is_visible()
        page.locator("#resumeBtn").tap()
        assert not errors, errors
        context.close()
    # Seed a dense battle through a test-only instrumented response.
    page = browser.new_page(viewport={"width":844,"height":390})
    html = (root/"index.html").read_text().replace("showBalance();\n})();","""showBalance();
    window.previewBiome=i=>{start();mapIndex=i;makeWorld();player.invuln=999;bannerTime=0;$('banner').style.opacity=0;
    updateHUD();walls=walls.filter(w=>Math.hypot(w.x,w.y)>370);walls.push({x:86,y:-24,w:106,h:48,detail:.4});
    spawnEnemy(i===7?'abyss':'hunter',-108,-42);setMode('pause');ui.pause.classList.add('hidden');render()};
    window.stress=()=>{start();player.invuln=999;walls=[];enemies=[];for(let i=0;i<120;i++)spawnEnemy('drone',60+i%15*14,-130+Math.floor(i/15)*28)};
    })();""")
    page.route(url+"/", lambda route:route.fulfill(content_type="text/html",body=html))
    page.goto(url);page.evaluate("stress()")
    intervals=page.evaluate("""()=>new Promise(done=>{let last=performance.now(),samples=[];function tick(t){samples.push(t-last);last=t;if(samples.length>=120)done(samples.slice(5));else requestAnimationFrame(tick)}requestAnimationFrame(tick)})""")
    print("Headless desktop Chromium, 120 enemies seeded. Median frame interval (ms)",round(statistics.median(intervals),1),"p95",round(sorted(intervals)[int(len(intervals)*.95)],1))
    page.screenshot(path=shots / "dense-battle.png")
    for index in range(8):
        page.evaluate("(i)=>previewBiome(i)",index)
        page.wait_for_timeout(150)
        page.screenshot(path=shots / f"biome-{index}.png")
    browser.close()
server.shutdown()
