# Deploy ke Cloudflare Pages

Situs ini statis murni (HTML/CSS/JS), jadi tidak ada build step. Root repo langsung jadi folder output.
`_headers` dan `_redirects` di root otomatis dibaca oleh Cloudflare Pages.

Ada dua cara deploy. Pilih **salah satu** saja.

---

## Cara A — Hubungkan ke GitHub (disarankan)

Setiap `git push` ke `main` otomatis ter-deploy.

1. Buka [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git**.
2. Pilih akun GitHub, lalu repo `cevin2001/cuma-disini`.
3. Isi pengaturan build:

   | Field                  | Nilai          |
   | ---------------------- | -------------- |
   | Project name           | `cuma-disini`  |
   | Production branch      | `main`         |
   | Framework preset       | `None`         |
   | Build command          | *(kosongkan)*  |
   | Build output directory | `/`            |

4. Klik **Save and Deploy**. Situs live di `https://cuma-disini.pages.dev`.

Setelah itu, deploy berikutnya cukup:

```bash
git add -A
git commit -m "pesan perubahan"
git push origin main
```

Branch selain `main` otomatis dapat URL preview sendiri (`<branch>.cuma-disini.pages.dev`).

---

## Cara B — Upload langsung dengan Wrangler (CLI)

Untuk deploy dari komputer lokal tanpa integrasi GitHub. Butuh Node.js.

### 1. Login (sekali saja)

```bash
npx wrangler login
```

Browser akan terbuka untuk login Cloudflare. Cek dengan `npx wrangler whoami`.

### 2. Buat project (sekali saja)

```bash
npx wrangler pages project create cuma-disini --production-branch main
```

### 3. Siapkan folder deploy

Salin hanya file situs supaya `CLAUDE.md`, `DEPLOY.md`, dan `.git` tidak ikut ter-upload.

PowerShell:

```powershell
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
New-Item -ItemType Directory dist | Out-Null
Copy-Item -Recurse index.html, public, robots.txt, sitemap.xml, _headers, _redirects dist
```

Bash:

```bash
rm -rf dist && mkdir dist
cp -r index.html public robots.txt sitemap.xml _headers _redirects dist/
```

### 4. Deploy

```bash
npx wrangler pages deploy dist --project-name cuma-disini --branch main
```

Tambahkan `dist/` ke `.gitignore` agar tidak ikut di-commit.

---

## Custom domain

1. Di project Pages → **Custom domains** → **Set up a custom domain** → masukkan domain (mis. `cumadisini.my.id`).
2. Jika DNS domain sudah di Cloudflare, record dibuat otomatis. Jika belum, tambahkan CNAME ke `cuma-disini.pages.dev` di penyedia DNS.
3. Redirect `www` → apex tidak bisa lewat `_redirects`. Buat lewat **Rules → Redirect Rules** di dashboard domain:
   - When: hostname equals `www.cumadisini.my.id`
   - Then: Dynamic redirect ke `concat("https://cumadisini.my.id", http.request.uri.path)`, status `301`, preserve query string.

Kalau domain final berbeda dari `https://cumadisini.my.id/`, ganti sekaligus di `<head>` dan JSON-LD `index.html`, `robots.txt`, dan `sitemap.xml`.

---

## Cek setelah deploy

- Halaman utama terbuka, CSS/JS dan gambar termuat.
- `/CLAUDE.md` dan `/DEPLOY.md` redirect ke `/`.
- Header aktif: `curl -I https://cuma-disini.pages.dev` → ada `X-Frame-Options: DENY`.
- Tombol CTA membuka WhatsApp dengan pesan yang benar.
- Preview link (OG image) dicek di [opengraph.xyz](https://www.opengraph.xyz) atau kirim link ke WhatsApp.
