"""Read-only UI regressions. No account, contact, review or order is submitted.
Requires Python Playwright; optional --axe PATH enables WCAG checks with axe-core.
"""
import argparse
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

sys.stdout.reconfigure(encoding="utf-8")
parser=argparse.ArgumentParser()
parser.add_argument("--base-url",default="http://localhost:3000")
parser.add_argument("--output",default=".gstack/impeccable-qa")
parser.add_argument("--axe")
parser.add_argument("--layout-only",action="store_true")
args=parser.parse_args()
base=args.base_url.rstrip("/")
out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
checks=[];errors=[];pages=[]
def passed(name):
 checks.append(name);print("PASS",name,flush=True)
def reflow(page):
 return page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth")

with sync_playwright() as p:
 browser=p.chromium.launch()
 context=browser.new_context(viewport={"width":1440,"height":1000},reduced_motion="reduce",has_touch=True)
 page=context.new_page();page.on("pageerror",lambda err:errors.append(str(err)))
 # Visual checks do not create analytics records or depend on telemetry availability.
 page.route("**/api/etkinlik",lambda route:route.fulfill(status=204))
 def visit(path):
  response=page.goto(base+path,wait_until="networkidle",timeout=60000)
  assert response.status==200,(path,response.status)
  return response
 if not args.layout_only:
  visit("/")
  expect(page.locator('.store-product')).to_have_count(8)
  for card in page.locator('.store-product[data-has-image="false"]').all():
   expect(card.get_by_text("Ürün görseli eklenmemiş",exact=True).first).to_be_visible()
  passed("Home renders live products and honestly identifies missing photographs")
  page.screenshot(path=str(out/"home-desktop.png"),full_page=True)
  page.set_viewport_size({"width":390,"height":844})
  page.get_by_role("button",name="Menüyü aç veya kapat").tap()
  expect(page.locator("#store-mobile-menu").get_by_role("link",name="Yardım Merkezi",exact=True)).to_be_visible()
  expect(page.locator("#store-mobile-menu").get_by_role("link",name="Filtreler",exact=True)).to_be_visible()
  page.get_by_role("button",name="Menüyü aç veya kapat").tap()
  page.get_by_role("button",name="Mağaza fotoğrafı 2",exact=True).tap()
  expect(page.get_by_role("button",name="Mağaza fotoğrafı 2",exact=True)).to_have_attribute("aria-pressed","true")
  assert page.get_by_role("button",name="Mağaza fotoğrafı 2",exact=True).bounding_box()["width"]>=44
  page.screenshot(path=str(out/"home-mobile.png"),full_page=True)
  passed("Touch menu exposes categories; photo controls have 44px targets")
  page.set_viewport_size({"width":1440,"height":1000})
  visit("/urunler?grup=filtreler")
  sidebar=page.locator("aside.store-filter-sidebar")
  sidebar.get_by_role("searchbox").fill("sobo")
  sidebar.get_by_role("button",name="Ara",exact=True).click()
  page.wait_for_url("**/urunler?**")
  expect(page.locator("main h1:visible")).to_contain_text("sobo")
  assert "grup=filtreler" in page.url and "q=sobo" in page.url,page.url
  passed("Catalog search preserves its category scope")
  page.wait_for_load_state("networkidle")
  page.keyboard.press("Control+k")
  modal=page.locator("dialog.store-search-modal[open]")
  expect(modal).to_be_visible()
  page.route("**/api/arama?*",lambda route:route.fulfill(status=503,body="unavailable"))
  modal.get_by_label("Ürün veya rehber arayın").fill("akvaryum")
  expect(modal.get_by_role("alert")).to_contain_text("yüklenemiyor")
  expect(modal.get_by_text("için sonuç bulunamadı",exact=False)).to_have_count(0)
  page.unroute("**/api/arama?*")
  modal.get_by_role("button",name="Tekrar dene").click()
  expect(modal.locator('[data-search-index="0"]')).to_be_visible(timeout=60000)
  field=modal.get_by_label("Ürün veya rehber arayın")
  expect(field).to_have_value("akvaryum")
  field.focus();field.press("ArrowDown")
  expect(modal.locator('[data-search-index="0"]')).to_be_focused()
  page.keyboard.press("ArrowUp");expect(field).to_be_focused()
  page.keyboard.press("Escape")
  passed("Failed search retains query, retries, and moves real keyboard focus")
  visit("/kayit")
  page.get_by_role("button",name="Kayıt Ol",exact=True).click()
  expect(page.locator("#register-name")).to_be_focused()
  for field in ["name","email","phone","password"]:
   control=page.locator("#register-"+field)
   assert control.evaluate("e=>e.labels.length")>0
   expect(control).to_have_attribute("aria-describedby","register-error-"+field)
  passed("Registration errors have labels, descriptions and focus recovery")
  visit("/giris")
  expect(page.get_by_role("link",name="Parolamı unuttum / hesabımı doğrula")).to_have_attribute("href","/parola-yenile")
  for field in ["email","password"]:
   assert page.locator("#login-"+field).evaluate("e=>e.labels.length")>0
  passed("Login labels and real password recovery link are available")
  visit("/urunler/3752270")
  radios=page.get_by_role("radiogroup",name="Puanınız")
  radios.get_by_role("radio",name="3 yıldız").check()
  expect(radios.get_by_role("radio",name="3 yıldız")).to_be_checked()
  radios.get_by_role("radio",name="3 yıldız").press("ArrowRight")
  expect(radios.get_by_role("radio",name="4 yıldız")).to_be_checked()
  expect(page.get_by_role("button",name="Adet azalt",exact=True)).to_be_disabled()
  passed("Rating exposes its selected value and supports native arrow navigation")
 for index,path in enumerate(["/","/urunler","/urunler/3752270","/rehber","/rehber/ilk-akvaryum-kurulumu","/iletisim","/giris","/kayit","/sepet","/parola-yenile"]):
  visit(path);row={"route":path,"sizes":[]}
  for width in [320,390,768,1024,1440]:
   page.set_viewport_size({"width":width,"height":900})
   ok=reflow(page);row["sizes"].append({"width":width,"fits":ok})
  if args.axe:
   page.add_script_tag(path=args.axe)
   row["axe"]=page.evaluate("""async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}""")
  page.set_viewport_size({"width":390,"height":844})
  page.screenshot(path=str(out/f"route-{index}-mobile.png"),full_page=True)
  page.evaluate("document.documentElement.style.fontSize='200%'")
  row["text200Fits"]=reflow(page)
  if not row["text200Fits"]:
   row["overflow"]=page.evaluate("""()=>[...document.querySelectorAll('main *')].filter(e=>e.getBoundingClientRect().right>document.documentElement.clientWidth+1).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,100)}))""")
   page.screenshot(path=str(out/f"route-{index}-text200.png"),full_page=True)
  pages.append(row)
  print(json.dumps(row,ensure_ascii=False),flush=True)
  (out/"report.json").write_text(json.dumps({"checks":checks,"pages":pages,"errors":errors},ensure_ascii=False,indent=2),encoding="utf-8")
 # Malformed client storage must not crash or leak invalid totals into checkout.
 visit("/");page.evaluate("localStorage.setItem('ga_cart','{bad json')");page.reload(wait_until="networkidle")
 page.locator(".store-cart-button").click();expect(page.locator(".store-cart-empty")).to_be_visible()
 passed("Malformed cart storage recovers to an empty cart")
 assert not errors,errors
 (out/"report.json").write_text(json.dumps({"checks":checks,"pages":pages,"errors":errors},ensure_ascii=False,indent=2),encoding="utf-8")
 assert all(all(s["fits"] for s in row["sizes"]) and row["text200Fits"] for row in pages),"Reflow failures in report.json"
 assert not any(row.get("axe") for row in pages),"Accessibility findings in report.json"
 browser.close()
 passed("All audited routes pass viewport, text resize and accessibility checks")
