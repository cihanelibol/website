# Etkileşimli akvaryum — araştırma ve aksiyon planı

Tarih: 13 Kasım 2026. Durum: Plan; uygulama yapılmadı.

Amaç: `/giris` ekranındaki her balığı ve akvaryum süsünü bağımsız, fareye/dokunmaya ve ekran bileşenlerine tepki veren bir nesneye dönüştürmek.

## Mevcut yapı ve kapsam

- `components/AquariumScene.tsx` tek bir `aquarium.mp4`, poster ve CSS su efektleri kullanıyor. Videodaki balıklar ve süsler ayrı nesneler değil.
- `components/AuthShell.tsx` sahneyi ve formu yan yana yerleştiriyor; arka plan ikisinin arkasına yayılıyor. `/giris` ve `/kayit` aynı kabuğu kullanıyor.
- Mevcut hareketi azaltma, duraklatma, görünürlük ve ekran dışına çıkınca durma davranışları yeni motora aktarılacak.
- İlk uygulama `/giris` üzerinde açılacak. `AuthShell` için sahne varyantı ile `/kayit` mevcut görünümünü koruyabilir; ortak kabuktaki değişiklikler iki sayfada da kontrol edilecek.
- Repoda devam eden commit edilmemiş çalışmalar var. Uygulama sırasında bunların üzerine toplu geri alma yapılmayacak.
- Kurulu Next.js paketinin yerel Server/Client Components ve Lazy Loading rehberleri incelendi. Giriş sayfası ve sunucu kimlik doğrulama sınırı korunacak; animasyon istemci tarafında izole edilecek.

## Teknoloji kararı

Öneri: **React + DOM/SVG/şeffaf WebP görseller + CSS transform + tek requestAnimationFrame döngüsü ile 2.5D sahne.** Bu, aşağıdaki başlangıç yoğunluğu için mühendislik tercihidir; ölçülmüş performans sonucu değildir.

| Seçenek | Uygun olduğu durum | Bu proje için karar |
| --- | --- | --- |
| DOM/SVG ve şeffaf görseller | Az sayıda bağımsız nesne, HTML formla yakın etkileşim, kolay erişilebilirlik | İlk tercih; ek animasyon motoru bağımlılığı gerektirmez |
| PixiJS | Yoğun sprite/partikül sahnesi, atlas animasyonları, GPU üzerinde çizim | Prototip ölçümleri DOM yaklaşımının bütçeyi aştığını gösterirse değerlendir |
| Three.js / React Three Fiber | Gerçek 3D kamera, hacimli modeller ve perspektif dönüşler | Mevcut isteğin ilk sürümüne dahil etme; model/ışık/GPU maliyeti ayrıca değerlendirilir |

