# Satu — your everything app

**Satu** (Indonesian for "one") is a personal all-in-one life app: to-do lists, a personal
CRM, journaling, study tools, AI-powered research and slide decks — everything in one place.

Built with **Flutter**, so the same codebase runs as a web app today and as native
iOS / Android / Windows / macOS apps later.

## One-time setup (do this once, then never again)

Before the app can go live, GitHub Pages has to be switched on. GitHub does not let
an automated workflow do this for you, so it needs one manual click:

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

That's it. Every push now builds the app and publishes it automatically.

## Use it on your iPhone

1. Open **https://ammaralfianmentor1985.github.io/Big-Project/** in Safari.
2. Tap the **Share** button (square with an arrow).
3. Tap **Add to Home Screen**.
4. Satu now launches full-screen from your home screen, like a real app.

Your data is stored **on your device** — nothing is sent to a server
(except AI requests, which go directly from your device to Anthropic when you use them).

## AI features

AI features (chat, research, summaries, flashcard generation) need an Anthropic API key.
See [docs/GET-API-KEY.md](docs/GET-API-KEY.md) for a step-by-step guide.
The key is pasted once in **Settings** and stored only on your device.

## Development

The app lives in [`app/`](app/). This project is built autonomously by scheduled Claude
sessions following [`ROADMAP.md`](ROADMAP.md).

```bash
cd app
flutter pub get
flutter run -d chrome        # run locally
flutter analyze && flutter test
flutter build web --base-href "/Big-Project/"
```

Every push to the working branch redeploys the web app via GitHub Actions → GitHub Pages.
