# GitHub taşıma kaydı — 13 Kasım 2026

- Aktif depo: https://github.com/cihanelibol/website
- Hesap: `cihanelibol`; yeni depoda yönetici erişimi API ile doğrulandı.
- Eski kaynak: https://github.com/griakvaryu/website
- Eski depoda yönetici erişimi olmadığı için GitHub sahiplik devri yerine yeni depoya Git geçmişi aktarımı yapıldı. Eski depo silinmedi veya arşivlenmedi; eski adres otomatik yönlenmez.
- Kaynağın 12 dalı aktarıldı: `main` ve 11 Dependabot dalı. Kaynakta tag yoktu. `main` ayrıca yerelde tamamlanmış SEO commit'lerini içerir.
- Yerel `origin` yeni depoya, `legacy` eski depoya bakar. `main`, `origin/main` dalını takip eder.
- CODEOWNERS kayıtları `cihanelibol` hesabına güncellendi.
- Vercel'in mevcut `griakvaryum` projesi yeni GitHub deposunun `main` dalına bağlandı; bağlantı Vercel API ile doğrulandı. Proje ID'si `prj_i6Fut1y8vZ9b9tG9qRazi8kXnX33`.
- Aynı Vercel projesi kullanıldığı için alan adları ve ortam değişkenleri yeniden oluşturulmadı; veritabanı taşınmadı.
- Kaynakta bağımsız issue veya release bulunmadı. 11 açık Dependabot PR'ının başlık, açıklama, kaynak adresi ve dal bilgileri [eski PR kaydında](github-eski-pr-kaydi.json) saklandı. Dallar yeni depoda mevcut; PR tartışmaları ve eski kontrol sonuçları eski depoda kalır. Bunlar yeni depoda birleştirilmiş sayılmaz.
- Kaynak wiki Git deposu bulunmadı; Discussions kapalıydı.
- GitHub platform ayarları/secrets/branch protection, Git geçmişiyle otomatik taşınmaz. Mevcut workflow `GITHUB_TOKEN` kullanır; ayrı bir kullanıcı sırrı gerektiren workflow değişkeni görülmedi. Yeni depoda koruma kuralları etkinleştirildiği iddia edilmez.
- Taşıma sırasında başka çalışmaya ait commit edilmemiş arayüz ve video dosyaları vardı. Bunlar bu taşıma commit'ine dahil edilmedi; çalışma alanında korundu.

## Kontrol

Aktarımdan sonra yeni uzak `main` ile yerel `HEAD` eşitliği, kaynak ve hedefin 11 yan dalının SHA eşitliği ve Vercel Git bağlantısı kontrol edilir. Canlı yayın, GitHub push ile oluşan deployment üzerinden ayrıca doğrulanır.
