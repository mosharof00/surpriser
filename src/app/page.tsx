"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Compass,
  Mountain,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Camera,
  Flame,
  Coffee,
  CheckCircle2,
  Send,
  Backpack,
  Printer,
} from "lucide-react";
import styles from "./page.module.css";
import { TRAILS, VIBES, SNACKS, ORGANIZER_DUTIES, Trail } from "@/data/expeditionData";
import { sounds } from "@/lib/soundEffects";

function HikingSurpriseApp() {
  const searchParams = useSearchParams();
  const queryName = searchParams.get("name") || "";

  // User & Form State
  const [friendName, setFriendName] = useState(queryName || "Klodjana");
  const [step, setStep] = useState(0); // 0 to 5
  const [isSoundOn, setIsSoundOn] = useState(false);

  // Selections
  const [selectedVibe, setSelectedVibe] = useState(VIBES[0].id);
  const [selectedSnack, setSelectedSnack] = useState(SNACKS[0].id);
  const [selectedTrail, setSelectedTrail] = useState<Trail>(TRAILS[0]);
  const [chosenDate, setChosenDate] = useState("Next Sunny Weekend");
  const [customDate, setCustomDate] = useState("");
  const [selectedDuties, setSelectedDuties] = useState<string[]>([
    "thermos",
    "camera",
    "snacks",
  ]);
  const [personalNote, setPersonalNote] = useState("");

  // Runaway "No" button states
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noClickCount, setNoClickCount] = useState(0);
  const runawayAttempts = useRef(0);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Sync query name if provided
  useEffect(() => {
    if (queryName) {
      setFriendName(queryName);
    }
  }, [queryName]);

  // Audio Toggle
  const toggleSound = () => {
    const active = sounds.toggleAmbient();
    setIsSoundOn(active);
  };

  // Step Navigation
  const goToNextStep = () => {
    sounds.playChime(640);
    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPrevStep = () => {
    sounds.playChime(480);
    setStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Duty selection toggle
  const toggleDuty = (dutyId: string) => {
    sounds.playChime(550);
    setSelectedDuties((prev) =>
      prev.includes(dutyId) ? prev.filter((id) => id !== dutyId) : [...prev, dutyId]
    );
  };

  // Runaway No Button Logic
  const handleNoInteraction = () => {
    sounds.playChime(320);
    runawayAttempts.current += 1;
    setNoClickCount((prev) => prev + 1);

    // Random displacement within +- 160px
    const randomX = (Math.random() - 0.5) * 320;
    const randomY = (Math.random() - 0.5) * 160;
    setNoButtonPos({ x: randomX, y: randomY });
  };

  const getNoButtonLabel = () => {
    const funnyLabels = [
      "No, thanks",
      "Are you sure? 🤨",
      "Wrong button! 🏃💨",
      "Boots already packed! 🥾",
      "Error 404: No not found!",
      "Nice try! Still hiking! 😉",
      "Just press YES! ✨",
    ];
    return funnyLabels[Math.min(noClickCount, funnyLabels.length - 1)];
  };

  // Grand YES Celebration
  const handleAcceptExpedition = async () => {
    sounds.playVictory();

    // Launch double confetti burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#f5b843", "#2ec4b6", "#ffffff", "#e63946"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);

    setStep(5);
    setIsSubmitting(true);

    // Prepare payload
    const activeDate = customDate.trim() ? customDate : chosenDate;
    const activeVibeObj = VIBES.find((v) => v.id === selectedVibe);
    const activeSnackObj = SNACKS.find((s) => s.id === selectedSnack);
    const activeDutiesLabels = ORGANIZER_DUTIES.filter((d) =>
      selectedDuties.includes(d.id)
    ).map((d) => d.label);

    try {
      const response = await fetch("/api/send-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friendName,
          selectedTrail: selectedTrail.id,
          trailName: selectedTrail.name,
          trailLocation: selectedTrail.location,
          hikingVibe: activeVibeObj?.title || selectedVibe,
          trailSnack: activeSnackObj?.title || selectedSnack,
          chosenDate: activeDate,
          organizerDuties: activeDutiesLabels,
          personalMessage: personalNote,
          responseStatus: "accepted",
          submittedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
      }
    } catch (err) {
      console.error("Failed to transmit RSVP:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const activeDate = customDate.trim() ? customDate : chosenDate;
  const activeVibeObj = VIBES.find((v) => v.id === selectedVibe);
  const activeSnackObj = SNACKS.find((s) => s.id === selectedSnack);

  return (
    <div className={styles.container}>
      <div className="ambient-grain" />

      {/* Top Bar Header */}
      <header className={styles.topBar}>
        <div className={styles.brandBadge}>
          <Compass className={styles.brandIcon} size={20} />
          <span>Operation Summit: Albania</span>
        </div>

        <div className={styles.controls}>
          <button
            onClick={toggleSound}
            className={`${styles.soundBtn} ${isSoundOn ? styles.soundActive : ""}`}
            title="Toggle Alpine Wind Ambience"
          >
            {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{isSoundOn ? "Alpine Wind: On" : "Sound"}</span>
          </button>
        </div>
      </header>

      {/* Progress Dots */}
      {step > 0 && (
        <div className={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((sIndex) => (
            <div key={sIndex} className={styles.stepDot}>
              <div
                className={`${styles.dotCircle} ${
                  step === sIndex
                    ? styles.dotCircleActive
                    : step > sIndex
                    ? styles.dotCircleCompleted
                    : ""
                }`}
              >
                {step > sIndex ? <Check size={14} /> : sIndex}
              </div>
              {sIndex < 5 && (
                <div
                  className={`${styles.dotLine} ${
                    step > sIndex ? styles.dotLineActive : ""
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* STEP 0: HERO MISSION ARRIVAL */}
      {step === 0 && (
        <section className={`animate-fade-in ${styles.heroCard}`}>
          <div className={styles.heroImageWrapper}>
            <Image
              src="/images/albanian_alps.jpg"
              alt="Albanian Alps Valbona Theth"
              fill
              priority
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
              <div className="badge-albania" style={{ marginBottom: 14 }}>
                <MapPin size={12} />
                <span>Albanian Mountain Range • Classified Invitation</span>
              </div>

              <h1 className={styles.heroTitle}>
                Hey {friendName},
                <br />
                <span className="serif-title" style={{ color: "var(--text-gold)" }}>
                  Pack your boots.
                </span>
              </h1>

              <p className={styles.heroSubtitle}>
                A secret summit expedition has been planned in the breathtaking peaks of
                Albania. The mountains are calling, the trail snacks are ready, and this
                journey cannot happen without you.
              </p>

              <div className={styles.heroActions}>
                <button onClick={goToNextStep} className="btn-summit">
                  <span>Open Mission Briefing</span>
                  <ChevronRight size={18} />
                </button>
                <button onClick={handleShare} className="btn-outline">
                  <Share2 size={16} />
                  <span>{isCopied ? "Link Copied!" : "Share Link"}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STEP 1: TRAIL VIBE & PROVISIONS */}
      {step === 1 && (
        <section className={`animate-fade-in ${styles.stepCard}`}>
          <div className={styles.stepHeader}>
            <span className={styles.stepPreTitle}>Phase 1 • Expedition Style</span>
            <h2 className={styles.stepHeading}>What vibe are we aiming for?</h2>
            <p className={styles.stepDescription}>
              Every great hike starts with the right mood and proper provisions. Choose
              how we conquer this mountain.
            </p>
          </div>

          {/* Vibe Selection */}
          <h3
            style={{
              fontSize: "1.1rem",
              color: "var(--text-gold)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Sparkles size={18} />
            <span>Select Trail Atmosphere</span>
          </h3>

          <div className={styles.choicesGrid}>
            {VIBES.map((vibe) => {
              const isSelected = selectedVibe === vibe.id;
              return (
                <div
                  key={vibe.id}
                  onClick={() => {
                    sounds.playChime(580);
                    setSelectedVibe(vibe.id);
                  }}
                  className={`${styles.choiceCard} ${
                    isSelected ? styles.choiceCardSelected : ""
                  }`}
                >
                  <div className={styles.choiceIconBox}>
                    {vibe.icon === "Camera" && <Camera size={24} />}
                    {vibe.icon === "Flame" && <Flame size={24} />}
                    {vibe.icon === "Coffee" && <Coffee size={24} />}
                  </div>
                  <h4 className={styles.choiceTitle}>{vibe.title}</h4>
                  <p className={styles.choiceDesc}>{vibe.description}</p>
                </div>
              );
            })}
          </div>

          {/* Snack Selection */}
          <h3
            style={{
              fontSize: "1.1rem",
              color: "var(--text-gold)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Backpack size={18} />
            <span>Essential Mountain Provisions (I will bring this!)</span>
          </h3>

          <div className={styles.choicesGrid}>
            {SNACKS.map((snack) => {
              const isSelected = selectedSnack === snack.id;
              return (
                <div
                  key={snack.id}
                  onClick={() => {
                    sounds.playChime(600);
                    setSelectedSnack(snack.id);
                  }}
                  className={`${styles.choiceCard} ${
                    isSelected ? styles.choiceCardSelected : ""
                  }`}
                >
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>
                    {snack.emoji}
                  </div>
                  <h4 className={styles.choiceTitle}>{snack.title}</h4>
                  <p className={styles.choiceDesc}>{snack.desc}</p>
                </div>
              );
            })}
          </div>

          <div className={styles.navRow}>
            <button onClick={goToPrevStep} className="btn-outline">
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <button onClick={goToNextStep} className="btn-summit">
              <span>Next: Choose Our Summit</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: CHOOSE THE ALBANIAN SUMMIT */}
      {step === 2 && (
        <section className={`animate-fade-in ${styles.stepCard}`}>
          <div className={styles.stepHeader}>
            <span className={styles.stepPreTitle}>Phase 2 • Trail Selection</span>
            <h2 className={styles.stepHeading}>Which mountain shall we summit?</h2>
            <p className={styles.stepDescription}>
              Albania has some of the most dramatic mountain vistas in Europe. Pick your
              favorite destination or let it be a wildcard surprise!
            </p>
          </div>

          <div className={styles.trailsGrid}>
            {TRAILS.map((trail) => {
              const isSelected = selectedTrail.id === trail.id;
              return (
                <div
                  key={trail.id}
                  onClick={() => {
                    sounds.playChime(620);
                    setSelectedTrail(trail);
                  }}
                  className={`${styles.trailCard} ${
                    isSelected ? styles.trailCardSelected : ""
                  }`}
                >
                  <div className={styles.trailImageContainer}>
                    <Image
                      src={trail.image}
                      alt={trail.name}
                      fill
                      className={styles.trailThumb}
                    />
                    <div className={styles.trailTag}>{trail.tag}</div>
                  </div>

                  <div className={styles.trailContent}>
                    <h4 className={styles.trailTitle}>{trail.name}</h4>
                    <div className={styles.trailLocation}>
                      <MapPin size={14} />
                      <span>{trail.location}</span>
                    </div>

                    <div className={styles.trailStats}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Distance</span>
                        <span className={styles.statValue}>{trail.distance}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Elevation</span>
                        <span className={styles.statValue}>{trail.elevation}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Est. Time</span>
                        <span className={styles.statValue}>{trail.duration}</span>
                      </div>
                    </div>

                    <p className={styles.trailBlurb}>{trail.description}</p>

                    <div className={styles.selectTrailIndicator}>
                      {isSelected ? (
                        <>
                          <CheckCircle2 size={16} color="var(--primary)" />
                          <span>Selected Peak</span>
                        </>
                      ) : (
                        <span>Click to Select</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.navRow}>
            <button onClick={goToPrevStep} className="btn-outline">
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <button onClick={goToNextStep} className="btn-summit">
              <span>Next: Schedule & Gear</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: SCHEDULE & GEAR DUTIES */}
      {step === 3 && (
        <section className={`animate-fade-in ${styles.stepCard}`}>
          <div className={styles.stepHeader}>
            <span className={styles.stepPreTitle}>Phase 3 • Logistics & Date</span>
            <h2 className={styles.stepHeading}>When are we conquering this?</h2>
            <p className={styles.stepDescription}>
              Select your preferred timing and assign me whatever heavy gear you want me
              to carry in my backpack!
            </p>
          </div>

          {/* Date Options */}
          <h3
            style={{
              fontSize: "1.1rem",
              color: "var(--text-gold)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Calendar size={18} />
            <span>Target Weekend / Date</span>
          </h3>

          <div className={styles.dateRow}>
            {["Next Saturday", "Next Sunday", "Two Weeks from Now", "Surprise Me with the Forecast"].map(
              (opt) => {
                const isSelected = chosenDate === opt && !customDate;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      sounds.playChime(540);
                      setChosenDate(opt);
                      setCustomDate("");
                    }}
                    className={`${styles.dateOption} ${
                      isSelected ? styles.dateOptionSelected : ""
                    }`}
                  >
                    {opt}
                  </button>
                );
              }
            )}
          </div>

          <div style={{ marginBottom: 36 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.88rem",
                color: "var(--text-muted)",
                marginBottom: 8,
              }}
            >
              Or pick a specific calendar date:
            </label>
            <input
              type="date"
              className={styles.customDateInput}
              value={customDate}
              onChange={(e) => {
                setCustomDate(e.target.value);
                setChosenDate(e.target.value);
              }}
            />
          </div>

          {/* Gear Duty Checkboxes */}
          <h3
            style={{
              fontSize: "1.1rem",
              color: "var(--text-gold)",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Backpack size={18} />
            <span>Assign Tasks to My Backpack (Select all you want me to carry)</span>
          </h3>

          <div className={styles.dutiesGrid}>
            {ORGANIZER_DUTIES.map((duty) => {
              const isChecked = selectedDuties.includes(duty.id);
              return (
                <div
                  key={duty.id}
                  onClick={() => toggleDuty(duty.id)}
                  className={`${styles.dutyCheckbox} ${
                    isChecked ? styles.dutyActive : ""
                  }`}
                >
                  <div className={styles.checkboxSquare}>
                    {isChecked && <Check size={14} />}
                  </div>
                  <span className={styles.dutyLabel}>{duty.label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.navRow}>
            <button onClick={goToPrevStep} className="btn-outline">
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
            <button onClick={goToNextStep} className="btn-summit">
              <span>Next: The Big Question</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: THE BIG REVEAL & RUNAWAY 'NO' BUTTON */}
      {step === 4 && (
        <section className={`animate-fade-in ${styles.stepCard}`}>
          <div className={styles.letterCard}>
            <div className={styles.letterSeal}>
              <Heart size={26} color="#ffffff" />
            </div>

            <div className={styles.letterBody}>
              <p>
                <strong>Dear {friendName},</strong>
              </p>
              <p>
                Life gets busy, but the Albanian mountains never lose their magic. There
                is truly nothing like climbing above the clouds, breathing the crisp pine
                air, and laughing our way to the summit with a hot thermos of tea.
              </p>
              <p>
                I planned this entire expedition specifically for you because you deserve
                an unforgettable day out on the trails. I&apos;ll handle all the heavy
                backpack duties, trail navigation, and delicious snacks. All you have to do
                is show up with your hiking boots and a smile.
              </p>

              <div
                style={{
                  padding: "16px 20px",
                  background: "rgba(245, 184, 67, 0.08)",
                  borderRadius: 12,
                  border: "1px dashed rgba(245, 184, 67, 0.4)",
                  margin: "24px 0",
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>
                  EXPEDITION BLUEPRINT:
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#fff", marginTop: 4 }}>
                  ⛰️ Destination: {selectedTrail.name}
                </div>
                <div style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>
                  📅 When: {activeDate} • 🫖 Fuel: {activeSnackObj?.title}
                </div>
              </div>

              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  color: "var(--text-gold)",
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                Any secret requests, songs, or extra notes for me?
              </label>
              <textarea
                className={styles.customNoteTextarea}
                placeholder="E.g., Make sure the tea is extra sweet, or bring extra water..."
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
              />

              <div className={styles.letterSignoff}>
                Will you conquer this mountain with me?
              </div>
            </div>

            {/* Runaway Action Arena */}
            <div className={styles.rsvpActionArena}>
              <button
                onClick={handleAcceptExpedition}
                className="btn-summit"
                style={{ fontSize: "1.2rem", padding: "16px 36px" }}
              >
                <Sparkles size={20} />
                <span>YES! Pack My Backpack! ⛰️</span>
              </button>

              {/* Dodging 'No' button with interactive physics */}
              <button
                type="button"
                onMouseEnter={handleNoInteraction}
                onTouchStart={handleNoInteraction}
                onClick={handleNoInteraction}
                className={styles.noButton}
                style={{
                  transform: `translate(${noButtonPos.x}px, ${noButtonPos.y}px)`,
                }}
              >
                {getNoButtonLabel()}
              </button>
            </div>
          </div>

          <div className={styles.navRow} style={{ marginTop: 36 }}>
            <button onClick={goToPrevStep} className="btn-outline">
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: DIGITAL SUMMIT BOARDING PASS & EMAIL CONFIRMATION */}
      {step === 5 && (
        <section className={`animate-fade-in ${styles.stepCard}`}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div
              className="badge-tag pulse-glow"
              style={{ fontSize: "0.95rem", padding: "8px 20px", marginBottom: 12 }}
            >
              <ShieldCheck size={18} />
              <span>Expedition Confirmed & Locked In!</span>
            </div>
            <h2 className={styles.stepHeading}>
              We are going to the mountains! 🎉
            </h2>
            <p className={styles.stepDescription}>
              {isSubmitting
                ? "Transmitting all your trail details and snack choices to the organizer's inbox..."
                : "All your trail choices have been transmitted directly to my inbox. Pack your hiking boots!"}
            </p>
          </div>

          {/* The Boarding Pass */}
          <div className={styles.passTicket} id="summit-ticket">
            <div className={styles.passHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mountain size={22} />
                <span className={styles.passHeaderTitle}>Albania Summit Pass</span>
              </div>
              <div className={styles.passHeaderId}>PASS #ALB-{Math.floor(1000 + Math.random() * 9000)}</div>
            </div>

            <div className={styles.passBody}>
              <div className={styles.passGrid}>
                <div className={styles.passField}>
                  <span className={styles.passFieldLabel}>Summit Climber</span>
                  <span className={styles.passFieldValue}>{friendName}</span>
                </div>
                <div className={styles.passField}>
                  <span className={styles.passFieldLabel}>Expedition Date</span>
                  <span className={styles.passFieldValue}>{activeDate}</span>
                </div>
                <div className={styles.passField}>
                  <span className={styles.passFieldLabel}>Destination Trail</span>
                  <span className={styles.passFieldValue} style={{ color: "var(--text-gold)" }}>
                    {selectedTrail.name}
                  </span>
                </div>
                <div className={styles.passField}>
                  <span className={styles.passFieldLabel}>Trail Elevation / Length</span>
                  <span className={styles.passFieldValue}>
                    {selectedTrail.elevation} • {selectedTrail.distance}
                  </span>
                </div>
                <div className={styles.passField}>
                  <span className={styles.passFieldLabel}>Trail Atmosphere</span>
                  <span className={styles.passFieldValue}>{activeVibeObj?.title}</span>
                </div>
                <div className={styles.passField}>
                  <span className={styles.passFieldLabel}>Summit Fuel</span>
                  <span className={styles.passFieldValue}>{activeSnackObj?.title}</span>
                </div>
              </div>

              {personalNote && (
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.04)",
                    padding: "12px 16px",
                    borderRadius: 8,
                    fontSize: "0.88rem",
                    color: "var(--text-muted)",
                    marginBottom: 16,
                  }}
                >
                  <strong style={{ color: "#fff" }}>Your Note:</strong> &ldquo;{personalNote}&rdquo;
                </div>
              )}

              <div className={styles.passDivider}>
                <div className={styles.passDashedLine} />
              </div>

              <div className={styles.passFooter}>
                <div className={styles.passBarcode}>
                  <div className={styles.barcodeBars} />
                  <span className={styles.barcodeText}>EXPEDITION // 2026-ALBANIA</span>
                </div>
                <div className={styles.passStamp}>
                  <Check size={18} />
                  <span>100% READY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <button onClick={handlePrint} className="btn-outline">
              <Printer size={16} />
              <span>Save / Print Ticket</span>
            </button>
            <button onClick={handleShare} className="btn-summit">
              <Share2 size={16} />
              <span>{isCopied ? "Link Copied to Clipboard!" : "Share Invitation Link"}</span>
            </button>
          </div>
        </section>
      )}

      {/* Footer Info */}
      <footer className={styles.footerContainer}>
        <a
          href="https://mosharof-khan.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerLink}
          title="Visit Mosharof Khan's Portfolio"
        >
          <span>Made with love for the mountains of Albania ⛰️</span>
          <span>•</span>
          <span className={styles.footerAuthor}>By</span>
        </a>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40, color: "#fff", textAlign: "center" }}>Loading expedition...</div>}>
      <HikingSurpriseApp />
    </Suspense>
  );
}
