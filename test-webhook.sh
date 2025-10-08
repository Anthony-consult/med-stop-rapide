#!/bin/bash

# Script de test du webhook Stripe
# Usage: ./test-webhook.sh <consultation_id>

CONSULTATION_ID=${1:-"test-uuid-123"}
WEBHOOK_URL="https://consult-chrono.fr/api/stripe/webhook"

echo "🧪 Test du webhook Stripe"
echo "=========================="
echo ""
echo "📝 Consultation ID: $CONSULTATION_ID"
echo "🔗 Webhook URL: $WEBHOOK_URL"
echo ""

# Payload de test
PAYLOAD=$(cat <<EOF
{
  "id": "evt_test_webhook",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_123",
      "object": "checkout.session",
      "client_reference_id": "$CONSULTATION_ID",
      "payment_intent": "pi_test_123",
      "payment_status": "paid",
      "status": "complete"
    }
  }
}
EOF
)

echo "📤 Envoi du payload..."
echo ""

# Envoyer la requête
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "x-webhook-token: your-webhook-token-here" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "📥 Réponse:"
echo "Status: $HTTP_CODE"
echo "Body: $BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Webhook fonctionne !"
  echo ""
  echo "🔍 Vérifie maintenant dans Supabase que le statut a été mis à jour:"
  echo "SELECT id, email, payment_status, payment_id FROM consultations WHERE id = '$CONSULTATION_ID';"
else
  echo "❌ Erreur webhook"
  echo ""
  echo "💡 Vérifications:"
  echo "1. STRIPE_WEBHOOK_SECRET configuré dans Vercel"
  echo "2. SUPABASE_SERVICE_ROLE_KEY configuré dans Vercel"
  echo "3. L'ID de consultation existe dans Supabase"
fi

