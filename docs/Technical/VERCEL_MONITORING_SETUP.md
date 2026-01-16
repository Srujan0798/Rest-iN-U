# Vercel Deployment Monitoring Setup

Automatic monitoring of Vercel deployments with logs sent to GitHub Issues and Actions.

## What You Get

1. **Automatic Issue Creation** - When a deployment fails, a GitHub Issue is created with full error logs
2. **Build Logs as Artifacts** - Download complete build output, events, and function logs
3. **Health Checks** - Automatic testing of deployed pages
4. **Auto-Close on Success** - Issues are automatically closed when deployment succeeds
5. **GitHub Actions Summary** - See deployment status directly in Actions tab

## Required GitHub Secrets

Add these secrets in your repository settings (Settings > Secrets and variables > Actions):

| Secret | Description | How to Get |
|--------|-------------|------------|
| `VERCEL_TOKEN` | Your Vercel API token | [Vercel Tokens](https://vercel.com/account/tokens) - Create a new token |
| `VERCEL_ORG_ID` | Your Vercel team/org ID | Run `vercel link` locally, check `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your project ID | Run `vercel link` locally, check `.vercel/project.json` |

### Getting Vercel IDs

```bash
# In your project directory
npm i -g vercel
vercel link

# Check the generated file
cat .vercel/project.json
# Output: {"orgId":"team_xxx","projectId":"prj_xxx"}
```

## Workflow Files

### 1. `vercel-monitor.yml` - Polling-based Monitor

Runs every 15 minutes and on every push to main/develop:
- Fetches latest deployment status
- Downloads full build logs
- Creates issues on failure
- Uploads logs as artifacts

### 2. `vercel-webhook.yml` - Real-time Webhook Handler (Optional)

For instant notifications, set up a Vercel webhook:

1. Go to your Vercel project settings
2. Navigate to **Git > Deploy Hooks** or **Integrations**
3. Create a webhook that calls GitHub's repository dispatch API

**Webhook URL format:**
```
https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches
```

**Headers:**
```
Authorization: token YOUR_GITHUB_PAT
Accept: application/vnd.github.v3+json
```

**Body:**
```json
{
  "event_type": "vercel-deployment",
  "client_payload": {
    "url": "{{DEPLOYMENT_URL}}",
    "state": "{{DEPLOYMENT_STATE}}",
    "deployment_id": "{{DEPLOYMENT_ID}}"
  }
}
```

## Where to Find Logs

### GitHub Actions Tab
1. Go to **Actions** tab in your repo
2. Click on "Vercel Monitor" workflow
3. See the **Summary** for quick status
4. Download **Artifacts** for full logs

### GitHub Issues
- Failed deployments create issues with label `deployment-failure`
- Issues include full error messages and build output
- Auto-closed when deployment succeeds

### Artifacts Included
- `deployments-raw.json` - Raw Vercel API response
- `deployment-detail.json` - Full deployment details
- `deployment-events.json` - Build events timeline
- `build-output.json` - stdout/stderr from build
- `function-logs.json` - Runtime/function logs
- `deployment-summary.md` - Formatted readable report

## Manual Trigger

You can manually trigger the monitor:

1. Go to **Actions** tab
2. Select "Vercel Monitor"
3. Click **Run workflow**
4. Optionally enter a specific deployment ID

## Troubleshooting

### "Could not parse deployments"
- Check that `VERCEL_TOKEN` is set correctly
- Verify `VERCEL_PROJECT_ID` matches your project

### No logs appearing
- Vercel API has rate limits; wait a few minutes
- Some log types require Pro/Enterprise plan

### Issues not being created
- Ensure the workflow has write permissions to Issues
- Check that the `deployment-failure` label exists (will be created automatically)

## Customization

### Change monitoring frequency
Edit `vercel-monitor.yml`:
```yaml
schedule:
  - cron: '*/15 * * * *'  # Every 15 minutes (current)
  - cron: '*/5 * * * *'   # Every 5 minutes (more frequent)
  - cron: '0 * * * *'     # Every hour (less frequent)
```

### Add more health check pages
Edit the "Test Deployed Site" step to add more URLs:
```bash
NEW_PAGE=$(curl -s -o /dev/null -w "%{http_code}" https://your-site.vercel.app/new-page)
echo "| /new-page | $NEW_PAGE |" >> vercel-logs/deployment-summary.md
```

### Change artifact retention
```yaml
retention-days: 30  # Keep logs for 30 days (max 90)
```
