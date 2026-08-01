# Free MP4 Reel Renderer

This DEV build uses GitHub Actions to create a real 1080 × 1920 MP4 on phones and computers.

## First-time GitHub setup

1. Upload every file and folder in this ZIP to the `de-mayo-bible-study-dev` repository, including the hidden `.github` folder.
2. Open the repository's **Actions** tab.
3. If GitHub asks, select **I understand my workflows, go ahead and enable them**.
4. Open **Render Bible Reel MP4**.

## Create a reel from the app

1. Open **Bible Reel Creator** in the DEV website.
2. Generate or edit the reel.
3. Tap **Create MP4**. The Reel Request is copied and GitHub Actions opens.
4. Tap **Run workflow**.
5. Paste the copied request into **reel_json**.
6. Tap the green **Run workflow** button.
7. Wait for the run to show a green check.
8. Open the completed run and download **de-mayo-bible-reel-mp4** under Artifacts.
9. Unzip the artifact and post the MP4 to Facebook Reels.

## Notes

- GitHub Actions rendering is free within GitHub's available usage for public repositories.
- The workflow first tries a natural New Zealand English voice. If that service is unavailable, it uses an offline fallback voice so the render still completes.
- Finished artifacts are retained for seven days.
