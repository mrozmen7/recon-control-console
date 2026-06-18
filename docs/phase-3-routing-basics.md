# Phase 3 - Routing Basics

## Topic

Angular Router ile URL tabanli sayfa gecisleri.

## Runtime Flow

```text
Browser URL
    |
    v
app.routes.ts ---- path eslesmesi ----> Page component
                                            |
App -> AppShell -> RouterOutlet <-----------+
```

```text
/cases      -> CasesPage
/cases/new  -> CreateCasePage
/queue      -> ReviewQueuePage
```

`AppShell` sabit uygulama cercevesini, page component ise URL'ye gore degisen ekran icerigini yonetir.

## Terms

- **Router:** URL ile acilacak component arasindaki gecisi yoneten Angular sistemi.
- **Route:** Bir URL yolu ile component eslesmesi.
- **Path:** Route'un URL parcasi; ornegin `cases/new`.
- **Page component:** Router tarafindan acilan, bir ekrani temsil eden component.
- **RouterOutlet:** Eslesen page component'in yerlestirildigi Angular direktifi.
- **RouterLink:** Tam sayfa yenilemeden uygulama ici gezinme saglayan direktif.
- **RouterLinkActive:** Eslesen menu baglantisina aktif CSS sinifi ekleyen direktif.
- **Redirect:** Bir yolu baska bir yola yonlendirme.
- **Wildcard (`**`):** Tanimlanmamis tum URL'leri yakalayan son route.

## Route Table

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'cases', pathMatch: 'full' },
  { path: 'cases', component: CasesPage },
  { path: 'cases/new', component: CreateCasePage },
  { path: 'queue', component: ReviewQueuePage },
  { path: '**', redirectTo: 'cases' },
];
```

`pathMatch: 'full'`, yalnizca bos URL'nin yonlendirilmesini saglar. Wildcard route en sonda bulunur; aksi halde kendisinden sonraki route'lari da yakalar.

## Company Pattern

Gercek projelerde uygulama kabugu sabit kalir; router yalnizca calisma alanindaki page component'i degistirir. Route seviyesinde feature klasorleri kullanmak, ekran sahipligini belirginlestirir ve ileride lazy loading uygulanmasini kolaylastirir.

Bu fazda route'lar dogrudan component kullanir. Lazy loading, route parametrelerini component input olarak alma ve view transitions ileri routing fazinda eklenecektir.

## Verification

- `/cases`, `/cases/new` ve `/queue` tarayicida dogrulandi.
- Aktif menu durumu dogrulandi.
- Root route ve queue route icin component testleri eklendi.
- Production build ve Vitest testleri gecti.
