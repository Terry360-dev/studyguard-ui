# StudyGuard deployment guide

## 1. Create the Google Cloud and Firebase projects

```bash
gcloud projects create studyguard-prod --name="StudyGuard"
gcloud config set project studyguard-prod
```

## 2. Enable required APIs

```bash
gcloud services enable run.googleapis.com \
  firestore.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com \
  firebase.googleapis.com
```

## 3. Create Firestore database

```bash
gcloud beta firestore databases create --location=europe-west1 --type=firestore-native
```

## 4. Create Cloud Storage bucket

```bash
export BUCKET_NAME=studyguard-syllabi-$(date +%s)
gsutil mb -l europe-west1 gs://$BUCKET_NAME
```

## 5. Create Gemini secret

```bash
printf '%s' "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --replication-policy=automatic --data-file=-
```

## 6. Build and deploy backend to Cloud Run

```bash
cd backend
docker build -t gcr.io/$(gcloud config get-value project)/studyguard-api .
docker push gcr.io/$(gcloud config get-value project)/studyguard-api
gcloud run deploy studyguard-api \
  --image gcr.io/$(gcloud config get-value project)/studyguard-api \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 1Gi \
  --min-instances 1 \
  --max-instances 10 \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest
```

## 7. Deploy frontend to Firebase Hosting

```bash
npm install
npm run build
firebase login
firebase init hosting
firebase deploy
```

## 8. Configure Firebase Auth

Inside the Firebase console:
- Enable Email/Password sign-in
- Enable Google sign-in
- Add your web app config to the frontend env file

## 9. Upload Firestore and storage rules

In Firebase Console:
- Firestore > Rules > upload the contents of firestore.rules
- Storage > Rules > upload the contents of storage.rules

## 10. Monitoring

Create alert policies in Cloud Monitoring for:
- API latency > 2s
- Error rate > 5%

## 11. Budget control

```bash
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="StudyGuard MVP budget" \
  --budget-amount=50USD \
  --threshold-rule=percent=100
```
