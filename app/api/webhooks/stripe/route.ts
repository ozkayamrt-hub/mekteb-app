import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook doğrulama başarısız' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      // Find psychologist by stripe_customer_id
      const { data: membership } = await supabase
        .from('memberships')
        .select('psychologist_id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (membership) {
        // current_period_* moved to subscription items in newer Stripe API versions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subAny = sub as any
        const periodStart = subAny.current_period_start ?? subAny.items?.data?.[0]?.current_period_start
        const periodEnd   = subAny.current_period_end   ?? subAny.items?.data?.[0]?.current_period_end
        await supabase
          .from('memberships')
          .update({
            stripe_subscription_id: sub.id,
            status: sub.status === 'active' ? 'active' : 'inactive',
            ...(periodStart ? { current_period_start: new Date(periodStart * 1000).toISOString() } : {}),
            ...(periodEnd   ? { current_period_end:   new Date(periodEnd   * 1000).toISOString() } : {}),
          })
          .eq('psychologist_id', membership.psychologist_id)

        // Activate psychologist if subscription is active
        if (sub.status === 'active') {
          await supabase
            .from('psychologists')
            .update({ status: 'active' })
            .eq('id', membership.psychologist_id)
        }
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const { data: membership } = await supabase
        .from('memberships')
        .select('psychologist_id')
        .eq('stripe_subscription_id', sub.id)
        .single()

      if (membership) {
        await supabase
          .from('memberships')
          .update({ status: 'cancelled' })
          .eq('psychologist_id', membership.psychologist_id)

        await supabase
          .from('psychologists')
          .update({ status: 'suspended' })
          .eq('id', membership.psychologist_id)
      }
      break
    }

    case 'invoice.payment_failed': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const invoice = event.data.object as any
      const subId = invoice.subscription as string
      await supabase
        .from('memberships')
        .update({ status: 'past_due' })
        .eq('stripe_subscription_id', subId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