PixiJS nesne bazlı pointer olayları, özel tıklama alanları ve sprite atlasları sunuyor. Canvas içinde çizim yapılması nesnelerin tek bir video gibi davranmasını gerektirmez; ancak HTML erişilebilirlik ve form bağlantısı ayrıca tasarlanır. Kaynaklar: [PixiJS Events](https://pixijs.com/8.x/guides/components/events), [PixiJS Performance](https://pixijs.com/8.x/guides/concepts/performance-tips).

3D seçilirse de kare başına React state güncellemek yerine render döngüsünde delta zamanı ile çalışma gerekir. Kaynak: [React Three Fiber performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls).

## Görsel üretim

İlk hedef masaüstünde 6–8 balık, mobilde 3–4 balık; 6–10 bağımsız bitki/kaya/süs ve sınırlı kabarcık. Sayılar tasarım ve cihaz ölçümüyle ayarlanacak.

- Su/zemin arka planı, kayalar, bitkiler, mercanlar ve balıklar ayrı varlıklar olacak. Hareket edecek balıklar arka plan görseline gömülü olmayacak.
- Mevcut poster geçiş sırasında kullanılabilir; kalıcı arka plan balık ve etkileşimli süs içermeyen yeni bir kompozisyon olacak.
- Balıklarda tutarlı ışık ve perspektif, temiz alfa kenarları, gerçekçi yüzgeç/kuyruk hareketi gerekli. Yalnızca sabit balık resmini sağa sola taşımak yeterli görsel kalite sağlamaz.
- Her tür için kısa yüzme kare dizisi veya gövde/kuyruk/yüzgeç parçaları hazırlanacak. İlk görsel deneme tek balık ve tek bitkiyle yapılacak; kalite doğrulandıktan sonra varlık seti genişletilecek.
- DOM sürümünde yüzme kareleri gerekiyorsa kırpılmış bir kapsayıcı içindeki atlas transform ile kaydırılacak; dış kapsayıcı konumu, iç kapsayıcı yüzgeç hareketini yönetecek. Aynı transform değerini iki sistem yazmayacak.
- Kullanılan görsellerin kaynak ve lisansları kaydedilecek. Atlaslar ve mobil sürümler indirme boyutu kadar çözülmüş görüntü belleği açısından da ölçülecek.

## Davranış sözleşmesi

| Nesne / durum | Beklenen tepki |
| --- | --- |
| Boştaki balık | Türüne göre yavaş dolaşır; hafif yön değiştirir, diğer balıklardan uzaklık korur |
| Yaklaşan fare | Küçük yarıçapta hafif uzaklaşır; tıklamayı imkânsızlaştıracak kadar erken kaçmaz |
| Balığa tıklama / dokunma | Tıklama noktasından ters yöne hızlanır, yumuşak dönüş yapar, yaklaşık 1–2 saniyede normal yüzmeye döner |
| Bitki / mercan | Yakındaki fare hızına göre sınırlı esner, ardından sönümlenerek eski duruşuna döner |
| Kaya / dekor | Bağımsız hit alanı ve engel geometrisi taşır; tıklama çevresinde kısa kabarcık tepkisi oluşturur |
| Form kartı | Balıkların algıladığı bir engeldir; balıklar kartın kenarından dolaşır, yazı ve kontrol alanlarını kapatmaz |
| Form içinde odak | Sahnedeki hareket yoğunluğu azalır; form dışına çıkıldığında kademeli normale döner |
| Ekran kenarı | Balık, görünür boyutunu da hesaba katarak yumuşakça yön değiştirir |

Balık durumları: `cruise → flee → recover → cruise`. Üst üste tıklama hız sınırını aşırmaz. Hızlanma, yön değiştirme ve engelden kaçınma bir arada sınırlandırılır; balığın köşeye sıkışması için kurtarma hedefi bulunur. Hareket azaltma ve duraklatma bu davranışların hepsinden önceliklidir.

## Bileşen ve motor yapısı

Önerilen dosya dağılımı:

```text
components/AquariumScene.tsx          sahne sınırı, statik görünüm ve kontroller
components/aquarium/Fish.tsx          bağımsız balık görünümü ve etkileşim
components/aquarium/AquariumProp.tsx  bitki/kaya/süs varyantları
components/aquarium/WaterEffects.tsx  ışık ve sınırlı kabarcıklar
components/aquarium/useAquariumEngine.ts
lib/aquarium/scene-config.ts          tür, boyut, katman, görsel ve hareket ayarları
lib/aquarium/simulation.ts            saf hareket ve engelden kaçınma hesapları
public/aquarium/                      bağımsız görseller ve atlaslar
```

- Her balık/süs sabit kimlikli bir entity olacak: konum, hız, yön, derinlik, hit alanı, davranış durumu. Statik ayarlar React props, sık değişen simülasyon verileri motor/ref içinde tutulacak.
- Tek `requestAnimationFrame` döngüsü bütün nesneleri güncelleyecek. Kare başına `setState` ve balık başına ayrı timer kullanılmayacak. React state yalnızca duraklatma gibi seyrek UI değişiklikleri için kullanılacak. Ref değişiklikleri React render tetiklemez: [React useRef](https://react.dev/reference/react/useRef).
- Hareket `deltaTime` ile hesaplanacak; uzun sekme araları sonrası zaman farkı sınırlandırılıp saat sıfırlanacak. Böylece 60/120 Hz ekranlarda hız tutarlı kalır: [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
- Konum/yön `transform`, görünürlük `opacity` üzerinden değişecek. Büyük blur/filter alanları sınırlanacak; `will-change` tüm öğelere gelişigüzel verilmeyecek. Kaynak: [web.dev animasyon rehberi](https://web.dev/articles/animations-guide).
- Sunucu ve ilk istemci görünümü deterministik olacak; render sırasında rastgele başlangıç koordinatı üretilmeyecek. Motor effect içinde başlayacak ve cleanup döngüyü, olayları, observer'ları kapatacak.
- Motor yüklenmesi ertelenirse statik sahne ve form önceden görünecek. Next.js yerel rehberine göre `ssr: false` yalnızca Client Component sınırında kullanılabilir; DOM tabanlı statik sahne için bunu zorunlu kılmaya gerek yok.

## Ekran bileşenleriyle bağlantı

- Sahne, görsel olarak formun arkasına uzanacak; form daha üst katmanda kalacak. Yalnızca balık/süs hedefleri pointer alacak, ışık ve kabarcık katmanları `pointer-events: none` olacak.
- `AuthShell` form kartını açık bir engel işaretiyle tanımlayacak. Motor sahneyle sınırlı DOM referansından bu alanı okuyacak; genel document taraması yapılmayacak.
- `ResizeObserver`, viewport değişimi ve kaydırmada ölçümler güncellenecek; her kare `getBoundingClientRect()` çağrılmayacak. Form hatası, yardım alanının açılması ve mobil klavye gibi boyut/konum değişimleri de ele alınacak.
- Fare koordinatları sahnenin yerel koordinatlarına dönüştürülecek. Scroll ve resize sonrası hit alanları güncel kalacak; pointer sahneyi terk ettiğinde kaçınma etkisi temizlenecek.
- Form için yalnızca odak/odaktan çıkma sinyali kullanılacak; alan değerleri animasyona aktarılmayacak. Olay dinleyicileri formun varsayılan davranışlarını engellemeyecek.
- Mouse ve touch için ortak Pointer Events kullanılacak. Mobilde hover şartı aranmayacak; sürükleme eklenmeden normal sayfa kaydırması korunacak. Kaynak: [MDN Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

## Erişilebilirlik ve çalışma bütçesi

- Görünür, klavyeyle kullanılabilir duraklat/oynat kontrolü bütün hareketi durduracak. Otomatik ve sürekli hareket için bu kontrol önemlidir: [W3C Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).
- `prefers-reduced-motion` durumunda başlangıç görünümü sabit olacak; kaçış, parallax ve sallanma kapalı olacak. Tıklama geri bildirimi kısa ve hareketsiz görsel değişimle verilebilir. Kaynak: [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- Etkileşimli balık/süsler erişilebilir isim ve klavye aktivasyonu taşıyacak; yalnızca dekoratif katmanlar erişilebilirlik ağacından çıkarılacak. Klavye odağındaki hedef sabitlenerek hedefin kaçması önlenecek. Forma doğrudan geçiş sağlanacak.
- Gizli sekmede ve sahne görünmezken motor duracak; geri dönüşte konumlar sıçramayacak. Eksik görsel veya motor hatası giriş formunu engellemeyecek.
- Önerilen başlangıç bütçesi: masaüstünde 60 fps, orta sınıf mobilde kararlı en az 30 fps; sahne simülasyonu ve DOM yazımları için referans masaüstünde p95 ≤4 ms/kare. Bunlar hedeflerdir, mevcut ölçüm değildir.
- İlk sahne görselleri için yaklaşık 1 MB sıkıştırılmış transfer hedeflenecek; gerçekçi animasyon kalitesiyle çelişirse önce kare/nesne/çözünürlük azaltılacak ve bütçe ölçüme göre yeniden değerlendirilecek.
- Üretim build'inde sahne açık/kapalı karşılaştırılacak: ana iş parçacığı uzun görevleri, input gecikmesi, kare süreleri, bellek, görsel yüklenmesi ve yerleşim kayması. Düşük performansta önce kabarcık/ışık, sonra balık sayısı azaltılacak. Ölçümler hâlâ bütçeyi aşarsa aynı simülasyonun PixiJS çizicisine taşınması değerlendirilecek.

## Uygulama sırası ve tamamlanma ölçütleri

1. **Temel ölçüm ve tek nesneli prototip.** Mevcut giriş ekranının performansını kaydet. Tek balık, bir bitki ve form engeliyle masaüstü/mobil etkileşimi doğrula. Çıktı: tıklanınca kaçan balık, düzgün yüzgeç animasyonu, çalışan giriş formu.
2. **Varlık seti ve katmanlar.** Temiz su/zemin görseli, bağımsız süsler ve tür bazlı balık varlıklarını hazırla. Çıktı: birbirine gömülü olmayan, tutarlı ışık ve ölçeğe sahip sahne.
3. **Ortak simülasyon.** Dolaşma, kaçış, toparlanma, engel/kenar kaçınma, bitki tepkisi ve kabarcıkları bağla. Çıktı: bütün nesnelerin ayrı kimliği, davranışı ve hedef alanı var.
4. **Form ve mobil entegrasyon.** Kart engeli, odak sakinleşmesi, responsive konumlar, dokunma ve scroll davranışı. Çıktı: form odağı, yazma, doğrulama, Google düğmesi ve bağlantılar normal çalışıyor.
5. **Erişilebilirlik ve performans.** Reduced motion, duraklatma, klavye, görünürlük ve kalite azaltma. Çıktı: seçilen referans cihazlarda ölçülmüş bütçe, konsol/hydration hatası yok.
6. **Doğrulama ve dokümantasyon.** Mevcut `scripts/verify-aquarium-hero.mjs` video beklentilerini yeni davranışlara göre güncelle; `docs/aquarium-hero.md` mimariyi açıklasın. Çıktı: typecheck, ilgili lint, anlamlı testler ve üretim build sonucu.

Anlamlı otomasyon: sabit seed/zaman adımlarıyla tıklama sonrası balığın uzaklaşması ve normale dönmesi; form engeli/ekran sınırlarından kaçınma; uzun zaman farkında sıçrama olmaması; duraklatmada hareketin kesilmesi; resize sonrası doğru hit alanı. Playwright ile mouse/touch/klavye, form alanları, yardım alanının açılması, reduced motion, asset hatası, 320–1440 px genişlikler ve `/kayit` regresyonu kontrol edilecek. Safari/iOS ve Android üzerinde gerçek cihaz performansı ayrıca doğrulanacak.

Bu planın temel kalite riski varlıkların doğallığıdır. Tek balıkla yapılan ilk deneme, tüm sahne üretilmeden önce yüzme ve yön değiştirme kalitesini görünür kılacaktır.
