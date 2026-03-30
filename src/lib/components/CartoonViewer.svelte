<!-- CartoonViewer.svelte — shared by /cartoon and /cartoon/[date] -->
<script lang="ts">
  interface Strip {
    publish_date: string;
    image_url: string;
    alt_text: string;
    strip_type: string;
  }

  let {
    strip,
    prev,
    next
  }: {
    strip: Strip | null;
    prev: string | null;
    next: string | null;
  } = $props();

  function formatDate(d: string) {
    return new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  function copyShareLink() {
    const url = strip
      ? `${window.location.origin}/cartoon/${strip.publish_date}`
      : window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      copied = true;
      setTimeout(() => (copied = false), 2000);
    });
  }

  function nativeShare() {
    if (navigator.share && strip) {
      navigator.share({
        title: `Feather & Spag — ${formatDate(strip.publish_date)}`,
        url: `${window.location.origin}/cartoon/${strip.publish_date}`
      });
    } else {
      copyShareLink();
    }
  }

  let copied = $state(false);
</script>

<div class="viewer">
  <!-- Header -->
  <div class="strip-header">
    <div class="strip-title">Feather &amp; Spag</div>
    {#if strip}
      <div class="strip-date">{formatDate(strip.publish_date)}</div>
    {:else}
      <div class="strip-date">Coming soon</div>
    {/if}
  </div>

  <!-- Strip image or placeholder -->
  <div class="strip-frame" class:sunday={strip?.strip_type === 'sunday'}>
    {#if strip}
      <img
        src={strip.image_url}
        alt={strip.alt_text || 'Feather & Spag comic strip'}
        class="strip-img"
        loading="eager"
      />
    {:else}
      <!-- Mock placeholder strip — replaced once real art is uploaded -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 900 300"
        class="strip-img placeholder-svg"
        aria-label="Feather and Spag — mock strip placeholder"
      >
        <defs>
          <!-- Clip regions matching each panel's inner art area -->
          <clipPath id="pc1"><rect x="0"   y="0" width="280" height="300"/></clipPath>
          <clipPath id="pc2"><rect x="302" y="0" width="268" height="300"/></clipPath>
          <clipPath id="pc3"><rect x="582" y="0" width="318" height="300"/></clipPath>
        </defs>

        <!-- White background (gutter / margin space) -->
        <rect width="900" height="300" fill="white"/>

        <!-- Panel backgrounds: sky + ground per panel (edge-to-edge, no outer margins) -->
        <rect x="0"   y="0"   width="280" height="255" fill="#e3f2fd"/>
        <rect x="0"   y="255" width="280" height="45"  fill="#c8e6c9"/>
        <rect x="302" y="0"   width="268" height="255" fill="#e3f2fd"/>
        <rect x="302" y="255" width="268" height="45"  fill="#c8e6c9"/>
        <rect x="582" y="0"   width="318" height="255" fill="#e3f2fd"/>
        <rect x="582" y="255" width="318" height="45"  fill="#c8e6c9"/>

        <!-- === PANEL 1: Blue Jay introduces himself === -->
        <g clip-path="url(#pc1)">
          <!-- Strip title inside panel 1 (newspaper convention) -->
          <text x="146" y="28" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="bold" fill="#1b5e20" letter-spacing="2">FEATHER &amp; SPAG</text>

          <!-- Birdhouse background -->
          <g transform="translate(146,75)" opacity="0.45">
            <rect x="-20" y="20" width="40" height="48" rx="2" fill="#8d6e63"/>
            <polygon points="-25,20 0,-8 25,20" fill="#6d4c41"/>
            <circle cx="0" cy="38" r="7" fill="#3e2723"/>
            <rect x="-2" y="68" width="4" height="18" fill="#6d4c41"/>
            <rect x="-38" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
            <text x="-21" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">SUET HOTEL</text>
            <rect x="6" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
            <text x="23" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">FINE DINING</text>
          </g>

          <!-- Branch -->
          <rect x="0" y="218" width="280" height="9" rx="4" fill="#5d4037"/>

          <!-- Blue Jay -->
          <g transform="translate(72,214)">
            <ellipse cx="0" cy="-9" rx="19" ry="13" fill="#1565c0"/>
            <circle cx="17" cy="-20" r="11" fill="#1976d2"/>
            <polygon points="14,-31 20,-42 24,-28" fill="#0d47a1"/>
            <polygon points="27,-21 35,-20 27,-17" fill="#e65100"/>
            <ellipse cx="20" cy="-18" rx="6" ry="5" fill="white" opacity="0.55"/>
            <circle cx="21" cy="-22" r="2.5" fill="#111"/>
            <path d="M-16,-4 Q-4,-13 12,-9" stroke="#0d47a1" stroke-width="2" fill="none"/>
            <line x1="-3" y1="4" x2="-3" y2="13" stroke="#e65100" stroke-width="2"/>
            <line x1="5"  y1="4" x2="5"  y2="13" stroke="#e65100" stroke-width="2"/>
            <line x1="0" y1="13" x2="0" y2="22" stroke="#888" stroke-width="1"/>
            <rect x="-27" y="22" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
            <text x="0" y="33" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">BLUE JAY</text>
          </g>

          <!-- Feather p1 -->
          <g transform="translate(175,214)">
            <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
            <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
            <path d="M13,-30 Q10,-40 14,-49" stroke="#9e7d5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <ellipse cx="14" cy="-49" rx="3.5" ry="4.5" fill="#8d6e52" transform="rotate(-12,14,-49)"/>
            <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
            <circle cx="18" cy="-22" r="2" fill="#111"/>
            <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="1" y1="13" x2="1" y2="22" stroke="#888" stroke-width="1"/>
            <rect x="-27" y="22" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
            <text x="1" y="33" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">FEATHER</text>
          </g>

          <!-- Spag p1 -->
          <g transform="translate(240,214)">
            <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
            <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
            <ellipse cx="11" cy="-11" rx="7" ry="5.5" fill="#1a1a1a"/>
            <ellipse cx="15" cy="-18" rx="5" ry="3.5" fill="#1a1a1a"/>
            <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
            <circle cx="18" cy="-22" r="2" fill="#111"/>
            <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="1" y1="13" x2="1" y2="22" stroke="#888" stroke-width="1"/>
            <rect x="-22" y="22" width="44" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
            <text x="1" y="33" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">SPAG</text>
          </g>

          <!-- Speech bubble — Blue Jay -->
          <rect x="16" y="112" width="160" height="50" rx="9" fill="white" stroke="#333" stroke-width="1.5"/>
          <polygon points="65,162 83,162 72,178" fill="white"/>
          <polygon points="65,162 83,162 72,177" fill="white" stroke="#333" stroke-width="1.5"/>
          <line x1="66" y1="162" x2="82" y2="162" stroke="white" stroke-width="3"/>
          <text x="96" y="131" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">&#x201C;I&#x2019;m a free spirit.</text>
          <text x="96" y="145" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">I go where the</text>
          <text x="96" y="159" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">seeds take me.&#x201D;</text>
        </g>

        <!-- === PANEL 2: Feather responds === -->
        <g clip-path="url(#pc2)">
          <!-- Birdhouse background -->
          <g transform="translate(436,75)" opacity="0.45">
            <rect x="-20" y="20" width="40" height="48" rx="2" fill="#8d6e63"/>
            <polygon points="-25,20 0,-8 25,20" fill="#6d4c41"/>
            <circle cx="0" cy="38" r="7" fill="#3e2723"/>
            <rect x="-2" y="68" width="4" height="18" fill="#6d4c41"/>
            <rect x="-38" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
            <text x="-21" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">SUET HOTEL</text>
            <rect x="6" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
            <text x="23" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">FINE DINING</text>
          </g>

          <!-- Branch -->
          <rect x="302" y="218" width="268" height="9" rx="4" fill="#5d4037"/>

          <!-- Blue Jay p2 -->
          <g transform="translate(334,214)">
            <ellipse cx="0" cy="-9" rx="19" ry="13" fill="#1565c0"/>
            <circle cx="17" cy="-20" r="11" fill="#1976d2"/>
            <polygon points="14,-31 20,-42 24,-28" fill="#0d47a1"/>
            <polygon points="27,-21 35,-20 27,-17" fill="#e65100"/>
            <ellipse cx="20" cy="-18" rx="6" ry="5" fill="white" opacity="0.55"/>
            <circle cx="21" cy="-22" r="2.5" fill="#111"/>
            <line x1="-3" y1="4" x2="-3" y2="13" stroke="#e65100" stroke-width="2"/>
            <line x1="5"  y1="4" x2="5"  y2="13" stroke="#e65100" stroke-width="2"/>
            <line x1="0" y1="13" x2="0" y2="22" stroke="#888" stroke-width="1"/>
            <rect x="-27" y="22" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
            <text x="0" y="33" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">BLUE JAY</text>
          </g>

          <!-- Feather p2 (facing left) -->
          <g transform="translate(474,214) scale(-1,1)">
            <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
            <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
            <path d="M13,-30 Q10,-40 14,-49" stroke="#9e7d5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <ellipse cx="14" cy="-49" rx="3.5" ry="4.5" fill="#8d6e52" transform="rotate(12,14,-49)"/>
            <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
            <circle cx="18" cy="-22" r="2" fill="#111"/>
            <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
          </g>
          <line x1="474" y1="227" x2="474" y2="236" stroke="#888" stroke-width="1"/>
          <rect x="447" y="236" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
          <text x="474" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">FEATHER</text>

          <!-- Spag p2 (facing left) -->
          <g transform="translate(538,214) scale(-1,1)">
            <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
            <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
            <ellipse cx="11" cy="-11" rx="7" ry="5.5" fill="#1a1a1a"/>
            <ellipse cx="15" cy="-18" rx="5" ry="3.5" fill="#1a1a1a"/>
            <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
            <circle cx="18" cy="-22" r="2" fill="#111"/>
            <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
          </g>
          <line x1="538" y1="227" x2="538" y2="236" stroke="#888" stroke-width="1"/>
          <rect x="517" y="236" width="42" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
          <text x="538" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">SPAG</text>

          <!-- Speech bubble — Feather -->
          <rect x="363" y="108" width="194" height="50" rx="9" fill="white" stroke="#333" stroke-width="1.5"/>
          <polygon points="438,158 458,158 441,176" fill="white"/>
          <polygon points="438,158 458,158 441,175" fill="white" stroke="#333" stroke-width="1.5"/>
          <line x1="439" y1="158" x2="457" y2="158" stroke="white" stroke-width="3"/>
          <text x="460" y="127" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">&#x201C;Right. And the seeds</text>
          <text x="460" y="141" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">took you here.</text>
          <text x="460" y="155" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">Every. Single. Day.&#x201D;</text>
        </g>

        <!-- === PANEL 3: Punchline === -->
        <g clip-path="url(#pc3)">
          <!-- Birdhouse background -->
          <g transform="translate(720,75)" opacity="0.45">
            <rect x="-20" y="20" width="40" height="48" rx="2" fill="#8d6e63"/>
            <polygon points="-25,20 0,-8 25,20" fill="#6d4c41"/>
            <circle cx="0" cy="38" r="7" fill="#3e2723"/>
            <rect x="-2" y="68" width="4" height="18" fill="#6d4c41"/>
            <rect x="-38" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
            <text x="-21" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">SUET HOTEL</text>
            <rect x="6" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
            <text x="23" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">FINE DINING</text>
          </g>

          <!-- Branch -->
          <rect x="582" y="218" width="318" height="9" rx="4" fill="#5d4037"/>

          <!-- Blue Jay p3 -->
          <g transform="translate(618,214)">
            <ellipse cx="0" cy="-9" rx="19" ry="13" fill="#1565c0"/>
            <circle cx="17" cy="-20" r="11" fill="#1976d2"/>
            <polygon points="14,-31 20,-42 24,-28" fill="#0d47a1"/>
            <polygon points="27,-21 35,-20 27,-17" fill="#e65100"/>
            <ellipse cx="20" cy="-18" rx="6" ry="5" fill="white" opacity="0.55"/>
            <circle cx="21" cy="-22" r="2.5" fill="#111"/>
            <line x1="-3" y1="4" x2="-3" y2="13" stroke="#e65100" stroke-width="2"/>
            <line x1="5"  y1="4" x2="5"  y2="13" stroke="#e65100" stroke-width="2"/>
            <line x1="0" y1="13" x2="0" y2="22" stroke="#888" stroke-width="1"/>
            <rect x="-27" y="22" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
            <text x="0" y="33" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">BLUE JAY</text>
          </g>

          <!-- Feather p3 (facing left) -->
          <g transform="translate(754,214) scale(-1,1)">
            <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
            <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
            <path d="M13,-30 Q10,-40 14,-49" stroke="#9e7d5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <ellipse cx="14" cy="-49" rx="3.5" ry="4.5" fill="#8d6e52" transform="rotate(12,14,-49)"/>
            <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
            <circle cx="18" cy="-22" r="2" fill="#111"/>
            <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
          </g>
          <line x1="754" y1="227" x2="754" y2="236" stroke="#888" stroke-width="1"/>
          <rect x="727" y="236" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
          <text x="754" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">FEATHER</text>

          <!-- Spag p3 (laughing) -->
          <g transform="translate(822,214) scale(-1,1)">
            <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
            <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
            <ellipse cx="11" cy="-11" rx="7" ry="5.5" fill="#1a1a1a"/>
            <ellipse cx="15" cy="-18" rx="5" ry="3.5" fill="#1a1a1a"/>
            <polygon points="23,-22 32,-17 23,-13" fill="#e8a030"/>
            <ellipse cx="26" cy="-18" rx="4" ry="3" fill="#cc3300"/>
            <circle cx="19" cy="-23" r="2" fill="#111"/>
            <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
            <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
          </g>
          <line x1="822" y1="227" x2="822" y2="236" stroke="#888" stroke-width="1"/>
          <rect x="801" y="236" width="42" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
          <text x="822" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">SPAG</text>

          <!-- Speech bubble — Feather punchline -->
          <rect x="600" y="112" width="218" height="40" rx="9" fill="white" stroke="#333" stroke-width="1.5"/>
          <polygon points="706,152 726,152 712,170" fill="white"/>
          <polygon points="706,152 726,152 712,169" fill="white" stroke="#333" stroke-width="1.5"/>
          <line x1="707" y1="152" x2="725" y2="152" stroke="white" stroke-width="3"/>
          <text x="709" y="130" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">&#x201C;That&#x2019;s not a spirit.</text>
          <text x="709" y="146" text-anchor="middle" font-family="Georgia,serif" font-size="9.5" fill="#111">That&#x2019;s a schedule.&#x201D;</text>
        </g>

        <!-- Vertical copyright in copyright gutter only — no panel borders (strips read as one continuous piece) -->

        <!-- Vertical copyright in copyright gutter (between panel 1 and panel 2) -->
        <text
          transform="rotate(-90, 291, 150)"
          x="291" y="150"
          text-anchor="middle"
          font-family="Arial" font-size="7" fill="#888"
        >&#169; 2026 Feather &amp; Spag</text>

        <!-- Mock watermark -->
        <text x="848" y="297" text-anchor="end" font-family="Arial" font-size="7" fill="#bbb">MOCK STRIP</text>
      </svg>
    {/if}
  </div>

  <!-- Navigation + share -->
  <div class="strip-nav">
    {#if prev}
      <a href="/cartoon/{prev}" class="nav-btn">← Previous</a>
    {:else}
      <span class="nav-btn disabled">← Previous</span>
    {/if}

    <button class="share-btn" onclick={nativeShare}>
      {copied ? '✓ Copied!' : 'Share'}
    </button>

    {#if next}
      <a href="/cartoon/{next}" class="nav-btn">Next →</a>
    {:else}
      <span class="nav-btn disabled">Next →</span>
    {/if}
  </div>

  <!-- Archive link -->
  <div class="archive-link">
    <a href="/cartoon/archive">Browse all strips →</a>
  </div>
</div>

<style>
  .viewer {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    font-family: Georgia, serif;
  }

  .strip-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.5rem 0 0.4rem;
    border-bottom: 1px solid #ddd;
    margin-bottom: 0;
  }

  .strip-title {
    font-size: 1.25rem;
    font-weight: bold;
    color: #1b5e20;
    letter-spacing: 0.05em;
  }

  .strip-date {
    font-size: 0.85rem;
    color: #666;
    font-family: Arial, sans-serif;
  }

  .strip-frame {
    width: 100%;
    line-height: 0;
    aspect-ratio: 3 / 1;
    overflow: hidden;
  }

  .strip-frame.sunday {
    aspect-ratio: 2 / 1;
  }

  .strip-img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }

  .strip-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-top: 1px solid #ddd;
    margin-top: 0;
  }

  .nav-btn {
    font-family: Arial, sans-serif;
    font-size: 0.9rem;
    color: #1b5e20;
    text-decoration: none;
    padding: 0.35rem 0.75rem;
    border: 1px solid #1b5e20;
    border-radius: 6px;
    transition: background 0.15s;
  }

  .nav-btn:hover { background: #e8f5e9; }
  .nav-btn.disabled { color: #bbb; border-color: #ddd; cursor: default; }

  .share-btn {
    font-family: Arial, sans-serif;
    font-size: 0.9rem;
    background: #1b5e20;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.35rem 1.1rem;
    cursor: pointer;
    transition: background 0.15s;
  }

  .share-btn:hover { background: #2e7d32; }

  .archive-link {
    text-align: center;
    padding: 0.35rem 0 0.75rem;
    font-family: Arial, sans-serif;
    font-size: 0.85rem;
  }

  .archive-link a {
    color: #555;
    text-decoration: none;
  }
  .archive-link a:hover { text-decoration: underline; }

  /* CTA row below strip */
  :global(.cartoon-cta) {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    padding: 0.85rem 0 0;
    font-family: Arial, sans-serif;
    font-size: 0.85rem;
    color: #666;
    flex-wrap: wrap;
  }

  :global(.cartoon-cta a) {
    color: #1b5e20;
    text-decoration: none;
    font-weight: 600;
  }

  :global(.cartoon-cta a:hover) { text-decoration: underline; }
</style>
