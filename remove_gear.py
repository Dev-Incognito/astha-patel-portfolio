import re

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the feature flags panel from HTML
pattern = r'  <!-- ====== FEATURE FLAGS PANEL ====== -->.*?</aside>'
html_cleaned = re.sub(pattern, '', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_cleaned)

# 2. Update js/feature-flags.js
with open('js/feature-flags.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Remove syncCheckboxes, openPanel, closePanel, resetAll
funcs_pattern = r'  // Sync checkboxes to state.*?// Init\n  async function init\(\) \{'
js = re.sub(funcs_pattern, '  // Init\n  async function init() {', js, flags=re.DOTALL)

# Remove the event listeners in init()
listeners_pattern = r'    // Trigger button.*?// Keyboard: Escape to close\n    document.addEventListener\(\'keydown\', \(e\) => \{\n      if \(e\.key === \'Escape\'\) closePanel\(\);\n    \}\);\n  \}'
js = re.sub(listeners_pattern, '  }', js, flags=re.DOTALL)

# Remove syncCheckboxes() call from init()
js = js.replace('      syncCheckboxes();\n', '')

with open('js/feature-flags.js', 'w', encoding='utf-8') as f:
    f.write(js)

print('Gear icon removed successfully')
