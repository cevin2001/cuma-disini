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

Domain: `cuma-disini.com` (apex jadi situs utama, `www` redirect ke apex).

Apex domain hanya bisa dipakai di Pages kalau nameserver domain dikelola Cloudflare. CNAME di registrar hanya cukup untuk subdomain seperti `www`.

1. **Tambah domain ke Cloudflare**: dashboard → **Add a domain** → `cuma-disini.com` → plan **Free**.
2. **Ganti nameserver di registrar**: salin 2 nameserver yang diberikan Cloudflare (mis. `xxx.ns.cloudflare.com`), lalu di panel registrar → **Nameserver** → ganti ke keduanya. Matikan DNSSEC di registrar dulu jika aktif. Tunggu status zone **Active** (menit sampai 24 jam, Cloudflare kirim email).
3. **Hubungkan ke Pages**: project `cuma-disini` → **Custom domains** → **Set up a custom domain** → `cuma-disini.com` → Activate. Ulangi untuk `www.cuma-disini.com`. Record CNAME dibuat otomatis.
4. **Redirect `www` → apex** (tidak bisa lewat `_redirects`). Zone `cuma-disini.com` → **Rules → Redirect Rules** → Create:
   - When: hostname equals `www.cuma-disini.com`
   - Then: Dynamic redirect ke `concat("https://cuma-disini.com", http.request.uri.path)`, status `301`, preserve query string.
5. **SSL/TLS**: mode **Full**, aktifkan **Always Use HTTPS**.

Kalau domain berubah lagi, ganti `https://cuma-disini.com/` sekaligus di `<head>` dan JSON-LD `index.html`, `robots.txt`, dan `sitemap.xml`.

---

## Cek setelah deploy

- Halaman utama terbuka, CSS/JS dan gambar termuat.
- `/CLAUDE.md` dan `/DEPLOY.md` redirect ke `/`.
- Header aktif: `curl -I https://cuma-disini.pages.dev` → ada `X-Frame-Options: DENY`.
- Tombol CTA membuka WhatsApp dengan pesan yang benar.
- Preview link (OG image) dicek di [opengraph.xyz](https://www.opengraph.xyz) atau kirim link ke WhatsApp.
