from fastapi import APIRouter, HTTPException, Header, Request
import stripe
from pydantic import BaseModel
from backend.app.core.config import settings

router = APIRouter(prefix="/api/billing", tags=["billing"])

stripe.api_key = settings.STRIPE_SECRET_KEY

class CheckoutSessionRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': request.price_id,
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
        )
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    
    # Try verifying with Snapshot secret first, then Thin secret
    event = None
    for secret in [settings.STRIPE_WEBHOOK_SECRET_SNAPSHOT, settings.STRIPE_WEBHOOK_SECRET_THIN]:
        if not secret:
            continue
        try:
            event = stripe.Webhook.construct_event(
                payload, stripe_signature, secret
            )
            break # Success
        except stripe.error.SignatureVerificationError:
            continue # Try next secret
        except Exception:
            break

    if not event:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # TODO: Update user subscription status in DB
        print(f"Payment successful for session {session['id']}")
    elif event['type'] == 'invoice.paid':
        # Continue to provision the subscription as as repeated payments are made
        pass
    elif event['type'] == 'invoice.payment_failed':
        # The payment failed or the customer does not have a valid payment method
        pass

    return {"status": "success"}
