import os

# 1. Update admin/index.html
admin_path = 'admin/index.html'
with open(admin_path, 'r', encoding='utf-8') as f:
    admin_html = f.read()

FONTS = ['Default', 'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Poppins', 'Oswald', 'Roboto Mono', 'Raleway', 'Playfair Display', 'Merriweather', 'Nunito', 'Ubuntu', 'Rubik', 'Lora', 'Work Sans', 'Fira Sans', 'Quicksand', 'Barlow', 'Mulish', 'Inconsolata', 'PT Sans', 'Titillium Web', 'DM Sans', 'IBM Plex Sans', 'Josefin Sans', 'Cabin', 'Libre Franklin', 'Dancing Script', 'Anton', 'Bebas Neue', 'Mukta', 'Karla', 'Teko', 'Fjalla One', 'Dosis', 'Bitter', 'Arimo', 'Varela Round', 'Pacifico', 'Hind', 'Zilla Slab', 'Righteous', 'Cinzel', 'Archivo Black', 'Lobster', 'EB Garamond', 'Caveat', 'Comfortaa']

opts = ''.join([f'<option value="{f if f!="Default" else ""}">{f}</option>' for f in FONTS])

helper_code = f"""
const FONTS = {repr(FONTS)};
function fontSel(ex, v) {{
  const opts = FONTS.map(f => '<option value="'+(f==='Default'?'':f)+'"'+(v===f?' selected':'')+'>'+f+'</option>').join('');
  return '<select class="fsel" onchange="'+ex+'=this.value;dsv();">'+opts+'</select>';
}}
"""

# Insert helper code after 'function sh(t)'
admin_html = admin_html.replace("function sh(t){return '<div class=\"subhdr\">'+t+'</div>';}", "function sh(t){return '<div class=\"subhdr\">'+t+'</div>';}\n" + helper_code)

# Add font selector to each section
sections = [
    ('rHero', 'content.hero'),
    ('rBrand', 'content.brand'),
    ('rStr', 'content.strengths'),
    ('rDiff', 'content.differentiators'),
    ('rExp', 'content.exposure'),
    ('rCap', 'content.capabilities'),
    ('rVis', 'content.vision'),
    ('rIntro', 'content.introduction'),
    ('rCon', 'content.contact')
]

for fn, path in sections:
    # We find where `<div class="fg">` is injected in the function.
    if fn == 'rHero':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','h.')+".font))+")
    elif fn == 'rBrand':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','b.')+".font))+", 1) # Only first fg
    elif fn == 'rStr':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','s.')+".font))+", 1)
    elif fn == 'rDiff':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','d.')+".font))+", 1)
    elif fn == 'rExp':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','e.')+".font))+", 1)
    elif fn == 'rCap':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','c.')+".font))+", 1)
    elif fn == 'rVis':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','v.')+".font))+", 1)
    elif fn == 'rIntro':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','n.')+".font))+", 1)
    elif fn == 'rCon':
        admin_html = admin_html.replace("'<div class=\"fg\">'+", "'<div class=\"fg\">'+\n  fld('Section Font',fontSel('"+path+".font',"+path.replace('content.','c.')+".font))+", 1)

with open(admin_path, 'w', encoding='utf-8') as f:
    f.write(admin_html)

# 2. Update js/content-loader.js
cl_path = 'js/content-loader.js'
with open(cl_path, 'r', encoding='utf-8') as f:
    cl_js = f.read()

font_injector = """
    // ── Apply Section Fonts ──
    const sections = ['hero', 'brand', 'strengths', 'differentiators', 'exposure', 'capabilities', 'vision', 'introduction', 'contact'];
    const fontSet = new Set();
    
    sections.forEach(sec => {
      if (data[sec] && data[sec].font) {
        fontSet.add(data[sec].font);
        const el = document.getElementById(sec);
        if (el) {
          el.style.setProperty('--font-display', `"${data[sec].font}", sans-serif`);
          el.style.setProperty('--font-heading', `"${data[sec].font}", sans-serif`);
          el.style.setProperty('--font-body', `"${data[sec].font}", sans-serif`);
        }
      }
    });

    if (fontSet.size > 0) {
      const families = Array.from(fontSet).map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
      document.head.appendChild(link);
    }
"""

if "const fontSet" not in cl_js:
    cl_js = cl_js.replace("const heroVariant = flags['hero-variant'] || 'orbital';", font_injector + "\n    const heroVariant = flags['hero-variant'] || 'orbital';")

with open(cl_path, 'w', encoding='utf-8') as f:
    f.write(cl_js)

print('Patched successfully')
