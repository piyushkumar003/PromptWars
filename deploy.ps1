# Deployment script for Google Cloud Run
# Ensure you have gcloud CLI installed and authenticated

$PROJECT_ID = "promptwar-494820"
$SERVICE_NAME = "voter-sahayak"
$REGION = "us-central1"

$ErrorActionPreference = "Stop"

# Load environment variables from .env if it exists
if (Test-Path ".env") {
    Write-Host "Loading environment variables from .env..." -ForegroundColor Gray
    Get-Content .env | Where-Object { $_ -match "=" -and $_ -notmatch "^#" } | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        Set-Item -Path "env:$($name.Trim())" -Value ($value.Trim().Trim('"').Trim("'"))
    }
}

$DATABASE_URL = $env:DATABASE_URL
$API_KEY = $env:GOOGLE_GENERATIVE_AI_API_KEY

if (-not $DATABASE_URL -or $DATABASE_URL -match "USER:PASSWORD") {
    Write-Host "WARNING: DATABASE_URL is not set or contains placeholders. Deployment may fail at runtime." -ForegroundColor Yellow
}

Write-Host "Starting deployment to Google Cloud Run..." -ForegroundColor Cyan

# Enable necessary services
Write-Host "Enabling services..."
gcloud services enable run.googleapis.com containerregistry.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com --project $PROJECT_ID --quiet

# Build and push the image using Cloud Build
Write-Host "Building and pushing image to Google Container Registry..."
gcloud builds submit --tag "gcr.io/$PROJECT_ID/$SERVICE_NAME" --project $PROJECT_ID --quiet

# Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME `
  --image "gcr.io/$PROJECT_ID/$SERVICE_NAME" `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --project $PROJECT_ID `
  --memory 1Gi `
  --set-env-vars "DATABASE_URL=$DATABASE_URL,GOOGLE_GENERATIVE_AI_API_KEY=$API_KEY" `
  --quiet

Write-Host "Service URL: $(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')" -ForegroundColor Cyan
