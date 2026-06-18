import re

# 1. Update admin/index.html
admin_path = 'admin/index.html'
with open(admin_path, 'r', encoding='utf-8') as f:
    admin_html = f.read()

FONTS = ['Default', 'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Lato', 'Poppins', 'Oswald', 'Roboto Mono', 'Raleway', 'Playfair Display', 'Merriweather', 'Nunito', 'Ubuntu', 'Rubik', 'Lora', 'Work Sans', 'Fira Sans', 'Quicksand', 'Barlow', 'Mulish', 'Inconsolata', 'PT Sans', 'Titillium Web', 'DM Sans', 'IBM Plex Sans', 'Josefin Sans', 'Cabin', 'Libre Franklin', 'Dancing Script', 'Anton', 'Bebas Neue', 'Mukta', 'Karla', 'Teko', 'Fjalla One', 'Dosis', 'Bitter', 'Arimo', 'Varela Round', 'Pacifico', 'Hind', 'Zilla Slab', 'Righteous', 'Cinzel', 'Archivo Black', 'Lobster', 'EB Garamond', 'Caveat', 'Comfortaa']

helper_code = f"""
const FONTS = {repr(FONTS)};
function fontSel(ex, v) {{
  const opts = FONTS.map(f => '<option value="'+(f==='Default'?'':f)+'"'+(v===f?' selected':'')+'>'+f+'</option>').join('');
  return '<select class="fsel" onchange="'+ex+'=this.value;dsv();">'+opts+'</select>';
}}
"""

if "const FONTS =" not in admin_html:
    admin_html = admin_html.replace("function sh(t){return '<div class=\"subhdr\">'+t+'</div>';}", "function sh(t){return '<div class=\"subhdr\">'+t+'</div>';}\n" + helper_code)

sections = [
    ('rHero', r"return hdr\('Hero \/ Cover','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rBrand', r"return hdr\('Personal Brand','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rStr', r"return hdr\('Core Strengths','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rDiff', r"return hdr\('Differentiators','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rExp', r"return hdr\('Business Exposure','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rCap', r"return hdr\('Capabilities','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rVis', r"return hdr\('Career Vision','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rIntro', r"return hdr\('Personal Introduction','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rCon', r"return hdr\('Contact','[^']+'\)\+\n  '<div class=\"fg\">'\+"),
    ('rGlob', r"return hdr\('Global Settings','[^']+'\)\+\n  '<div class=\"fg\">'\+")
]

mapping = {
    'rHero': ('content.hero', 'h'),
    'rBrand': ('content.brand', 'b'),
    'rStr': ('content.strengths', 's'),
    'rDiff': ('content.differentiators', 'd'),
    'rExp': ('content.exposure', 'e'),
    'rCap': ('content.capabilities', 'c'),
    'rVis': ('content.vision', 'v'),
    'rIntro': ('content.introduction', 'n'),
    'rCon': ('content.contact', 'c'),
    'rGlob': ('content.global', 'g')
}

for fn, pattern in sections:
    path, var = mapping[fn]
    replacement = r"\g<0>\n  fld('Section Font',fontSel('"+path+r".font',"+var+r".font))+"
    # make sure we don't apply it twice
    if fld := f"fontSel('{path}.font'":
        if fld not in admin_html:
            admin_html = re.sub(pattern, replacement, admin_html, count=1)

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
