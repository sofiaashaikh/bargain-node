# bargain-node

an autonomous ai checkout negotiator built for the razorpay buildathon. designed to reduce cart abandonment by allowing users to negotiate prices dynamically through an ai agent while respecting strict merchant profit margins.

## core features

- **ai negotiation chat**: users can converse with an agent to bargain for custom pricing on cart items.
- **profit-margin guardrails**: backend constraints ensure discounts never exceed authorized safety limits.
- **live updates**: cart summaries update instantly when a discount is approved.
- **dynamic coupons**: automatically generates secure, one-time coupon codes upon successful negotiation.
- **razorpay sandbox modal**: integrated test-mode payment gateway to finalize transactions at the negotiated price.

## tech stack

- **frontend**: react, vite, tailwind css
- **backend**: fastapi, python
- **ai model**: google gemini 2.5 flash
- **payments**: razorpay sandbox sdk

## local setup

1. clone the repository and navigate to the backend folder:
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate  # windows: venv\Scripts\activate
   pip install -r requirements.txt
