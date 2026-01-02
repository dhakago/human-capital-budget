# Deploy ke GitHub Pages

Aplikasi ini sudah di-setup untuk auto-deploy ke GitHub Pages.

## Setup Repository

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **Aktifkan GitHub Pages:**
   - Buka repo di GitHub → **Settings** → **Pages**
   - Source: pilih **GitHub Actions**

3. **Set Secret (Optional):**
   - Buka **Settings** → **Secrets and variables** → **Actions**
   - Tambah secret baru: `VITE_SUPERADMIN_PASSWORD` dengan value password yang diinginkan

## Auto Deploy

Setiap push ke branch `main`, aplikasi akan otomatis:
1. Build dengan Vite
2. Deploy ke GitHub Pages
3. Accessible di: `https://<username>.github.io/human-capital-budget/`

## Manual Deploy

Jika ingin deploy manual:

```bash
# Build aplikasi
npm run build

# Deploy folder dist/ ke branch gh-pages
# Gunakan tools seperti gh-pages atau manual push
```

## Local Preview

```bash
# Build dan preview hasil build
npm run build
npm run preview
```

Aplikasi akan berjalan di `http://localhost:4173`
