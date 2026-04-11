# GitHub Pages Setup

This project is set up as a static GitHub Pages site.

Files:
- `index.html` is the page entrypoint.
- `research_paper (1).pdf` is published alongside the site.
- `.github/workflows/pages.yml` deploys the site with GitHub Actions.

## Publish

1. Create a new GitHub repository.
2. Push this folder to the repository's default branch.
3. In GitHub, go to `Settings -> Pages`.
4. If GitHub asks for a source, choose `GitHub Actions`.
5. Wait for the `Deploy to GitHub Pages` workflow to finish.

Your site URL will be:

- `https://USERNAME.github.io/REPO/`

If the repository is named `USERNAME.github.io`, the site URL will be:

- `https://USERNAME.github.io/`

## Local Git Commands

If you want to push this folder as-is:

```bash
git init -b main
git add .
git commit -m "Initial GitHub Pages site"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```
