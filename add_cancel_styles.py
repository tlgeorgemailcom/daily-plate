# Add cancel-link styles to plate and chain files

cancel_link_css = '''
  .cancel-link {
    display: block;
    text-align: center;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    color: #6b7280;
    text-decoration: none;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .cancel-link:hover {
    color: #374151;
    background: #f3f4f6;
  }
'''

# Update plate file
plate_path = "src/routes/plate/+page.svelte"
with open(plate_path, 'r') as f:
    content = f.read()

insert_after = '''  .difficulty-desc {
    font-size: 0.85rem;
    color: #6b7280;
  }'''

if '.cancel-link' not in content and insert_after in content:
    content = content.replace(insert_after, insert_after + cancel_link_css)
    with open(plate_path, 'w') as f:
        f.write(content)
    print("Plate styles added")
elif '.cancel-link' in content:
    print("Plate already has cancel-link styles")
else:
    print("Plate pattern not found")

# Update chain file  
chain_path = "src/routes/chain/+page.svelte"
with open(chain_path, 'r') as f:
    content = f.read()

if '.cancel-link' not in content and insert_after in content:
    content = content.replace(insert_after, insert_after + cancel_link_css)
    with open(chain_path, 'w') as f:
        f.write(content)
    print("Chain styles added")
elif '.cancel-link' in content:
    print("Chain already has cancel-link styles")
else:
    print("Chain pattern not found")
