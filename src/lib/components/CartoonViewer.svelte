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
        <!-- Title bar -->
        <rect width="900" height="30" fill="#1b5e20"/>
        <text x="450" y="21" text-anchor="middle" font-family="Georgia,serif" font-size="15" font-weight="bold" fill="#a5d6a7" letter-spacing="4">FEATHER &amp; SPAG</text>

        <!-- Sky -->
        <rect x="0" y="30" width="900" height="225" fill="#e3f2fd"/>
        <!-- Ground -->
        <rect x="2"   y="255" width="294" height="43" fill="#c8e6c9"/>
        <rect x="302" y="255" width="294" height="43" fill="#c8e6c9"/>
        <rect x="602" y="255" width="296" height="43" fill="#c8e6c9"/>

        <!-- Birdhouse — panel 1 background -->
        <g transform="translate(148,68)" opacity="0.45">
          <rect x="-20" y="20" width="40" height="48" rx="2" fill="#8d6e63"/>
          <polygon points="-25,20 0,-8 25,20" fill="#6d4c41"/>
          <circle cx="0" cy="38" r="7" fill="#3e2723"/>
          <rect x="-2" y="68" width="4" height="18" fill="#6d4c41"/>
          <rect x="-38" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
          <text x="-21" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">SUET HOTEL</text>
          <rect x="6" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
          <text x="23" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">FINE DINING</text>
        </g>
        <!-- Birdhouse — panel 2 -->
        <g transform="translate(448,68)" opacity="0.45">
          <rect x="-20" y="20" width="40" height="48" rx="2" fill="#8d6e63"/>
          <polygon points="-25,20 0,-8 25,20" fill="#6d4c41"/>
          <circle cx="0" cy="38" r="7" fill="#3e2723"/>
          <rect x="-2" y="68" width="4" height="18" fill="#6d4c41"/>
          <rect x="-38" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
          <text x="-21" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">SUET HOTEL</text>
          <rect x="6" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
          <text x="23" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">FINE DINING</text>
        </g>
        <!-- Birdhouse — panel 3 -->
        <g transform="translate(748,68)" opacity="0.45">
          <rect x="-20" y="20" width="40" height="48" rx="2" fill="#8d6e63"/>
          <polygon points="-25,20 0,-8 25,20" fill="#6d4c41"/>
          <circle cx="0" cy="38" r="7" fill="#3e2723"/>
          <rect x="-2" y="68" width="4" height="18" fill="#6d4c41"/>
          <rect x="-38" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
          <text x="-21" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">SUET HOTEL</text>
          <rect x="6" y="82" width="34" height="11" rx="2" fill="#fff9c4" stroke="#aaa" stroke-width="0.8"/>
          <text x="23" y="91" text-anchor="middle" font-family="Arial" font-size="6" fill="#555">FINE DINING</text>
        </g>

        <!-- Branches -->
        <rect x="10"  y="218" width="278" height="9" rx="4" fill="#5d4037"/>
        <rect x="310" y="218" width="278" height="9" rx="4" fill="#5d4037"/>
        <rect x="610" y="218" width="278" height="9" rx="4" fill="#5d4037"/>

        <!-- === PANEL 1: Blue Jay introduces himself === -->
        <!-- Blue Jay -->
        <g transform="translate(82,214)">
          <ellipse cx="0" cy="-9" rx="19" ry="13" fill="#1565c0"/>
          <circle cx="17" cy="-20" r="11" fill="#1976d2"/>
          <polygon points="14,-31 20,-42 24,-28" fill="#0d47a1"/>
          <polygon points="27,-21 35,-20 27,-17" fill="#e65100"/>
          <ellipse cx="20" cy="-18" rx="6" ry="5" fill="white" opacity="0.55"/>
          <circle cx="21" cy="-22" r="2.5" fill="#111"/>
          <path d="M-16,-4 Q-4,-13 12,-9" stroke="#0d47a1" stroke-width="2" fill="none"/>
          <line x1="-3" y1="4" x2="-3" y2="13" stroke="#e65100" stroke-width="2"/>
          <line x1="5"  y1="4" x2="5"  y2="13" stroke="#e65100" stroke-width="2"/>
          <line x1="-3" y1="13" x2="-10" y2="15" stroke="#e65100" stroke-width="1.5"/>
          <line x1="-3" y1="13" x2="2"   y2="15" stroke="#e65100" stroke-width="1.5"/>
          <line x1="5"  y1="13" x2="-1"  y2="15" stroke="#e65100" stroke-width="1.5"/>
          <line x1="5"  y1="13" x2="11"  y2="15" stroke="#e65100" stroke-width="1.5"/>
          <line x1="0" y1="13" x2="0" y2="22" stroke="#888" stroke-width="1"/>
          <rect x="-27" y="22" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
          <text x="0" y="33" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">BLUE JAY</text>
        </g>
        <!-- Feather p1 -->
        <g transform="translate(192,214)">
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
        <g transform="translate(252,214)">
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
        <!-- Panel 1 speech bubble — Blue Jay -->
        <rect x="14" y="108" width="172" height="52" rx="9" fill="white" stroke="#333" stroke-width="1.5"/>
        <polygon points="68,160 88,160 75,178" fill="white"/>
        <polygon points="68,160 88,160 75,176" fill="white" stroke="#333" stroke-width="1.5"/>
        <line x1="69" y1="160" x2="87" y2="160" stroke="white" stroke-width="3"/>
        <text x="100" y="129" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">&#x201C;I&#x2019;m a free spirit.</text>
        <text x="100" y="143" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">I go where the</text>
        <text x="100" y="157" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">seeds take me.&#x201D;</text>

        <!-- === PANEL 2: Feather responds === -->
        <!-- Blue Jay p2 -->
        <g transform="translate(338,214)">
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
        <!-- Feather p2 (facing left — mirrored) -->
        <g transform="translate(490,214) scale(-1,1)">
          <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
          <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
          <path d="M13,-30 Q10,-40 14,-49" stroke="#9e7d5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="14" cy="-49" rx="3.5" ry="4.5" fill="#8d6e52" transform="rotate(12,14,-49)"/>
          <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
          <circle cx="18" cy="-22" r="2" fill="#111"/>
          <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
          <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
        </g>
        <line x1="490" y1="227" x2="490" y2="236" stroke="#888" stroke-width="1"/>
        <rect x="463" y="236" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
        <text x="490" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">FEATHER</text>
        <!-- Spag p2 (facing left — mirrored) -->
        <g transform="translate(555,214) scale(-1,1)">
          <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
          <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
          <ellipse cx="11" cy="-11" rx="7" ry="5.5" fill="#1a1a1a"/>
          <ellipse cx="15" cy="-18" rx="5" ry="3.5" fill="#1a1a1a"/>
          <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
          <circle cx="18" cy="-22" r="2" fill="#111"/>
          <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
          <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
        </g>
        <line x1="555" y1="227" x2="555" y2="236" stroke="#888" stroke-width="1"/>
        <rect x="534" y="236" width="42" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
        <text x="555" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">SPAG</text>
        <!-- Panel 2 speech bubble — Feather -->
        <rect x="376" y="103" width="206" height="52" rx="9" fill="white" stroke="#333" stroke-width="1.5"/>
        <polygon points="454,155 474,155 458,174" fill="white"/>
        <polygon points="454,155 474,155 458,173" fill="white" stroke="#333" stroke-width="1.5"/>
        <line x1="455" y1="155" x2="473" y2="155" stroke="white" stroke-width="3"/>
        <text x="479" y="123" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">&#x201C;Right. And the seeds</text>
        <text x="479" y="137" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">took you here.</text>
        <text x="479" y="151" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">Every. Single. Day.&#x201D;</text>

        <!-- === PANEL 3: Punchline === -->
        <!-- Blue Jay p3 (sheepish) -->
        <g transform="translate(638,214)">
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
        <!-- Feather p3 -->
        <g transform="translate(775,214) scale(-1,1)">
          <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
          <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
          <path d="M13,-30 Q10,-40 14,-49" stroke="#9e7d5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="14" cy="-49" rx="3.5" ry="4.5" fill="#8d6e52" transform="rotate(12,14,-49)"/>
          <polygon points="24,-21 31,-20 24,-17" fill="#e8a030"/>
          <circle cx="18" cy="-22" r="2" fill="#111"/>
          <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
          <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
        </g>
        <line x1="775" y1="227" x2="775" y2="236" stroke="#888" stroke-width="1"/>
        <rect x="748" y="236" width="54" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
        <text x="775" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">FEATHER</text>
        <!-- Spag p3 (laughing) -->
        <g transform="translate(848,214) scale(-1,1)">
          <ellipse cx="0" cy="-9" rx="17" ry="12" fill="#9e7d5a"/>
          <circle cx="15" cy="-20" r="10" fill="#8d6e52"/>
          <ellipse cx="11" cy="-11" rx="7" ry="5.5" fill="#1a1a1a"/>
          <ellipse cx="15" cy="-18" rx="5" ry="3.5" fill="#1a1a1a"/>
          <!-- Open beak / laughing -->
          <polygon points="23,-22 32,-17 23,-13" fill="#e8a030"/>
          <ellipse cx="26" cy="-18" rx="4" ry="3" fill="#cc3300"/>
          <circle cx="19" cy="-23" r="2" fill="#111"/>
          <line x1="-2" y1="3" x2="-2" y2="13" stroke="#e8a030" stroke-width="2"/>
          <line x1="4"  y1="3" x2="4"  y2="13" stroke="#e8a030" stroke-width="2"/>
        </g>
        <line x1="848" y1="227" x2="848" y2="236" stroke="#888" stroke-width="1"/>
        <rect x="827" y="236" width="42" height="16" rx="3" fill="#fff9c4" stroke="#aaa" stroke-width="1"/>
        <text x="848" y="247" text-anchor="middle" font-family="Arial" font-size="8" font-weight="bold" fill="#333">SPAG</text>
        <!-- Panel 3 speech bubble — Feather punchline -->
        <rect x="660" y="110" width="228" height="40" rx="9" fill="white" stroke="#333" stroke-width="1.5"/>
        <polygon points="740,150 760,150 744,168" fill="white"/>
        <polygon points="740,150 760,150 744,167" fill="white" stroke="#333" stroke-width="1.5"/>
        <line x1="741" y1="150" x2="759" y2="150" stroke="white" stroke-width="3"/>
        <text x="774" y="129" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">&#x201C;That&#x2019;s not a spirit.</text>
        <text x="774" y="145" text-anchor="middle" font-family="Georgia,serif" font-size="10" fill="#111">That&#x2019;s a schedule.&#x201D;</text>

        <!-- Panel dividers (rendered last, on top) -->
        <rect x="0"   y="30" width="2"   height="268" fill="#1b5e20"/>
        <rect x="298" y="30" width="4"   height="268" fill="#1b5e20"/>
        <rect x="598" y="30" width="4"   height="268" fill="#1b5e20"/>
        <rect x="898" y="30" width="2"   height="268" fill="#1b5e20"/>
        <rect x="0"   y="297" width="900" height="3" fill="#1b5e20"/>

        <!-- Mock label -->
        <text x="893" y="296" text-anchor="end" font-family="Arial" font-size="7" fill="#aaa">MOCK STRIP</text>
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
    border-bottom: 2px solid #1b5e20;
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
    background: #f5f5f5;
    border: 2px solid #1b5e20;
    border-top: none;
    line-height: 0;
  }

  .strip-img {
    width: 100%;
    height: auto;
    display: block;
  }

  /* Weekday natural height ~300px at 900px width (3:1).
     Sunday natural height ~450px at 900px width (2:1).
     height:auto handles both correctly via viewBox / img aspect ratio. */

  .placeholder-svg {
    aspect-ratio: 3 / 1;
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
