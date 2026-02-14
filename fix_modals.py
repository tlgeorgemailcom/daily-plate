# Update plate file
plate_path = "src/routes/plate/+page.svelte"
with open(plate_path, 'r') as f:
    content = f.read()

old = '''            <span class="difficulty-mult">2× score</span>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <header>'''

new = '''            <span class="difficulty-mult">2× score</span>
          </button>
        </div>
        
        <a href="/" class="cancel-link">← Back to Games</a>
      </div>
    </div>
  {/if}

  <header>'''

if old in content:
    content = content.replace(old, new)
    with open(plate_path, 'w') as f:
        f.write(content)
    print("Plate updated")
else:
    print("Plate pattern not found")

# Update chain file  
chain_path = "src/routes/chain/+page.svelte"
with open(chain_path, 'r') as f:
    content = f.read()

old2 = '''            <span class="difficulty-mult">2× score</span>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Header -->'''

new2 = '''            <span class="difficulty-mult">2× score</span>
          </button>
        </div>
        
        <a href="/" class="cancel-link">← Back to Games</a>
      </div>
    </div>
  {/if}

  <!-- Header -->'''

if old2 in content:
    content = content.replace(old2, new2)
    with open(chain_path, 'w') as f:
        f.write(content)
    print("Chain updated")
else:
    print("Chain pattern not found")
