import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      friendName = "Klodjana",
      trailName = "Albanian Mountain Expedition",
      trailLocation = "Albania",
      hikingVibe = "Scenic & Inspiring",
      trailSnack = "Traditional Çaj Mali & Snacks",
      chosenDate = "Upcoming Weekend",
      organizerDuties = [],
      personalMessage = "",
      responseStatus = "accepted",
      submittedAt = new Date().toISOString(),
    } = data;

    const formattedDuties =
      organizerDuties.length > 0
        ? organizerDuties.join(", ")
        : "Standard hiking pack & good vibes";

    const formattedEmailBody = `
⛰️ EXPEDITION ACCEPTED! YOUR HIKING SURPRISE WAS A SUCCESS! 🥾

--------------------------------------------------------------
👤 Hiker: ${friendName}
📍 Chosen Trail: ${trailName} (${trailLocation})
📅 Target Date: ${chosenDate}
✨ Trail Vibe: ${hikingVibe}
🥨 Requested Trail Provisions: ${trailSnack}
🎒 Your Backpack Responsibilities: ${formattedDuties}
💬 Note from ${friendName}: "${personalMessage || "Ready to climb! Pack the backpack!"}"
⏰ Confirmed At: ${new Date(submittedAt).toLocaleString("en-US", { timeZone: "Europe/Tirane" })} (Albania Time)
--------------------------------------------------------------

Everything is locked in. Get the hiking boots and thermos ready!
    `.trim();

    const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY || process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
    const whatsappPhone = (process.env.WHATSAPP_PHONE || "8801314859997").replace(/[^0-9]/g, "");
    const callmebotApiKey = process.env.CALLMEBOT_APIKEY;

    let emailSent = false;
    let whatsappSent = false;

    // 1. Silent WhatsApp notification via CallMeBot (server-to-phone)
    if (callmebotApiKey && whatsappPhone) {
      try {
        const formattedWhatsappMsg = `⛰️ *EXPEDITION ACCEPTED!* 🥾\n\n👤 *Hiker:* ${friendName}\n📍 *Trail:* ${trailName} (${trailLocation})\n📅 *Date:* ${chosenDate}\n✨ *Vibe:* ${hikingVibe}\n🥨 *Fuel:* ${trailSnack}\n🎒 *Backpack Tasks:* ${formattedDuties}\n💬 *Note from Klodjana:* "${personalMessage || "Ready to climb!"}"`;

        const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
          whatsappPhone
        )}&text=${encodeURIComponent(formattedWhatsappMsg)}&apikey=${encodeURIComponent(
          callmebotApiKey
        )}`;

        const waRes = await fetch(callmebotUrl, { method: "GET" });
        if (waRes.ok) {
          whatsappSent = true;
          console.log(`[WhatsApp] Silent notification delivered to +${whatsappPhone}`);
        } else {
          console.warn("[WhatsApp] CallMeBot response status:", waRes.status);
        }
      } catch (err) {
        console.error("[WhatsApp] Error dispatching to CallMeBot:", err);
      }
    } else {
      console.log(
        `[WhatsApp] Configured for +${whatsappPhone}. Waiting for CALLMEBOT_APIKEY to enable silent delivery.`
      );
    }

    // 2. Send via Web3Forms if API key is provided
    if (web3formsKey) {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `⛰️ Expedition Confirmed by ${friendName}! (${trailName})`,
            from_name: "Albania Alpine Invitation",
            message: formattedEmailBody,
            hiker_name: friendName,
            chosen_trail: trailName,
            date: chosenDate,
            trail_vibe: hikingVibe,
            provisions: trailSnack,
            organizer_tasks: formattedDuties,
            notes: personalMessage,
          }),
        });

        const json = await res.json();
        if (json.success) {
          emailSent = true;
        } else {
          console.warn("Web3Forms response warning:", json);
        }
      } catch (err) {
        console.error("Error submitting to Web3Forms:", err);
      }
    }

    // 3. Optional custom webhook (Discord / Slack / Make / Zapier)
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `🎉 **${friendName} accepted the hiking invitation!**\n**Trail:** ${trailName}\n**Date:** ${chosenDate}\n**Vibe:** ${hikingVibe}`,
          }),
        });
      } catch (err) {
        console.error("Error posting to webhook:", err);
      }
    }

    console.log("=== HIKING RSVP RECEIVED ===");
    console.log(formattedEmailBody);

    return NextResponse.json({
      success: true,
      emailSent,
      whatsappSent,
      hasKeyConfigured: Boolean(web3formsKey || callmebotApiKey),
      whatsappConfigured: Boolean(callmebotApiKey),
      message: "Expedition confirmed! All trail data registered successfully.",
    });
  } catch (error) {
    console.error("Failed to process RSVP:", error);
    return NextResponse.json(
      { success: false, error: "Internal processing error" },
      { status: 500 }
    );
  }
}
